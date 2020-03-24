import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TabsModule,
  ModalModule,
  AlertModule,
  TypeaheadModule,
  BsDropdownModule,
  TooltipModule
} from 'ngx-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AngularSplitModule } from 'angular-split';
import { LpToolkitModule } from '@lightpointfinancialtechnology/lp-toolkit';

import { SharedModule } from 'src/app/shared.module';

import { AssetServicingComponent } from './asset-servicing.component';

import { AssetServicingRoutes } from './asset-servicing.route';
import { AssetServicesOptionsComponent } from './asset-services-options/asset-services-options.component';

const assetServicingComponents = [AssetServicingComponent];

@NgModule({
  declarations: [...assetServicingComponents, AssetServicesOptionsComponent],
  exports: [...assetServicingComponents, SharedModule],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetServicingRoutes),
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ModalModule,
    AlertModule,
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    AngularSplitModule.forRoot(),
    LpToolkitModule,
    SharedModule
  ]
})
export class AssetServicingModule {}
