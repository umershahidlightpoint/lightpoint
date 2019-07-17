import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceGridComponent } from './finance-grid/finance-grid.component';
import { AgGridExampleComponent } from './main/ag-grid-example/ag-grid-example.component'
import { LedgerFormComponent } from './ledger-form/ledger-form.component';
import { CreateAccountComponent } from './ledger-form/create-account/create-account.component';
import { DeleteAccountComponent } from './ledger-form/delete-account/delete-account.component';
import { UpdateAccountComponent } from './ledger-form/update-account/update-account.component';
import { ViewAccountComponent } from './ledger-form/view-account/view-account.component';

const routes: Routes = [
  { path: 'finance-grid', component: FinanceGridComponent },
  { path: 'accounts', component: LedgerFormComponent, 
    children: [{
      path: 'create-account',
      component: CreateAccountComponent
    },
    {
      path: 'delete-account',
      component: DeleteAccountComponent
    },
    {
      path: 'update-account',
      component: UpdateAccountComponent
    },
    {
      path: 'view-account',
      component: ViewAccountComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
