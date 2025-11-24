import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AdminGuard: verificando rol admin...', auth.usuarioLogueado());
  
  if (!auth.usuarioLogueado()) {
    // No logueado: dejar como está (redirige a login)
    window.alert('No tienes permiso para acceder a esta página');
    console.log('AdminGuard: Usuario no logueado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  const usuario = auth.infoUsuario();
  console.log('AdminGuard: Usuario rol:', usuario.rol);
  
  if (usuario.rol !== 'ADMIN') {
    window.alert('No tienes permiso para acceder a esta página');
    // Redirigir a dashboard según rol
    if (usuario.rol === 'PROFESOR') {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }
  
  console.log('AdminGuard: Usuario admin autenticado, acceso permitido');
  return true;
};