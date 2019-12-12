import { Component } from '@angular/core';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  costBasisReportActive = true;
  taxLotReportActive = false;
  dayPnLReportActive = false;
  bookmonReportActive = false;
  trialBalanceReportActive = false;

  style = Style;

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  tabChanged(e) {
    if (e.index === 0) {
      this.costBasisReportActive = true;
    }
    if (e.index === 1) {
      this.taxLotReportActive = true;
    }
    if (e.index === 2) {
      this.dayPnLReportActive = true;
    }
    if (e.index === 3) {
      this.bookmonReportActive = true;
    }
    if (e.index === 4) {
      this.trialBalanceReportActive = true;
    }
  }
}
