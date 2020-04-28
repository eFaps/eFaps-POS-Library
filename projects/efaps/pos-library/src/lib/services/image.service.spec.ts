import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { DomSanitizer } from "@angular/platform-browser";

import { ConfigService } from "./config.service";
import { ImageService } from "./image.service";

class ConfigServiceStub {}

describe("ImageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DomSanitizer,
        ImageService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
  });

  it("should be created", inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});
