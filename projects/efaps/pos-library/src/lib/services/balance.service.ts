import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { Balance, BalanceSummary, CashEntry, PrintResponse } from "../model";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, AuthService, ConfigService, WorkspaceService],
})
export class BalanceService {
  private balance: Balance = null;
  private balanceSource = new BehaviorSubject<Balance>(this.balance);
  currentBalance = this.balanceSource.asObservable();
  private workspaceOid: string | undefined;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private config: ConfigService,
    private workspaceService: WorkspaceService,
  ) {
    this.setup();
    this.load();
  }

  private setup() {
    this.authService.currentEvent.subscribe((event) => {
      switch (event) {
        case "login":
          this.load();
          break;
        case "logout":
          this.balanceSource.next(null);
      }
    });
    this.workspaceService.currentWorkspace.subscribe((ws) => {
      if (ws) {
        this.workspaceOid = ws.oid;
        this.load();
      } else {
        this.workspaceOid = undefined;
        this.balanceSource.next(null);
      }
    });
  }

  private load() {
    this.getCurrent(false).subscribe({
      next: (balance) => {
        this.balanceSource.next(balance);
      },
      error: (error) => {
        if (error.status !== 404) {
          console.log(error);
        }
      },
    });
  }

  private getCurrent(_createNew?: boolean): Observable<Balance> {
    const requestUrl = `${this.config.baseUrl}/balance/current`;
    return this.http.get<Balance>(requestUrl, {
      params: { createNew: _createNew.toString() },
    });
  }

  init() {
    this.getCurrent(true).subscribe((_balance) =>
      this.balanceSource.next(_balance),
    );
  }

  addCashEntries(
    balance: Balance,
    cashEntries: CashEntry[],
  ): Observable<PrintResponse[]> {
    const requestUrl = `${this.config.baseUrl}/balance/${balance.id}/cash`;
    return this.http.post<PrintResponse[]>(requestUrl, cashEntries, {
      params: { workspaceOid: this.workspaceOid },
    });
  }

  close(balance: Balance): Observable<Balance> {
    const url = `${this.config.baseUrl}/balance/${balance.id}`;
    return this.http
      .put<Balance>(url, balance)
      .pipe(tap(() => this.balanceSource.next(null)));
  }

  getSummary(balance: Balance): Observable<BalanceSummary> {
    const url = `${this.config.baseUrl}/balance/${balance.id}/summary`;
    return this.http.get<BalanceSummary>(url);
  }

  getBalances(): Observable<Balance[]> {
    const url = `${this.config.baseUrl}/balance`;
    return this.http.get<Balance[]>(url);
  }

  /*
   * this should only  be used to veriy against the sever not to init
   */
  hasCurrent(): Observable<Boolean> {
    return new Observable((observer) => {
      this.getCurrent(false).subscribe({
        next: (_balance) => {
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          if (error.status == 404) {
            observer.next(false);
            observer.complete();
          } else {
            observer.error(error);
          }
        },
      });
    });
  }
}
