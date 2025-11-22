import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  get usuario() {
    return this.auth.infoUsuario();
  }

  // Simulamos solicitudes pendientes - después se conectará con el servicio real
  get pendingSolicitudes(): number {
    // Por ahora retornamos un número fijo, después se calculará dinámicamente
    return 5;
  }

  navigateTo(path: string) {
    // Por ahora solo navegar a rutas que existen
    if (path === '/home' || path === '/perfil') {
      this.router.navigate([path]);
    } else {
      // Mostrar mensaje de que la funcionalidad está en desarrollo
      alert(`La funcionalidad "${path}" estará disponible próximamente.`);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}