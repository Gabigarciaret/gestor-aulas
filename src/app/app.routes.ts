import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Nueva } from './pages/solicitud/nueva/nueva';
import { MisSolicitudes } from './pages/solicitud/mis-solicitudes/mis-solicitudes';
import { GestionUsuarios } from './pages/gestion-usuarios/gestion-usuarios';
import { RegistrarUsuario } from './pages/gestion-usuarios/registrar-usuario/registrar-usuario';
import { AdministrarUsuario } from './pages/gestion-usuarios/administrar-usuario/administrar-usuario';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
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
    path: 'gestionUsuarios',
    component: GestionUsuarios
  },
  {
    path: 'gestionUsuarios/registrarUsuario',
    component: RegistrarUsuario
  },
  {
    path: 'gestionUsuarios/eliminarUsuario',
    component: AdministrarUsuario
  },
  {
    path: 'coming-soon',
    redirectTo: '/home'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
