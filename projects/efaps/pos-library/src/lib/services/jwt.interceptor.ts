import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.tokens) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.tokens.accessToken}`
        }
      });
    }
    return next.handle(request);
  }
}
