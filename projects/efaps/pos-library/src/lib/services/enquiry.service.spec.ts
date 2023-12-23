import { TestBed } from "@angular/core/testing";

import { EnquiryService } from "./enquiry.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ConfigService } from "./config.service";

class ConfigServiceStub {}

describe("EnquiryService", () => {
  let service: EnquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    });
    service = TestBed.inject(EnquiryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
