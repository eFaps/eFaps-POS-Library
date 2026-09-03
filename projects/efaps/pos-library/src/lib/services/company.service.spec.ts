import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { PosConfigToken } from "../services/pos-config.token";
import { CompanyService } from "./company.service";

describe("CompanyService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }),
  );

  it("should be created", () => {
    const service: CompanyService = TestBed.inject(CompanyService);
    expect(service).toBeTruthy();
  });
});
