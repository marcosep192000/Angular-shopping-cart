import { TestBed } from '@angular/core/testing';

import { ApiDolarService } from './api-dolar.service';

describe('ApiDolarService', () => {
  let service: ApiDolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
