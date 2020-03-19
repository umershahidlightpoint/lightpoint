import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LpToolkitModule } from '@lightpointfinancialtechnology/lp-toolkit';

// Journal Allocation
import { JournalAllocationComponent } from './journal-allocation/journal-allocation.component';
import { TradesComponent } from './sharedOms/trades/trades.component';
import { AllocationsComponent } from './sharedOms/allocations/allocations.component';

// Trade Allocations
import { TradeAllocationComponent } from './trade-allocation/trade-allocation.component';

// Accruals
import { AccrualsComponent } from './accruals/accruals.component';

// Securities
import { SecuritiesComponent } from './securities/securities.component';
import { SecurityDetailsComponent } from './securities/security-details/security-details.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { OmsRoutes } from './oms.route';

const omsComponents = [
  JournalAllocationComponent,
  TradesComponent,
  AllocationsComponent,
  TradeAllocationComponent,
  AccrualsComponent,
  SecuritiesComponent,
  SecurityDetailsComponent
];

@NgModule({
  declarations: [...omsComponents],
  exports: [],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    LpToolkitModule,
    SharedModule,
    RouterModule.forChild(OmsRoutes)
  ]
})
export class OmsModule {}
