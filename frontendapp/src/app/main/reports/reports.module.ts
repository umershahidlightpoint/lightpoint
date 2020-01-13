import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';


import { AgGridModule } from 'ag-grid-angular';
// import { NgcatalystModule } from 'ngcatalyst';
import { ReportsComponent } from './reports.component';
import { BalanceReportComponent } from './balance-report/balance-report.component';
import { BookmonReconcileComponent } from './bookmon-reconcile/bookmon-reconcile.component';
import { CostBasisComponent } from './costbasis/costbasis.component';
import { DayPnlComponent } from './daypnl-reconcile/daypnl-reconcile.component';
// import { ReportGridComponent } from './report-grid/report-grid.component';
import { TaxLotsComponent } from './taxlots/taxlots.component';
import { TaxLotStatusComponent } from './taxlotstatus/taxlotstatus.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
// import { CalculationGraphsComponent } from '../fund-theoretical/calculation-graphs/calculation-graphs.component';
import { JournalsComponent } from '../journals/journals.component';
import { DataModalComponent } from '../../../shared/Component/data-modal/data-modal.component';

// import { GridLayoutMenuComponent } from '../../../shared/Component/grid-layout-menu/grid-layout-menu.component';
// import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component';
// import { AgGridCheckboxComponent } from '../../../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';

import { RouterModule } from '@angular/router';
import { ReportsRoutes } from './reports.routes';
import { SharedModule } from '../../shared.module';


const reportComponents = [
    ReportsComponent,
    BalanceReportComponent,
    BookmonReconcileComponent,
    CostBasisComponent,
    DayPnlComponent,
    // ReportGridComponent,
    TaxLotsComponent,
    TaxLotStatusComponent,
    TrialBalanceComponent,
    // CalculationGraphsComponent,
    JournalsComponent,
    // DataModalComponent
    // GridLayoutMenuComponent,
    // TemplateRendererComponent,
    // AgGridCheckboxComponent
  ];

@NgModule({
  declarations: [...reportComponents],
  exports: [...reportComponents],
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
    // NgcatalystModule,
    SharedModule,
    //   AgGridModule.withComponents([
    //     GridLayoutMenuComponent,
    //     TemplateRendererComponent,
    //     AgGridCheckboxComponent
    //   ]),
    RouterModule.forChild(ReportsRoutes),
    SharedModule
  ]
})
export class ReportsModule { }