import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AngularSplitModule } from 'angular-split';
import { NgcatalystModule } from 'ngcatalyst';
import { LpToolkitModule } from '@lightpointfinancialtechnology/lp-toolkit';

import { ReconciliationComponent } from './reconciliation.component';
import { DayPnlComponent } from '../reconciliation/daypnl-reconcile/daypnl-reconcile.component';
import { BookmonReconcileComponent } from '../reconciliation/bookmon-reconcile/bookmon-reconcile.component';
import { FundAdminReconcileComponent } from '../reconciliation/fundadmin-reconcile/fundadmin-reconcile.component';
import { DetailPnlDateComponent } from './detail-pnl-date/detail-pnl-date.component';

import { ReconciliationRoutes } from './reconciliation.routes';
import { SharedModule } from '../../shared.module';

const reconcileComponents = [
  ReconciliationComponent,
  DayPnlComponent,
  BookmonReconcileComponent,
  FundAdminReconcileComponent,
  DetailPnlDateComponent
];

@NgModule({
  declarations: [...reconcileComponents],
  exports: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ReconciliationRoutes),
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ModalModule,
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    AngularSplitModule,
    NgcatalystModule,
    LpToolkitModule,
    SharedModule
  ]
})
export class ReconciliationModule {}
