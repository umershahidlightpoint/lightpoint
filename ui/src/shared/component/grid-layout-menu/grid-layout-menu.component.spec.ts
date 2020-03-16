import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GridLayoutMenuComponent } from "./grid-layout-menu.component";

describe("GridLayoutMenuComponent", () => {
  let component: GridLayoutMenuComponent;
  let fixture: ComponentFixture<GridLayoutMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridLayoutMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLayoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
