import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { CollectService } from "./collect.service";
import { PosConfigToken } from "./pos-config.token";

describe("CollectService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: PosConfigToken, useValue: {} }
      ]
    })
  );

  it("should be created", () => {
    const service: CollectService = TestBed.get(CollectService);
    expect(service).toBeTruthy();
  });
});
