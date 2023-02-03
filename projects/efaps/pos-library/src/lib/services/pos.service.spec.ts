import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injectable } from "@angular/core";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";
import { Item } from "../model";

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
    observer.next();
  });
}
class CalculatorServiceStub {}

@Injectable()
class PosServiceExtended extends PosService {
  calculateTotals(items: Item[]) {
    super.calculateTotals(items);
  }
}

describe("PosService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PosServiceExtended,
        TaxService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
        { provide: CalculatorService, useClass: CalculatorServiceStub },
      ],
    });
  });

  it("should be created", inject(
    [PosService],
    (service: PosServiceExtended) => {
      expect(service).toBeTruthy();
    }
  ));
});
