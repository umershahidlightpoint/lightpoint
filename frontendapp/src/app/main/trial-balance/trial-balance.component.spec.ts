import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialGridExampleComponent } from './trial-balance.component';

describe('TrialGridExampleComponent', () => {
  let component: TrialGridExampleComponent;
  let fixture: ComponentFixture<TrialGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
