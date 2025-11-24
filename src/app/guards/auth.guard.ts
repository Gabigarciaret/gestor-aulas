import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: verificando autenticación...', auth.usuarioLogueado());
  
  if (!auth.usuarioLogueado()) {
    window.alert('No tienes permiso para acceder a esta página');
    router.navigate(['/login']);
    return false;
  }

  // Si está logueado pero no autorizado, redirigir a dashboard
  // (esto solo aplica si el guard se usa para rutas restringidas por rol, pero aquí se deja la lógica base)
  
  console.log('AuthGuard: Usuario autenticado, acceso permitido');
  return true;
};
