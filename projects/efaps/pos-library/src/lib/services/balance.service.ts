import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, ConfigService, WorkspaceService } from '@efaps/pos-library';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Balance, BalanceSummary } from '../model';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balance: Balance;
  private balanceSource = new BehaviorSubject<Balance>(this.balance);
  currentBalance = this.balanceSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService,
    private config: ConfigService, private workspaceService: WorkspaceService) {
    this.setup();
  }

  private setup() {
    this.authService.currentEvent.subscribe(event => {
      switch (event) {
        case 'login':
          this.load();
          break;
        case 'logout':
          this.balanceSource.next(null);
      }
    });
    this.workspaceService.currentWorkspace.subscribe(ws => {
      if (ws) {
        this.load();
      } else {
        this.balanceSource.next(null);
      }
    });
  }

  private load() {
    this.getCurrent(false).subscribe({
      next: balance => {
        this.balanceSource.next(balance);
      },
      error: error => {
        if (error.status !== 404) {
          console.log(error);
        }
      }
    });
  }

  private getCurrent(_createNew?: boolean): Observable<Balance> {
    const requestUrl = `${this.config.baseUrl}/balance/current`;
    const params = new HttpParams()
      .set('createNew', _createNew.toString());
    return this.http.get<Balance>(requestUrl, { params: params });
  }

  init() {
    this.getCurrent(true).subscribe(_balance => this.balanceSource.next(_balance));
  }

  close(balance: Balance): Observable<Balance> {
    const url = `${this.config.baseUrl}/balance/${balance.id}`;
    return this.http.put<Balance>(url, balance)
      .pipe(tap(() => this.balanceSource.next(null)))
  }

  getSummary(balance: Balance): Observable<BalanceSummary> {
    const url = `${this.config.baseUrl}/balance/${balance.id}/summary`;
    return this.http.get<BalanceSummary>(url);
  }

  getBalances(): Observable<Balance[]> {
    const url = `${this.config.baseUrl}/balance`;
    return this.http.get<Balance[]>(url);
  }
}
