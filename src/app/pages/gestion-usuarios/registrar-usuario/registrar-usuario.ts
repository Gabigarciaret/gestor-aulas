import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service/usuario-service';
import { AuthService } from '../../../auth/service/auth-service';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { UsuarioCreateDto } from '../../../models/usuarioCreateDto';

@Component({
  selector: 'app-registrar-usuario',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registrar-usuario.html',
  styleUrl: './registrar-usuario.css',
})
export class RegistrarUsuario {
  private usuarioService = inject(UsuarioService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  error = signal('');
  mensajeExito = signal('');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    passwordConfirmar: ['', [Validators.required]],
    rol: ['', [Validators.required]],
  });

  enviar() {
    if (this.form.invalid) {
      return;
    }

    this.mensajeExito.set('');
    this.error.set('');

    if (!this.auth.validarPassword(this.form.value.password!, this.form.value.passwordConfirmar!)) {
      this.error.set('Repita correctamente la contraseña');
      return;
    }

    this.usuarioService.getUsuarioByEmail(this.form.value.email!).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.error.set('Ya existe un usuario registrado con este Email');
          return;
        }

        this.usuarioService.crear(this.buildUsuario()).subscribe({
          next: () => {
            this.mensajeExito.set('¡Usuario creado exitosamente!');
            this.form.reset();
          },
          error: (err) => {
            console.log(err);
            this.error.set('Error al registrar el nuevo usuario');
          },
        });
      },
      error: (err) => {
        console.log(err);
        this.error.set('Error al verificar el email');
      },
    });
  }

  private buildUsuario(): UsuarioCreateDto {
    return {
      nombre: this.form.value.nombre!,
      apellido: this.form.value.apellido!,
      password: this.form.value.password!,
      rol: this.usuarioService.convertirRol(this.form.value.rol!),
      email: this.form.value.email!,
    };
  }
}
