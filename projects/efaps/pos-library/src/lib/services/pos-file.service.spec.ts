import { TestBed } from "@angular/core/testing";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ConfigService } from "./config.service";
import { PosFileService } from "./pos-file.service";

describe("PosFileService", () => {
  let service: PosFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PosFileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
