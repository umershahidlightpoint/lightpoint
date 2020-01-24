import { Component, OnInit, Input } from '@angular/core';
import { onSideNavChange, animateText } from '../animations/animations';
import { SidenavService } from '../../../services/sidenav.service';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'lp-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class SideMenuComponent implements OnInit {
  @Input() userPages: Page[];
  @Input() adminPages: Page[];
  @Input() colorMode: string;
  @Input() backgroundColor: string;

  public sideNavState = false;
  public linkText = false;

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
