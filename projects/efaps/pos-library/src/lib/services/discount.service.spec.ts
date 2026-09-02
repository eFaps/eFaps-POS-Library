import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { DiscountService } from "./discount.service";
import { PosConfigToken } from "./pos-config.token";

describe("DiscountService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }),
  );

  it("should be created", () => {
    const service: DiscountService = TestBed.inject(DiscountService);
    expect(service).toBeTruthy();
  });
});
