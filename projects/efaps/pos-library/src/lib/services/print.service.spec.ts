import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfigService } from "./config.service";
import { PrintService } from "./print.service";

class ConfigServiceStub {}

describe("PrintService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PrintService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject([PrintService], (service: PrintService) => {
    expect(service).toBeTruthy();
  }));
});
