import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuComponent } from "../../components/menu/menu.components";
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private auth = inject(AuthService);
  private router = inject(Router);

  get usuario() {
    return this.auth.infoUsuario();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  viewCalendar() {
    // Por ahora mostrar alerta, más tarde implementar calendario público
    alert('Calendario público próximamente disponible');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
