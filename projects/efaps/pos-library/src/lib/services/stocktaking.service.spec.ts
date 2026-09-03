import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { PosConfigToken } from "./pos-config.token";
import { StocktakingService } from "./stocktaking.service";

describe("StocktakingService", () => {
  let service: StocktakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StocktakingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
