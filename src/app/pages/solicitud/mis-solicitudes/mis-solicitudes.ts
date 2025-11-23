import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Solicitud as SolicitudModel } from '../../../services/solicitud';
import { Solicitud as SolicitudService } from '../../../services/solicitud';
import { AuthService } from '../../../auth/service/auth-service';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.html',
  styleUrls: ['./mis-solicitudes.css'],
})
export class MisSolicitudes implements OnInit {
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);

  // Signal que contendrá el array de solicitudes para renderizar en el template
  solicitudes: WritableSignal<SolicitudModel[]> = signal<SolicitudModel[]>([]);
  // Signal para la solicitud seleccionada y mostrar modal
  selectedSolicitud: WritableSignal<SolicitudModel | null> = signal<SolicitudModel | null>(null);
  // Signal para indicar que se está procesando la cancelación
  isCancelling: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  // Carga las solicitudes desde el servidor y filtra las del usuario logueado
  loadSolicitudes(): void {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        const currentUser = this.authService.infoUsuario();
        const userId = currentUser?.id ?? '';
        const filtered = data.filter((s) => String(s.usuario_id) === String(userId));
        this.solicitudes.set(filtered);
      },
      error: (err) => {
        console.error('Error cargando solicitudes', err);
      },
    });
  }

  openDetails(solicitud: SolicitudModel): void {
    this.selectedSolicitud.set(solicitud);
  }

  closeDetails(): void {
    this.selectedSolicitud.set(null);
  }

  // Cancela la solicitud: actualiza el estado a 'CANCELADA' y persiste en el servidor
  cancelarSolicitud(solicitud: SolicitudModel | null): void {
    if (!solicitud) return;

    const currentUser = this.authService.infoUsuario();
    const currentUserIdStr = currentUser?.id ? String(currentUser.id) : '';

    // Prevención por si ya no está en estado PENDIENTE
    if (solicitud.estado !== 'PENDIENTE') return;

    // Validar que exista id de solicitud y id de usuario como string antes de continuar
    if (solicitud.id == null || currentUserIdStr === '') {
      console.warn('Faltan datos para cancelar la solicitud');
      return;
    }

    this.isCancelling.set(true);

    this.solicitudService.cancelarSolicitudIfAllowed(String(solicitud.id), solicitud, currentUserIdStr).subscribe({
      next: (updated) => {
        // actualizar la lista local (refrescar desde servidor para asegurarnos de consistencia)
        this.loadSolicitudes();

        // dejar de mostrar el modal
        this.isCancelling.set(false);
        this.closeDetails();
      },
      error: (err) => {
        console.error('Error cancelando solicitud', err);
        this.isCancelling.set(false);
      },
    });
  }

  

  // Ejemplo de helper para formatear la fecha (puedes personalizarlo)
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

  // Formatea una cadena de hora a HH:MM. Acepta formatos como 'HH:MM', 'HH:MM:SS',
  // o una parte horaria de un ISO datetime. Devuelve '-' si no hay valor.
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
