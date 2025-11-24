import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';
import { Solicitud as SolicitudService } from '../../services/solicitud';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private solicitudService = inject(SolicitudService);

  usuario = computed(() => {
    const user = this.auth.infoUsuario();
    return user.id === '' ? null : user;
  });

  // Simulamos solicitudes pendientes - después se conectará con el servicio real
  private pendingCount = signal<number>(0);

  get pendingSolicitudes(): number {
    return this.pendingCount();
  }

  constructor() {
    this.solicitudService.getSolicitudes().subscribe((sols) => {
      if (!sols) {
        this.pendingCount.set(0);
        return;
      }
      const pending = sols.filter((s) => s.estado === 'PENDIENTE').length;
      this.pendingCount.set(pending);
    });
  }

  navigateTo(path: string | null) {
    if (path) {
      this.router.navigate([path]);
    }
  }
}