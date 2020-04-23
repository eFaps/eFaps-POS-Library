import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { DiscountService } from "./discount.service";
import { PosConfigToken } from "./pos-config.token";

describe("DiscountService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: PosConfigToken, useValue: {} }
      ]
    })
  );

  it("should be created", () => {
    const service: DiscountService = TestBed.get(DiscountService);
    expect(service).toBeTruthy();
  });
});
