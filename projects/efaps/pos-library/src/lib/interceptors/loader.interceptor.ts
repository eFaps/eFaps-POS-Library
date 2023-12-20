import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.show();
    this.requests.push(request);

    return next
      .handle(request)
      .pipe(finalize(() => this.removeRequest(request)));
  }

  private removeRequest(request: HttpRequest<any>) {
    const i = this.requests.indexOf(request);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    if (this.requests.length < 1) {
      this.loaderService.hide();
    }
  }
}
