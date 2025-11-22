// src/app/components/menu/menu.component.ts
import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  roles: ('ADMIN' | 'PROFESOR')[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  private auth = inject(AuthService);

  items: MenuItem[] = [
    { label: 'Inicio', path: '/home', roles: ['ADMIN', 'PROFESOR'] }
    // TODO: Agregar estas rutas cuando los componentes estén listos
    // { label: 'Calendario', path: '/cronograma', roles: ['ADMIN', 'PROFESOR'] },
    // { label: 'Gestor reservas', path: '/reservas', roles: ['ADMIN'] },
    // { label: 'Gestor espacios', path: '/espacios', roles: ['ADMIN'] },
    // { label: 'Mis reservas', path: '/mis-reservas', roles: ['PROFESOR'] },
    // { label: 'Solicitudes', path: '/solicitudes', roles: ['ADMIN', 'PROFESOR'] },
    // { label: 'Usuarios', path: '/usuarios', roles: ['ADMIN'] }
  ];

  rolActual = this.auth.rolActual;

  menuVisible = computed(() => {
    const rol = this.rolActual();
    if (!rol) return [];
    return this.items.filter(i => i.roles.includes(rol));
  });
}
