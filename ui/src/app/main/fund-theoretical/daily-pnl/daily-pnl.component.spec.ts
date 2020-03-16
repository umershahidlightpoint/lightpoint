import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPnlComponent } from './daily-pnl.component';

describe('DailyPnlComponent', () => {
  let component: DailyPnlComponent;
  let fixture: ComponentFixture<DailyPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
