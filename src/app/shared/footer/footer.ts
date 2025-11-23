import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private auth = inject(AuthService);

  get usuario() {
    return this.auth.infoUsuario();
  }

  get isAdmin() {
    return this.usuario?.rol === 'ADMIN';
  }
}
