import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerFormComponent } from './ledger-form.component';

describe('LedgerFormComponent', () => {
  let component: LedgerFormComponent;
  let fixture: ComponentFixture<LedgerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
