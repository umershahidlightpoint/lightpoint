import { TestBed } from '@angular/core/testing';

import { AssetServicesService } from './asset-services.service';

describe('AssetServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetServicesService = TestBed.get(AssetServicesService);
    expect(service).toBeTruthy();
  });
});
