import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../animations/animations';
import { SidenavService } from '../../../shared/common/sidenav.service';

interface Page {
  routerLink: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;

  public userPages: Page[] = [
    { name: 'Journals', routerLink: '/journals-ledgers', icon: 'fa-book' },
    { name: 'Trial Balance', routerLink: 'trial-balance', icon: 'fa-balance-scale' },
    { name: 'Reports', routerLink: '/reports', icon: 'fa-bar-chart' }
  ];

  public adminPages: Page[] = [
    { name: 'Accounts', routerLink: '/accounts', icon: 'fa-bank' },
    { name: 'Accruals', routerLink: '/accruals', icon: 'fa-files-o' },
    { name: 'Trades', routerLink: '/trade-allocation', icon: 'fa-exchange' },
    { name: 'OpsBlotter Journals', routerLink: '/journal-allocation', icon: 'fa-exchange' },
    { name: 'Operations', routerLink: 'operations', icon: 'fa-tasks' },
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
