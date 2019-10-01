import { TestBed } from '@angular/core/testing';

import { PosLibraryService } from './pos-library.service';

describe('PosLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosLibraryService = TestBed.get(PosLibraryService);
    expect(service).toBeTruthy();
  });
});
