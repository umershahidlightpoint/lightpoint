/*
Core/Libraries Imports
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
Services
*/
import { SidenavService } from '../shared/common/sidenav.service';
import { FinanceServiceProxy } from '../shared/service-proxies/service-proxies';
import { PostingEngineService } from '../shared/common/posting-engine.service';
import { DataService } from '../shared/common/data.service';
import { AgGridUtils } from '../shared/utils/AgGridUtils';
import { DataDictionary } from '../shared/utils/DataDictionary';
/*
Components
*/
import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { LeftMenuComponent } from './menu/left-menu/left-menu.component';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { GridLayoutMenuComponent } from '../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { AgGridCheckboxComponent } from '../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';

// Renderer Buttons
import { ButtonRendererComponent } from '../renderer/buttonRenderer';

// Reports
import { ReportsComponent } from './main/reports/reports.component';
import { BalanceReportComponent } from './main/reports/balance-report/balance-report.component';
import { CostBasisComponent } from './main/reports/costbasis/costbasis.component';
import { DayPnlComponent } from './main/reports/daypnl-reconcile/daypnl-reconcile.component';
import { ReportGridComponent } from './main/reports/report-grid/report-grid.component';
import { TaxLotsComponent } from './main/reports/taxlots/taxlots.component';
import { TaxLotStatusComponent } from './main/reports/taxlotstatus/taxlotstatus.component';

// Fund Theoretical
import { FundTheoreticalComponent } from './main/fund-theoretical/fund-theoretical.component';
import { CalculationGraphsComponent } from './main/fund-theoretical/calculation-graphs/calculation-graphs.component';
import { DailyPnlComponent } from './main/fund-theoretical/daily-pnl/daily-pnl.component';
import { FxRatesComponent } from './main/fund-theoretical/fx-rates/fx-rates.component';
import { MarketPricesComponent } from './main/fund-theoretical/market-prices/market-prices.component';
import { TaxRatesComponent } from './main/fund-theoretical/tax-rates/tax-rates.component';

// Summary
import { SummaryComponent } from './main/summary/summary.component';
import { JournalsSummaryComponent } from './main/summary/journals-summary/journals-summary.component';
import { JournalsSummayDetailComponent } from './main/summary/journals-summay-detail/journals-summay-detail.component';

// Journals Ledger
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';

// Trail Balence
import { TrialBalanceComponent } from './main/reports/trial-balance/trial-balance.component';
import { TrialGridExampleComponent } from './main/trial-balance/trial-balance.component';

// Accruals
import { AccrualsComponent } from './main/accruals/accruals.component';

// Trade Allocation
import { TradeAllocationComponent } from './main/trade-allocation/trade-allocation.component';
import { TradesComponent } from './main/trades/trades.component';
import { AllocationsComponent } from './main/allocations/allocations.component';
import { JournalsComponent } from './main/journals/journals.component';

// Journal Allocation (Same as Trade Allocation)
import { JournalAllocationComponent } from './main/journal-allocation/journal-allocation.component';

// Operations
import { OperationsComponent } from './main/operations/operations.component';
import { FileExceptionComponent } from './main/operations/file-exception/file-exception.component';
import { FileManagementComponent } from './main/operations/file-management/file-management.component';
import { FileUploadComponent } from './main/operations/file-upload/file-upload.component';
import { SilverFileManagementComponent } from 'src/app/main/operations/silver-file-management/silver-file-management.component';

// Settings
import { SettingsComponent } from './main/settings/settings.component';

// Grid Views/Layouts
import { LayoutsComponent } from './main/layouts/layouts.component';

// Logs/RunLogs
import { RunLogsComponent } from './runlogs/runlogs.component';
import { LogsComponent } from './main/logs/logs.component';

/*
SharedComponents
*/

import { DataModalComponent } from '../shared/Component/data-modal/data-modal.component';
import { ReportModalComponent } from '../shared/Component/report-modal/report-modal.component';
import { ConfirmationModalComponent } from '../shared/Component/confirmation-modal/confirmation-modal.component';
import { GridUtilsComponent } from '../shared/Component/grid-utils/grid-utils.component';
import { PerformanceCanDeactivateGuard } from '../shared/guards/performance-can-deactivate-guard.service';
import { DataGridModalComponent } from '../shared/Component/data-grid-modal/data-grid-modal.component';
import { TaxRateModalComponent } from './main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component';
import { DatePickerModalComponent } from '../shared/Component/date-picker-modal/date-picker-modal.component';
import { JournalsServerSideComponent } from './main/journals-ledgers/journals-server-side/journals-server-side.component';
import { JournalModalComponent } from './main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component';
import { JournalsLayoutComponent } from './main/journals-ledgers/journals-layout.component';
import { JournalsLedgersComponent } from './main/journals-ledgers/journals-client-side/journals-ledgers.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftMenuComponent,
    TemplateRendererComponent,
    GridLayoutMenuComponent,
    AgGridCheckboxComponent,
    ButtonRendererComponent,
    // Reports
    ReportsComponent,
    BalanceReportComponent,
    CostBasisComponent,
    DayPnlComponent,
    ReportGridComponent,
    TaxLotsComponent,
    TaxLotStatusComponent,
    // Fund Theorietical
    FundTheoreticalComponent,
    CalculationGraphsComponent,
    DailyPnlComponent,
    FxRatesComponent,
    MarketPricesComponent,
    TaxRatesComponent,
    // Summary
    SummaryComponent,
    JournalsSummaryComponent,
    JournalsSummayDetailComponent,
    // Journals Ledger
    JournalsLedgersComponent,
    JournalModalComponent,
    AccountComponent,
    CreateAccountComponent,
    // Trial Balence
    TrialBalanceComponent,
    TrialGridExampleComponent,
    // Accruals
    AccrualsComponent,
    // Trade Allocation
    TradeAllocationComponent,
    TradesComponent,
    AllocationsComponent,
    JournalsComponent,
    // Journal Allocation
    JournalAllocationComponent,
    // Operations
    OperationsComponent,
    FileExceptionComponent,
    FileManagementComponent,
    FileUploadComponent,
    SilverFileManagementComponent,
    // Grid Views/Layouts
    LayoutsComponent,
    // Settings
    SettingsComponent,
    // Logs/RunLogs
    LogsComponent,
    RunLogsComponent,
    // Shared Components
    DataModalComponent,
    ReportModalComponent,
    ConfirmationModalComponent,
    GridUtilsComponent,
    DataGridModalComponent,
    TaxRateModalComponent,
    DatePickerModalComponent,
    JournalsServerSideComponent,
    JournalsLayoutComponent
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
      firstDay: 1
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
    FinanceServiceProxy,
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
