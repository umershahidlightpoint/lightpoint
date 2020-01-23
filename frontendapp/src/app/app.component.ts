import { Component, OnInit } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { MatSidenav } from '@angular/material';
import { onMainContentChange } from './menu/animations/animations';
import { SidenavService } from '../services/common/sidenav.service';
import { ServicesStatusApiService } from '../services/services-status-api.service';
import { Page } from 'lp-components-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [onMainContentChange]
})
export class AppComponent implements OnInit {
  public onSideNavChange: boolean;
  public userPages: Page[] = [
    {
      name: 'Reports',
      routerLink: '/reports',
      icon: 'fa-bar-chart'
    },
    {
      name: 'Data Services',
      routerLink: '/fund-theoretical',
      icon: 'fa-calculator'
    },
    {
      name: 'Research',
      routerLink: '/journals-ledgers',
      icon: 'fa-book'
    }
  ];
  public adminPages: Page[] = [
    {
      name: 'Maintenance',
      routerLink: '/maintenance',
      icon: 'fa-wrench'
    },
    {
      name: 'Accruals OMS',
      routerLink: 'oms/accruals',
      icon: 'fa-files-o'
    },
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
    {
      name: 'Accounts',
      routerLink: '/accounts',
      icon: 'fa-bank'
    },
    {
      name: 'Operations',
      routerLink: 'operations',
      icon: 'fa-tasks'
    },
    // {
    //   name: 'Grid Views',
    //   routerLink: 'settings/grid-views',
    //   icon: 'fa-th'
    // },
    {
      name: 'Settings',
      routerLink: '/settings',
      icon: 'fa-cog'
    }
  ];

  leftMenu: MatSidenav;
  isNavigating = false;

  constructor(
    private router: Router,
    private sidenavService: SidenavService,
    public servicesStatusApiService: ServicesStatusApiService
  ) {
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });

    // Only Hit API, Once Navigation Finish
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      }
      if (event instanceof NavigationEnd) {
        this.isNavigating = false;
        this.servicesStatusApiService.loadServices();
      }
      if (event instanceof NavigationCancel) {
        this.isNavigating = false;
      }
      if (event instanceof NavigationError) {
        this.isNavigating = false;
      }
    });
  }

  ngOnInit() {}
}
