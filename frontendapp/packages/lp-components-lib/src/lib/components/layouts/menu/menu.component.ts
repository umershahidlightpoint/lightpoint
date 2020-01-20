import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { onMainContentChange } from '../animations/animations';
import { SidenavService } from '../../../services/sidenav.service';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'lp-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [onMainContentChange]
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('leftMenu', { static: true }) leftMenu: MatSidenav;
  @Input() userPages: Page[];
  @Input() adminPages: Page[];
  @Input() colorMode: string;
  @Input() backgroundColor: string;

  public onSideNavChange: boolean;
  public sideNavSubscription: Subscription;
  public leftMenuSubscription: Subscription;

  constructor(private sidenavService: SidenavService) {
    this.sideNavSubscription = this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
    this.leftMenuSubscription = this.sidenavService.leftMenu$.subscribe(res => {
      this.leftMenu = res;
    });
  }

  ngOnInit() {
    this.sidenavService.leftMenuInst(this.leftMenu);
  }

  ngOnDestroy(): void {
    this.sideNavSubscription.unsubscribe();
    this.leftMenuSubscription.unsubscribe();
  }
}
