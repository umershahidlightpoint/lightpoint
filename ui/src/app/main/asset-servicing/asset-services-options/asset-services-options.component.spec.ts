import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetServicesOptionsComponent } from './asset-services-options.component';

describe('AssetServicesOptionsComponent', () => {
  let component: AssetServicesOptionsComponent;
  let fixture: ComponentFixture<AssetServicesOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetServicesOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetServicesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
