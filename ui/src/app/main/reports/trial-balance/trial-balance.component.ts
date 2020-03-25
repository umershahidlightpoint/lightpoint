import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { ReportGridComponent } from '../report-grid/report-grid.component';
import { CacheService } from 'src/services/common/cache.service';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { GridName } from 'src/shared/utils/AppEnums';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import {
  Ranges,
  Style,
  HeightStyle,
  GetDateRangeLabel,
  SetDateRange,
  FormatNumber2,
  getRange
} from 'src/shared/utils/Shared';

@Component({
  selector: 'rep-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {
  @ViewChild('trialBalanceReportGrid', { static: false })
  private trialBalanceReportGrid: ReportGridComponent;

  fund: any = 'All Funds';
  funds: Fund;
  fundsRange: any;
  DateRangeLabel = '';
  startDate: any = '';
  endDate: any = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  maxDate: moment.Moment;
  journalMinDate: moment.Moment;
  title = 'Account Name';
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  externalFilters: any;
  hideGrid: boolean;
  isDataLoaded = false;

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
    private cdRef: ChangeDetectorRef,
    private cacheService: CacheService,
    private dataService: DataService,
    private financeService: FinanceServiceProxy,
    private reportsApiService: ReportsApiService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
    this.getExternalFilters();
  }

  ngOnInit() {
    this.maxDate = moment();
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
        this.initRanges();
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

  initRanges() {
    const payload = {
      GridName: GridName.journalsLedgers
    };
    this.cacheService.getServerSideJournalsMeta(payload).subscribe(result => {
      this.fundsRange = result.payload.FundsRange;
      this.journalMinDate = result.payload.JournalMinDate;
      this.ranges = getRange(this.getCustomFundRange());
      this.cdRef.detectChanges();
    });
  }

  getCustomFundRange(fund = 'All Funds') {
    const customRange: any = {};

    this.fundsRange.forEach(element => {
      if (fund === 'All Funds' && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      } else if (fund === element.fund && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      }
    });

    customRange.ITD = [moment(this.journalMinDate, 'YYYY-MM-DD'), moment()];

    return customRange;
  }

  getReport(toDate, fromDate, fund) {
    this.isDataLoaded = false;
    this.reportsApiService.getTrialBalanceReport(toDate, fromDate, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.payload.map(data => ({
        accountName: data.AccountName,
        AccountCategory: data.AccountCategory,
        AccountType: data.AccountType,
        AccountName: data.AccountName,
        credit: FormatNumber2(data.Credit),
        creditPercentage: data.CreditPercentage,
        debit: FormatNumber2(data.Debit),
        debitPercentage: data.DebitPercentage,
        balance: FormatNumber2(data.Balance)
      }));
      this.isDataLoaded = true;
    });
  }

  setDateRange(dateFilter: any) {
    const payload = {
      GridName: GridName.journalsLedgers
    };
    this.cacheService.getServerSideJournalsMeta(payload).subscribe(result => {
      this.journalMinDate = result.payload.JournalMinDate;
      let dates = [];
      if (dateFilter === 'ITD') {
        this.DateRangeLabel = 'ITD';
        dates = SetDateRange(dateFilter, this.journalMinDate, this.endDate);
      }
      dates = SetDateRange(dateFilter, this.startDate, this.endDate);
      this.startDate = dates[0];
      this.endDate = dates[1];

      this.selected =
        dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    });
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  rangeClicked(range) {
    this.DateRangeLabel = '';
    this.DateRangeLabel = range.label;
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      this.DateRangeLabel = '';
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    // this.getRangeLabel();
    this.getExternalFilters();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;

    this.ranges = getRange(this.getCustomFundRange(selectedFund));
    this.cdRef.detectChanges();
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
