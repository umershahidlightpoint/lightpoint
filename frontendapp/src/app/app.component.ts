import { Component, OnInit, Injector } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { onMainContentChange } from './menu/animations/animations';
import { SidenavService } from '../shared/common/sidenav.service';
import { ServicesStatusApiService } from '../services/services-status-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange]
})
export class AppComponent implements OnInit {
  public onSideNavChange: boolean;

  constructor(
    private router: Router,
    private sidenavService: SidenavService,
    public servicesStatusApiService: ServicesStatusApiService
  ) {
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });

    this.router.events.subscribe((event: Event) => {
      // Only Hit API, Once Navigation Finish
      if (event instanceof NavigationEnd) {
        this.servicesStatusApiService.loadServices();
      }
    });
  }

  ngOnInit() {}
}
