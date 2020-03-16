import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalComponent, ModalFooterConfig } from 'lp-toolkit';
import { FinanceServiceProxy } from './../../../services/service-proxies';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-exclude-trade',
  templateUrl: './exclude-trade.component.html',
  styleUrls: ['./exclude-trade.component.scss']
})
export class ExcludeTradeComponent implements OnInit {

  @ViewChild('lpModal', { static: false }) lpModal: ModalComponent;
  @Output() refreshData = new EventEmitter<any>();

  constructor(private financeService: FinanceServiceProxy) { }

  ngOnInit() {
  }

  reason : string;
  lpOrderId : string;
  public isSaveState = true;
  public footerConfig: ModalFooterConfig = {
    showConfirmButton: true,
    confirmButtonText: 'Save',
    confirmButtonIcon: 'fa-save',
    confirmButtonDisabledState: false,
    confirmButtonLoadingState: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonIcon: 'fa-times',
    cancelButtonDisabledState: false,
    cancelButtonLoadingState: false,
    showDeleteButton: false,
    deleteButtonText: 'Delete',
    deleteButtonIcon: 'fa-trash',
    deleteButtonDisabledState: false,
    deleteButtonLoadingState: false
};

onClose() {
  this.resetForm();
}

onConfirm() {
    this.hideModal();
}

onCancel() {
}

onDelete() {
    this.hideModal();
}

showModal(lpOrderId) {
    this.lpOrderId = lpOrderId;
    this.lpModal.showModal();
}

hideModal() {
    this.resetForm();
    this.lpModal.hideModal();
}

resetForm(){
  this.lpOrderId = null;
  this.reason = null;
}

excludeTrade(){
  this.footerConfig = {
    confirmButtonDisabledState: true,
    confirmButtonLoadingState: true
  };
  let payload = {
    LpOrderId : this.lpOrderId,
    Reason: this.reason
  }
  this.financeService.excludeTrade(payload).subscribe( resp => {
    if(resp.statusCode === 200){
      this.footerConfig = {
        confirmButtonDisabledState: false,
        confirmButtonLoadingState: false
      };
      this.refreshData.emit(true);
      this.hideModal();
    } else {
      this.hideModal();
    }
  },err => {
    this.footerConfig = {
      confirmButtonDisabledState: false,
      confirmButtonLoadingState: false
    };
  })
}

}
