
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Solicitud as SolicitudService } from '../../../services/solicitud';
import { AuthService } from '../../../auth/service/auth-service';
import type { Solicitud as SolicitudModel } from '../../../services/solicitud';
import { UsuarioService } from '../../../services/usuario-service/usuario-service';
import type { Usuario } from '../../../models/usuario';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-list-solicitudes',
  imports: [RouterLink],
  templateUrl: './list-solicitudes.html',
  styleUrls: ['./list-solicitudes.css'],
})
export class ListSolicitudes implements OnInit {
  private solicitudService = inject(SolicitudService);
  public authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);

  // Señales públicas para usar en la plantilla separadas por estado
  solicitudes: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);
  pendientes: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);
  aprobadas: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);
  rechazadas: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);
  otras: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);

  // Señal privada para la solicitud seleccionada (usada por los helpers siguientes)
  private _selected: WritableSignal<SolicitudModel | null> = signal<SolicitudModel | null>(null);

  // Señal privada para el usuario (solicitante) de la solicitud seleccionada
  private _selectedUsuario: WritableSignal<Usuario | null> = signal<Usuario | null>(null);

  // Señal privada para la comisión de la solicitud seleccionada
  private _selectedComision: WritableSignal<{ id: number; nombre?: string } | null> = signal<{
    id: number;
    nombre?: string;
  } | null>(null);

  // Señal privada para el espacio (nuevo_espacio) de la solicitud seleccionada
  private _selectedEspacio: WritableSignal<{ id: number; nombre?: string } | null> = signal<{
    id: number;
    nombre?: string;
  } | null>(null);

  // Flag para operaciones asíncronas (ej. cancelar)
  private _isCancelling: WritableSignal<boolean> = signal<boolean>(false);

  // Señal para editar el comentario de estado en la UI
  private _comentarioEditing: WritableSignal<string> = signal<string>('');
  private _isSavingComment: WritableSignal<boolean> = signal<boolean>(false);

  constructor() { }

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  // === Helpers y acciones de detalle (usados por la plantilla) ===
  selectedSolicitud(): SolicitudModel | null {
    return this._selected();
  }

  selectedUsuario(): Usuario | null {
    return this._selectedUsuario();
  }

  selectedComision(): { id: number; nombre?: string } | null {
    return this._selectedComision();
  }

  selectedEspacio(): { id: number; nombre?: string } | null {
    return this._selectedEspacio();
  }

  openDetails(s: SolicitudModel): void {
    this._selected.set(s);
    // Inicializar texto de edición del comentario
    this._comentarioEditing.set(s.comentario_estado || '');
    // Cargar datos del solicitante para mostrar nombre en la tarjeta de detalle
    const uid = (s as any).usuario_id ?? (s as any).usuario?.id ?? null;
    if (uid) {
      this.usuarioService.getUsuarioById(String(uid)).subscribe({
        next: (u) => this._selectedUsuario.set(u),
        error: (err) => {
          console.error('Error cargando usuario', err);
          this._selectedUsuario.set(null);
        },
      });
    } else {
      this._selectedUsuario.set(null);
    }
    // Cargar datos de la comisión para mostrar nombre
    const cid = (s as any).comision_id ?? null;
    if (cid !== null && cid !== undefined) {
      this.http.get<{ id: number; nombre?: string }>(`http://localhost:3000/comisiones/${cid}`).subscribe({
        next: (c) => this._selectedComision.set(c),
        error: (err) => {
          console.error('Error cargando comisión', err);
          this._selectedComision.set(null);
        },
      });
    } else {
      this._selectedComision.set(null);
    }
    // Cargar datos del nuevo espacio para mostrar nombre
    const eid = (s as any).nuevo_espacio_id ?? null;
    if (eid !== null && eid !== undefined) {
      this.http.get<{ id: number; nombre?: string }>(`http://localhost:3000/espacios/${eid}`).subscribe({
        next: (e) => this._selectedEspacio.set(e),
        error: (err) => {
          console.error('Error cargando espacio', err);
          this._selectedEspacio.set(null);
        },
      });
    } else {
      this._selectedEspacio.set(null);
    }
  }

  comentarioEditing(): string {
    return this._comentarioEditing();
  }

  isSavingComment(): boolean {
    return this._isSavingComment();
  }

  setComentarioEditing(v: string): void {
    this._comentarioEditing.set(v);
  }

  isAdmin(): boolean {
    return String(this.authService.infoUsuario().rol) === 'ADMIN';
  }

  saveComentarioEstado(): void {
    const s = this._selected();
    if (!s || s.id == null) return;
    const idStr = String(s.id);
    const nuevo = this._comentarioEditing();
    this._isSavingComment.set(true);
    this.solicitudService.patchComentarioEstado(idStr, nuevo).subscribe({
      next: (updated) => {
        this._isSavingComment.set(false);
        // actualizar la solicitud seleccionada localmente
        const newS = { ...(s as any), comentario_estado: updated.comentario_estado } as SolicitudModel;
        this._selected.set(newS);
        this.updateLocalSolicitud(newS);
      },
      error: (err) => {
        console.error('Error guardando comentario', err);
        this._isSavingComment.set(false);
      },
    });
  }

  // Aprobar la solicitud y guardar comentario de estado
  approveSolicitud(): void {
    this.changeEstadoConComentario('APROBADA');
  }

  // Rechazar la solicitud y guardar comentario de estado
  rejectSolicitud(): void {
    this.changeEstadoConComentario('RECHAZADA');
  }

  // Mostrar confirmación al usuario antes de acciones irreversibles
  confirmApprove(): void {
    const s = this._selected();
    if (!s) return;
    const ok = window.confirm('Esta acción aceptará la solicitud y no tiene vuelta atrás. ¿Desea continuar?');
    if (ok) this.approveSolicitud();
  }

  confirmReject(): void {
    const s = this._selected();
    if (!s) return;
    const ok = window.confirm('Esta acción rechazará la solicitud y no tiene vuelta atrás. ¿Desea continuar?');
    if (ok) this.rejectSolicitud();
  }

  private changeEstadoConComentario(estado: string): void {
    const s = this._selected();
    if (!s || s.id == null) return;
    const idStr = String(s.id);
    const comentario = this._comentarioEditing();
    this._isSavingComment.set(true);
    this.solicitudService.patchEstadoComentario(idStr, estado, comentario).subscribe({
      next: (updated) => {
        this._isSavingComment.set(false);
        const newS = { ...(s as any), estado: updated.estado, comentario_estado: updated.comentario_estado } as SolicitudModel;
        this._selected.set(newS);
        this.updateLocalSolicitud(newS);
      },
      error: (err) => {
        console.error(`Error cambiando estado a ${estado}`, err);
        this._isSavingComment.set(false);
      },
    });
  }

  private updateLocalSolicitud(updated: SolicitudModel): void {
    const all = this.solicitudes();
    const mapped = all.map((x) => (x.id === updated.id ? updated : x));
    this.solicitudes.set(mapped);
    this.categorizeSolicitudes(mapped);
  }

  closeDetails(): void {
    this._selected.set(null);
    this._selectedUsuario.set(null);
    this._selectedComision.set(null);
    this._selectedEspacio.set(null);
  }

  isCancelling(): boolean {
    return this._isCancelling();
  }

  loadSolicitudes(): void {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.categorizeSolicitudes(data);
      },
      error: (err) => {
        console.error('Error cargando solicitudes', err);
      },
    });
  }

  private categorizeSolicitudes(data: SolicitudModel[]): void {
    const pendientes: SolicitudModel[] = [];
    const aprobadas: SolicitudModel[] = [];
    const rechazadas: SolicitudModel[] = [];
    const otras: SolicitudModel[] = [];

    for (const s of data) {
      const estado = (s as any).estado ?? '';
      const norm = String(estado).toLowerCase();

      if (norm.includes('pend')) {
        pendientes.push(s);
      } else if (norm.includes('aprob')) {
        aprobadas.push(s);
      } else if (norm.includes('rech')) {
        rechazadas.push(s);
      } else {
        otras.push(s);
      }
    }

    this.pendientes.set(pendientes);
    this.aprobadas.set(aprobadas);
    this.rechazadas.set(rechazadas);
    this.otras.set(otras);
  }

   // Ejemplo de helper para formatear la fecha 
  formatFecha(fechaIso?: string): string {
    if (!fechaIso) return '';
    try {
      const d = new Date(fechaIso);
      // Devolver solo la parte de fecha (sin hora)
      return d.toLocaleDateString();
    } catch {
      return fechaIso;
    }
  }

 
  formatHora(hora?: string): string {
    if (!hora) return '-';

    // Si viene un ISO datetime, intentar extraer la parte de hora
    const isoMatch = hora.match(/(\d{2}:\d{2})(:\d{2})?/);
    if (isoMatch) {
      return isoMatch[1];
    }

    // Si viene como número o texto con sólo horas/minutos
    const hmMatch = hora.match(/^(\d{1,2})([:.])(\d{2})$/);
    if (hmMatch) {
      const hh = hmMatch[1].padStart(2, '0');
      const mm = hmMatch[3];
      return `${hh}:${mm}`;
    }

    // Fallback: intentar parsear como Date
    const d = new Date(hora);
    if (!isNaN(d.getTime())) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    }

    // Si no se pudo formatear, devolver el valor crudo
    return hora;
  }

}