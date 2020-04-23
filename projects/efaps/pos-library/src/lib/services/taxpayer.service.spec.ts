import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "./pos-config.token";
import { TaxpayerService } from "./taxpayer.service";

describe("TaxpayerService", () => {
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
    const service: TaxpayerService = TestBed.get(TaxpayerService);
    expect(service).toBeTruthy();
  });
});
