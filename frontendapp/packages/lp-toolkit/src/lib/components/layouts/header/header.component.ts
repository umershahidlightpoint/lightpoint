import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../../services/sidenav.service';

@Component({
  selector: 'lp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() title = 'My App';

  public sidenav: MatSidenav;
  public sideNavSubscription: Subscription;

  constructor(private sidenavService: SidenavService) {}

  ngOnInit() {
    this.initLeftMenu();
  }

  private initLeftMenu() {
    this.sideNavSubscription = this.sidenavService.leftMenu$.subscribe(res => {
      this.sidenav = res;
    });
  }

  public onToggle() {
    this.sidenav.toggle();
  }

  ngOnDestroy(): void {
    this.sideNavSubscription.unsubscribe();
  }
}
