import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CompanyService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class CompanyInterceptor implements HttpInterceptor {

  private currentCompany;

  constructor(companyService: CompanyService) {
    companyService.company.subscribe({
      next: company => this.currentCompany = company
    })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.currentCompany && this.currentCompany.key) {
      request = request.clone({
        setHeaders: {
          "X-CONTEXT-COMPANY": this.currentCompany.key
        }
      });
    }
    return next.handle(request);
  }
}
