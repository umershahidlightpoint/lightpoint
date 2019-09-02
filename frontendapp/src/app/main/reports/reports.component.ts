import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LogsComponent } from '../logs/logs.component';
import { Fund } from '../../../shared/Models/account';
import { TrialBalanceReport, TrialBalanceReportStats } from '../../../shared/Models/trial-balance';
import { DataService } from '../../../shared/common/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLable: string;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  hideGrid: boolean;
  isLoading: boolean = false;

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
    height: 'calc(100vh - 200px)',
    boxSizing: 'border-box'
  };

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    height: 'calc(100vh - 320px)',
    boxSizing: 'border-box',
    overflow: 'overlay'
  };

  // Mock Data for Trial Balance Report to Check Scrolling
  reports = {
    data: [
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Settled Activity ) -- ',
        debit: 7911275.262161168,
        credit: 0,
        debitPercentage: 100.00000331376634,
        creditPercentage: 0
      },
      {
        accountName: 'SHORT POSITIONS-COST -- ',
        debit: 0,
        credit: 3709872.56895135,
        debitPercentage: 0,
        creditPercentage: 46.893485170865
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      },
      {
        accountName: 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity ) -- ',
        debit: 4201402.693209818,
        credit: 0,
        debitPercentage: 53.10651814290134,
        creditPercentage: 0
      },
      {
        accountName: 'LONG POSITIONS AT COST -- ',
        debit: 0,
        credit: 198996266.7667359,
        debitPercentage: 0,
        creditPercentage: 4.7930583828192335
      }
    ],
    stats: {
      totalDebit: -4151759704.181762,
      totalCredit: 4151759709.181762
    }
  };

  constructor(private financeService: FinancePocServiceProxy, private dataService: DataService) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.getFunds();
    this.getReport(null, null, 'ALL');
  }

  ngAfterViewInit(): void {
    this.dataService.flag.subscribe(obj => {
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
    this.isLoading = true;
    this.financeService.getTrialBalanceReport(toDate, fromDate, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.data.map(data => ({
        accountName: data.AccountName,
        credit: data.Credit,
        creditPercentage: data.CreditPercentage,
        debit: data.Debit,
        debitPercentage: data.DebitPercentage
      }));
      this.isLoading = false;
    });
  }

  getRangeLabel() {
    this.DateRangeLable = '';
    if (
      moment('01-01-1901', 'MM-DD-YYYY').diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'ITD';
      return;
    }
    if (
      moment()
        .startOf('year')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'YTD';
      return;
    }
    if (
      moment()
        .startOf('month')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'MTD';
      return;
    }
    if (moment().diff(this.startDate, 'days') === 0 && moment().diff(this.endDate, 'days') === 0) {
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
    this.getReport(null, null, 'ALL');
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
  }

  refreshReport() {
    this.clearFilters();
  }
}
