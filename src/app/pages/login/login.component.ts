import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';
import { LoginRequest } from '../../auth/models/LoginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;
  errorMsg: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.errorMsg = null;
    this.loading = true;

    console.log('Intentando login con:', { email, password });

    const loginRequest: LoginRequest = { email, password };

    this.auth.validarCredenciales(loginRequest).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        this.loading = false;
        this.errorMsg = err.message || 'Error al iniciar sesión';
      }
    });
  }
}
