import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";

import { WorkspaceService } from "../services/workspace.service";

@Injectable({
  providedIn: "root",
  deps: [Router, WorkspaceService]
})
export class WorkspaceGuard implements CanActivate {
  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>(resolve => {
      this.workspaceService.hasCurrent().then(_ret => {
        if (_ret) {
          resolve(true);
        } else {
          this.router.navigate(["/workspaces"]);
          resolve(false);
        }
      });
    });
  }
}
