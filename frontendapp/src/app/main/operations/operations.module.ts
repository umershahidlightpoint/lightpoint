import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LpToolkitModule } from 'lp-toolkit';

import { OperationsComponent } from './operations.component';
import { FileExceptionComponent } from '../operations/file-exception/file-exception.component';
import { FileManagementComponent } from '../operations/file-management/file-management.component';
import { FileUploadComponent } from '../operations/file-upload/file-upload.component';
import { SilverFileManagementComponent } from 'src/app/main/operations/silver-file-management/silver-file-management.component';
import { ServicesStatusComponent } from 'src/app/main/operations/services-status/services-status.component';
import { ServicesLogComponent } from './services-log/services-log.component';

import { OperationsRoutes } from './operations.route';
import { SharedModule } from 'src/app/shared.module';

const operationsComponents = [
  OperationsComponent,
  FileExceptionComponent,
  FileManagementComponent,
  FileUploadComponent,
  SilverFileManagementComponent,
  ServicesStatusComponent,
  ServicesLogComponent
];

@NgModule({
  declarations: [...operationsComponents],
  exports: [...operationsComponents, SharedModule],
  imports: [
    CommonModule,
    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    RouterModule.forChild(OperationsRoutes),
    LpToolkitModule,
    SharedModule
  ]
})
export class OperationsModule {}
