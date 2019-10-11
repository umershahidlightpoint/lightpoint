import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { TrialGridExampleComponent } from './trial-balance.component';
import { AgGridModule } from 'ag-grid-angular';

describe('TrialGridExampleComponent', () => {
  let component: TrialGridExampleComponent;
  let fixture: ComponentFixture<TrialGridExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AgGridModule.withComponents([])],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(TrialGridExampleComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Grid API is Available', () => {
    fixture.detectChanges();
    expect(component.gridOptions.api).toBeTruthy();
  });

  it('Check Grouped Data', () => {
    let done = false;
    let result = false;
    setTimeout(() => {
      component.gridOptions.api.forEachNode(node => {
        if (node.field === 'AccountCategory' && node.group === true) {
          result = true;
        }
        result = node.expanded === true ? true : false;
      });
      done = true;
    }, 5000);
  });
});
