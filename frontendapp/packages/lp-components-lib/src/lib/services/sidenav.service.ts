import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  public sideNavState$: Subject<boolean> = new Subject();

  public leftMenu$: Subject<any> = new Subject();
  leftMenu = this.leftMenu$.asObservable();

  // private identifierForAllocation = new BehaviorSubject(null);
  // private identifierForJournal = new BehaviorSubject(null);

  // allocationId = this.identifierForAllocation.asObservable();
  // journalId = this.identifierForJournal.asObservable();

  constructor() {
  }

  leftMenuInst(obj: any) {
    this.leftMenu$.next(obj);
  }
}
