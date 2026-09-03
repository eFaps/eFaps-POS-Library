import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { WorkspaceService } from "./workspace.service";

class ConfigServiceStub {}
class AuthServiceStub {}
class WorkspaceServiceStub {
  currentWorkspace = new Observable((observer) => {
    observer.next(undefined);
  });
}

describe("DocumentService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DocumentService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject(
    [DocumentService],
    (service: DocumentService) => {
      expect(service).toBeTruthy();
    },
  ));
});
