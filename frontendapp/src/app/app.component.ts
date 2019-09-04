import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '../shared/common/app-component-base';
import { onMainContentChange } from './menu/animations/animations';
import { SidenavService } from '../shared/common/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange]
})
export class AppComponent extends AppComponentBase implements OnInit {
  public onSideNavChange: boolean;

  constructor(injector: Injector, private sidenavService: SidenavService) {
    super(injector);
    this.sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }

  ngOnInit() {}
}
