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
import { AgGridModule } from 'ag-grid-angular';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
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
} from 'primeng/primeng';
import { SliderModule } from 'primeng/slider';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import {
  ModalModule,
  PopoverModule,
  TabsModule,
  TooltipModule
} from 'ngx-bootstrap';
import { LegderModalComponent } from './main/legder-modal/legder-modal.component';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { UpdateLedgerModalComponent } from './main/update-ledger-modal/update-ledger-modal.component';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JournalComponent } from './main/journal/journal.component';
import { AgGridExampleComponent } from './main/ag-grid-example/ag-grid-example.component';
import { LogsComponent } from './main/logs/logs.component';
import { FinanceGridComponent } from './finance-grid/finance-grid.component';
import { RunLogsComponent } from './runlogs/runlogs.component';
import { ReportsComponent } from './reports/reports.component';
import { LedgerFormComponent } from './ledger-form/ledger-form.component'; 
import { CreateAccountComponent } from './ledger-form/create-account/create-account.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    FundsComponent,
    LedgerComponent,
    LegderModalComponent,
    UpdateLedgerModalComponent,
    JournalComponent,
    AgGridExampleComponent,
    LogsComponent,
    TemplateRendererComponent,
    FinanceGridComponent,
    LedgerFormComponent,
    CreateAccountComponent,
    RunLogsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([
      TemplateRendererComponent,
    ]),
    AgGridModule.withComponents([]),
    NgxDaterangepickerMd.forRoot(),
    AppRoutingModule,
    TableModule,
    PaginatorModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    HttpClientModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
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
    DragAndDropModule,
    SliderModule,
    AngularSplitModule.forRoot(),
    CalendarModule,
    ToastrModule.forRoot()
  ],
  providers: [FinancePocServiceProxy, MessageService],

  bootstrap: [AppComponent]
})
export class AppModule { }
