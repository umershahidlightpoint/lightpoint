import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LpToolkitComponent } from './lp-toolkit.component';

describe('LpToolkitComponent', () => {
  let component: LpToolkitComponent;
  let fixture: ComponentFixture<LpToolkitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LpToolkitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LpToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
