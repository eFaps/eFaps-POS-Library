import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { ConfigService } from './config.service';

class ConfigServiceStub {}

describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        AdminService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
  });

  it('should be created', inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
