import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { DocumentService } from './document.service';
import { PosService } from './pos.service';
import { WorkspaceService } from './workspace.service';

class AuthServiceStub { }
class ConfigServiceStub { }
class DocumentServiceStub { }
class WorkspaceServiceStub {
  currentWorkspace = new Observable(observer => {
    observer.next();
  });
}

describe('PosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        PosService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: WorkspaceService, useClass: WorkspaceServiceStub },
      ]
    });
  });

  it('should be created', inject([PosService], (service: PosService) => {
    expect(service).toBeTruthy();
  }));
});
