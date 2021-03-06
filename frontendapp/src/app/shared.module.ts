import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ngx-toastr';
import { NgcatalystModule } from 'ngcatalyst';

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
import { LoaderComponent } from '../shared/Component/loader/loader.component';
import { CalculationGraphsComponent } from '../shared/Component/calculation-graphs/calculation-graphs.component';
import { JournalsComponent } from '../shared/Component/journals/journals.component';

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
  LoaderComponent,
  CalculationGraphsComponent,
  JournalsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule.withComponents([
      GridLayoutMenuComponent,
      TemplateRendererComponent,
      AgGridCheckboxComponent
    ]),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    NgcatalystModule,
    ToastrModule.forRoot()
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
