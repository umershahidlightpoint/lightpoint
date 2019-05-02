import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegderModalComponent } from './legder-modal.component';

describe('LegderModalComponent', () => {
  let component: LegderModalComponent;
  let fixture: ComponentFixture<LegderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
