import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceGridComponent } from './finance-grid.component';

describe('FinanceGridComponent', () => {
  let component: FinanceGridComponent;
  let fixture: ComponentFixture<FinanceGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
