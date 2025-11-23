import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = computed(() => {
    const user = this.auth.infoUsuario();
    return user.id === '' ? null : user;
  });

  // Simulamos solicitudes pendientes - después se conectará con el servicio real
  get pendingSolicitudes(): number {
    return 5;
  }

  navigateTo(path: string) {
    if (path === '/dashboard' || path === '/perfil') {
      this.router.navigate([path]);
    } else {
      alert(`La funcionalidad "${path}" estará disponible próximamente.`);
    }
  }
}