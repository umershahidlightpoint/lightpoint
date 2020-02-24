
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AngularSplitModule } from 'angular-split';
import { LpToolkitModule } from 'lp-toolkit';

import { CorporateActionsComponent } from './corporate-actions.component';
import { DividendsComponent } from './dividends/dividends.component';
import { StockSplitsComponent } from './stock-splits/stock-splits.component';
import { PreviewComponent } from './dividends/preview/preview.component';

import { CorporateActionsRoutes } from './corporate-actions.route';

import { SharedModule } from 'src/app/shared.module';
import { StockSplitsPreviewComponent } from './stock-splits/stock-splits-preview/stock-splits-preview.component';

const corporateActionsComponents = [
  CorporateActionsComponent,
  DividendsComponent,
  StockSplitsComponent,
  PreviewComponent,
  StockSplitsPreviewComponent
];

@NgModule({
  declarations: [...corporateActionsComponents],
  exports: [...corporateActionsComponents, SharedModule],
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ModalModule,
    AlertModule,
    TooltipModule,
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    AngularSplitModule.forRoot(),
    RouterModule.forChild(CorporateActionsRoutes),
    LpToolkitModule,
    SharedModule
  ]
})
export class CorporateActionsModule {}
