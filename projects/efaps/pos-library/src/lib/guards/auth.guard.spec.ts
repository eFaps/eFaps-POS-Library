import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LocalStorageService } from "ngx-store";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "../services/auth.service";
import { ConfigService } from "../services/config.service";

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
        LocalStorageService
      ]
    });
  });

  it("should ...", inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
