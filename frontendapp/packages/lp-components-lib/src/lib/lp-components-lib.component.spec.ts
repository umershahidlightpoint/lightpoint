import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LpComponentsLibComponent } from './lp-components-lib.component';

describe('LpComponentsLibComponent', () => {
  let component: LpComponentsLibComponent;
  let fixture: ComponentFixture<LpComponentsLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LpComponentsLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LpComponentsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
