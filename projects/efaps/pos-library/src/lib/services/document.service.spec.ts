import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { WorkspaceService } from "./workspace.service";

class ConfigServiceStub {}
class AuthServiceStub {}
class WorkspaceServiceStub {
  currentWorkspace = new Observable((observer) => {
    observer.next();
  });
}

describe("DocumentService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
      ],
    });
  });

  it("should be created", inject(
    [DocumentService],
    (service: DocumentService) => {
      expect(service).toBeTruthy();
    }
  ));
});
