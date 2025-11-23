import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Solicitud as SolicitudService, Solicitud } from '../../../services/solicitud';
import { AuthService } from '../../../auth/service/auth-service';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva.html',
  styleUrl: './nueva.css',
})
export class Nueva implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private solicitudService = inject(SolicitudService);
  private auth = inject(AuthService);

  form!: FormGroup;
  espacios: Array<any> = [];
  comisiones: Array<any> = [];
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  ngOnInit() {
    const usuario = this.auth.infoUsuario();
    if (!usuario || !usuario.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.form = this.fb.group({
      comentario_profesor: [''],
      dia_semana: ['LUNES', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      hora_inicio: ['', [Validators.required]],
      hora_fin: ['', [Validators.required]],
      nuevo_espacio_id: [null, [Validators.required]],
      comision_id: [null, [Validators.required]]
    });

    this.cargarEspacios();
    this.cargarComisionesDelProfesor(Number(usuario.id));
  }

  private cargarEspacios() {
    this.http.get<any[]>('http://localhost:3000/espacios').subscribe({
      next: (r) => this.espacios = r || [],
      error: () => this.espacios = []
    });
  }

  private cargarComisionesDelProfesor(profesorId: number) {
    this.http.get<any[]>(`http://localhost:3000/comisiones?usuario_profesor_id=${profesorId}`).subscribe({
      next: (r) => {
        this.comisiones = r || [];
        if (this.comisiones.length > 0 && !this.form.value.comision_id) {
          this.form.patchValue({ comision_id: this.comisiones[0].id });
        }
      },
      error: () => this.comisiones = []
    });
  }

  private formatDate(dateStr: string) {
    // Expecting yyyy-mm-dd from input (type=date)
    return dateStr;
  }

  private formatTime(timeStr: string) {
    // input type=time gives HH:MM, convert to HH:MM:SS.000000
    if (!timeStr) return '';
    return `${timeStr}:00.000000`;
  }

  private fechaHoraSolicitudNow(): string {
    // Usar ISO 8601, backend suele aceptar este formato. Ej: 2025-06-13T09:00:00.000Z
    return new Date().toISOString();
  }

  private parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    // Aceptar formatos: HH:MM, HH:MM:SS.000000
    const parts = timeStr.split(':');
    const hh = Number(parts[0] || 0);
    const mm = Number(parts[1] || 0);
    return hh * 60 + mm;
  }

  private datesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    // comparar fechas YYYY-MM-DD
    return !(endA < startB || endB < startA);
  }

  private timesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    const a1 = this.parseTimeToMinutes(startA);
    const a2 = this.parseTimeToMinutes(endA);
    const b1 = this.parseTimeToMinutes(startB);
    const b2 = this.parseTimeToMinutes(endB);
    return a1 < b2 && b1 < a2;
  }

  onSubmit() {
    this.mensaje = null;
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = this.auth.infoUsuario();
    const form = this.form.value;

    // Validaciones simples
    if (form.fecha_inicio > form.fecha_fin) {
      this.error = 'La fecha de inicio no puede ser posterior a la fecha de fin.';
      return;
    }

    this.loading = true;

    const payload: Partial<Solicitud> = {
      comentario_estado: null as any,
      comentario_profesor: form.comentario_profesor || null,
      dia_semana: form.dia_semana,
      estado: 'PENDIENTE',
      fecha_fin: this.formatDate(form.fecha_fin),
      fecha_inicio: this.formatDate(form.fecha_inicio),
      fecha_hora_solicitud: this.fechaHoraSolicitudNow(),
      hora_inicio: this.formatTime(form.hora_inicio),
      hora_fin: this.formatTime(form.hora_fin),
      comision_id: Number(form.comision_id),
      nuevo_espacio_id: Number(form.nuevo_espacio_id),
      reserva_original_id: null as any,
      usuario_id: Number(usuario.id)
    };
    // Comprobar solapamientos con solicitudes existentes para el mismo espacio
    this.http.get<Solicitud[]>(`http://localhost:3000/solicitudes?nuevo_espacio_id=${payload.nuevo_espacio_id}`).subscribe({
      next: (existing) => {
        const conflictos = (existing || []).filter(s => s && s.estado !== 'RECHAZADA' && s.estado !== 'CANCELADA').some(s => {
          const exFi = s.fecha_inicio;
          const exFf = s.fecha_fin;
          // si los rangos de fechas se solapan y también las horas
          const fechasSeSolapan = this.datesOverlap(payload.fecha_inicio as string, payload.fecha_fin as string, exFi, exFf);
          const horasSeSolapan = this.timesOverlap(payload.hora_inicio as string, payload.hora_fin as string, s.hora_inicio || '', s.hora_fin || '');
          return fechasSeSolapan && horasSeSolapan;
        });

        if (conflictos) {
          this.loading = false;
          this.error = 'Existe una reserva solapada en el espacio y horario seleccionado.';
          return;
        }

        // Si no hay conflictos, crear la solicitud
        this.solicitudService.createSolicitud(payload as Solicitud).subscribe({
          next: () => {
            this.loading = false;
            // Redirigir al listado de mis solicitudes
            this.router.navigate(['/solicitud/mis-solicitudes']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err?.message || 'Error al crear la solicitud';
          }
        });
      },
      error: () => {
        // si falla la comprobación, permitir crear para no bloquear el flujo, pero avisar
        this.solicitudService.createSolicitud(payload as Solicitud).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/solicitud/mis-solicitudes']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err?.message || 'Error al crear la solicitud';
          }
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/menu']);
  }
}
