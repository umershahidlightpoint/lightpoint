import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeAllocationComponent } from './trade-allocation.component';

describe('AccrualsComponent', () => {
  let component: TradeAllocationComponent;
  let fixture: ComponentFixture<TradeAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
