import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";

import { WorkspaceService } from "../services/workspace.service";

export const workspaceGuard: CanActivateFn = () =>
  new Promise<boolean | UrlTree>((resolve) => {
    const workspaceService: WorkspaceService = inject(WorkspaceService);
    workspaceService.hasCurrent().then(
      (onfullFilled) => {
        return true;
      },
      (onRejected) => {
        return inject(Router).createUrlTree(["/workspaces"]);
      }
    );
  });
