import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { RxStompService } from "./rx-stomp.service";

describe("RxStompService", () => {
  let service: RxStompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxStompService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
