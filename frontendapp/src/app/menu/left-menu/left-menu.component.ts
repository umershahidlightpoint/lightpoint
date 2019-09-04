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
  public sideNavState: boolean = false;
  public linkText: boolean = false;

  public pages: Page[] = [
    { name: 'Journals', routerLink: '/journals-ledgers', icon: 'fa-book' },
    { name: 'Trial Balance', routerLink: 'trial-balance', icon: 'fa-balance-scale' },
    { name: 'Accounts', routerLink: '/accounts', icon: 'fa-bank' },
    { name: 'Accruals', routerLink: '/accruals', icon: 'fa-book' },
    { name: 'Reports', routerLink: '/reports', icon: 'fa-bar-chart' },
    { name: 'Operations', routerLink: 'operations', icon: 'fa-tasks' }
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
