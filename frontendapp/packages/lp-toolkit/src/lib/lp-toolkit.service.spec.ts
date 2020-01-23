import { TestBed } from '@angular/core/testing';

import { LpToolkitService } from './lp-toolkit.service';

describe('LpToolkitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LpToolkitService = TestBed.get(LpToolkitService);
    expect(service).toBeTruthy();
  });
});
