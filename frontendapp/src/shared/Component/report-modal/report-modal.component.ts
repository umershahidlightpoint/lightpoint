import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnInit {
  
  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() isLoading = false;
  @Input() hideGrid: boolean;
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  @Input() title: string = 'Data Details';
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

  constructor() { }

  ngOnInit() {
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

}
