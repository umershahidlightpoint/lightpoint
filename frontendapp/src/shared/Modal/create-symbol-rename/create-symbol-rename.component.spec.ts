import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSymbolRenameComponent } from './create-symbol-rename.component';

describe('CreateSymbolRenameComponent', () => {
  let component: CreateSymbolRenameComponent;
  let fixture: ComponentFixture<CreateSymbolRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSymbolRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSymbolRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
