import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "./pos-config.token";
import { ConfigService } from "./config.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("ConfigService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
    imports: [],
    providers: [{ provide: PosConfigToken, useValue: {} }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  );

  it("should be created", () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });
});
