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
    { name: 'Journal', routerLink: '/journals-ledgers', icon: 'library_books' },
    { name: 'Trial Balance', routerLink: 'trialBalance', icon: 'attach_money' },
    { name: 'Account', routerLink: '/accounts', icon: 'account_balance' },
    // { name: "Logs", routerLink: "runlogs", icon: "list_alt" },
    { name: 'Operations', routerLink: 'operations', icon: 'bookmarks' }
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
