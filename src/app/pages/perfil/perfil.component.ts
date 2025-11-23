import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  form = this.fb.group({
      nombre: [this.auth.infoUsuario().nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.auth.infoUsuario().apellido, [Validators.required, Validators.minLength(2)]],
      email: [this.auth.infoUsuario().email, [Validators.required, Validators.email]],
      passwordActual: ['', [Validators.required]],
      passwordNuevo: ['', [Validators.required]],
      passwordConfirmar: ['']
    });

  ngOnInit() {
    if (!this.auth.usuarioLogueado) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    
    // Validar contraseñas
    if (formData.passwordNuevo && formData.passwordNuevo !== formData.passwordConfirmar) {
      this.error = 'Las contraseñas nuevas no coinciden';
      return;
    }

    this.loading = true;
    this.error = null;
    this.mensaje = null;

    // Por ahora solo simular la actualización
    setTimeout(() => {
      this.loading = false;
      this.mensaje = '¡Perfil actualizado correctamente!';
      
      // Limpiar campos de contraseña
      this.form.patchValue({
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmar: ''
      });
    }, 1000);
  }

  volver() {
    this.router.navigate(['/home']);
  }
}