import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Style } from 'src/shared/utils/Shared';
import { DataService } from 'src/services/common/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  costBasisReportActive = true;
  taxLotReportActive = false;
  dayPnLReportActive = false;
  bookmonReportActive = false;
  trialBalanceReportActive = false;
  hideGrid: boolean;

  style = Style;

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  tabs = [
    { heading: 'Cost Basis', selectTab: 'activeCostBasisReport()' },
    { heading: 'Tax Lots Open/Closed', selectTab: 'activeTaxLotReport()' },
    { heading: 'DayPnl Reconcile', selectTab: 'activeDayPnLReport()' },
    { heading: 'Bookmon Reconcile', selectTab: 'activeBookmonReport()' },
    { heading: 'Trial Balance', selectTab: 'activeTrialBalanceReport()' }
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.hideGrid = false;
    // this.router.navigateByUrl('/reports/cost-basis');
  }

  ngOnInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }

  tabIndex(index) {
    console.log('Index', index);
    switch (index) {
      case 0:
        this.router.navigateByUrl('./reports/cost-basis');
        break;
      case 1:
        this.router.navigateByUrl('/reports/taxlot');
        break;
      case 2:
        this.router.navigateByUrl('/reports/daily-pnl');
        break;
      case 3:
        this.router.navigateByUrl('/reports/bookmon-reconcile');
        break;
      case 4:
        this.router.navigateByUrl('/reports/trial-balance');
        break;
      default:
    }
  }

  activeCostBasisReport() {
    this.costBasisReportActive = true;
    // this.router.navigateByUrl('/reports');
  }

  activeTaxLotReport() {
    this.taxLotReportActive = true;
    // this.router.navigateByUrl('/reports/taxlot');
  }

  activeDayPnLReport() {
    this.dayPnLReportActive = true;
    // this.router.navigateByUrl('/reports/daily-pnl');
  }

  activeBookmonReport() {
    this.bookmonReportActive = true;
    // this.router.navigateByUrl('/reports/bookmon-reconcile');
  }

  activeTrialBalanceReport() {
    this.trialBalanceReportActive = true;
    // this.router.navigateByUrl('/reports/trial-balance');
  }
}
