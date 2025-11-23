import { Routes } from '@angular/router';
//import { authGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { PerfilComponent } from './pages/perfil/perfil.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'menu', component: Menu },
  { path: 'perfil', component: PerfilComponent,/* canActivate: [authGuard]*/},
  { path: '**', redirectTo: 'home' }
];
