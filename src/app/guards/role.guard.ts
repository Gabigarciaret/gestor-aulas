import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const rol = auth.infoUsuario().rol;
  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || !rol || !rolesPermitidos.includes(rol)) {
    window.alert('No tienes permiso para acceder a esta página');
    // Si está logueado, redirigir a dashboard; si no, dejar como está
    if (auth.usuarioLogueado()) {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/login']);
    }
    return false;
  }
  return true;
};
