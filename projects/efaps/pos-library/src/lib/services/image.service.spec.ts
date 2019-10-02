import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from '@efaps/pos-library';
import { ImageService } from './image.service';

class ConfigServiceStub {}

describe('ImageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DomSanitizer,
        HttpClient,
        HttpHandler,
        ImageService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
  });

  it('should be created', inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});
