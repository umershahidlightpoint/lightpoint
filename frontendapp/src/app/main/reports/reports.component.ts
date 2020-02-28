import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/common/data.service';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  costBasisReportActive = true;
  taxLotReportActive = false;
  trialBalanceReportActive = false;
  positionMarketValueAppraisalActive = false;
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

  constructor(private dataService: DataService) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }

  activateCostBasisReport() {
    this.costBasisReportActive = true;
  }

  activateTaxLotReport() {
    this.taxLotReportActive = true;
  }

  activateTrialBalanceReport() {
    this.trialBalanceReportActive = true;
  }

  activatePositionMarketValueAppraisalReport() {
    this.positionMarketValueAppraisalActive = true;
  }
}
