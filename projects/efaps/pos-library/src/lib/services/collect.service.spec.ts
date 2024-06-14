import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { CollectService } from "./collect.service";
import { PosConfigToken } from "./pos-config.token";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("CollectService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
  );

  it("should be created", () => {
    const service: CollectService = TestBed.get(CollectService);
    expect(service).toBeTruthy();
  });
});
