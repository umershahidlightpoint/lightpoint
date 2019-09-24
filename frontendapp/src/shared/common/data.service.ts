import { BehaviorSubject } from 'rxjs';

export class DataService {
  private oGridOptions = new BehaviorSubject(null);
  private grid = new BehaviorSubject(null);
  private setGridFilter = new BehaviorSubject(null);
  private isEngineRunning = new BehaviorSubject(false);

  gridColumnApi$ = this.oGridOptions.asObservable();
  gridObject$ = this.grid.asObservable();
  setGridFilterObject$ = this.setGridFilter.asObservable();
  flag$ = this.isEngineRunning.asObservable();

  private allocationGridOptions = new BehaviorSubject(null);
  private allocationGrid = new BehaviorSubject(null);

  allocationGridColApi$ = this.allocationGridOptions.asObservable();
  allocationGridObject$ = this.allocationGrid.asObservable();

  constructor() {}

  changeMessage(obj: any) {
    this.oGridOptions.next(obj);
  }

  changeGrid(obj: any) {
    this.grid.next(obj);
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
}
