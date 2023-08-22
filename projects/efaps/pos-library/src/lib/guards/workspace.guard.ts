import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { WorkspaceService } from "../services/workspace.service";

export function workspaceGuard(): CanActivateFn {
  return () =>
    new Promise<boolean>((resolve) => {
      const workspaceService: WorkspaceService = inject(WorkspaceService);
      const router: Router = inject(Router);
      workspaceService.hasCurrent().then((_ret) => {
        if (_ret) {
          resolve(true);
        } else {
          router.navigate(["/workspaces"]);
          resolve(false);
        }
      });
    });
}
