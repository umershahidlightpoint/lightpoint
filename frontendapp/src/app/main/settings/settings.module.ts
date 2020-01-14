import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Settings Component
import { SettingsComponent } from './settings/settings.component';

// Layout Component
import { LayoutsComponent } from './layouts/layouts.component';

// Account Component
import { SettingsRoutes } from './settings.route';
import { SharedModule } from '../../shared.module';

const settingsComponents = [
    SettingsComponent,
    LayoutsComponent
  ];

@NgModule({
  declarations: [...settingsComponents],
  exports: [],
  imports: [
    CommonModule,
    TabsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(SettingsRoutes),
    SharedModule
  ]
})

export class SettingsModule { }