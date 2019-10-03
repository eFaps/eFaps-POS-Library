import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { InventoryService } from './inventory.service';

class ConfigServiceStub {}

describe('InventoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        InventoryService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
  });

  it('should be created', inject([InventoryService], (service: InventoryService) => {
    expect(service).toBeTruthy();
  }));
});
