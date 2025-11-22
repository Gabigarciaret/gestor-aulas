import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/service/auth-service';
import { LoginRequest } from '../../auth/models/LoginRequest';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if(this.authService.usuarioLogueado()) {
        this.authService.logout();
      }
    });
  }

  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  mensajeError = signal('');

  Enviar(): void {
    if (this.form.invalid) { return; }

    this.mensajeError.set('');

    this.authService.validarCredenciales(this.form.value as LoginRequest).subscribe({
      next: () => {
        this.router.navigateByUrl('/menu');
      },
      error: (error) => {
        this.mensajeError.set(error.message);
      }
    });
  }
}
