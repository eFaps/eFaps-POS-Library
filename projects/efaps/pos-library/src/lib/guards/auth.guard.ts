import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Permission } from "../model";

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  if (authService.isTokenExpired()) {
    return inject(Router).createUrlTree(["/login"]);
  }
  return true;
};

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const permissions = route.data.permissions as Array<Permission>;
  const authService: AuthService = inject(AuthService);
  return authService.hasPermission(...permissions);
};
