import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccrualsComponent } from './accruals.component';

describe('AccrualsComponent', () => {
  let component: AccrualsComponent;
  let fixture: ComponentFixture<AccrualsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccrualsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccrualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
