import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const rol = auth.infoUsuario().rol;
  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || !rol || !rolesPermitidos.includes(rol)) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
