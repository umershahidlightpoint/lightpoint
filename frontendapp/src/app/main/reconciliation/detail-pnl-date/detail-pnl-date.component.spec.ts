import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPnlDateComponent } from './detail-pnl-date.component';

describe('DetailPnlDateComponent', () => {
  let component: DetailPnlDateComponent;
  let fixture: ComponentFixture<DetailPnlDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPnlDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPnlDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
