import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationGridLayoutMenuComponent } from './grid-layout-menu.component';

describe('AllocationGridLayoutMenuComponent', () => {
  let component: AllocationGridLayoutMenuComponent;
  let fixture: ComponentFixture<AllocationGridLayoutMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationGridLayoutMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationGridLayoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
