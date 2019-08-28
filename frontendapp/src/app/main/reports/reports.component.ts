import { Component, OnInit, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LogsComponent } from '../logs/logs.component';
import { TrialBalanceReport, TrialBalanceReportStats } from '../../../shared/Models/trial-balance';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  fund: any = 'All Funds';
  funds: any;
  DateRangeLable: any;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;

  @ViewChild('app-logs') journalsLedgers: LogsComponent;

  ranges: any = {
    ITD: [moment('01-01-1901', 'MM-DD-YYYY'), moment()],
    YTD: [moment().startOf('year'), moment()],
    MTD: [moment().startOf('month'), moment()],
    Today: [moment(), moment()]
  };

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 185px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    height: 'calc(100vh - 285px)',
    boxSizing: 'border-box',
    overflow: 'auto'
  };

  constructor(private financeService: FinancePocServiceProxy) {}

  ngOnInit() {
    this.getFunds();
    this.getReport(null, 'ALL');
  }

  getFunds() {
    this.financeService.getFunds().subscribe(result => {
      this.funds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
    });
  }

  getReport(date, fund) {
    this.financeService.getTrialBalanceReport(date, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.data.map(data => ({
        accountName: data.AccountName,
        credit: data.Credit,
        creditPercentage: data.CreditPercentage,
        debit: data.Debit,
        debitPercentage: data.DebitPercentage
      }));
    });
  }

  getRangeLable() {
    this.DateRangeLable = '';
    if (
      moment('01-01-1901', 'MM-DD-YYYY').diff(this.startDate, 'days') == 0 &&
      moment().diff(this.endDate, 'days') == 0
    ) {
      this.DateRangeLable = 'ITD';
      return;
    }
    if (
      moment()
        .startOf('year')
        .diff(this.startDate, 'days') == 0 &&
      moment().diff(this.endDate, 'days') == 0
    ) {
      this.DateRangeLable = 'YTD';
      return;
    }
    if (
      moment()
        .startOf('month')
        .diff(this.startDate, 'days') == 0 &&
      moment().diff(this.endDate, 'days') == 0
    ) {
      this.DateRangeLable = 'MTD';
      return;
    }
    if (moment().diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0) {
      this.DateRangeLable = 'Today';
      return;
    }
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selected = null;
    this.DateRangeLable = '';
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
  }

  public ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getRangeLable();
  }

  ngModelChangeFund(e) {
    this.fund = e;
  }
}
