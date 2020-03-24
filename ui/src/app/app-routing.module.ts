import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reports',
    loadChildren: './main/reports/reports.module#ReportsModule'
  },
  {
    path: 'fund-theoretical',
    loadChildren: './main/fund-theoretical/fund-theoretical.module#FundTheoreticalModule'
  },
  {
    path: 'journals-ledgers',
    loadChildren: './main/journals-ledgers/journals-ledger.module#JournalsLedgerModule'
  },
  {
    path: 'reconciliation',
    loadChildren: './main/reconciliation/reconciliation.module#ReconciliationModule'
  },
  // { path: 'analysis', component: SummaryComponent },
  // { path: 'trial-balance', component: TrialGridExampleComponent },
  {
    path: 'maintenance',
    loadChildren: './main/maintenance/maintenance.module#MaintenanceModule'
  },
  {
    path: 'oms', // contains Trade Allocation OMS, Journal Allocation OMS, Accruals OMS
    loadChildren: './main/oms/oms.module#OmsModule'
  },
  {
    path: 'accounts',
    loadChildren: './main/accounts/accounts.module#AccountsModule'
  },
  {
    path: 'operations',
    loadChildren: './main/operations/operations.module#OperationsModule'
  },
  {
    path: 'corporate-actions',
    loadChildren: './main/corporate-actions/corporate-actions.module#CorporateActionsModule'
  },
  {
    path: 'asset-servicing',
    loadChildren: './main/asset-servicing/asset-servicing.module#AssetServicingModule'
  },
  {
    path: 'settings',
    loadChildren: './main/settings/settings.module#SettingsModule'
  },
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  {
    path: '**',
    loadChildren: './main/not-found/notfound.module#NotFoundModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
