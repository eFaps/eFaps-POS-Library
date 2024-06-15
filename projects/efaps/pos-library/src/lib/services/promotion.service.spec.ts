import { TestBed } from "@angular/core/testing";

import { PromotionService } from "./promotion.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ConfigService } from "./config.service";

describe("PromotionService", () => {
  let service: PromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PromotionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
