Gestor de Aulas

Este proyecto fue desarrollado como trabajo final de la materia Programación IV de la Tecnicatura Universitaria en Programación (Universidad Tecnológica Nacional, Facultad Regional Mar del Plata).

Gestor de Aulas es una aplicación web desarrollada en Angular para la gestión de reservas de aulas dentro de una institución educativa.
Permite a los usuarios autenticarse, solicitar reservas, administrar solicitudes y visualizar información relevante sobre el uso de los espacios.

Repositorio GitHub: https://github.com/Gabigarciaret/gestor-aulas.git

Integrantes

Ambrosi Nicolás

De la Riva Karina

García Retamar Gabriela

Módulos y Funcionalidades
Autenticación y Usuarios

Inicio de sesión y registro.

Manejo de roles: usuarios comunes y administradores.

Guards de rutas para proteger secciones según autenticación y permisos.

Panel de Control (Dashboard)

Acceso centralizado a las funcionalidades principales según rol.

Navegación hacia módulos de solicitudes, calendario, perfil y administración.

Gestión de Solicitudes

Creación de nuevas solicitudes de reserva de aula.

Visualización y seguimiento de solicitudes del usuario.

Aprobación o rechazo de solicitudes (solo para administradores).

Calendario

Visualización de reservas en formato calendario.

Consulta de disponibilidad de aulas.

Perfil de Usuario

Visualización y edición de datos personales.

Cambio de contraseña.

Componentes Compartidos

Header y footer reutilizables.

Menú adaptado al rol del usuario.

Seguridad

Guards de autenticación.

Guards de autorización por rol.

Redirección automática según permisos y estado de sesión.

Backend Simulado

Uso de json-server con db.json para simular CRUD y persistencia durante el desarrollo.

Estructura del Proyecto
src/
 └─ app/
     ├─ auth/        → Autenticación, modelos y servicios
     ├─ guards/      → Guards de rutas (auth y roles)
     ├─ pages/       → Páginas principales (dashboard, calendario, login, registro, perfil, solicitudes)
     ├─ services/    → Servicios de usuarios, reservas y solicitudes
     └─ shared/      → Header, footer y componentes comunes

db/
 └─ db.json          → Base de datos simulada

Objetivo del Proyecto

El objetivo principal de Gestor de Aulas es permitir una administración eficiente de los espacios educativos, facilitando la reserva por parte de los usuarios y la gestión de disponibilidad por parte de los administradores.

Fecha

Noviembre 2025
