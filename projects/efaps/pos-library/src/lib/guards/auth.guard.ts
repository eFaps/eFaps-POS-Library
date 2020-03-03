import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
  deps: [Router, AuthService]
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isTokenExpired()) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
