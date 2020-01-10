import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts.component';
import { LayoutsRoutes } from './layouts.route';
import { SharedModule } from '../../shared.module';

const layoutsComponents = [
    LayoutsComponent
  ];

@NgModule({
  declarations: [...layoutsComponents],
  exports: [...layoutsComponents],
  imports: [
    CommonModule,
    TabsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(LayoutsRoutes),
    SharedModule
  ]
})

export class LayoutsModule { }