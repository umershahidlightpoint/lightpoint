import { Component, OnInit } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { ThemeService, Page } from 'lp-toolkit';
import { ServicesStatusApiService } from '../services/services-status-api.service';
import { SettingApiService } from 'src/services/setting-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = false;
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
    },
    {
      name: 'Reconciliation',
      routerLink: '/reconciliation',
      icon: 'fa-balance-scale'
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
    {
      name: 'Corporate Actions',
      routerLink: 'corporate-actions',
      icon: 'fa-group'
    },
    {
      name: 'Securities',
      routerLink: 'oms/security',
      icon: 'fa-lock'
    },
    {
      name: 'Settings',
      routerLink: '/settings',
      icon: 'fa-cog'
    }
  ];

  isNavigating = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    public servicesStatusApiService: ServicesStatusApiService,
    private settingApiService: SettingApiService
  ) {
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

  ngOnInit() {
    this.isLoading = true;
    this.getSettings();
  }

  getSettings() {
    this.settingApiService.getSettings().subscribe(
      response => {
        if (response.isSuccessful && response.statusCode === 200) {
          this.themeService.setActiveTheme(response.payload[0].theme);
        } else if (response.isSuccessful && response.statusCode === 404) {
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }
}
