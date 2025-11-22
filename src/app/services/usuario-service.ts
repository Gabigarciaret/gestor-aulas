import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { AuthError } from '../errores/AuthError';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private baseDatosUrl = 'http://localhost:3000/usuarios';

  getAll():Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseDatosUrl);
  }

  getUsuarioByEmail(email:string):Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseDatosUrl}?email=${email}`);
  }

  validarCredenciales(email: string, password: string): Observable<Usuario> {
    return this.getUsuarioByEmail(email).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          if (usuario.password === password) {
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

