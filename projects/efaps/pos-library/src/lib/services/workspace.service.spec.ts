import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

class ConfigServiceStub {}
class AuthServiceStub {}

describe("WorkspaceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        WorkspaceService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject(
    [WorkspaceService],
    (service: WorkspaceService) => {
      expect(service).toBeTruthy();
    },
  ));
});
