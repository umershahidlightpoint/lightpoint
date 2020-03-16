import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExceptionComponent } from './file-exception.component';

describe('FileExceptionComponent', () => {
  let component: FileExceptionComponent;
  let fixture: ComponentFixture<FileExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
