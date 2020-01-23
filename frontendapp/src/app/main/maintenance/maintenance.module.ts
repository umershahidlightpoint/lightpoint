import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LpToolkitModule } from 'lp-toolkit';

import { MaintenanceComponent } from './maintenance.component';
import { TaxlotsMaintenanceComponent } from './taxlots-maintenance/taxlots-maintenance.component';

import { SharedModule } from '../../shared.module';
import { MaintenanceRoutes } from './maintenance.route';

const maintenanceComponents = [MaintenanceComponent, TaxlotsMaintenanceComponent];

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
    RouterModule.forChild(MaintenanceRoutes),
    LpToolkitModule,
    SharedModule
  ]
})
export class MaintenanceModule {}
