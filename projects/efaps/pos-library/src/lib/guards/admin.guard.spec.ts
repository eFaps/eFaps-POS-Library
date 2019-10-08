import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'ngx-store';

import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';

describe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        AdminGuard,
        AuthService,
        ConfigService,
        HttpClient,
        HttpHandler,
        LocalStorageService
      ]
    });
  });

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
