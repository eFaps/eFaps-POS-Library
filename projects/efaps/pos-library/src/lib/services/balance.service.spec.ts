import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { AuthService, ConfigService, WorkspaceService } from '@efaps/pos-library';
import { Observable } from 'rxjs';

import { BalanceService } from './balance.service';

class AuthServiceStub {
  currentEvent = new Observable(observer => {
    observer.next('nothing');
  });
}
class ConfigServiceStub { }
class WorkspaceServiceStub {
  currentWorkspace = new Observable(observer => {
    observer.next();
  });
}

describe('BalanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        BalanceService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub }
      ]
    });
  });

  it('should be created', inject([BalanceService], (service: BalanceService) => {
    expect(service).toBeTruthy();
  }));
});
