import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { AdminService } from "./admin.service";
import { ConfigService } from "./config.service";

class ConfigServiceStub {}

describe("AdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  it("should be created", inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
