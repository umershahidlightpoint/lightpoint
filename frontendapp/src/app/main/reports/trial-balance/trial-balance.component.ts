import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FinanceServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { DataService } from '../../../../shared/common/data.service';
import * as moment from 'moment';
import {
  Ranges,
  Style,
  HeightStyle,
  GetDateRangeLabel,
  SetDateRange,
  FormatNumber
} from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { ReportGridComponent } from '../report-grid/report-grid.component';

@Component({
  selector: 'rep-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {
  @ViewChild('trialBalanceReportGrid',{ static: false })
  private trialBalanceReportGrid: ReportGridComponent;

  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel = '';
  startDate: any = '';
  endDate: any = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  title = 'Account Name';
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  isDataLoaded = false;
  externalFilters: any;
  hideGrid: boolean;

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinanceServiceProxy,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
    this.getExternalFilters();
  }

  ngOnInit() {
    this.getFunds();
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
        this.getReport(null, null, 'ALL');
      }
    });
  }

  getFunds() {
    this.financeService.getFunds().subscribe(result => {
      this.funds = result.payload.map(item => ({
        fundId: item.FundId,
        fundCode: item.FundCode
      }));
    });
  }

  getReport(toDate, fromDate, fund) {
    this.isDataLoaded = false;
    this.financeService.getTrialBalanceReport(toDate, fromDate, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.payload.map(data => ({
        accountName: data.AccountName,
        credit: FormatNumber(data.Credit),
        creditPercentage: data.CreditPercentage,
        debit: FormatNumber(data.Debit),
        debitPercentage: data.DebitPercentage,
        balance: FormatNumber(data.Balance)
      }));
      this.isDataLoaded = true;
    });
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getRangeLabel();
    this.getExternalFilters();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getExternalFilters();
  }

  getExternalFilters() {
    this.externalFilters = {
      fundFilter: this.fund,
      dateFilter:
        this.DateRangeLabel !== ''
          ? this.DateRangeLabel
          : {
              startDate: this.startDate !== null ? this.startDate : '',
              endDate: this.endDate !== null ? this.endDate : ''
            }
    };
  }

  isExternalFilterPassed(object) {
    const { fundFilter, dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.setDateRange(dateFilter);
    this.startDate = this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : null;
    this.endDate = this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : null;
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selected = null;
    this.DateRangeLabel = '';
    this.startDate = '';
    this.endDate = '';
    this.getReport(null, null, 'ALL');
  }

  onBtExport() {
    const params = {
      fileName: 'Trial Balance Reports',
      sheetName: 'First Sheet'
    };
    this.trialBalanceReportGrid.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  refreshReport() {
    this.trialBalanceReportGrid.gridOptions.api.showLoadingOverlay();
    this.clearFilters();
    this.getReport(null, null, 'ALL');
  }
}
