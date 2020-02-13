import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSplitsComponent } from './stock-splits.component';

describe('StockSplitsComponent', () => {
  let component: StockSplitsComponent;
  let fixture: ComponentFixture<StockSplitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSplitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
