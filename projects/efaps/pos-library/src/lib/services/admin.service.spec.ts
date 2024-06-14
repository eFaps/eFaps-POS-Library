import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { AdminService } from "./admin.service";
import { ConfigService } from "./config.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

class ConfigServiceStub {}

describe("AdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        AdminService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
  });

  it("should be created", inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
