import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './main/operations/operations.component';
import { AccrualsComponent } from './main/accruals/accruals.component';
import { SettingsComponent } from './main/settings/settings.component';
import { RunLogsComponent } from './runlogs/runlogs.component';
import { ReportsComponent } from './main/reports/reports.component';
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';
import { JournalsLedgersComponent } from './main/journals-ledgers/journals-ledgers.component';
import { TrialGridExampleComponent } from './main/trial-balance/trial-balance.component';

const routes: Routes = [
  { path: '', component: JournalsLedgersComponent },
  { path: 'journals-ledgers', component: JournalsLedgersComponent },
  { path: 'trial-balance', component: TrialGridExampleComponent },
  { path: 'runlogs', component: RunLogsComponent },
  { path: 'operations', component: OperationsComponent },
  { path: 'accruals', component: AccrualsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'reports', component: ReportsComponent },
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
  { path: 'operations', component: OperationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
