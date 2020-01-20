import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from '../../../services/sidenav.service';

@Component({
  selector: 'lp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() heading: string;
  public sidenav: MatSidenav;
  public sideNavSubscription: Subscription;

  constructor(private sidenavService: SidenavService) {
   }

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
