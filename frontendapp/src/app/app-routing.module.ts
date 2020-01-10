import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { OperationsComponent } from './main/operations/operations.component';
// import { AccrualsComponent } from './main/accruals/accruals.component';
// import { TradeAllocationComponent } from './main/trade-allocation/trade-allocation.component';
// import { JournalAllocationComponent } from './main/journal-allocation/journal-allocation.component';
// import { SettingsComponent } from './main/settings/settings.component';
// import { ReportsComponent } from './main/reports/reports.component';
// import { AccountComponent } from './main/accounts/account.component';
// import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';
// import { TrialGridExampleComponent } from './main/trial-balance/trial-balance.component';
// import { LayoutsComponent } from './main/layouts/layouts.component';
// import { FundTheoreticalComponent } from './main/fund-theoretical/fund-theoretical.component';
// import { SummaryComponent } from './main/summary/summary.component';
// import { JournalsLayoutComponent } from './main/journals-ledgers/journals-layout.component';
import { NotfoundComponent } from './main/not-found/notfound/notfound.component';
// import { PerformanceCanDeactivateGuard } from '../../src/services/guards/performance-can-deactivate-guard.service';
// import { MaintenanceComponent } from './main/maintenance/maintenance.component';


const routes: Routes = [
  {
    path: 'journals-ledgers',
    loadChildren: './main/journals-ledgers/journals-ledger.module#JournalsLedgerModule'
  },
  // { path: 'analysis', component: SummaryComponent },
  // { path: 'trial-balance', component: TrialGridExampleComponent },
  // { path: 'operations', component: OperationsComponent },
  // { path: 'accruals', component: AccrualsComponent },
  // { path: 'trade-allocation', component: TradeAllocationComponent },
  // { path: 'journal-allocation', component: JournalAllocationComponent },
  {
    path: 'settings',
    loadChildren: './main/settings/settings.module#SettingsModule'
  },
  // { path: 'maintenance', component: MaintenanceComponent },

  // {
  //   path: 'fund-theoretical',
  //   component: FundTheoreticalComponent,
  //   canDeactivate: [PerformanceCanDeactivateGuard]
  // },
  {
    path: 'fund-theoretical',
    loadChildren: './main/fund-theoretical/fund-theoretical.module#FundTheoreticalModule'
  },
  // { path: 'reports', component: ReportsComponent },
  {
    path: 'reports',
    loadChildren: './main/reports/reports.module#ReportsModule'
  },

  // {
  //   path: 'accounts',
  //   component: AccountComponent,
  //   children: [
  //     {
  //       path: 'create-account',
  //       component: CreateAccountComponent
  //     }
  //   ]
  // },
  {
    path: 'operations',
    loadChildren: './main/operations/operations.module#OperationsModule'
  },
  {
    path: 'grid-views',
    loadChildren: './main/layouts/layouts.module#LayoutsModule'
  },
  // { path: '', redirectTo: '/reports', pathMatch: 'full' },
  // {
  //   path: '',
  //   loadChildren: './main/reports/reports.module#ReportsModule'
  // },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
