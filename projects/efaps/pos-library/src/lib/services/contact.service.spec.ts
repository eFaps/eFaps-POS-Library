import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { ContactService } from "./contact.service";
import { PosConfigToken } from "./pos-config.token";

describe("ContactService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: PosConfigToken, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }),
  );

  it("should be created", () => {
    const service: ContactService = TestBed.inject(ContactService);
    expect(service).toBeTruthy();
  });
});
