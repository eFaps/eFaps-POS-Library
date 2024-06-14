import { TestBed } from "@angular/core/testing";

import { EnquiryService } from "./enquiry.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ConfigService } from "./config.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

class ConfigServiceStub {}

describe("EnquiryService", () => {
  let service: EnquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EnquiryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
