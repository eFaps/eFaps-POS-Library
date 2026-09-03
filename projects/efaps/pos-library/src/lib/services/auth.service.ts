import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CurrentUser, Permission, Tokens } from "../model";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [HttpClient, ConfigService],
})
export class AuthService {
  private eventSource = new BehaviorSubject<string>("");
  currentEvent = this.eventSource.asObservable();

  private refreshing = false;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  get currentUser(): CurrentUser {
    return this.config.persistence.currentUser();
  }

  login(username: string, password: string): Observable<boolean> {
    const href = `${this.config.baseUrl}/authenticate`;
    return this.http
      .post<Tokens>(href, { userName: username, password: password })
      .pipe(
        map((response) => {
          if (response.accessToken) {
            const user = this.currentUser;
            user.username = username;
            user.tokens = response;
            user.save();
            this.eventSource.next("login");
            this.refreshing = false;
            return true;
          } else {
            return false;
          }
        }),
      );
  }

  private refreshToken() {
    this.refreshing = true;
    const href = `${this.config.baseUrl}/refreshauth`;
    this.http
      .post<Tokens>(href, { refreshToken: this.getRefreshToken() })
      .subscribe({
        next: (response) => {
          if (response.accessToken) {
            const user = this.currentUser;
            user.tokens = response;
            user.save();
            this.eventSource.next("refresh");
          } else {
            this.logout();
          }
          this.refreshing = false;
        },
      });
  }

  logout(): void {
    this.currentUser.clean();
    this.eventSource.next("logout");
  }

  getAccessToken(): string | undefined {
    return this.currentUser.tokens?.accessToken;
  }

  private getRefreshToken(): string | undefined {
    return this.currentUser.tokens?.refreshToken;
  }

  getCurrentUsername(): string | undefined {
    return this.currentUser.username;
  }

  private getTokenExpirationDate(token: string): Date | undefined {
    const decoded = <any>jwtDecode(token);

    if (decoded.exp === undefined) {
      return undefined;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getAccessToken();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }

    if (
      !this.refreshing &&
      date.valueOf() - new Date().valueOf() < 2 * 60 * 1000
    ) {
      this.refreshToken();
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  hasPermission(...permissions: Permission[]) {
    if (this.isTokenExpired()) {
      return false;
    }
    const decoded = <any>jwtDecode(this.getAccessToken()!!);
    const assignedPermissions: string[] = decoded.permissions;

    let hasIt = false;
    assignedPermissions.every((permission) => {
      if (permissions.find((x) => x === (Permission as any)[permission])) {
        hasIt = true;
        return false;
      }
      return true;
    });
    return hasIt;
  }
}
