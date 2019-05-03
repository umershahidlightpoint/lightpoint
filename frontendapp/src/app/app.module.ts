import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FundsComponent } from './main/funds/funds.component';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { LedgerComponent } from './main/ledger/ledger.component';
import {
  AutoCompleteModule,
  EditorModule,
  InputMaskModule,
  PaginatorModule,
  MultiSelectModule,
  ListboxModule,
  ScheduleModule,
  TabViewModule,
  CalendarModule
} from "primeng/primeng";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
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
    ModalModule.forRoot(),
    AutoCompleteModule,
    EditorModule,
    InputMaskModule,
    PaginatorModule,
    MultiSelectModule,
    ListboxModule,
    ScheduleModule,
    TabViewModule, BrowserAnimationsModule,
    NoopAnimationsModule,
    CalendarModule
  ],
  providers: [FinancePocServiceProxy],
  bootstrap: [AppComponent]
})
export class AppModule { }
