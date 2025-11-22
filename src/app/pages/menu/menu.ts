import { Component, inject, effect } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.usuarioLogueado()) {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
