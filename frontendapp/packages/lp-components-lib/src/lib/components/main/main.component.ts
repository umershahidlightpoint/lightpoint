import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { onMainContentChange } from '../layouts/animations/animations';
import { SidenavService } from '../../services/sidenav.service';
import { Subscription } from 'rxjs';

interface Page {
  routerLink: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'lp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [onMainContentChange]
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('leftMenu', { static: true}) leftMenu: MatSidenav;
  @Input() userPages: Page[];
  @Input() adminPages: Page[];

  public onSideNavChange: boolean;
  public sideNavSubscription: Subscription;
  public leftMenuSubscription: Subscription;


  constructor(private sidenavService: SidenavService) { 
    this.sideNavSubscription = this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
    this.leftMenuSubscription = this.sidenavService.leftMenu$.subscribe( res => {
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
