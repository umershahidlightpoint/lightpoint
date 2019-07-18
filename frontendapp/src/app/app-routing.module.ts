import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceGridComponent } from './finance-grid/finance-grid.component';
import { LedgerFormComponent } from './ledger-form/ledger-form.component';
import { CreateAccountComponent } from './ledger-form/create-account/create-account.component';

const routes: Routes = [
  { path: 'journals-ledgers', component: FinanceGridComponent },
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
