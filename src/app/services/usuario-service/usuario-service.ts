import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { UsuarioCreateDto } from '../../models/usuarioCreateDto';

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

  crear(usuario: UsuarioCreateDto): Observable<Usuario> {
    const usuarioNuevo = {
      ...usuario,
      activo: true
    };
    return this.http.post<Usuario>(this.baseDatosUrl, usuarioNuevo);
  }

  convertirRol(rol: string): 'ADMIN' | 'PROFESOR' {
    const rolMayus = rol.toUpperCase();
    if (rolMayus === 'ADMIN') {
      return 'ADMIN';
    }
    return 'PROFESOR';
  }

  obtenerUsuariosPaginados(
    pagina: number,
    limite: number,
    filtroTexto?: string,
    filtroRol?: string,
    filtroActivo?: boolean
  ): Observable<{ usuarios: Usuario[]; total: number }> {
    let params = '';

    if (filtroRol && filtroRol !== '') {
      params += `rol=${filtroRol}`;
    }

    if (filtroActivo !== undefined) {
      params += params ? '&' : '';
      params += `activo=${filtroActivo}`;
    }

    const url = params ? `${this.baseDatosUrl}?${params}` : this.baseDatosUrl;

    return this.http
      .get<Usuario[]>(url, { observe: 'response' })
      .pipe(
        map((response) => {
          let usuarios = response.body || [];
          
          if (filtroTexto && filtroTexto.trim() !== '') {
            const textoLower = filtroTexto.toLowerCase();
            usuarios = usuarios.filter(u => 
              u.nombre.toLowerCase().includes(textoLower) ||
              u.apellido.toLowerCase().includes(textoLower) ||
              u.email.toLowerCase().includes(textoLower)
            );
          }
          
          const inicio = (pagina - 1) * limite;
          const fin = inicio + limite;
          const usuariosPaginados = usuarios.slice(inicio, fin);
          
          return {
            usuarios: usuariosPaginados,
            total: usuarios.length,
          };
        })
      );
  }
}
