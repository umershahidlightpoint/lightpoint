import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FxRatesComponent } from './fx-rates.component';

describe('FxRatesComponent', () => {
  let component: FxRatesComponent;
  let fixture: ComponentFixture<FxRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FxRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
