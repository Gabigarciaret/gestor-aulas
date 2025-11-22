import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private baseDatosUrl = 'http://localhost:3001/usuarios';

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseDatosUrl);
  }

  getUsuarioByEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseDatosUrl}?email=${email}`);
  }
}