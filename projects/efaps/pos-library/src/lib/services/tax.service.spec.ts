import { TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it } from "vitest";
import { TaxService } from "./tax.service";

describe("TaxService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TaxService = TestBed.inject(TaxService);
    expect(service).toBeTruthy();
  });
});
