import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludeTradeComponent } from './exclude-trade.component';

describe('ExcludeTradeComponent', () => {
  let component: ExcludeTradeComponent;
  let fixture: ComponentFixture<ExcludeTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcludeTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludeTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
