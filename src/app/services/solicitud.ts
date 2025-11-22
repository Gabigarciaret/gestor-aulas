import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Solicitud{
  id?: number;
  comentario_estado: string;
  comentario_profesor: string;
  dia_semana: "LUNES" | "MARTES" | "MIÉRCOLES" | "JUEVES" | "VIERNES";
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA";
  fecha_fin: string;
  fecha_hora_solicitud: string;
  fecha_inicio: string;
  comision_id: number;
  nuevo_espacio_id: number;
  reserva_original_id: number;
  usuario_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class Solicitud {
  private apiUrl = 'http://localhost:3000/solicitudes';

  constructor(private http: HttpClient) {}

  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  createSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud);
  }

  updateSolicitud(id: number, solicitud: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}`, solicitud);
  }

  cancelarSolicitud(id: number, solicitud: Solicitud): Observable<Solicitud> {
    const payload = { ...solicitud, estado: 'CANCELADA' };
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Comprueba si la solicitud puede ser modificada por el usuario actual.
   * Solo el usuario creador y cuando el estado sea 'PENDIENTE'.
   */
  isEditable(solicitud: Solicitud, currentUserId: number): boolean {
    return (
      solicitud?.usuario_id === currentUserId &&
      solicitud?.estado === 'PENDIENTE'
    );
  }

  /**
   * Intenta actualizar la solicitud solo si el usuario está autorizado.
   * Devuelve un error observable si no está permitido.
   */
  updateSolicitudIfAllowed(
    id: number,
    solicitud: Solicitud,
    currentUserId: number
  ): Observable<Solicitud> {
    if (!this.isEditable(solicitud, currentUserId)) {
      return throwError(
        () => new Error('No autorizado: solo el creador puede modificar solicitudes en estado PENDIENTE')
      );
    }
    return this.updateSolicitud(id, solicitud);
  }

  cancelarSolicitudIfAllowed(
    id: number,
    solicitud: Solicitud,
    currentUserId: number
  ): Observable<Solicitud> {
    if (!this.isEditable(solicitud, currentUserId)) {
      return throwError(
        () => new Error('No autorizado: solo el creador puede cancelar solicitudes en estado PENDIENTE')
      );
    }
    // cancelarSolicitud ya fuerza el estado 'CANCELADA'
    return this.cancelarSolicitud(id, solicitud);
  }
}
