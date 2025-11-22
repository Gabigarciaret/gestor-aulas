import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AuthService as NewAuthService } from '../auth/service/auth-service';
import { LoginRequest } from '../auth/models/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001';
  private newAuthService = inject(NewAuthService);

  // Mantener compatibilidad con la implementación anterior
  private _usuarioActual = computed(() => {
    const usuario = this.newAuthService.infoUsuario();
    return usuario.id === 0 ? null : usuario;
  });

  constructor(private http: HttpClient) {}

  get usuarioActual() {
    return this._usuarioActual;
  }

  rolActual = computed(() => {
    const usuario = this._usuarioActual();
    return usuario ? usuario.rol : null;
  });

  login(email: string, password: string): Observable<Usuario> {
    const loginRequest: LoginRequest = { email, password };
    return this.newAuthService.validarCredenciales(loginRequest);
  }

  logout() {
    this.newAuthService.logout();
  }

  isAuthenticated(): boolean {
    return this.newAuthService.estaLogueado();
  }

  estaLogueado(): boolean {
    return this.newAuthService.estaLogueado();
  }

  hasRole(rol: 'ADMIN' | 'PROFESOR'): boolean {
    const usuario = this._usuarioActual();
    return usuario !== null && usuario.rol === rol;
  }
}
