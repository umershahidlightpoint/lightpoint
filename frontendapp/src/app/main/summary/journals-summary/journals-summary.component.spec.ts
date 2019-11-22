import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsSummaryComponent } from './journals-summary.component';

describe('JournalsSummaryComponent', () => {
  let component: JournalsSummaryComponent;
  let fixture: ComponentFixture<JournalsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
