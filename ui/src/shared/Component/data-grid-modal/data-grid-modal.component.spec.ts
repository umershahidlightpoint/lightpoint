import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGridModalComponent } from './data-grid-modal.component';

describe('DataGridModalComponent', () => {
  let component: DataGridModalComponent;
  let fixture: ComponentFixture<DataGridModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGridModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGridModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
