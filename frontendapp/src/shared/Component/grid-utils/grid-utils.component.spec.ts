import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUtilsComponent } from './grid-utils.component';

describe('GridUtilsComponent', () => {
  let component: GridUtilsComponent;
  let fixture: ComponentFixture<GridUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
