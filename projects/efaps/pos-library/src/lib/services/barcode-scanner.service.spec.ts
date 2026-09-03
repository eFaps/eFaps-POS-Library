import { TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it } from "vitest";
import { BarcodeScannerService } from "./barcode-scanner.service";
describe("BarcodeScannerService", () => {
  let service: BarcodeScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeScannerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
