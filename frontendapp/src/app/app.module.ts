import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FundsComponent } from './main/funds/funds.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { LedgerComponent } from './main/ledger/ledger.component';
import {
  ModalModule,
  PopoverModule,
  TabsModule,
  TooltipModule
} from "ngx-bootstrap";
import { LegderModalComponent } from './main/legder-modal/legder-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    FundsComponent,
    LedgerComponent,
    LegderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    PaginatorModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot()
  ],
  providers: [FinancePocServiceProxy],
  bootstrap: [AppComponent]
})
export class AppModule { }
