import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalDirective;
  @Input() title: string;
  @Input() tableHeader: string;

  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  isLoading = false;
  hideGrid: boolean;
  backdrop: any;

  styleForHight = {
    width: '100%',
    boxSizing: 'border-box'
  };

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'overlay'
  };

  constructor() {}

  ngOnInit() {}

  openModal(payload: any) {
    this.trialBalanceReport = payload.data;
    this.trialBalanceReportStats = payload.stats;
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }
}