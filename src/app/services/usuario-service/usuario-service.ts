import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private baseDatosUrl = 'http://localhost:3000/usuarios';

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseDatosUrl);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseDatosUrl}/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseDatosUrl}?email=${email}`);
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseDatosUrl}/${usuario.id}`, usuario);
  }

  actualizarPassword(id: string, password: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseDatosUrl}/${id}`, { password });
  }

  eliminarById(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseDatosUrl}/${id}`, { activo: false });
  }

  
}
