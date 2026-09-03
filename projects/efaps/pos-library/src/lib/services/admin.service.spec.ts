import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AdminService } from "./admin.service";
import { ConfigService } from "./config.service";

class ConfigServiceStub {}

describe("AdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AdminService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
