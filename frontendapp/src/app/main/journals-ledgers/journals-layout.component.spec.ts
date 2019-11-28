import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsLayoutComponent } from './journals-layout.component';

describe('JournalsLayoutComponent', () => {
  let component: JournalsLayoutComponent;
  let fixture: ComponentFixture<JournalsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
