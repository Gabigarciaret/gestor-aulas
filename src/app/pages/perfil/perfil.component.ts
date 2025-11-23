import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  usuario = computed(() => this.authService.infoUsuario());
  
  form: FormGroup;
  loading = false;
  mensaje = '';
  error = '';

  constructor() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwordActual: [''],
      passwordNuevo: [''],
      passwordConfirmar: ['']
    });

    // Cargar datos del usuario si existe
    const user = this.usuario();
    if (user) {
      this.form.patchValue({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.mensaje = '';
    this.error = '';

    // Aquí iría la lógica para actualizar el perfil
    // Por ahora solo simulamos la operación
    setTimeout(() => {
      this.loading = false;
      this.mensaje = 'Perfil actualizado correctamente';
    }, 1000);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}