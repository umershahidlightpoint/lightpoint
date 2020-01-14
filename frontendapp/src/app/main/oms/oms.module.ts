import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';

// Journal Allocation
import { JournalAllocationComponent } from './journal-allocation/journal-allocation.component';
import { TradesComponent } from './sharedOms/trades/trades.component';
import { AllocationsComponent } from './sharedOms/allocations/allocations.component';
// import { JournalsComponent } from './sharedOms/journals/journals.component';

// Trade Allocations
import { TradeAllocationComponent } from './trade-allocation/trade-allocation.component';

// Accruals
import { AccrualsComponent } from './accruals/accruals.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { OmsRoutes } from './oms.route';

const omsComponents = [
     JournalAllocationComponent,
     TradesComponent,
     AllocationsComponent,
    //  JournalsComponent,
     TradeAllocationComponent,
     AccrualsComponent
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
    SharedModule,
    RouterModule.forChild(OmsRoutes),
  ]
})
export class OmsModule { }