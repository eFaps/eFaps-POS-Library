import { TestBed, inject } from "@angular/core/testing";

import { beforeEach, describe, expect, it } from "vitest";
import { UtilsService } from "./utils.service";
describe("UtilsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService],
    });
  });

  it("should be created", inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it("should parse correctly", inject(
    [UtilsService],
    (service: UtilsService) => {
      expect(service.parse("1,234,657.8901")).not.toBeNaN();
      expect(service.parse("1,234,657.8901") == 1234567.8901).toBeTruthy();
    },
  ));
});
