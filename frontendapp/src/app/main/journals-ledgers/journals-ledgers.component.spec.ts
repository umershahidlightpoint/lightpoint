import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsLedgersComponent } from './journals-ledgers.component';

describe('AgGridExampleComponent', () => {
  let component: JournalsLedgersComponent;
  let fixture: ComponentFixture<JournalsLedgersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsLedgersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
