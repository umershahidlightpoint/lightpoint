import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/common/data.service';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss']
})
export class ReconciliationComponent implements OnInit {
  fundadminReconcileActive = true;
  dayPnLReconcileActive = false;
  bookmonReconcileActive = false;
  detailPnLToDateReportActive = false;
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

  activateFundAdminReconcile() {
    this.fundadminReconcileActive = true;
  }

  activateDayPnLReconcile() {
    this.dayPnLReconcileActive = true;
  }

  activateBookmonReconcile() {
    this.bookmonReconcileActive = true;
  }

  activateDetailPnLToDateReport() {
    this.detailPnLToDateReportActive = true;
  }
}
