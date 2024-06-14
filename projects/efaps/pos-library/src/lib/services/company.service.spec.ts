import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "../services/pos-config.token";
import { CompanyService } from "./company.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("CompanyService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
    imports: [],
    providers: [{ provide: PosConfigToken, useValue: {} }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  );

  it("should be created", () => {
    const service: CompanyService = TestBed.get(CompanyService);
    expect(service).toBeTruthy();
  });
});
