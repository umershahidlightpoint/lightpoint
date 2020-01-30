import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { AgGridModule } from 'ag-grid-angular';

import { LpToolkitComponent } from './lp-toolkit.component';
import { MenuComponent } from './components/layouts/menu/menu.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SideMenuComponent } from './components/layouts/side-menu/side-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProgressComponent } from './components/progress/progress.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SelectThemeComponent } from './components/select-theme/select-theme.component';
import { ServicesLogComponent } from './components/services-log/services-log.component';
import { TemplateRendererComponent } from './components/shared/template-renderer/template-renderer.component';

import { SidenavService } from './services/sidenav.service';
import { ThemeService } from './services/theme.service';
import { LPToolkitConfigService } from './services/lp-toolkit-config.service';

import { LPToolkitConfig } from './models/lp-toolkit-config.model';

const sharedComponents = [
  LpToolkitComponent,
  MenuComponent,
  HeaderComponent,
  SideMenuComponent,
  NotFoundComponent,
  ProgressComponent,
  LoadingComponent,
  SelectThemeComponent,
  ServicesLogComponent,
  TemplateRendererComponent
];

const materialModules = [MatSidenavModule, MatListModule];

@NgModule({
  declarations: [...sharedComponents],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([TemplateRendererComponent]),
    ...materialModules
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules,
    ...sharedComponents
  ],
  entryComponents: []
})
export class LpToolkitModule {
  static forRoot(config: LPToolkitConfig): ModuleWithProviders<LpToolkitModule> {
    return {
      ngModule: LpToolkitModule,
      providers: [
        SidenavService,
        ThemeService,
        {
          provide: LPToolkitConfigService,
          useValue: config
        }
      ]
    };
  }
}
