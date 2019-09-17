import { Component, OnInit, Input } from '@angular/core';
import { TrialBalanceReport, TrialBalanceReportStats } from '../../../../shared/Models/trial-balance';


@Component({
  selector: 'app-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.css']
})
export class BalanceReportComponent implements OnInit {

  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() isLoading = false;
  @Input() hideGrid: boolean;

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

  constructor() { }

  ngOnInit() {
  }

}
