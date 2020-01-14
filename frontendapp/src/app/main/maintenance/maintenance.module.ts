import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { MaintenanceComponent } from './maintenance.component';
import { TaxlotsMaintenanceComponent } from './taxlots-maintenance/taxlots-maintenance.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { MaintenanceRoutes } from './maintenance.route';

const maintenanceComponents = [
     MaintenanceComponent,
     TaxlotsMaintenanceComponent
  ];

@NgModule({
  declarations: [...maintenanceComponents],
  exports: [],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
        applyLabel: 'Okay',
        firstDay: 1
      }),
    SharedModule,
    RouterModule.forChild(MaintenanceRoutes),
  ]
})
export class MaintenanceModule { }