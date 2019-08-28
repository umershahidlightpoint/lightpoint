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
      console.log(response, 'response');
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

  public clearFilters() {
    this.fund = 'All Funds';
    // this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    // this.endDate = moment();
  }

  public ngModelChangeFund(e) {
    // this.fund = e;
    // this.journalGrid.api.onFilterChanged();
  }
}
