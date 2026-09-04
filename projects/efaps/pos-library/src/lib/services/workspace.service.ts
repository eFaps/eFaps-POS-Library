import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { PersistenceObject } from "../model";
import { PosLayout, SpotConfig, Workspace } from "../model/index";
import { AuthService } from "./auth.service";
import { CollectService } from "./collect.service";
import { CompanyService } from "./company.service";
import { ConfigService } from "./config.service";

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
  private current?: Workspace | null;
  private currentSource = new BehaviorSubject<Workspace | undefined | null>(
    this.current,
  );
  currentWorkspace = this.currentSource.asObservable();
  workspaces: PersistenceObject;
  private autoPayment = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private config: ConfigService,
    private companyService: CompanyService,
    private collectService: CollectService,
  ) {
    this.workspaces = config.persistence.workspaces();
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
    var workspaceOid: string | undefined;
    var userName = this.auth.getCurrentUsername()
      ? this.auth.getCurrentUsername()
      : "none";
    if (this.companyService.hasCompany()) {
      if (!(this.workspaces as any)[this.companyService.currentCompany!.key]) {
        (this.workspaces as any)[this.companyService.currentCompany!.key] = {};
      }
      workspaceOid = (this.workspaces as any)[
        this.companyService.currentCompany!.key
      ][userName!];
    } else {
      workspaceOid = (this.workspaces as any)[userName!];
    }

    if (workspaceOid) {
      return new Promise<boolean>((resolve) => {
        this.getWorkspace(workspaceOid!).subscribe({
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

  private storeCurrentWorkspace(oid: string) {
    var userName = this.auth.getCurrentUsername()
      ? this.auth.getCurrentUsername()
      : "none";
    if (this.companyService.hasCompany()) {
      if (
        (this.workspaces as any)[this.companyService.currentCompany!.key] ==
        undefined
      ) {
        (this.workspaces as any)[this.companyService.currentCompany!.key] = {};
      }
      (this.workspaces as any)[this.companyService.currentCompany!.key][
        userName!
      ] = oid;
    } else {
      (this.workspaces as any)[userName!] = oid;
    }
    this.workspaces.save();
  }

  public getLanguage() {
    return "es";
  }

  public showSpots() {
    if (this.current && this.current.spotConfig && this.current.spotConfig != SpotConfig.NONE) {
      return true
    }
    return false
  }

  public getSpotSize(): number {
    return this.current && this.current.spotCount ? this.current.spotCount : 0;
  }

  public showInventory(): boolean {
    if (this.current && this.current.warehouseOid && this.current.warehouseOid.length > 0) {
      return true
    }
    return false
  }

  public allowPayment() : boolean{
    if (this.current && this.current.docTypes && this.current.docTypes.length > 0) {
      return true
    }
    return false
  }

  public hasAutoPayment() {
    return this.autoPayment;
  }

  public getWarehouseOid(): string | undefined {
    return this.showInventory() && this.current?.warehouseOid
      ? this.current.warehouseOid
      : undefined;
  }

  public getPosLayout(): PosLayout {
    return this.current && this.current.posLayout
      ? this.current.posLayout
      : PosLayout.GRID;
  }
}
