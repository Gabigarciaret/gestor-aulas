# 📅 CALENDARIO - GUÍA PARA KARI

## 🎯 Cómo conectar tus reservas al calendario

### 📂 Archivos del calendario:
- `src/app/pages/calendario/calendario.component.ts` - Lógica principal
- `src/app/pages/calendario/calendario.component.html` - Template
- `src/app/pages/calendario/calendario.component.css` - Estilos

### 🔧 Pasos para conectar tus reservas:

#### 1. **Inyectar tu servicio de reservas**
```typescript
// En calendario.component.ts - línea ~15
constructor(private reservaService: ReservaService) {}
```

#### 2. **Cargar reservas reales en ngOnInit**
```typescript
ngOnInit() {
  this.cargarReservas();
}

private cargarReservas() {
  this.reservaService.getReservasAprobadas().subscribe(reservas => {
    this.reservasAprobadas = this.transformarReservasParaCalendario(reservas);
    this.actualizarCalendario();
  });
}
```

#### 3. **Transformar datos al formato FullCalendar**
```typescript
private transformarReservasParaCalendario(reservas: any[]): EventInput[] {
  return reservas.map(reserva => ({
    id: reserva.id,
    title: `${reserva.asignatura?.nombre || 'Clase'} - ${reserva.espacio?.nombre || 'Aula'}`,
    start: `${reserva.fecha_inicio}T${reserva.hora_inicio}`,
    end: `${reserva.fecha_fin || reserva.fecha_inicio}T${reserva.hora_fin}`,
    color: this.getColorPorTipo(reserva.tipo || reserva.asignatura?.nombre),
    extendedProps: {
      reservaId: reserva.id,
      profesor: reserva.profesor?.nombre || 'Sin profesor',
      aula: reserva.espacio?.nombre || 'Sin aula',
      comision: reserva.comision?.nombre || 'Sin comisión',
      asignatura: reserva.asignatura?.nombre || 'Sin asignatura'
    }
  }));
}
```

#### 4. **Actualizar calendario**
```typescript
private actualizarCalendario() {
  this.calendarOptions.update(options => ({
    ...options,
    events: this.reservasAprobadas
  }));
}
```

#### 5. **Método para colores (opcional)**
```typescript
private getColorPorTipo(tipo: string): string {
  const colores: {[key: string]: string} = {
    'Matemática': '#007bff',
    'Física': '#28a745', 
    'Programación': '#dc3545',
    'Base de Datos': '#ffc107',
    'Química': '#6f42c1',
    'Inglés': '#fd7e14'
  };
  return colores[tipo] || '#6c757d'; // Gris por defecto
}
```

### 🗂️ Formato esperado de tus datos:

```typescript
interface ReservaParaCalendario {
  id: number;
  fecha_inicio: string;    // 'YYYY-MM-DD' 
  fecha_fin?: string;      // 'YYYY-MM-DD' (opcional)
  hora_inicio: string;     // 'HH:mm:ss'
  hora_fin: string;        // 'HH:mm:ss'
  asignatura?: {
    nombre: string;
  };
  espacio?: {
    nombre: string;
  };
  profesor?: {
    nombre: string;
  };
  comision?: {
    nombre: string;
  };
}
```

### 🎨 Personalización:

#### Cambiar colores de la leyenda:
En `calendario.component.css` - líneas 120-140

#### Modificar detalles del popup:
En `calendario.component.ts` - método `handleEventClick()`

#### Agregar filtros:
Puedes agregar botones de filtro y modificar el array `reservasAprobadas`

### 🔄 Refrescar datos:
```typescript
// Método público para refrescar desde otros componentes
public refrescarReservas() {
  this.cargarReservas();
}
```

### 📱 Todo ya está responsive y funcionando:
- ✅ Vista mensual/semanal
- ✅ Detalles al hacer click
- ✅ Navegación por fechas
- ✅ Estilos integrados con el diseño

### 🚀 ¡Solo necesitas conectar tu servicio de reservas!

---
**Creado por**: Integración con Gabi
**Para**: Kari (gestión de reservas)
**Fecha**: Noviembre 2025