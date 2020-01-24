import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgcatalystModule } from 'ngcatalyst';
import { RouterModule } from '@angular/router';

import { FundTheoreticalComponent } from './fund-theoretical.component';
import { DailyPnlComponent } from '../fund-theoretical/daily-pnl/daily-pnl.component';
import { FxRatesComponent } from '../fund-theoretical/fx-rates/fx-rates.component';
import { MarketPricesComponent } from '../fund-theoretical/market-prices/market-prices.component';
import { TaxRatesComponent } from '../fund-theoretical/tax-rates/tax-rates.component';
import { TaxRateModalComponent } from './tax-rates/tax-rate-modal/tax-rate-modal.component';
import { FundtheoreticalRoutes } from './fund-theoretical.route';

import { SharedModule } from '../../shared.module';

const fundtheoreticalComponents = [
  FundTheoreticalComponent,
  DailyPnlComponent,
  FxRatesComponent,
  MarketPricesComponent,
  TaxRatesComponent,
  TaxRateModalComponent
];

@NgModule({
  declarations: [...fundtheoreticalComponents],
  exports: [],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    TooltipModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: 'Okay',
      firstDay: 1
    }),
    NgcatalystModule,
    RouterModule.forChild(FundtheoreticalRoutes),
    SharedModule
  ]
})
export class FundTheoreticalModule {}
