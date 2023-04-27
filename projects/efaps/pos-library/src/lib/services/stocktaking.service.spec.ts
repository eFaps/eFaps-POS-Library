import { TestBed } from "@angular/core/testing";

import { StocktakingService } from "./stocktaking.service";

describe("StocktakingService", () => {
  let service: StocktakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocktakingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
