import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from '../services/pos-config.token';
import { CompanyService } from "./company.service";

describe("CompanyService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      { provide: PosConfigToken, useValue: {} },
    ]
  }));

  it("should be created", () => {
    const service: CompanyService = TestBed.get(CompanyService);
    expect(service).toBeTruthy();
  });
});
