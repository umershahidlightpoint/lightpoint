import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendsComponent } from './dividends.component';

describe('DividentsComponent', () => {
  let component: DividendsComponent;
  let fixture: ComponentFixture<DividendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
