import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverFileManagementComponent } from './silver-file-management.component';

describe('FileManagementComponent', () => {
  let component: SilverFileManagementComponent;
  let fixture: ComponentFixture<SilverFileManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SilverFileManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilverFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
