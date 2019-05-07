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

@NgModule({
  declarations: [
    AppComponent,
    FundsComponent,
    LedgerComponent,
    LegderModalComponent,
    UpdateLedgerModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    PaginatorModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    HttpClientModule,
    ToastModule,
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
    CalendarModule
  ],
  providers: [FinancePocServiceProxy, MessageService],

  bootstrap: [AppComponent]
})
export class AppModule { }
