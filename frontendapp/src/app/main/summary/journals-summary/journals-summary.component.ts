import { Component, OnInit, OnDestroy } from '@angular/core';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GridId } from '../../../../shared/utils/AppEnums';
import { HeightStyle } from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-journals-summary',
  templateUrl: './journals-summary.component.html',
  styleUrls: ['./journals-summary.component.css']
})
export class JournalsSummaryComponent implements OnInit, OnDestroy {
  private columns: any;
  private rowData: any[] = [];

  gridLayout = 'Select a Layout';
  gridLayouts: string;
  isSubscriptionAlive: boolean;
  gridOptions: GridOptions;

  styleForHeight = HeightStyle(228);

  excelParams = {
    fileName: 'Journals Summary',
    sheetName: 'First Sheet'
  };

  constructor(private financeService: FinanceServiceProxy, private toastrService: ToastrService) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit(): void {
    this.getGridLayouts();
  }

  getGridLayouts(): void {
    this.financeService
      .getGridLayouts(GridId.journalsLedgersId, 1)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(
        response => {
          if (response.isSuccessful) {
            this.gridLayouts = response.payload.map(item => item.GridLayoutName);
          }
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
  }

  changeGridLayout(selectedGridLayout): void {}

  refreshGrid() {
    this.rowData = [];
    this.gridOptions.api.showLoadingOverlay();
  }

  ngOnDestroy(): void {
    this.isSubscriptionAlive = false;
  }
}
