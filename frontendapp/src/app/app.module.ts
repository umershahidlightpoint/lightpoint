/*
Core/Libraries Imports
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { DragAndDropModule } from 'angular-draggable-droppable';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {
  AutoCompleteModule,
  EditorModule,
  InputMaskModule,
  PaginatorModule,
  MultiSelectModule,
  ListboxModule,
  ScheduleModule,
  TabViewModule,
  CalendarModule
} from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { SliderModule } from 'primeng/slider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { NgcatalystModule } from 'ngcatalyst';
/*
Services/Components
*/
import { SidenavService } from '../shared/common/sidenav.service';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { PostingEngineService } from '../shared/common/posting-engine.service';
import { DataService } from '../shared/common/data.service';
import { AgGridUtils } from '../shared/utils/ag-grid-utils';
import { DataDictionary } from '../shared/utils/DataDictionary';

import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { GridLayoutMenuComponent } from '../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { LeftMenuComponent } from './menu/left-menu/left-menu.component';
import { JournalsLedgersComponent } from './main/journals-ledgers/journals-ledgers.component';
import { JournalModalComponent } from './main/journals-ledgers/journal-modal/journal-modal.component';
import { DataModalComponent } from '../shared/Component/data-modal/data-modal.component';
import { TrialGridExampleComponent } from './main/trial-balance/trial-balance.component';
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';
import { AccrualsComponent } from './main/accruals/accruals.component';
import { TradeAllocationComponent } from './main/trade-allocation/trade-allocation.component';
import { JournalAllocationComponent } from './main/journal-allocation/journal-allocation.component';
import { ReportsComponent } from './main/reports/reports.component';
import { RunLogsComponent } from './runlogs/runlogs.component';
import { FileManagementComponent } from './main/operations/file-management/file-management.component';
import { SilverFileManagementComponent } from 'src/app/main/operations/silver-file-management/silver-file-management.component';
import { LogsComponent } from './main/logs/logs.component';
import { SettingsComponent } from './main/settings/settings.component';
import { OperationsComponent } from './main/operations/operations.component';
import { ButtonRendererComponent } from '../renderer/buttonRenderer';
import { BalanceReportComponent } from './main/reports/balance-report/balance-report.component';
import { CostBasisComponent } from './main/reports/costbasis/costbasis.component';
import { TaxLotStatusComponent } from './main/reports/taxlotstatus/taxlotstatus.component';
import { TaxLotsComponent } from './main/reports/taxlots/taxlots.component';
import { TrialBalanceComponent } from './main/reports/trial-balance/trial-balance.component';
import { ReportModalComponent } from '../shared/Component/report-modal/report-modal.component';
import { AllocationsComponent } from './main/allocations/allocations.component';
import { JournalsComponent } from './main/journals/journals.component';
import { TradesComponent } from './main/trades/trades.component';
import { LayoutsComponent } from './main/layouts/layouts.component';
import { ConfirmationModalComponent } from '../shared/Component/confirmation-modal/confirmation-modal.component';
import { ReportGridComponent } from './main/reports/report-grid/report-grid.component';
import { GridUtilsComponent } from '../shared/Component/grid-utils/grid-utils.component';
import { FileExceptionComponent } from './main/operations/file-exception/file-exception.component';
import { FundTheoreticalComponent } from './main/fund-theoretical/fund-theoretical.component';
import { DailyPnlComponent } from './main/fund-theoretical/daily-pnl/daily-pnl.component';
import { MarketPricesComponent } from './main/fund-theoretical/market-prices/market-prices.component';
import { PerformanceCanDeactivateGuard } from '../shared/guards/performance-can-deactivate-guard.service';
import { DataGridModalComponent } from '../shared/Component/data-grid-modal/data-grid-modal.component';
import { DecimalPipe } from '@angular/common';
import { AgGridCheckboxComponent } from '../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';
import { CalculationGraphsComponent } from './main/fund-theoretical/calculation-graphs/calculation-graphs.component';
import { TaxRatesComponent } from './main/fund-theoretical/tax-rates/tax-rates.component';
import { TaxRateModalComponent } from './main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    JournalsLedgersComponent,
    TrialGridExampleComponent,
    LogsComponent,
    TemplateRendererComponent,
    AccountComponent,
    CreateAccountComponent,
    OperationsComponent,
    AccrualsComponent,
    TradeAllocationComponent,
    JournalAllocationComponent,
    SettingsComponent,
    HeaderComponent,
    ReportsComponent,
    RunLogsComponent,
    JournalModalComponent,
    DataModalComponent,
    GridLayoutMenuComponent,
    LeftMenuComponent,
    FileManagementComponent,
    SilverFileManagementComponent,
    ButtonRendererComponent,
    BalanceReportComponent,
    CostBasisComponent,
    TaxLotStatusComponent,
    TaxLotsComponent,
    TrialBalanceComponent,
    ReportModalComponent,
    AllocationsComponent,
    JournalsComponent,
    LayoutsComponent,
    ConfirmationModalComponent,
    TradesComponent,
    LayoutsComponent,
    ReportGridComponent,
    GridUtilsComponent,
    FileExceptionComponent,
    FundTheoreticalComponent,
    DailyPnlComponent,
    MarketPricesComponent,
    DataGridModalComponent,
    AgGridCheckboxComponent,
    CalculationGraphsComponent,
    TaxRatesComponent,
    TaxRateModalComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([
      TemplateRendererComponent,
      GridLayoutMenuComponent,
      AgGridCheckboxComponent
    ]),
    MaterialModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 3
    }),
    AppRoutingModule,
    TableModule,
    PaginatorModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    HttpClientModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    AutoCompleteModule,
    EditorModule,
    InputMaskModule,
    PaginatorModule,
    MultiSelectModule,
    ListboxModule,
    ScheduleModule,
    TabViewModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    DragAndDropModule,
    SliderModule,
    AngularSplitModule.forRoot(),
    CalendarModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgcatalystModule
  ],
  providers: [
    FinancePocServiceProxy,
    MessageService,
    DataService,
    SidenavService,
    PostingEngineService,
    AgGridUtils,
    DataDictionary,
    PerformanceCanDeactivateGuard,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
