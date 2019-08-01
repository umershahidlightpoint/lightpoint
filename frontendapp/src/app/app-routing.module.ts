import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceGridComponent } from './finance-grid/finance-grid.component';
import { RunLogsComponent } from './runlogs/runlogs.component';
import { ReportsComponent } from './reports/reports.component';
import { AccountComponent } from './main/accounts/account.component';
import { CreateAccountComponent } from './main/accounts/create-account/create-account.component';

 
 
import { AgGridExampleComponent } from  './main/ag-grid-example/ag-grid-example.component';;

const routes: Routes = [
  { path: 'journals-ledgers', component: AgGridExampleComponent },
  { path: 'runlogs', component: RunLogsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'accounts', component: AccountComponent, 
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
