import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLedgerModalComponent } from './update-ledger-modal.component';

describe('UpdateLedgerModalComponent', () => {
  let component: UpdateLedgerModalComponent;
  let fixture: ComponentFixture<UpdateLedgerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLedgerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLedgerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
