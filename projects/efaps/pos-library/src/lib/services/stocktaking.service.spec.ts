import { TestBed } from "@angular/core/testing";

import { StocktakingService } from "./stocktaking.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { PosConfigToken } from "./pos-config.token";

describe("StocktakingService", () => {
  let service: StocktakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PosConfigToken, useValue: {} }],
    });
    service = TestBed.inject(StocktakingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
