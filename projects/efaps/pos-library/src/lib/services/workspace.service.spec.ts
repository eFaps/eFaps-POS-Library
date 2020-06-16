import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

class ConfigServiceStub {}
class AuthServiceStub {}

describe("WorkspaceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WorkspaceService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  it("should be created", inject(
    [WorkspaceService],
    (service: WorkspaceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
