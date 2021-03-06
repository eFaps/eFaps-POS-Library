import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import { PrintService } from "./print.service";

class ConfigServiceStub {}

describe("PrintService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PrintService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  it("should be created", inject([PrintService], (service: PrintService) => {
    expect(service).toBeTruthy();
  }));
});
