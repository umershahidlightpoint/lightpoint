import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerModalComponent } from './date-picker-modal.component';

describe('DatePickerModalComponent', () => {
  let component: DatePickerModalComponent;
  let fixture: ComponentFixture<DatePickerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
