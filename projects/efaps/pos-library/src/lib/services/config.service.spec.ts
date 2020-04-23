import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from './pos-config.token';
import { ConfigService } from "./config.service";

describe("ConfigService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      { provide: PosConfigToken, useValue: {} },
    ]
  }));

  it("should be created", () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });
});
