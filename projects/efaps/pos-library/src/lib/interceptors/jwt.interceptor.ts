import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
  deps: [AuthService],
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authService.isTokenExpired()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.currentUser.tokens.accessToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
