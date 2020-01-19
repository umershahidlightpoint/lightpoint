import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { NgcatalystModule } from 'ngcatalyst';
import { ReportsComponent } from './reports.component';
import { BalanceReportComponent } from './balance-report/balance-report.component';
import { BookmonReconcileComponent } from './bookmon-reconcile/bookmon-reconcile.component';
import { FundAdminReconcileComponent } from './fundadmin-reconcile/fundadmin-reconcile.component';
import { CostBasisComponent } from './costbasis/costbasis.component';
import { DayPnlComponent } from './daypnl-reconcile/daypnl-reconcile.component';
import { TaxLotsComponent } from './taxlots/taxlots.component';
import { TaxLotStatusComponent } from './taxlotstatus/taxlotstatus.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';

import { RouterModule } from '@angular/router';
import { ReportsRoutes } from './reports.routes';
import { SharedModule } from '../../shared.module';


const reportComponents = [
    ReportsComponent,
    BalanceReportComponent,
    BookmonReconcileComponent,
    FundAdminReconcileComponent,
    CostBasisComponent,
    DayPnlComponent,
    TaxLotsComponent,
    TaxLotStatusComponent,
    TrialBalanceComponent,
  ];

@NgModule({
  declarations: [...reportComponents],
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
    NgcatalystModule,
    SharedModule,
    RouterModule.forChild(ReportsRoutes),
    SharedModule
  ]
})
export class ReportsModule { }