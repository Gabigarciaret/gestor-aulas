import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    rol: ['PROFESOR', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  errorMessage: string = '';
  isLoading: boolean = false;

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;
      
      // Verificar si el email ya existe
      this.http.get<any[]>(`http://localhost:3001/usuarios?email=${userData.email}`)
        .subscribe({
          next: (existingUsers) => {
            if (existingUsers.length > 0) {
              this.errorMessage = 'Este email ya está registrado';
              this.isLoading = false;
            } else {
              // Crear nuevo usuario
              this.http.post('http://localhost:3001/usuarios', userData)
                .subscribe({
                  next: (response) => {
                    this.isLoading = false;
                    alert('Usuario registrado exitosamente');
                    this.router.navigate(['/login']);
                  },
                  error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = 'Error al registrar usuario';
                  }
                });
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error al verificar email';
          }
        });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}