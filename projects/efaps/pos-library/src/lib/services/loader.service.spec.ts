import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { LoaderService } from "./loader.service";

describe("LoaderService", () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
