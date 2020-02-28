import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMarketValueAppraisalComponent } from './position-market-value-appraisal.component';

describe('PositionMarketValueAppraisalComponent', () => {
  let component: PositionMarketValueAppraisalComponent;
  let fixture: ComponentFixture<PositionMarketValueAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionMarketValueAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMarketValueAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
