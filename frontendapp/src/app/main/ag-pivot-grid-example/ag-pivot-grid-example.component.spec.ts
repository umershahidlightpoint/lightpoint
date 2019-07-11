import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgPivotGridExampleComponent } from './ag-pivot-grid-example.component';

describe('AgPivotGridExampleComponent', () => {
  let component: AgPivotGridExampleComponent;
  let fixture: ComponentFixture<AgPivotGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgPivotGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgPivotGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
