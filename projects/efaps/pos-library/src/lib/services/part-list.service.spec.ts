import { TestBed } from '@angular/core/testing';

import { PartListService } from './part-list.service';

describe('PartListService', () => {
  let service: PartListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
