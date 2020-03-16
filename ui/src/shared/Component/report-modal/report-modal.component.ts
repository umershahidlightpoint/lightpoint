import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from "src/shared/Models/trial-balance";
import { ModalDirective } from "ngx-bootstrap";
import { HeightStyle } from "src/shared/utils/Shared";

@Component({
  selector: "app-report-modal",
  templateUrl: "./report-modal.component.html",
  styleUrls: ["./report-modal.component.scss"]
})
export class ReportModalComponent implements OnInit {
  @ViewChild("modal", { static: false }) modal: ModalDirective;
  @Input() title: string;
  @Input() tableHeader: string;

  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  isLoading = false;
  hideGrid: boolean;
  backdrop: any;

  styleForHeight = HeightStyle(220);

  containerDiv = {
    borderLeft: "1px solid #cecece",
    borderRight: "1px solid #cecece",
    width: "100%",
    boxSizing: "border-box",
    overflow: "overlay"
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
