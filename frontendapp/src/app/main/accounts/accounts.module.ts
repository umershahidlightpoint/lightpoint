import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

import { AccountRoutes } from './accounts.route';
import { SharedModule } from '../../shared.module';
// Account Component
import { AccountComponent } from './account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AccountMappingComponent } from './account-mapping/account-mapping.component';
import { ChartOfAccountComponent } from './account-mapping/chart-of-account/chart-of-account.component';
import { ChartOfAccountDetailComponent } from './account-mapping/chart-of-account-detail/chart-of-account-detail.component';

const AccountsComponents = [
    AccountComponent,
    CreateAccountComponent,
    AccountMappingComponent,
    ChartOfAccountComponent,
    ChartOfAccountDetailComponent
  ];

@NgModule({
  declarations: [...AccountsComponents],
  exports: [],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    SharedModule,
    RouterModule.forChild(AccountRoutes),
    SharedModule
  ]
})

export class AccountsModule { }