import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { FundTheoreticalComponent } from 'src/app/main/fund-theoretical/fund-theoretical.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class PerformanceCanDeactivateGuard implements CanDeactivate<FundTheoreticalComponent> {

  constructor() { }
  canDeactivate(
    component: FundTheoreticalComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

      let url: string = state.url;
      console.log('Url: '+ url);

      if (!component.disableCommit) {
        return window.confirm('There are unsaved changes on this page. Do you still want to navigate?');
      }
      return true;
  }
}