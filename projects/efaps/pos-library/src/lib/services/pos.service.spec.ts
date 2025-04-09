import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Injectable } from "@angular/core";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { CalculatorService } from "./calculator.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { PosService } from "./pos.service";
import { TaxService } from "./tax.service";
import { WorkspaceService } from "./workspace.service";

class AuthServiceStub {
  currentEvent = new Observable((observer) => {
    observer.next("nothing");
  });
}
class ConfigServiceStub {}
class DocumentServiceStub {}
class WorkspaceServiceStub {
  currentWorkspace = new Observable((observer) => {
    observer.next(undefined);
  });
}
class CalculatorServiceStub {}

@Injectable()
class PosServiceExtended extends PosService {}

describe("PosService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PosServiceExtended,
        TaxService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
        { provide: CalculatorService, useClass: CalculatorServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject(
    [PosService],
    (service: PosServiceExtended) => {
      expect(service).toBeTruthy();
    },
  ));
});
