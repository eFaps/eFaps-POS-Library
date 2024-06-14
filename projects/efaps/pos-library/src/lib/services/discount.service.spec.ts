import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { DiscountService } from "./discount.service";
import { PosConfigToken } from "./pos-config.token";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DiscountService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
    imports: [],
    providers: [{ provide: PosConfigToken, useValue: {} }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  );

  it("should be created", () => {
    const service: DiscountService = TestBed.get(DiscountService);
    expect(service).toBeTruthy();
  });
});
