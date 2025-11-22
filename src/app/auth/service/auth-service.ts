import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/LoginRequest';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UsuarioService } from '../../services/usuario-service/usuario-service';
import { AuthError } from '../errores/AuthError';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  usuarioLogueado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  infoUsuario: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>({
    id:'',
    apellido:'',
    nombre:'',
    rol:undefined,
    email:''
  });

  validarCredenciales(credenciales:LoginRequest): Observable<Usuario> {
    return this.usuarioService.getUsuarioByEmail(credenciales.email).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          if (usuario.password === credenciales.password) {
            return usuario;
          }
          else{
            throw AuthError.CredencialesInvalidas();
          };
        }
        throw AuthError.UsuarioNoRegistrado();
      }),
      tap(usuario => {
        this.usuarioLogueado.next(true);
        this.infoUsuario.next(usuario);
      })
    );
  }

  get datosUsuario(): Observable<Usuario> {
    return this.infoUsuario.asObservable();
  }

  get estaLogueado(): Observable<boolean> {
    return this.usuarioLogueado.asObservable();
  }
}
