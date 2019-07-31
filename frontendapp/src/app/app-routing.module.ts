import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceGridComponent } from './finance-grid/finance-grid.component';
import { RunLogsComponent } from './runlogs/runlogs.component';
import { ReportsComponent } from './reports/reports.component';

import { LedgerFormComponent } from './ledger-form/ledger-form.component';
import { CreateAccountComponent } from './ledger-form/create-account/create-account.component';
import { AgGridExampleComponent } from  './main/ag-grid-example/ag-grid-example.component';;

const routes: Routes = [
  { path: 'journals-ledgers', component: AgGridExampleComponent },
  { path: 'runlogs', component: RunLogsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'accounts', component: LedgerFormComponent, 
    children: [
    {
      path: 'create-account',
      component: CreateAccountComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
