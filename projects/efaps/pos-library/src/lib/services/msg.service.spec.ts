import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs";
import { beforeEach, describe, expect, it } from "vitest";

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { MsgService } from "./msg.service";
import { RxStompService } from "./rx-stomp.service";

class ConfigServiceStub {}
class AuthServiceStub {
  currentEvent = new Observable((observer) => {
    observer.next(undefined);
  });
}

describe("MsgService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MsgService,
        RxStompService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should be created", inject([MsgService], (service: MsgService) => {
    expect(service).toBeTruthy();
  }));
});
