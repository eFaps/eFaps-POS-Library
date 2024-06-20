import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ConfigService } from "./config.service";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { EmployeeService } from "./employee.service";

class ConfigServiceStub {}

describe("EmployeeService", () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EmployeeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
