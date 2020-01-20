import { TestBed } from '@angular/core/testing';

import { LpComponentsLibService } from './lp-components-lib.service';

describe('LpComponentsLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LpComponentsLibService = TestBed.get(LpComponentsLibService);
    expect(service).toBeTruthy();
  });
});
