/* Core/Libraries */
import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

/* Services/Components */
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridRowData, Fund } from '../../../../shared/Models/account';
import { Journal } from '../../../../shared/Models/journal';

@Component({
  selector: 'app-journal-modal',
  templateUrl: './journal-modal.component.html',
  styleUrls: ['./journal-modal.component.css']
})
export class JournalModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  allAccounts: GridRowData;
  funds: Fund;
  toAccountCheck: number;
  fromAccountCheck: number;
  toAccountId: number;
  fromAccountId: number;
  accountFund: string;
  selectedRow: Journal;
  editJournal: boolean;
  isSubscriptionAlive: boolean;
  journalForm: FormGroup;
  backdrop: any;

  constructor(
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private financePocServiceProxy: FinancePocServiceProxy
  ) {}

  ngOnInit() {
    this.getAccounts();
    this.getFunds();
    this.buildForm();
    this.editJournal = false;
    this.isSubscriptionAlive = true;
  }

  getAccounts() {
    this.financePocServiceProxy
      .getAllAccounts()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.allAccounts = response.payload;
        }
      });
  }

  getFunds() {
    this.financePocServiceProxy
      .getFunds()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.payload) {
          this.funds = response.payload;
        }
      });
  }

  buildForm() {
    this.journalForm = this.formBuilder.group({
      fund: ['Select fund type', Validators.required],
      fromAccount: ['0', Validators.required],
      toAccount: ['0', Validators.required],
      value: ['', Validators.required]
    });
  }

  saveJournal() {
    const journalObject = {
      accountFrom: this.journalForm.value.fromAccount,
      accountTo: this.journalForm.value.toAccount,
      value: this.journalForm.value.value,
      fund: this.journalForm.value.fund
    };
    if (this.editJournal) {
      const { source } = this.selectedRow;
      this.financePocServiceProxy
        .updateJournal(source, journalObject)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.isSuccessful) {
            this.toastrService.success('Journal is updated successfully !');
            this.modal.hide();
            this.modalClose.emit(true);
            setTimeout(() => this.clearForm(), 500);
          } else {
            this.toastrService.error('Failed to update Journal !');
          }
        });
    } else {
      this.financePocServiceProxy.createJounal(journalObject).subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Journal is created successfully !');
          this.modal.hide();
          this.modalClose.emit(true);
          setTimeout(() => this.clearForm(), 500);
        } else {
          this.toastrService.error('Failed to create Journal !');
        }
      });
    }
  }

  deleteJournal() {
    const { source } = this.selectedRow;
    this.financePocServiceProxy
      .deleteJournal(source)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Journal is deleted successfully!');
          this.modal.hide();
          this.modalClose.emit(true);
          setTimeout(() => this.clearForm(), 500);
        } else {
          this.toastrService.error('Failed to delete Journal!');
        }
      });
  }

  onAccountSelect() {
    this.toAccountCheck = this.journalForm.value.toAccount;
    this.fromAccountCheck = this.journalForm.value.fromAccount;
  }

  trackByFn(index, item) {
    return item.AccountId;
  }

  openModal(rowData) {
    if (Object.keys(rowData).length > 1) {
      this.editJournal = true;
      this.selectedRow = rowData;
      const { source } = rowData;
      const { modifiable } = rowData;
      if (modifiable === 'false') {
        this.toastrService.error('System Generated Journals are not Editable !');
        this.closeModal();
        return;
      }
      this.financePocServiceProxy
        .getJournal(source)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.isSuccessful) {
            const { JournalAccounts } = response.payload[0];
            const fromAccount = JournalAccounts[0];
            const toAccount = JournalAccounts[1];
            this.fromAccountId = fromAccount.AccountFromId;
            this.toAccountId = toAccount.AccountToId;
            this.accountFund = response.payload[0].Fund;
            this.journalForm.patchValue({
              value: toAccount.Value,
              fromAccount: this.fromAccountId,
              toAccount: this.toAccountId,
              fund: this.accountFund
            });
          } else {
            this.toastrService.error('Something went wrong!');
          }
        });
    } else {
      this.buildForm();
    }
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
  }

  clearForm() {
    this.editJournal = false;
    this.toAccountCheck = null;
    this.fromAccountCheck = null;
    this.journalForm.reset();
    this.buildForm();
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
