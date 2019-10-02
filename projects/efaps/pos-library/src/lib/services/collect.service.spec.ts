import { TestBed } from '@angular/core/testing';

import { CollectService } from './collect.service';

describe('CollectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectService = TestBed.get(CollectService);
    expect(service).toBeTruthy();
  });
});
