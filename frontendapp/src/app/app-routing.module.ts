import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './main/not-found/notfound/notfound.component';

const routes: Routes = [
  {
    path: 'journals-ledgers',
    loadChildren: './main/journals-ledgers/journals-ledger.module#JournalsLedgerModule'
  },
  // { path: 'analysis', component: SummaryComponent },
  // { path: 'trial-balance', component: TrialGridExampleComponent },
  {
    path: 'oms', // Contains Trade-Allocation OMS, Journal-Allocation OMS, Accruals OMS
    loadChildren: './main/oms/oms.module#OmsModule'
  },
  {
    path: 'settings',
    loadChildren: './main/settings/settings.module#SettingsModule'
  },
  {
    path: 'maintenance',
    loadChildren: './main/maintenance/maintenance.module#MaintenanceModule'
  },
  {
    path: 'fund-theoretical',
    loadChildren: './main/fund-theoretical/fund-theoretical.module#FundTheoreticalModule'
  },
  {
    path: 'reports',
    loadChildren: './main/reports/reports.module#ReportsModule'
  },
  {
    path: 'accounts',
    loadChildren: './main/accounts/accounts.module#AccountsModule'
  },
  {
    path: 'operations',
    loadChildren: './main/operations/operations.module#OperationsModule'
  },
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
