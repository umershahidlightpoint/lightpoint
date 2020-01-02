/*
Core/Libraries Imports
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { NgcatalystModule } from 'ngcatalyst';

/*
Services
*/
import { SidenavService } from '../services/common/sidenav.service';
import { FinanceServiceProxy } from '../services/service-proxies';
import { PostingEngineService } from '../services/common/posting-engine.service';
import { DataService } from '../services/common/data.service';
import { AgGridUtils } from '../shared/utils/AgGridUtils';
import { DataDictionary } from '../shared/utils/DataDictionary';
import { PerformanceCanDeactivateGuard } from '../../src/services/guards/performance-can-deactivate-guard.service';

/*
Components
*/
import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { LeftMenuComponent } from './menu/left-menu/left-menu.component';
import { GridLayoutMenuComponent } from '../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { AgGridCheckboxComponent } from '../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';

// Reports
import { ReportsComponent } from './main/reports/reports.component';
import { BalanceReportComponent } from './main/reports/balance-report/balance-report.component';
import { CostBasisComponent } from './main/reports/costbasis/costbasis.component';
import { DayPnlComponent } from './main/reports/daypnl-reconcile/daypnl-reconcile.component';
import { BookmonReconcileComponent } from './main/reports/bookmon-reconcile/bookmon-reconcile.component';
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
import { JournalsLayoutComponent } from './main/journals-ledgers/journals-layout.component';
import { JournalsLedgersComponent } from './main/journals-ledgers/journals-client-side/journals-ledgers.component';
import { JournalsServerSideComponent } from './main/journals-ledgers/journals-server-side/journals-server-side.component';

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

// Account
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';
import { AccountMappingComponent } from './main/accounts/account-mapping/account-mapping.component';
import { ChartOfAccountComponent } from './main/accounts/account-mapping/chart-of-account/chart-of-account.component';
import { ChartOfAccountDetailComponent } from './main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component';

// Operations
import { OperationsComponent } from './main/operations/operations.component';
import { FileExceptionComponent } from './main/operations/file-exception/file-exception.component';
import { FileManagementComponent } from './main/operations/file-management/file-management.component';
import { FileUploadComponent } from './main/operations/file-upload/file-upload.component';
import { SilverFileManagementComponent } from 'src/app/main/operations/silver-file-management/silver-file-management.component';
import { ServicesStatusComponent } from 'src/app/main/operations/services-status/services-status.component';

// Settings
import { SettingsComponent } from './main/settings/settings.component';

// Grid Views/Layouts
import { LayoutsComponent } from './main/layouts/layouts.component';

// Logs
import { LogsComponent } from './main/logs/logs.component';

/*
SharedComponents
*/
import { LoaderComponent } from '../shared/Component/loader/loader.component';
import { ConfirmationModalComponent } from '../shared/Component/confirmation-modal/confirmation-modal.component';
import { DataModalComponent } from '../shared/Component/data-modal/data-modal.component';
import { DataGridModalComponent } from '../shared/Component/data-grid-modal/data-grid-modal.component';
import { ReportModalComponent } from '../shared/Component/report-modal/report-modal.component';
import { JournalModalComponent } from './main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component';
import { TaxRateModalComponent } from './main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component';
import { DatePickerModalComponent } from '../shared/Component/date-picker-modal/date-picker-modal.component';
import { GridUtilsComponent } from '../shared/Component/grid-utils/grid-utils.component';
import { NotfoundComponent } from './main/not-found/notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftMenuComponent,
    GridLayoutMenuComponent,
    TemplateRendererComponent,
    AgGridCheckboxComponent,
    // Reports
    ReportsComponent,
    BalanceReportComponent,
    CostBasisComponent,
    DayPnlComponent,
    BookmonReconcileComponent,
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
    JournalsLayoutComponent,
    JournalsServerSideComponent,
    JournalsLedgersComponent,
    JournalModalComponent,
    AccountComponent,
    CreateAccountComponent,
    AccountMappingComponent,
    ChartOfAccountComponent,
    ChartOfAccountDetailComponent,
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
    // Account
    AccountComponent,
    CreateAccountComponent,
    // Operations
    OperationsComponent,
    FileExceptionComponent,
    FileManagementComponent,
    FileUploadComponent,
    SilverFileManagementComponent,
    ServicesStatusComponent,
    // Grid Views/Layouts
    LayoutsComponent,
    // Settings
    SettingsComponent,
    // Logs/RunLogs
    LogsComponent,
    // Shared Components
    LoaderComponent,
    ConfirmationModalComponent,
    DataModalComponent,
    DataGridModalComponent,
    ReportModalComponent,
    TaxRateModalComponent,
    DatePickerModalComponent,
    GridUtilsComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    AgGridModule.withComponents([
      TemplateRendererComponent,
      GridLayoutMenuComponent,
      AgGridCheckboxComponent
    ]),
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    AngularSplitModule.forRoot(),
    NgcatalystModule
  ],
  providers: [
    SidenavService,
    FinanceServiceProxy,
    DataService,
    PostingEngineService,
    AgGridUtils,
    DataDictionary,
    PerformanceCanDeactivateGuard,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
