import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';

import { LpComponentsLibComponent } from './lp-components-lib.component';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SideMenuComponent } from './components/layouts/side-menu/side-menu.component';
import { LoadingComponent } from './components/loading/loading.component';

import { SidenavService } from './services/sidenav.service';

const sharedComponents = [
  LpComponentsLibComponent,
  MainComponent,
  HeaderComponent,
  SideMenuComponent,
  LoadingComponent
];

const materialModules = [
  MatSidenavModule,
  MatListModule
]

@NgModule({
  declarations: [...sharedComponents],
  imports: [
            CommonModule,
            ...materialModules,
            RouterModule
           ],
  exports: [
            CommonModule,
            ...sharedComponents,
            ...materialModules,
            RouterModule
           ],
  entryComponents: []
})

export class LpComponentsLibModule {
  static forRoot(
  ): ModuleWithProviders<LpComponentsLibModule> {
    return {
      ngModule: LpComponentsLibModule,
      providers:[SidenavService]
    };
  }
}