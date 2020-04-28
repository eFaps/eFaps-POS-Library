import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed, inject } from "@angular/core/testing";
import { StompRService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { MsgService } from "./msg.service";

class ConfigServiceStub {}
class AuthServiceStub {
  currentEvent = new Observable(observer => {
    observer.next();
  });
}

describe("MsgService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MsgService,
        StompRService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
  });

  it("should be created", inject([MsgService], (service: MsgService) => {
    expect(service).toBeTruthy();
  }));
});
