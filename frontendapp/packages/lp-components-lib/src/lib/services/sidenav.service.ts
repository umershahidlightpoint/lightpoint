import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  public sideNavState$: Subject<boolean> = new Subject();

  public leftMenu$: Subject<any> = new Subject();
  leftMenu = this.leftMenu$.asObservable();

  constructor() {}

  leftMenuInst(obj: any) {
    this.leftMenu$.next(obj);
  }
}
