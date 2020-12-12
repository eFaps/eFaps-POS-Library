import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import { HealthService } from "./health.service";

class ConfigServiceStub {}

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    });
    service = TestBed.inject(HealthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
