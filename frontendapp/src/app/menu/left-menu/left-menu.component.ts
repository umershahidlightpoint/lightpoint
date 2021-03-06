import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../animations/animations';
import { SidenavService } from '../../../services/common/sidenav.service';

interface Page {
  routerLink: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;

  public userPages: Page[] = [
    { name: 'Reports', routerLink: '/reports', icon: 'fa-bar-chart' },
    {
      name: 'Data Services',
      routerLink: '/fund-theoretical',
      icon: 'fa-calculator'
    },
    // { name: 'Analysis', routerLink: '/analysis', icon: 'fa-line-chart' },
    { name: 'Research', routerLink: '/journals-ledgers', icon: 'fa-book' }
    // { name: 'Trial Balance', routerLink: 'trial-balance', icon: 'fa-balance-scale' }
  ];

  public adminPages: Page[] = [
    { name: 'Maintenance',
      routerLink: '/maintenance',
      icon: 'fa-wrench'
    },
    {
      name: 'Accruals OMS',
      routerLink: 'oms/accruals',
      icon: 'fa-files-o' },
    {
      name: 'Trades OMS',
      routerLink: 'oms/trade-allocation',
      icon: 'fa-exchange'
    },
    {
      name: 'Journals OMS',
      routerLink: 'oms/journal-allocation',
      icon: 'fa-list-alt'
    },
    { name: 'Accounts', routerLink: '/accounts', icon: 'fa-bank' },
    { name: 'Operations', routerLink: 'operations', icon: 'fa-tasks' },
    { name: 'Grid Views', routerLink: 'settings/grid-views', icon: 'fa-th' },
    { name: 'Settings', routerLink: '/settings', icon: 'fa-cog' }
  ];

  constructor(private sidenavService: SidenavService) {}

  ngOnInit() {}

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 50);
    this.sidenavService.sideNavState$.next(this.sideNavState);
  }
}
