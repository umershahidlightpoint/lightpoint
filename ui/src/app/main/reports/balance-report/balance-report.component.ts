import { Component, OnInit, Input } from '@angular/core';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';

@Component({
  selector: 'app-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.scss']
})
export class BalanceReportComponent implements OnInit {
  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() isLoading = false;
  @Input() hideGrid: boolean;
  @Input() tableHeader: string;

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    height: 'calc(100vh - 320px)',
    boxSizing: 'border-box',
    overflow: 'overlay'
  };

  constructor() {}

  ngOnInit() {}
}
