import { inject, Injectable } from '@angular/core';
import { LoginRequest } from './LoginRequest';
import { map, Observable } from 'rxjs';
import { UsuarioService } from '../usuario-service/usuario-service';
import { AuthError } from '../../errores/AuthError';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);

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
      })
    );
  }
}
