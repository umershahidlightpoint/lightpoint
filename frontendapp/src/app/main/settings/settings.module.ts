import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings.route';
import { SharedModule } from '../../shared.module';

const settingsComponents = [
    SettingsComponent
  ];

@NgModule({
  declarations: [...settingsComponents],
  exports: [...settingsComponents],
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