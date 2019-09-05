import { BehaviorSubject } from 'rxjs';

export class DataService {
  private oGridOptions = new BehaviorSubject(null);
  private isEngineRunning = new BehaviorSubject(false);

  gridColumnApi = this.oGridOptions.asObservable();
  flag = this.isEngineRunning.asObservable();

  constructor() {}

  changeMessage(obj: any) {
    this.oGridOptions.next(obj);
  }

  changeEngineStatus(obj: any) {
    this.isEngineRunning.next(obj);
  }
}
