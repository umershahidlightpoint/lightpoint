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
import { LpToolkitModule } from 'lp-toolkit';

import { ReportsComponent } from './reports.component';
import { CostBasisComponent } from './costbasis/costbasis.component';
import { TaxLotsComponent } from './taxlots/taxlots.component';
import { TaxLotStatusComponent } from './taxlotstatus/taxlotstatus.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { BalanceReportComponent } from './balance-report/balance-report.component';
import { PositionMarketValueAppraisalComponent } from './position-market-value-appraisal/position-market-value-appraisal.component';

import { ReportsRoutes } from './reports.routes';
import { SharedModule } from '../../shared.module';

const reportComponents = [
  ReportsComponent,
  CostBasisComponent,
  TaxLotsComponent,
  TaxLotStatusComponent,
  TrialBalanceComponent,
  BalanceReportComponent,
  PositionMarketValueAppraisalComponent
];

@NgModule({
  declarations: [...reportComponents],
  exports: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
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
export class ReportsModule {}
