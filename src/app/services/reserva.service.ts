import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { EventInput } from '@fullcalendar/core';

export interface Reserva {
  id: string;
  dia: string;
  fecha_fin: string;
  fecha_inicio: string;
  hora_fin: string;
  hora_inicio: string;
  comision_id: number;
  aula_id: number;
}

export interface Espacio {
  id: string;
  nombre: string;
  tipo_espacio: string;
  capacidad: number;
}

export interface Comision {
  id: string;
  nombre: string;
  asignatura_id: number;
  usuario_profesor_id: number;
}

export interface Asignatura {
  id: string;
  nombre_asignatura: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  constructor() { }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/reservas`);
  }

  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.baseUrl}/espacios`);
  }

  getComisiones(): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${this.baseUrl}/comisiones`);
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.baseUrl}/asignaturas`);
  }

  // Obtener reservas formateadas para FullCalendar
  getReservasParaCalendario(): Observable<EventInput[]> {
    return forkJoin({
      reservas: this.getReservas(),
      espacios: this.getEspacios(),
      comisiones: this.getComisiones(),
      asignaturas: this.getAsignaturas()
    }).pipe(
      map(({ reservas, espacios, comisiones, asignaturas }) => {
        console.log('🔄 Procesando datos de la API...');
        console.log('📊 Reservas:', reservas.length);
        console.log('🏫 Espacios:', espacios.length);
        console.log('👥 Comisiones:', comisiones.length);
        console.log('📚 Asignaturas:', asignaturas.length);
        
        return reservas.map(reserva => {
          const espacio = espacios.find(e => e.id === reserva.aula_id.toString());
          const comision = comisiones.find(c => c.id === reserva.comision_id.toString());
          const asignatura = comision ? asignaturas.find(a => a.id === comision.asignatura_id.toString()) : null;

          // Convertir fechas y horas
          const fechaInicio = new Date(`${reserva.fecha_inicio}T${reserva.hora_inicio.split('.')[0]}`);
          const fechaFin = new Date(`${reserva.fecha_inicio}T${reserva.hora_fin.split('.')[0]}`);

          const evento = {
            id: reserva.id,
            title: `${asignatura?.nombre_asignatura || 'Sin asignatura'} - ${espacio?.nombre || 'Sin aula'}`,
            start: fechaInicio.toISOString(),
            end: fechaFin.toISOString(),
            color: this.getColorPorAsignatura(asignatura?.nombre_asignatura || ''),
            extendedProps: {
              asignatura: asignatura?.nombre_asignatura || 'Sin asignatura',
              aula: espacio?.nombre || 'Sin aula',
              comision: comision?.nombre || 'Sin comisión',
              dia: reserva.dia,
              capacidad: espacio?.capacidad || 0,
              tipoEspacio: espacio?.tipo_espacio || 'AULA',
              profesorId: comision?.usuario_profesor_id || null,
              comisionId: reserva.comision_id
            }
          } as EventInput;
          
          console.log('✅ Evento procesado:', evento.title, 'en', evento.extendedProps?.['aula']);
          return evento;
        });
      })
    );
  }

  private getColorPorAsignatura(nombreAsignatura: string): string {
    const nombre = nombreAsignatura.toLowerCase();
    
    if (nombre.includes('matemática') || nombre.includes('matematica') || nombre.includes('álgebra') || nombre.includes('algebra')) {
      return '#007bff'; // Azul
    } else if (nombre.includes('física') || nombre.includes('fisica') || nombre.includes('laboratorio')) {
      return '#28a745'; // Verde
    } else if (nombre.includes('programación') || nombre.includes('programacion') || nombre.includes('algoritmos')) {
      return '#dc3545'; // Rojo
    } else if (nombre.includes('base') || nombre.includes('datos') || nombre.includes('sistemas')) {
      return '#ffc107'; // Amarillo
    } else if (nombre.includes('inglés') || nombre.includes('ingles')) {
      return '#6f42c1'; // Púrpura
    } else if (nombre.includes('química') || nombre.includes('quimica')) {
      return '#fd7e14'; // Naranja
    } else {
      return '#6c757d'; // Gris por defecto
    }
  }
}