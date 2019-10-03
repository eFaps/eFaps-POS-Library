import { TestBed } from '@angular/core/testing';

import { DiscountService } from './discount.service';

describe('DiscountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscountService = TestBed.get(DiscountService);
    expect(service).toBeTruthy();
  });
});
