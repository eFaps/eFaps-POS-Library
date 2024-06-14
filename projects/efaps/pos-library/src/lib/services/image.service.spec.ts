import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { DomSanitizer } from "@angular/platform-browser";

import { ConfigService } from "./config.service";
import { ImageService } from "./image.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

class ConfigServiceStub {}

describe("ImageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        DomSanitizer,
        ImageService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
  });

  it("should be created", inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});
