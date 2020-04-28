import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "../services/pos-config.token";
import { CompanyService } from "./company.service";

describe("CompanyService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PosConfigToken, useValue: {} }]
    })
  );

  it("should be created", () => {
    const service: CompanyService = TestBed.get(CompanyService);
    expect(service).toBeTruthy();
  });
});
