import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsSummayDetailComponent } from './journals-summay-detail.component';

describe('JournalsSummayDetailComponent', () => {
  let component: JournalsSummayDetailComponent;
  let fixture: ComponentFixture<JournalsSummayDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsSummayDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsSummayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
