import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: verificando autenticación...', auth.usuarioLogueado());
  
  if (!auth.usuarioLogueado()) {
    router.navigate(['/login']);
    return false;
  }
  
  console.log('AuthGuard: Usuario autenticado, acceso permitido');
  return true;
};
