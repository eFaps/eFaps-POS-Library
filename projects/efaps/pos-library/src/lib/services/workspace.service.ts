import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import {
  PosLayout,
  SpotConfig,
  Workspace,
  WorkspaceFlag,
} from "../model/index";
import { AuthService } from "./auth.service";
import { CollectService } from "./collect.service";
import { CompanyService } from "./company.service";
import { ConfigService } from "./config.service";
import { PersistenceObject } from "../model";
import { NumberSymbol } from "@angular/common";

@Injectable({
  providedIn: "root",
  deps: [
    HttpClient,
    AuthService,
    ConfigService,
    CompanyService,
    CollectService,
  ],
})
export class WorkspaceService {
  SpotConfig = SpotConfig;
  private current: Workspace = null;
  private currentSource = new BehaviorSubject<Workspace>(this.current);
  currentWorkspace = this.currentSource.asObservable();
  workspaces: PersistenceObject;
  private autoPayment = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private config: ConfigService,
    private companyService: CompanyService,
    private collectService: CollectService
  ) {
    if (config.persistence) {
      this.workspaces = config.persistence.workspaces();
    }
  }

  public getWorkspaces(): Observable<Workspace[]> {
    const url = `${this.config.baseUrl}/workspaces`;
    return this.http.get<Workspace[]>(url);
  }

  public getWorkspace(_oid: string): Observable<Workspace> {
    const url = `${this.config.baseUrl}/workspaces/${_oid}`;
    return this.http.get<Workspace>(url);
  }

  public hasCurrent(): Promise<boolean> {
    if (this.currentSource.getValue()) {
      return new Promise<boolean>((resolve) => resolve(true));
    }
    var workspaceOid;
    if (this.companyService.hasCompany()) {
      if (!this.workspaces[this.companyService.currentCompany.key]) {
        this.workspaces[this.companyService.currentCompany.key] = {};
      }
      workspaceOid =
        this.workspaces[this.companyService.currentCompany.key][
          this.auth.getCurrentUsername()
        ];
    } else {
      workspaceOid = this.workspaces[this.auth.getCurrentUsername()];
    }

    if (workspaceOid) {
      return new Promise<boolean>((resolve) => {
        this.getWorkspace(workspaceOid).subscribe({
          next: (ws) => {
            this.setCurrent(ws);
            resolve(true);
          },
          error: (err) => {
            resolve(false);
          },
        });
      });
    }
    return new Promise<boolean>((resolve) => resolve(false));
  }

  public logout() {
    this.currentSource.next(null);
  }

  public setCurrent(_workspace: Workspace) {
    this.current = _workspace;
    this.currentSource.next(_workspace);
    this.storeCurrentWorkspace(_workspace.oid);
    this.collectService.getCollectors().subscribe({
      next: (collectors) =>
        (this.autoPayment = collectors && collectors.length > 0),
    });
  }

  private storeCurrentWorkspace(_oid: string) {
    if (this.companyService.hasCompany()) {
      if (this.workspaces[this.companyService.currentCompany.key] == undefined) {
        this.workspaces[this.companyService.currentCompany.key] = {}
      }
      this.workspaces[this.companyService.currentCompany.key][
        this.auth.getCurrentUsername()
      ] = _oid;
    } else {
      this.workspaces[this.auth.getCurrentUsername()] = _oid;
    }
    this.workspaces.save();
  }

  public getLanguage() {
    return "es";
  }

  public showSpots() {
    return (
      this.current &&
      this.current.spotConfig &&
      this.current.spotConfig != SpotConfig.NONE
    );
  }

  public getSpotSize(): number {
    return this.current && this.current.spotCount;
  }

  public showInventory() {
    return (
      this.current &&
      this.current.warehouseOid &&
      this.current.warehouseOid.length > 0
    );
  }

  public allowPayment() {
    return (
      this.current && this.current.docTypes && this.current.docTypes.length > 0
    );
  }

  public hasAutoPayment() {
    return this.autoPayment;
  }

  public getWarehouseOid(): string {
    return this.showInventory() && this.current.warehouseOid;
  }

  public getPosLayout(): PosLayout {
    return this.current && this.current.posLayout
      ? this.current.posLayout
      : PosLayout.GRID;
  }
}
