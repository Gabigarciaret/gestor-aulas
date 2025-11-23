import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Nueva } from './pages/solicitud/nueva/nueva';
import { MisSolicitudes } from './pages/solicitud/mis-solicitudes/mis-solicitudes';

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
    path: 'agenda',
    loadComponent: () => import('./pages/calendario/calendario.component').then(m => m.CalendarioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/calendario/calendario.component').then(m => m.CalendarioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'coming-soon',
    redirectTo: '/home'  // Temporal hasta que tus compañeros implementen coming-soon
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
