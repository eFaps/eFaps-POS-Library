import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfigService } from "./config.service";
import { EnquiryService } from "./enquiry.service";

class ConfigServiceStub {}

describe("EnquiryService", () => {
  let service: EnquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EnquiryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
