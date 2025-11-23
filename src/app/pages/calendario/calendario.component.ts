import { Component, signal, ViewEncapsulation, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, Calendar } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../auth/service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarioComponent implements AfterViewInit, OnInit {
  
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  private reservaService = inject(ReservaService);
  public authService = inject(AuthService);
  private router = inject(Router);

  // Vista actual
  vistaActual = signal<'diario' | 'semanal' | 'mensual'>('semanal');

  // Reservas cargadas desde la API
  reservasAprobadas = signal<EventInput[]>([]);
  
  // Recursos (espacios/aulas) para la vista de recursos
  espaciosRecursos = signal<any[]>([]);

  // Método para determinar el título según la ruta
  getTituloVista(): string {
    const currentUrl = this.router.url;
    return currentUrl.includes('/mis-reservas') ? 'Mis Reservas' : 'Calendario de Reservas';
  }

  // Método para determinar el mensaje informativo
  getMensajeInfo(): string {
    const currentUrl = this.router.url;
    const usuario = this.authService.infoUsuario();
    
    if (currentUrl.includes('/mis-reservas')) {
      return `${usuario.nombre} ${usuario.apellido}`;
    }
    
    if (usuario.rol === 'ADMIN') {
      return '👨‍💼 Vista general - Todas las reservas del sistema';
    }
    
    return 'Gestión de horarios y reservas de aulas';
  }

  ngOnInit() {
    // Inicializar con arrays vacíos para evitar datos fantasma
    this.reservasAprobadas.set([]);
    this.espaciosRecursos.set([]);
    
    // Detectar si estamos en la vista "Mis Reservas"
    const currentUrl = this.router.url;
    const esMisReservas = currentUrl.includes('/mis-reservas');
    
    console.log(`📍 Ruta actual: ${currentUrl}, Es "Mis Reservas": ${esMisReservas}`);
    
    this.cargarReservas(esMisReservas);
  }

  // Cargar reservas desde la API
  cargarReservas(soloMisReservas = false) {
    console.log('🔄 Cargando reservas desde la API...');
    console.log(`📍 Solo mis reservas: ${soloMisReservas}`);
    
    // Timeout para la petición
    const timeoutMs = 5000; // 5 segundos
    
    this.reservaService.getReservasParaCalendario().subscribe({
      next: (reservas) => {
        console.log('✅ Reservas cargadas desde API:', reservas.length, 'eventos');
        
        if (reservas.length === 0) {
          console.log('⚠️ No se encontraron reservas en la API, usando fallback...');
          this.cargarDatosFallback();
          return;
        }
        
        // Mostrar detalles de las reservas por fecha
        const reservasPorFecha: { [key: string]: number } = {};
        reservas.forEach(reserva => {
          const fecha = new Date(reserva.start as string).toISOString().split('T')[0];
          if (!reservasPorFecha[fecha]) reservasPorFecha[fecha] = 0;
          reservasPorFecha[fecha]++;
        });
        
        console.log('📅 Reservas por fecha:', reservasPorFecha);
        console.log('📋 Primeras 5 reservas:', reservas.slice(0, 5));
        
        // Aplicar filtrado según la vista
        let reservasFiltradas: EventInput[];
        
        if (soloMisReservas) {
          // Vista "Mis Reservas": filtrar solo las del profesor
          console.log('🎯 Vista "Mis Reservas" - Filtrando solo reservas del profesor');
          reservasFiltradas = this.filtrarReservasPorUsuario(reservas);
        } else {
          // Vista "Agenda general": mostrar TODAS las reservas
          console.log('🌍 Agenda general - Mostrando todas las reservas del sistema');
          reservasFiltradas = reservas;
        }
        
        console.log('👤 Usuario actual:', this.authService.infoUsuario().rol, '- ID:', this.authService.infoUsuario().id);
        console.log('📊 Total reservas mostradas:', reservasFiltradas.length, 'de', reservas.length, 'totales');
        
        // Procesar reservas y agregar resourceId
        const reservasConRecursos = this.procesarReservasConRecursos(reservasFiltradas);
        this.reservasAprobadas.set(reservasConRecursos);
        
        // Cargar todas las aulas como recursos para vista diaria
        this.cargarTodasLasAulas();
        
        // Actualizar el calendario
        this.actualizarCalendario();
      },
      error: (error) => {
        console.error('❌ Error cargando reservas desde API:', error);
        console.log('� Posibles causas:');
        console.log('   - JSON Server no está ejecutándose en puerto 3000');
        console.log('   - Problema de conexión de red');
        console.log('   - El archivo db/db.json no existe o está corrupto');
        console.log('🔄 Usando datos de fallback...');
        this.cargarDatosFallback();
      }
    });
  }

  // Filtrar reservas según el rol y usuario actual
  private filtrarReservasPorUsuario(reservas: EventInput[]): EventInput[] {
    const usuario = this.authService.infoUsuario();
    
    // Si es PROFESOR, filtrar solo sus reservas
    if (usuario.rol === 'PROFESOR') {
      console.log('👨‍🏫 Usuario PROFESOR - Filtrando solo sus reservas');
      const profesorId = parseInt(usuario.id);
      
      const reservasDelProfesor = reservas.filter(reserva => {
        const profesorIdReserva = reserva.extendedProps?.['profesorId'];
        const esDelProfesor = profesorIdReserva === profesorId;
        
        if (esDelProfesor) {
          console.log('✅ Reserva del profesor encontrada:', reserva.title, '- Comisión:', reserva.extendedProps?.['comision']);
        }
        
        return esDelProfesor;
      });
      
      console.log(`🎯 Encontradas ${reservasDelProfesor.length} reservas para el profesor ID: ${profesorId}`);
      return reservasDelProfesor;
    }
    
    // Si es ADMIN, mostrar todas las reservas
    if (usuario.rol === 'ADMIN') {
      console.log('👨‍💼 Usuario ADMIN - Mostrando todas las reservas');
      return reservas;
    }
    
    // Otros roles: sin reservas por defecto
    console.log('👤 Usuario sin permisos específicos - Sin reservas');
    return [];
  }

  // Cargar todas las aulas disponibles como recursos
  private cargarTodasLasAulas() {
    this.reservaService.getEspacios().subscribe({
      next: (espacios) => {
        const recursos = espacios.map(espacio => ({
          id: espacio.nombre,
          title: espacio.nombre
        }));
        
        console.log('🏫 Todas las aulas cargadas como recursos:', recursos.length);
        this.espaciosRecursos.set(recursos);
        this.actualizarCalendario();
      },
      error: (error) => {
        console.error('❌ Error cargando espacios:', error);
        // Fallback: usar las aulas que aparecen en las reservas
        this.cargarRecursosDesdeReservas();
      }
    });
  }

  // Fallback: cargar recursos desde las reservas existentes
  private cargarRecursosDesdeReservas() {
    const reservas = this.reservasAprobadas();
    const espaciosUnicos = new Set<string>();
    
    reservas.forEach(reserva => {
      if (reserva.extendedProps?.['aula']) {
        espaciosUnicos.add(reserva.extendedProps['aula']);
      }
    });

    const recursos = Array.from(espaciosUnicos).map(aula => ({
      id: aula,
      title: aula
    }));

    console.log('🏫 Recursos de fallback desde reservas:', recursos.length);
    this.espaciosRecursos.set(recursos);
  }

  // Procesar reservas y agregar resourceId
  private procesarReservasConRecursos(reservas: EventInput[]) {
    console.log('🔄 Procesando', reservas.length, 'reservas...');
    
    // Agregar resourceId a cada evento
    const reservasConRecursos = reservas.map(reserva => ({
      ...reserva,
      resourceId: reserva.extendedProps?.['aula'] || 'sin-aula'
    }));

    console.log('✅ Reservas procesadas con resourceId:', reservasConRecursos.length);
    return reservasConRecursos;
  }

  // Actualizar calendario con configuración actual
  private actualizarCalendario() {
    const vistaActual = this.vistaActual();
    const recursos = this.espaciosRecursos();
    
    console.log('📅 Actualizando calendario...');
    console.log('👁️ Vista actual:', vistaActual);
    console.log('🏫 Recursos disponibles:', recursos.length, recursos);
    console.log('📊 Eventos disponibles:', this.reservasAprobadas().length);
    
    // Determinar qué vista usar
    let tipoVista: string;
    switch(vistaActual) {
      case 'diario':
        tipoVista = 'resourceTimeGridDay'; // Siempre con recursos en vista diaria
        break;
      case 'semanal':
        tipoVista = 'timeGridWeek'; // Vista normal en semanal
        break;
      case 'mensual':
        tipoVista = 'dayGridMonth'; // Vista normal en mensual
        break;
      default:
        tipoVista = 'resourceTimeGridDay';
    }

    // Actualizar opciones del calendario
    this.calendarOptions.update(options => ({
      ...options,
      initialView: tipoVista,
      events: this.reservasAprobadas(),
      resources: vistaActual === 'diario' ? recursos : []
    }));

    console.log('📅 Calendario actualizado - Vista:', tipoVista);
    console.log('🏫 Recursos asignados:', vistaActual === 'diario' ? recursos.length : 'Sin recursos (vista normal)');

    // Si el calendario ya está inicializado, cambiar vista
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.changeView(tipoVista);
      
      // Forzar actualización de recursos en la vista diaria
      if (vistaActual === 'diario') {
        console.log('🔄 Forzando actualización de recursos:', recursos);
        calendarApi.setOption('resources', recursos);
      }
    }
  }

  // Datos de fallback en caso de error
  private cargarDatosFallback() {
    const reservasFallback: EventInput[] = [
      {
        title: 'Programación I - Aula 101',
        start: '2025-11-25T08:00:00',
        end: '2025-11-25T10:00:00',
        color: '#dc3545',
        resourceId: 'Aula 101',
        extendedProps: {
          asignatura: 'Programación I',
          aula: 'Aula 101',
          comision: 'K1051'
        }
      },
      {
        title: 'Base de Datos - Lab Informática 1',
        start: '2025-11-25T10:00:00',
        end: '2025-11-25T12:00:00',
        color: '#ffc107',
        resourceId: 'Lab Informática 1',
        extendedProps: {
          asignatura: 'Base de Datos',
          aula: 'Lab Informática 1',
          comision: 'K2052'
        }
      },
      {
        title: 'Matemática I - Aula 203',
        start: '2025-11-25T14:00:00',
        end: '2025-11-25T16:00:00',
        color: '#007bff',
        resourceId: 'Aula 203',
        extendedProps: {
          asignatura: 'Matemática I',
          aula: 'Aula 203',
          comision: 'K1053'
        }
      },
      {
        title: 'Física I - Lab Física',
        start: '2025-11-25T16:00:00',
        end: '2025-11-25T18:00:00',
        color: '#28a745',
        resourceId: 'Lab Física',
        extendedProps: {
          asignatura: 'Física I',
          aula: 'Lab Física',
          comision: 'K1054'
        }
      }
    ];
    
    // Para fallback, procesar reservas y crear recursos básicos
    const reservasConRecursos = this.procesarReservasConRecursos(reservasFallback);
    this.reservasAprobadas.set(reservasConRecursos);
    
    // Crear recursos básicos para fallback
    const recursosFallback = [
      { id: 'Aula 101', title: 'Aula 101' },
      { id: 'Aula 102', title: 'Aula 102' },
      { id: 'Aula 103', title: 'Aula 103' },
      { id: 'Aula 201', title: 'Aula 201' },
      { id: 'Aula 202', title: 'Aula 202' },
      { id: 'Aula 203', title: 'Aula 203' },
      { id: 'Lab Informática 1', title: 'Lab Informática 1' },
      { id: 'Lab Informática 2', title: 'Lab Informática 2' },
      { id: 'Lab Física', title: 'Lab Física' }
    ];
    
    this.espaciosRecursos.set(recursosFallback);
    this.actualizarCalendario();
    
    console.log('⚠️ Usando datos de fallback - JSON server no disponible');
    console.log('📊 Cargadas', reservasFallback.length, 'reservas de demostración');
    console.log('🏫 Recursos de fallback:', recursosFallback.length);
  }

  // Configuración del calendario
  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '' // Quitamos los botones por defecto, usamos nuestros filtros
    },
    buttonText: {
      today: 'Hoy',
      prev: 'Anterior',
      next: 'Siguiente'
    },
    allDayText: 'Todo el día',
    initialView: 'timeGridWeek',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.reservasAprobadas(),
    resources: [], // Sin recursos por defecto, se cargan dinámicamente
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
    },
    // Configuración específica para recursos
    resourceAreaHeaderContent: 'Aulas/Espacios',
    resourceAreaWidth: '200px',
    resourceOrder: 'title'
  });

  // Cambiar vista
  cambiarVista(vista: 'diario' | 'semanal' | 'mensual') {
    console.log('🔄 Cambiando vista a:', vista);
    console.log('🏫 Recursos actuales antes del cambio:', this.espaciosRecursos());
    
    this.vistaActual.set(vista);
    this.actualizarCalendario();
    
    // Verificación adicional después del cambio
    if (vista === 'diario') {
      console.log('✅ Vista diaria activada. Recursos que se deberían mostrar:', this.espaciosRecursos());
      if (this.espaciosRecursos().length === 0) {
        console.log('⚠️ PROBLEMA: No hay recursos para vista diaria!');
      }
    }
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
    
    const props = evento.extendedProps;
    
    alert(`
📅 ${evento.title}

� Asignatura: ${props.asignatura || 'Sin asignatura'}
🏫 Aula: ${props.aula || 'Sin aula'}
🎓 Comisión: ${props.comision || 'Sin comisión'}
👥 Capacidad: ${props.capacidad || 'N/A'} personas
🏢 Tipo: ${props.tipoEspacio || 'AULA'}

📆 Fecha: ${fechaInicio}
⏰ Horario: ${horaInicio} - ${horaFin}
📅 Día: ${props.dia || ''}
    `);
  }

  // Manejar selección de fecha
  handleDateSelect(info: any) {
    console.log('Fecha seleccionada:', info.startStr);
  }
}