import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001';
  private _usuarioActual = signal<Usuario | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private getStoredUser(): Usuario | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  private setStoredUser(usuario: Usuario | null): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (usuario) {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  get usuarioActual() {
    return this._usuarioActual.asReadonly();
  }

  rolActual = computed(() => {
    const usuario = this._usuarioActual();
    return usuario ? usuario.rol : null;
  });

  login(email: string, password: string): Observable<Usuario> {
    const params = new HttpParams().set('email', email);

    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { params }).pipe(
      map(usuarios => {
        if (!usuarios || usuarios.length === 0) {
          throw new Error('Usuario o contraseña incorrectos');
        }

        const usuario = usuarios[0];

        // para probar usamos solo las contraseñas en texto plano
        if (usuario.password !== password) {
          throw new Error('Usuario o contraseña incorrectos');
        }

        this._usuarioActual.set(usuario);
        this.setStoredUser(usuario);
        return usuario;
      })
    );
  }

  logout() {
    this._usuarioActual.set(null);
    this.setStoredUser(null);
  }

  isAuthenticated(): boolean {
    return this._usuarioActual() !== null;
  }

  estaLogueado(): boolean {
    return this._usuarioActual() !== null;
  }

  hasRole(rol: 'ADMIN' | 'PROFESOR'): boolean {
    const usuario = this._usuarioActual();
    return usuario !== null && usuario.rol === rol;
  }
}
