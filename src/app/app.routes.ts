import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component:Home},
    {path:'login', component:Login},
    {path:'menu', component:Menu},
    {path:'**', redirectTo:'home'}
];
