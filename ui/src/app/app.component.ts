import { Component, OnInit } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ThemeService, Page } from 'lp-toolkit';
import { CacheService } from 'src/services/common/cache.service';
import { SettingApiService } from 'src/services/setting-api.service';
import { ServicesStatusApiService } from 'src/services/services-status-api.service';
import { Response } from 'src/shared/Models/response';
import { LayoutConfig } from 'src/shared/utils/AppEnums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = false;
  public isNavigating = false;
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
      name: 'Asset Servicing',
      routerLink: 'asset-servicing',
      icon: 'fa-money'
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

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private cacheService: CacheService,
    private settingApiService: SettingApiService,
    public servicesStatusApiService: ServicesStatusApiService
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
    this.initAppData();
  }

  initAppData() {
    this.requestAppData().subscribe(
      ([settingsResponse, configsResponse]: [Response<any[]>, Response<any[]>]) => {
        this.getSettings(settingsResponse);

        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  requestAppData(): Observable<any[]> {
    const settingsResponse = this.settingApiService.getSettings();
    const configsResponse = this.cacheService.getUserConfig(LayoutConfig.projectName);

    return forkJoin([settingsResponse, configsResponse]);
  }

  getSettings(response) {
    if (response.isSuccessful && response.statusCode === 200) {
      this.themeService.setActiveTheme(response.payload[0].theme);
    } else if (response.isSuccessful && response.statusCode === 404) {
    }
  }
}
