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

  /*El effect() se ejecuta automáticamente cada vez que
  usuarioLogueado() cambia. Usar effect cuando queremos
  realizar una accion cada vez que cambia el valor del signal */
  constructor() {
    effect(() => {
      if (!this.authService.usuarioLogueado()) {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
