import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FundTheoreticalComponent } from '../../app/main/fund-theoretical/fund-theoretical.component';

@Injectable()
export class PerformanceCanDeactivateGuard implements CanDeactivate<FundTheoreticalComponent> {
  constructor() {}

  canDeactivate(
    component: FundTheoreticalComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const url: string = state.url;

    if (!component.disableCommit) {
      return window.confirm(
        'There are unsaved changes on this page. Do you still want to navigate?'
      );
    }

    return true;
  }
}
