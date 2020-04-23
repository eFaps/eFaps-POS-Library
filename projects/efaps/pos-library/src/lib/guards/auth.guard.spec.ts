import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LocalStorageService } from "ngx-store";

import { AuthService } from "../services/auth.service";
import { ConfigService } from "../services/config.service";
import { PosConfigToken } from "../services/pos-config.token";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthService,
        AuthGuard,
        ConfigService,
        HttpClient,
        HttpHandler,
        LocalStorageService,
        { provide: PosConfigToken, useValue: {} }
      ]
    });
  });

  it("should ...", inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
