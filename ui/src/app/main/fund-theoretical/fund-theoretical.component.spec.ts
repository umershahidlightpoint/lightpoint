import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTheoreticalComponent } from './fund-theoretical.component';

describe('FundTheoreticalComponent', () => {
  let component: FundTheoreticalComponent;
  let fixture: ComponentFixture<FundTheoreticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundTheoreticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTheoreticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
