import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FinanceGridComponent } from "./finance-grid/finance-grid.component";
import { OperationsComponent } from "./main/operations/operations.component";
import { RunLogsComponent } from "./runlogs/runlogs.component";
import { ReportsComponent } from "./reports/reports.component";
import { AccountComponent } from "./main/accounts/account.component";
import { CreateAccountComponent } from "./main/accounts/create-account/create-account.component";

import { AgGridExampleComponent } from "./main/ag-grid-example/ag-grid-example.component";
import { TrialGridExampleComponent } from "./main/trial-balance/trial-balance.component";

const routes: Routes = [
  { path: "", component: AgGridExampleComponent },
  { path: "journals-ledgers", component: AgGridExampleComponent },
  { path: "trialBalance", component: TrialGridExampleComponent },
  { path: "runlogs", component: RunLogsComponent },
  { path: "operations", component: OperationsComponent },
  { path: "reports", component: ReportsComponent },
  {
    path: "accounts",
    component: AccountComponent,
    children: [
      {
        path: "create-account",
        component: CreateAccountComponent
      }
    ]
  },
  { path: "operations", component: OperationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
