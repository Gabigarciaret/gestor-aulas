import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AdminGuard: verificando rol admin...', auth.usuarioLogueado());
  
  if (!auth.usuarioLogueado()) {
    console.log('AdminGuard: Usuario no logueado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  const usuario = auth.infoUsuario();
  console.log('AdminGuard: Usuario rol:', usuario.rol);
  
  if (usuario.rol !== 'ADMIN') {
    console.log('AdminGuard: Usuario no es admin, redirigiendo a dashboard');
    router.navigate(['/dashboard']);
    return false;
  }
  
  console.log('AdminGuard: Usuario admin autenticado, acceso permitido');
  return true;
};