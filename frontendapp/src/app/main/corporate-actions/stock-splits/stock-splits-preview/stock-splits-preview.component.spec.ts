import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSplitsPreviewComponent } from './stock-splits-preview.component';

describe('StockSplitsPreviewComponent', () => {
  let component: StockSplitsPreviewComponent;
  let fixture: ComponentFixture<StockSplitsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSplitsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSplitsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
