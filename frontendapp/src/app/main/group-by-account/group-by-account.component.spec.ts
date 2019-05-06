import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByAccountComponent } from './group-by-account.component';

describe('GroupByAccountComponent', () => {
  let component: GroupByAccountComponent;
  let fixture: ComponentFixture<GroupByAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupByAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupByAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
