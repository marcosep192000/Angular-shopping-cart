import { TestBed } from '@angular/core/testing';

import { AccessoService } from './accesso.service';

describe('AccessoService', () => {
  let service: AccessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
