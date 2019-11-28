import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsServerSideComponent } from './journals-server-side.component';

describe('JournalsServerSideComponent', () => {
  let component: JournalsServerSideComponent;
  let fixture: ComponentFixture<JournalsServerSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsServerSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsServerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
