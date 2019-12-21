import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './main/operations/operations.component';
import { AccrualsComponent } from './main/accruals/accruals.component';
import { TradeAllocationComponent } from './main/trade-allocation/trade-allocation.component';
import { JournalAllocationComponent } from './main/journal-allocation/journal-allocation.component';
import { SettingsComponent } from './main/settings/settings.component';
import { ReportsComponent } from './main/reports/reports.component';
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';
import { TrialGridExampleComponent } from './main/trial-balance/trial-balance.component';
import { LayoutsComponent } from './main/layouts/layouts.component';
import { FundTheoreticalComponent } from './main/fund-theoretical/fund-theoretical.component';
import { SummaryComponent } from './main/summary/summary.component';
import { JournalsLayoutComponent } from './main/journals-ledgers/journals-layout.component';
import { PerformanceCanDeactivateGuard } from '../../src/services/guards/performance-can-deactivate-guard.service';
import { TaxLotStatusComponent } from './main/reports/taxlotstatus/taxlotstatus.component';
import { DayPnlComponent } from './main/reports/daypnl-reconcile/daypnl-reconcile.component';
import { BookmonReconcileComponent } from './main/reports/bookmon-reconcile/bookmon-reconcile.component';
import { TrialBalanceComponent } from './main/reports/trial-balance/trial-balance.component';
import { CostBasisComponent } from './main/reports/costbasis/costbasis.component';

const routes: Routes = [
  { path: '', component: ReportsComponent }, // Default
  { path: 'journals-ledgers', component: JournalsLayoutComponent },
  { path: 'analysis', component: SummaryComponent },
  { path: 'trial-balance', component: TrialGridExampleComponent },
  { path: 'operations', component: OperationsComponent },
  { path: 'accruals', component: AccrualsComponent },
  { path: 'trade-allocation', component: TradeAllocationComponent },
  { path: 'journal-allocation', component: JournalAllocationComponent },
  { path: 'settings', component: SettingsComponent },
  {
    path: 'fund-theoretical',
    component: FundTheoreticalComponent,
    canDeactivate: [PerformanceCanDeactivateGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    children: [
      {
        path: 'cost-basis',
        component: CostBasisComponent
      },
      {
        path: 'taxlot',
        component: TaxLotStatusComponent
      },
      {
        path: 'daily-pnl',
        component: DayPnlComponent
      },
      {
        path: 'bookmon-reconcile',
        component: BookmonReconcileComponent
      },
      {
        path: 'trial-balance',
        component: TrialBalanceComponent
      }
    ]
  },
  {
    path: 'accounts',
    component: AccountComponent,
    children: [
      {
        path: 'create-account',
        component: CreateAccountComponent
      }
    ]
  },
  { path: 'operations', component: OperationsComponent },
  { path: 'grid-views', component: LayoutsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
