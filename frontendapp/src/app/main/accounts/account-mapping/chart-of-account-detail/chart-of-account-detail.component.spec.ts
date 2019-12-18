import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountDetailComponent } from './chart-of-account-detail.component';

describe('ChartOfAccountDetailComponent', () => {
  let component: ChartOfAccountDetailComponent;
  let fixture: ComponentFixture<ChartOfAccountDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
