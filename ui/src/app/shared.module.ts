import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AgGridModule } from 'ag-grid-angular';
import { TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ngx-toastr';
import { NgcatalystModule } from 'ngcatalyst';
import { LpToolkitModule } from 'lp-toolkit';

import { GridLayoutMenuComponent } from '../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { AgGridCheckboxComponent } from '../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridUtils } from '../shared/utils/AgGridUtils';
import { ConfirmationModalComponent } from '../shared/Component/confirmation-modal/confirmation-modal.component';
import { DataModalComponent } from '../shared/Component/data-modal/data-modal.component';
import { ReportGridComponent } from './main/reports/report-grid/report-grid.component';
import { GridUtilsComponent } from '../shared/Component/grid-utils/grid-utils.component';
import { DataGridModalComponent } from '../shared/Component/data-grid-modal/data-grid-modal.component';
import { DatePickerModalComponent } from '../shared/Component/date-picker-modal/date-picker-modal.component';
import { CalculationGraphsComponent } from '../shared/Component/calculation-graphs/calculation-graphs.component';
import { JournalsComponent } from '../shared/Component/journals/journals.component';
import { CreateDividendComponent } from './../shared/Modal/create-dividend/create-dividend.component';
import { CreateStockSplitsComponent } from './../shared/Modal/create-stock-splits/create-stock-splits.component';
import { CreateSecurityComponent } from './../shared/Modal/create-security/create-security.component';
import { CreateSymbolRenameComponent } from './../shared/Modal/create-symbol-rename/create-symbol-rename.component';
import { ExcludeTradeComponent } from './../shared/Modal/exclude-trade/exclude-trade.component';

const sharedComponents = [
  GridLayoutMenuComponent,
  TemplateRendererComponent,
  AgGridCheckboxComponent,
  ConfirmationModalComponent,
  DataModalComponent,
  ReportGridComponent,
  GridUtilsComponent,
  DataGridModalComponent,
  DatePickerModalComponent,
  CalculationGraphsComponent,
  JournalsComponent,
  CreateDividendComponent,
  CreateStockSplitsComponent,
  CreateSecurityComponent,
  CreateSymbolRenameComponent,
  ExcludeTradeComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule,
    BsDropdownModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    AgGridModule.withComponents([
      GridLayoutMenuComponent,
      TemplateRendererComponent,
      AgGridCheckboxComponent
    ]),
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    ToastrModule.forRoot(),
    NgcatalystModule,
    LpToolkitModule
  ],
  declarations: [...sharedComponents],

  exports: [...sharedComponents, CommonModule, FormsModule, AgGridModule],
  providers: [AgGridUtils]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
      // providers: []
    };
  }
}
