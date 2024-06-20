import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ConfigService } from "./config.service";
import { HealthService } from "./health.service";

class ConfigServiceStub {}

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HealthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
