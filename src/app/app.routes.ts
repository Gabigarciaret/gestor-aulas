import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';


export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),canActivate: [authGuard]},
    {path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)},
    {path:'menu', component:Menu},
    {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
    {path:'**', redirectTo:'home'}
];
