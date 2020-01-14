import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AgGridUtils } from '../../../shared/utils/AgGridUtils';

import { JournalsLayoutComponent } from './journals-layout.component';
import { JournalsServerSideComponent } from './journals-server-side/journals-server-side.component';
// import { GridUtilsComponent } from '../../../shared/Component/grid-utils/grid-utils.component';
import { JournalModalComponent } from '../../main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component';
import { ReportModalComponent } from '../../../shared/Component/report-modal/report-modal.component';
import { SharedModule } from '../../shared.module';

import { RouterModule } from '@angular/router';
import { JournalsLedgerRoutes } from './journals-ledger.routes';

const journalLedgerComponents = [
    JournalsLayoutComponent,
    JournalsServerSideComponent,
    // GridUtilsComponent,
    JournalModalComponent,
    ReportModalComponent,
  ];

@NgModule({
  declarations: [
    ...journalLedgerComponents
],
  exports: [JournalsLayoutComponent, JournalsServerSideComponent, SharedModule],
  imports: [
    SharedModule,
    RouterModule.forChild(JournalsLedgerRoutes),
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
        applyLabel: 'Okay',
        firstDay: 1
      }),
    TypeaheadModule.forRoot(),
  ],
  providers: [
    AgGridUtils
  ],
})
export class JournalsLedgerModule {}