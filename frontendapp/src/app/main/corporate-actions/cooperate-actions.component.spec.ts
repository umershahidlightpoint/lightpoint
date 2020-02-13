import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateActionsComponent } from './corporate-actions.component';

describe('CooperateActionsComponent', () => {
  let component: CorporateActionsComponent;
  let fixture: ComponentFixture<CorporateActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
