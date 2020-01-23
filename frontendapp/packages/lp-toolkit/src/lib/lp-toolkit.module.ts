import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';

import { LpToolkitComponent } from './lp-toolkit.component';
import { MenuComponent } from './components/layouts/menu/menu.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SideMenuComponent } from './components/layouts/side-menu/side-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProgressComponent } from './components/progress/progress.component';
import { LoadingComponent } from './components/loading/loading.component';

import { SidenavService } from './services/sidenav.service';

const sharedComponents = [
  LpToolkitComponent,
  MenuComponent,
  HeaderComponent,
  SideMenuComponent,
  NotFoundComponent,
  ProgressComponent,
  LoadingComponent
];

const materialModules = [MatSidenavModule, MatListModule];

@NgModule({
  declarations: [...sharedComponents],
  imports: [CommonModule, RouterModule, ...materialModules],
  exports: [CommonModule, RouterModule, ...materialModules, ...sharedComponents],
  entryComponents: []
})
export class LpToolkitModule {
  static forRoot(): ModuleWithProviders<LpToolkitModule> {
    return {
      ngModule: LpToolkitModule,
      providers: [SidenavService]
    };
  }
}
