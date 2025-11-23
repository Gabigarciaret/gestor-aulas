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
    email: '',
    activo: false,
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
      rol: usuario.rol,
      activo: usuario.activo,
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
  }

  actualizarInfoUsuario(usuario: Usuario): Observable<Usuario> {
    return this.usuarioService.actualizarUsuario(usuario).pipe(
      tap((usuarioActualizado) => {
        this.infoUsuario.set({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo,
        });
        this.guardarSesion(usuarioActualizado);
      })
    );
  }

  validarCredenciales(credenciales: LoginRequest): Observable<Usuario> {
    console.log('validar credenciales');
    return this.usuarioService.getUsuarioByEmail(credenciales.email).pipe(
      map((usuarios) => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          if(!usuario.activo){
            throw AuthError.UsuarioEliminado();
          }
          if (usuario.password === credenciales.password) {
            return usuario;
          } else {
            throw AuthError.CredencialesInvalidas();
          }
        }
        throw AuthError.UsuarioNoRegistrado();
      }),
      tap((usuario) => {
        console.log('guardar datos de sesion');
        this.usuarioLogueado.set(true);
        this.infoUsuario.set(usuario);
        this.guardarSesion(usuario);
      })
    );
  }

  validarPassword(password1: string, password2: string): boolean {
    if (password1 === password2) {
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioLogueado.set(false);
    this.usuarioReset();
    localStorage.removeItem('usuario');
  }

  private usuarioReset(): void {
    this.infoUsuario.set({
      id: '',
      apellido: '',
      nombre: '',
      rol: undefined,
      email: '',
      activo: false,
    });
  }
}
