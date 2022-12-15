import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ConfigService } from "./config.service";

import { EmployeeService } from "./employee.service";

class ConfigServiceStub {}

describe("EmployeeService", () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    });
    service = TestBed.inject(EmployeeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
