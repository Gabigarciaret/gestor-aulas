import { Component, signal, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, Calendar } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarioComponent implements AfterViewInit {
  
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // Vista actual
  vistaActual = signal<'mensual' | 'semanal'>('mensual');

  // TODO: Kari - Conectar con tu servicio de reservas
  // Datos simulados de reservas (REEMPLAZAR por tu servicio)
  reservasAprobadas: EventInput[] = [
    // KARI: Aquí puedes cargar tus reservas reales
    // Ejemplo de cómo transformar:
    // this.reservaService.getReservas().subscribe(reservas => {
    //   this.reservasAprobadas = this.transformarReservasParaCalendario(reservas);
    //   this.calendarOptions.update(options => ({...options, events: this.reservasAprobadas}));
    // });
    
    {
      title: 'Matemática I - Aula 101',
      start: '2025-11-25T08:00:00',
      end: '2025-11-25T10:00:00',
      color: '#007bff',
      extendedProps: {
        profesor: 'Dr. González',
        aula: 'Aula 101',
        comision: 'K1051'
      }
    },
    {
      title: 'Física II - Lab. 205',
      start: '2025-11-25T14:00:00',
      end: '2025-11-25T16:00:00',
      color: '#28a745',
      extendedProps: {
        profesor: 'Dra. Martínez',
        aula: 'Laboratorio 205',
        comision: 'K1052'
      }
    },
    {
      title: 'Programación IV - Aula 302',
      start: '2025-11-26T10:00:00',
      end: '2025-11-26T12:00:00',
      color: '#dc3545',
      extendedProps: {
        profesor: 'Ing. López',
        aula: 'Aula 302',
        comision: 'K1053'
      }
    },
    {
      title: 'Base de Datos - Lab. 101',
      start: '2025-11-27T08:00:00',
      end: '2025-11-27T11:00:00',
      color: '#ffc107',
      extendedProps: {
        profesor: 'Lic. Fernández',
        aula: 'Laboratorio 101',
        comision: 'K1054'
      }
    }
  ];

  // Configuración del calendario
  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '' // Quitamos los botones por defecto, usamos nuestros filtros
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.reservasAprobadas,
    locale: 'es', // Español
    height: 'auto',
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    firstDay: 1, // Lunes como primer día
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false
    }
  });

  // Cambiar vista
  cambiarVista(vista: 'mensual' | 'semanal') {
    this.vistaActual.set(vista);
    
    const nuevaVista = vista === 'mensual' ? 'dayGridMonth' : 'timeGridWeek';
    
    // Usar la API del calendario para cambiar vista en tiempo real
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView(nuevaVista);
  }

  ngAfterViewInit() {
    // Componente inicializado
  }

  // Manejar click en evento
  handleEventClick(info: any) {
    const evento = info.event;
    const fechaInicio = evento.start.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const horaInicio = evento.start.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const horaFin = evento.end.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    alert(`
📅 ${evento.title}

👨‍🏫 Profesor: ${evento.extendedProps.profesor}
🏫 Aula: ${evento.extendedProps.aula}
🎓 Comisión: ${evento.extendedProps.comision}

📆 Fecha: ${fechaInicio}
⏰ Horario: ${horaInicio} - ${horaFin}
    `);
  }

  // Manejar selección de fecha
  handleDateSelect(info: any) {
    console.log('Fecha seleccionada:', info.startStr);
  }
}