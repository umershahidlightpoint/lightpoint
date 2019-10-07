import { BehaviorSubject } from 'rxjs';

export class DataService {
  private isEngineRunning = new BehaviorSubject(false);

  flag$ = this.isEngineRunning.asObservable();

  private identifierForAllocation = new BehaviorSubject(null);
  private identifierForJournal = new BehaviorSubject(null);

  allocationId = this.identifierForAllocation.asObservable();
  journalId = this.identifierForJournal.asObservable();

  constructor() {}

  changeEngineStatus(obj: any) {
    this.isEngineRunning.next(obj);
  }

  onRowSelectionTrade(obj: any) {
    this.identifierForAllocation.next(obj);
  }

  onRowSelectionAllocation(obj: any) {
    this.identifierForJournal.next(obj);
  }
}
