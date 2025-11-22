import { inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../models/LoginRequest';
import { map, Observable, tap } from 'rxjs';
import { UsuarioService } from '../../services/usuario-service/usuario-service';
import { AuthError } from '../errores/AuthError';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  
  usuarioLogueado = signal<boolean>(false);
  infoUsuario = signal<Usuario>({
    id: '',
    apellido: '',
    nombre: '',
    rol: undefined,
    email: ''
  });

  constructor() {
    this.cargarSesion();
  }

  private cargarSesion(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario: Usuario = JSON.parse(usuarioGuardado);
        this.usuarioLogueado.set(true);
        this.infoUsuario.set(usuario);
      } catch (error) {
        localStorage.removeItem('usuario');
      }
    }
  }

  private guardarSesion(usuario: Usuario): void {
    const usuarioParaGuardar = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
  }

  validarCredenciales(credenciales: LoginRequest): Observable<Usuario> {
    return this.usuarioService.getUsuarioByEmail(credenciales.email).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          if (usuario.password === credenciales.password) {
            return usuario;
          } else {
            throw AuthError.CredencialesInvalidas();
          }
        }
        throw AuthError.UsuarioNoRegistrado();
      }),
      tap(usuario => {
        this.usuarioLogueado.set(true);
        this.infoUsuario.set(usuario);
        this.guardarSesion(usuario);
      })
    );
  }

  logout(): void {
    this.usuarioLogueado.set(false);
    this.infoUsuario.set({
      id: '',
      apellido: '',
      nombre: '',
      rol: undefined,
      email: ''
    });
    localStorage.removeItem('usuario');
  }

  cerrarSesion(): void {
    this.usuarioLogueado.next(false);
    this.infoUsuario.next({
      id: '',
      apellido: '',
      nombre: '',
      rol: undefined,
      email: ''
    });
  }
}
