import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import {
  AuthService,
  ConfigService,
  WorkspaceService
} from "../services/index";
import { PosConfigToken } from "../services/pos-config.token";
import { WorkspaceGuard } from "./workspace.guard";

describe("WorkspaceGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthService,
        WorkspaceGuard,
        ConfigService,
        WorkspaceService,
        HttpClient,
        HttpHandler,
        { provide: PosConfigToken, useValue: {} }
      ]
    });
  });

  it("should ...", inject([WorkspaceGuard], (guard: WorkspaceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
