import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgcatalystModule } from 'ngcatalyst';
import { RouterModule } from '@angular/router';

import { JournalAllocationComponent } from './journal-allocation.component';
import { TradesComponent } from '../trades/trades.component';
import { AllocationsComponent } from '../allocations/allocations.component';
import { JournalsComponent } from '../journals/journals.component';

import { JournalAllocationRoutes } from './journal-allocation.route';
import { SharedModule } from '../../shared.module';

const journalAllocationComponents = [
    JournalAllocationComponent,
    TradesComponent,
    AllocationsComponent,
    JournalsComponent
  ];

@NgModule({
  declarations: [...journalAllocationComponents],
  exports: [...journalAllocationComponents],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot({
        applyLabel: 'Okay',
        firstDay: 1
      }),
    NgcatalystModule,
    RouterModule.forChild(JournalAllocationRoutes),
    SharedModule
  ]
})

export class JournalAllocationModule { }