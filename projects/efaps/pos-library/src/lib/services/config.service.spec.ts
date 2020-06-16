import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "./pos-config.token";
import { ConfigService } from "./config.service";

describe("ConfigService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PosConfigToken, useValue: {} }],
    })
  );

  it("should be created", () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });
});
