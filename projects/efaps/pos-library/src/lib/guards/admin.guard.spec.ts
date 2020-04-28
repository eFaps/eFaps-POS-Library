import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthService } from "../services/auth.service";
import { ConfigService } from "../services/config.service";
import { PosConfigToken } from '../services/pos-config.token';
import { AdminGuard } from "./admin.guard";

describe("AdminGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminGuard,
        AuthService,
        ConfigService,
        HttpClient,
        HttpHandler,
        { provide: PosConfigToken, useValue: {} },
      ]
    });
  });

  it("should ...", inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
