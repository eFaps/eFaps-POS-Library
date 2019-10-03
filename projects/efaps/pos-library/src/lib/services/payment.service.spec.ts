import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { LocalStorageService } from 'ngx-store';

import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { DocumentService } from './document.service';
import { PaymentService } from './payment.service';
import { PosService } from './pos.service';
import { WorkspaceService } from './workspace.service';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        AuthService,
        ConfigService,
        DocumentService,
        PaymentService,
        LocalStorageService,
        PosService,
        WorkspaceService
      ]
    });
  });

  it('should be created', inject([PaymentService], (service: PaymentService) => {
    expect(service).toBeTruthy();
  }));
});
