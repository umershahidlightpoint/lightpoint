import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAllocationComponent } from './journal-allocation.component';

describe('AccrualsComponent', () => {
  let component: JournalAllocationComponent;
  let fixture: ComponentFixture<JournalAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
