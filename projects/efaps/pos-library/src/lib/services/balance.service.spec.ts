import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { BalanceService } from "./balance.service";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

class AuthServiceStub {
  currentEvent = new Observable(observer => {
    observer.next("nothing");
  });
}
class ConfigServiceStub {}
class WorkspaceServiceStub {
  currentWorkspace = new Observable(observer => {
    observer.next();
  });
}

describe("BalanceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub }
      ]
    });
  });

  it("should be created", () => {
    const service: BalanceService = TestBed.get(BalanceService);
    expect(service).toBeTruthy();
  });
});
