import { TestBed } from "@angular/core/testing";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { PosConfigToken } from "./pos-config.token";
import { StocktakingService } from "./stocktaking.service";

describe("StocktakingService", () => {
  let service: StocktakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StocktakingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
