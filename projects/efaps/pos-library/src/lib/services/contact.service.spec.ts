import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from './pos-config.token';
import { ContactService } from "./contact.service";

describe("ContactService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      { provide: PosConfigToken, useValue: {} },
    ]
  }));

  it("should be created", () => {
    const service: ContactService = TestBed.get(ContactService);
    expect(service).toBeTruthy();
  });
});
