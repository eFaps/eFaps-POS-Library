import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { DiscountService } from "./discount.service";
import { PosConfigToken } from "./pos-config.token";

describe("DiscountService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PosConfigToken, useValue: {} }]
    })
  );

  it("should be created", () => {
    const service: DiscountService = TestBed.get(DiscountService);
    expect(service).toBeTruthy();
  });
});
