import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { FinancePocServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tax-rate-modal',
  templateUrl: './tax-rate-modal.component.html',
  styleUrls: ['./tax-rate-modal.component.css']
})
export class TaxRateModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  taxRates: Array<object>;
  selectedDate = null;
  longTermTaxRate: number = 0;
  shortTermTaxRate: number = 0;
  shortTermPeriod: number = 365;
  editTaxRate: boolean;
  isSubscriptionAlive: boolean;
  backdrop: any;

  constructor(
    private toastrService: ToastrService,
    private financePocServiceProxy: FinancePocServiceProxy
  ) {}

  ngOnInit() {
    this.getTaxRates();
    this.editTaxRate = false;
    this.isSubscriptionAlive = true;
  }

  getTaxRates() {}

  changeDate(date) {
    this.selectedDate = date;
  }

  saveTaxRate() {
    // const journalObject = {
    //   accountFrom: this.journalForm.value.fromAccount,
    //   accountTo: this.journalForm.value.toAccount,
    //   value: this.journalForm.value.value,
    //   fund: this.journalForm.value.fund
    // };
    // if (this.editJournal) {
    //   const { source } = this.selectedRow;
    //   this.financePocServiceProxy
    //     .updateJournal(source, journalObject)
    //     .pipe(takeWhile(() => this.isSubscriptionAlive))
    //     .subscribe(response => {
    //       if (response.isSuccessful) {
    //         this.toastrService.success('Journal is updated successfully !');
    //         this.modal.hide();
    //         this.modalClose.emit(true);
    //         setTimeout(() => this.clearForm(), 500);
    //       } else {
    //         this.toastrService.error('Failed to update Journal !');
    //       }
    //     });
    // } else {
    //   this.financePocServiceProxy.createJounal(journalObject).subscribe(response => {
    //     if (response.isSuccessful) {
    //       this.toastrService.success('Journal is created successfully !');
    //       this.modal.hide();
    //       this.modalClose.emit(true);
    //       setTimeout(() => this.clearForm(), 500);
    //     } else {
    //       this.toastrService.error('Failed to create Journal !');
    //     }
    //   });
    // }
  }

  deleteTaxRate() {}

  openModal(rowData) {
    if (Object.keys(rowData).length > 1) {
      this.editTaxRate = true;
      // this.selectedRow = rowData;
      // const { source } = rowData;
      // const { modifiable } = rowData;
      // if (modifiable === 'false') {
      //   this.toastrService.error('System Generated Journals are not Editable !');
      //   this.closeModal();
      //   return;
      // }
      // this.financePocServiceProxy
      //   .getJournal(source)
      //   .pipe(takeWhile(() => this.isSubscriptionAlive))
      //   .subscribe(response => {
      //     if (response.isSuccessful) {
      //       const { JournalAccounts } = response.payload[0];
      //       const fromAccount = JournalAccounts[0];
      //       const toAccount = JournalAccounts[1];
      //       this.fromAccountId = fromAccount.AccountFromId;
      //       this.toAccountId = toAccount.AccountToId;
      //       this.accountFund = response.payload[0].Fund;
      //       this.journalForm.patchValue({
      //         value: toAccount.Value,
      //         fromAccount: this.fromAccountId,
      //         toAccount: this.toAccountId,
      //         fund: this.accountFund
      //       });
      //     } else {
      //       this.toastrService.error('Something went wrong!');
      //     }
      //   });
    } else {
      
    }
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
  }

  clearForm() {
    this.editTaxRate = false;
    this.selectedDate = null;
    this.longTermTaxRate = 0;
    this.shortTermTaxRate = 0;
    this.shortTermPeriod = 365;
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
