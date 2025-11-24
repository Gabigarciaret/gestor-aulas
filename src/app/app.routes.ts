import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Nueva } from './pages/solicitud/nueva/nueva';
import { MisSolicitudes } from './pages/solicitud/mis-solicitudes/mis-solicitudes';
import { ListSolicitudes } from './pages/solicitud/list-solicitudes/list-solicitudes';
// import { ComingSoon } from './pages/coming-soon/coming-soon';
import { RegistrarUsuario } from './pages/gestion-usuarios/registrar-usuario/registrar-usuario';
import { AdministrarUsuario } from './pages/gestion-usuarios/administrar-usuario/administrar-usuario';

export const routes: Routes = [
  {
    path: '',
  redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  { path: 'solicitud/nueva',
   component: Nueva,
   canActivate: [authGuard]
   },
  { path: 'solicitud/mis-solicitudes',
    component: MisSolicitudes,
    canActivate: [authGuard]
  },
  {
    path: 'solicitudes',
    component: ListSolicitudes,
    canActivate: [adminGuard]
  },
  {
    path: 'agenda',
    loadComponent: () => import('./pages/calendario/calendario.component').then(m => m.CalendarioComponent)
  },
  {
    path: 'reservas-todas',
    loadComponent: () => import('./pages/gestor-reservas/gestor-reservas.component').then(m => m.GestorReservasComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/calendario/calendario.component').then(m => m.CalendarioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gestionUsuarios',
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios').then(m => m.GestionUsuarios),
    canActivate: [adminGuard]
  },
  {
    path: 'gestionUsuarios/registrarUsuario',
    component: RegistrarUsuario,
    canActivate: [adminGuard]
  },
  {
    path: 'gestionUsuarios/eliminarUsuario',
    component: AdministrarUsuario,
    canActivate: [adminGuard]
  },
  {
    path: 'coming-soon',
    redirectTo: '/coming-soon'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
