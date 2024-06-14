import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

class ConfigServiceStub {}

describe("AuthService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
