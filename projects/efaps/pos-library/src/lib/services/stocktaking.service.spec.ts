import { TestBed } from "@angular/core/testing";

import { StocktakingService } from "./stocktaking.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { PosConfigToken } from "./pos-config.token";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

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
