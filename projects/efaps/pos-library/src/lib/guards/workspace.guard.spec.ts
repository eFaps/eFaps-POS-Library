import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'ngx-store';

import { AuthService, ConfigService, WorkspaceService } from '../services/index';
import { WorkspaceGuard } from './workspace.guard';

describe('WorkspaceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        AuthService,
        WorkspaceGuard,
        ConfigService,
        WorkspaceService,
        HttpClient,
        HttpHandler,
        LocalStorageService
      ]
    });
  });

  it('should ...', inject([WorkspaceGuard], (guard: WorkspaceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
