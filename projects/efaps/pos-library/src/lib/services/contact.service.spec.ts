import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PosConfigToken } from "./pos-config.token";
import { ContactService } from "./contact.service";

describe("ContactService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PosConfigToken, useValue: {} }],
    })
  );

  it("should be created", () => {
    const service: ContactService = TestBed.get(ContactService);
    expect(service).toBeTruthy();
  });
});
