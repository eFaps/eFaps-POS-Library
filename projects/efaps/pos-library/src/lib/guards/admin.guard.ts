import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { Roles } from "../model";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
  deps: [AuthService],
})
export class AdminGuard  {
  constructor(private auth: AuthService) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.hasRole(Roles.ADMIN);
  }
}
