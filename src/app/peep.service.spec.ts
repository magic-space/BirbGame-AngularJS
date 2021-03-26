import { TestBed } from '@angular/core/testing';

import { PeepService } from './peep.service';

describe('PeepService', () => {
  let service: PeepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
