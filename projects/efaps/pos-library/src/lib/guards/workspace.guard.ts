import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";

import { WorkspaceService } from "../services/workspace.service";

export const workspaceGuard: CanActivateFn = () =>
  new Promise<boolean | UrlTree>((resolve) => {
    const workspaceService: WorkspaceService = inject(WorkspaceService);
    const router: Router = inject(Router);
    workspaceService.hasCurrent().then(
      (onfullFilled) => {
        if (onfullFilled) {
          resolve(true);
        } else {
          resolve(router.createUrlTree(["/workspaces"]));
        }
      },
      (onRejected) => {
        resolve(router.createUrlTree(["/workspaces"]));
      },
    );
  });
