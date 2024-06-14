import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { PaymentService } from "./payment.service";
import { PosService } from "./pos.service";
import { WorkspaceService } from "./workspace.service";
import { PosConfigToken } from "./pos-config.token";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("PaymentService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        ConfigService,
        DocumentService,
        PaymentService,
        PosService,
        WorkspaceService,
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject(
    [PaymentService],
    (service: PaymentService) => {
      expect(service).toBeTruthy();
    }
  ));
});
