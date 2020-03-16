import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolRenameComponent } from './symbol-rename.component';

describe('SymbolRenameComponent', () => {
  let component: SymbolRenameComponent;
  let fixture: ComponentFixture<SymbolRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
