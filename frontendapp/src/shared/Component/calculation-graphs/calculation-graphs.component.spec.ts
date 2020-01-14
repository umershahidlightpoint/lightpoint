import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationGraphsComponent } from './calculation-graphs.component';

describe('CalculationGraphsComponent', () => {
  let component: CalculationGraphsComponent;
  let fixture: ComponentFixture<CalculationGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculationGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
