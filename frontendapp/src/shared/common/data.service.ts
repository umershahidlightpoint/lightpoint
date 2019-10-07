import { BehaviorSubject } from 'rxjs';

export class DataService {
  private oGridOptions = new BehaviorSubject(null);
  private grid = new BehaviorSubject([]);
  private setGridFilter = new BehaviorSubject(null);
  private isEngineRunning = new BehaviorSubject(false);

  gridColumnApi$ = this.oGridOptions.asObservable();
  gridObject$ = this.grid.asObservable();
  setGridFilterObject$ = this.setGridFilter.asObservable();
  flag$ = this.isEngineRunning.asObservable();

  private allocationGridOptions = new BehaviorSubject(null);
  private allocationGrid = new BehaviorSubject(null);
  private identifierForAllocation = new BehaviorSubject(null);
  private identifierForJournal = new BehaviorSubject(null);

  allocationGridColApi$ = this.allocationGridOptions.asObservable();
  allocationGridObject$ = this.allocationGrid.asObservable();
  allocationId = this.identifierForAllocation.asObservable();
  journalId = this.identifierForJournal.asObservable();

  constructor() {}

  changeMessage(obj: any) {
    this.oGridOptions.next(obj);
  }

  changeGrid(obj: any, isSameComponent) {
    console.log('in change grid', obj);
    // if (isSameComponent) {
    //   let oldState;
    //   this.gridObject$.subscribe(data => (oldState = data));
    //   const newObj = [...oldState, ...obj];
    //   console.log('new obj', newObj);
    //   this.grid.next(newObj);
    // } else {
    this.grid.next(obj);
    // }
  }

  setExternalFilter(obj: any) {
    this.setGridFilter.next(obj);
  }

  changeEngineStatus(obj: any) {
    this.isEngineRunning.next(obj);
  }

  /* For Allocated Grids */
  changeAllocation(obj: any) {
    this.allocationGridOptions.next(obj);
  }

  changeAllocationGrid(obj: any) {
    this.allocationGrid.next(obj);
  }

  onRowSelectionTrade(obj: any) {
    this.identifierForAllocation.next(obj);
  }

  onRowSelectionAllocation(obj: any) {
    this.identifierForJournal.next(obj);
  }
}
