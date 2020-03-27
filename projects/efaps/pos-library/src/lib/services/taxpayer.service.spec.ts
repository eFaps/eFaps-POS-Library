import { TestBed } from "@angular/core/testing";

import { TaxpayerService } from "./taxpayer.service";

describe("TaxpayerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TaxpayerService = TestBed.get(TaxpayerService);
    expect(service).toBeTruthy();
  });
});
