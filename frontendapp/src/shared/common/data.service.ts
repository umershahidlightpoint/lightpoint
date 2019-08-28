import { BehaviorSubject } from 'rxjs';

export class DataService {
  private oGridOptions = new BehaviorSubject(null);
  gridColumnApi = this.oGridOptions.asObservable();
  private isEngineRunning = new BehaviorSubject(false);
  flag = this.isEngineRunning.asObservable();

  constructor() {}

  changeMessage(obj: any) {
    this.oGridOptions.next(obj);
  }

  changeEngineStatus(obj: any) {
    this.isEngineRunning.next(obj);
  }
}
