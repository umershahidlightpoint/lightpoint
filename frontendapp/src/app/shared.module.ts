import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

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

// import { HeaderComponent } from './menu/header/header.component';
// import { LeftMenuComponent } from './menu/left-menu/left-menu.component';


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
],
  declarations: [ GridLayoutMenuComponent, TemplateRendererComponent, AgGridCheckboxComponent,
                  ConfirmationModalComponent, DataModalComponent, ReportGridComponent,
                  GridUtilsComponent, DataGridModalComponent, DatePickerModalComponent,
                  LoaderComponent
                 ],

  exports:      [ GridLayoutMenuComponent, TemplateRendererComponent, AgGridCheckboxComponent,
                  ConfirmationModalComponent, DataModalComponent, ReportGridComponent,
                  GridUtilsComponent, DataGridModalComponent, DatePickerModalComponent,
                  LoaderComponent,
                  CommonModule, FormsModule, AgGridModule],
  providers: [AgGridUtils]
})

// export class SharedModule {}
export class SharedModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: SharedModule,
        // providers: [CounterService]
      };
    }
  }