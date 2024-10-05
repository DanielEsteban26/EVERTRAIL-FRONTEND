import { TestBed } from '@angular/core/testing';

import { RevocarTokenService } from './revocar-token.service';

describe('RevocarTokenService', () => {
  let service: RevocarTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevocarTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
