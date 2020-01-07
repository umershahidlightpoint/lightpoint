/* Core/Libraries */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
/* Services/Components */
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { JournalApiService } from 'src/services/journal-api.service';
import { AccountApiService } from 'src/services/account-api.service';
import { Journal } from '../../../../../shared/Models/journal';
import { Account, Fund } from '../../../../../shared/Models/account';

@Component({
  selector: 'app-journal-modal',
  templateUrl: './journal-modal.component.html',
  styleUrls: ['./journal-modal.component.css']
})
export class JournalModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('journalForm', { static: true }) journalForm: NgForm;
  @Output() modalClose = new EventEmitter<any>();

  funds: Fund;
  allAccounts: Account;
  fromAccountCheck: number;
  fromAccountEntryType: string;
  toAccountCheck: number;
  selectedAsOfDate: { startDate: moment.Moment; endDate: moment.Moment };
  isAsOfDateValid = false;
  valueTypes = ['Debit', 'Credit'];
  selectedRow: Journal;
  editJournal: boolean;
  backdrop: any;
  isSaving = false;
  isDeleting = false;

  constructor(
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private journalApiService: JournalApiService,
    private financePocServiceProxy: FinanceServiceProxy,
    private accountApiService: AccountApiService
  ) {}

  ngOnInit() {
    this.getAccounts();
    this.getFunds();
    this.editJournal = false;
  }

  getAccounts() {
    this.accountApiService.getAllAccounts().subscribe(response => {
      if (response.isSuccessful) {
        this.allAccounts = response.payload;
      }
    });
  }

  getFunds() {
    this.financePocServiceProxy.getFunds().subscribe(response => {
      if (response.payload) {
        this.funds = response.payload;
      }
    });
  }

  onDatesChanged(selectedDate) {
    if (selectedDate) {
      this.isAsOfDateValid = selectedDate.startDate !== null;
    }
  }

  saveJournal() {
    this.isSaving = true;
    console.log(this.journalForm, ':: FORM');
    const journalObject = {
      fund: this.journalForm.value.fund,
      ...(this.journalForm.value.fromAccount !== '' && {
        accountFrom: {
          accountId: this.journalForm.value.fromAccount,
          entryType: this.journalForm.value.fromAccountValueType
        }
      }),
      accountTo: {
        accountId: this.journalForm.value.toAccount,
        entryType: this.journalForm.value.toAccountValueType
      },
      asOf: moment(this.journalForm.value.selectedAsOfDate.startDate).format('YYYY-MM-DD'),
      value: this.journalForm.value.value,
      comments: this.journalForm.value.comments
    };
    console.log('PAYLOAD ::', journalObject);
    if (this.editJournal) {
      const { source } = this.selectedRow;
      this.journalApiService.updateJournal(source, journalObject).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Journal is updated successfully !');
            this.modal.hide();
            this.modalClose.emit(true);
            setTimeout(() => this.clearForm(), 500);
          } else {
            this.toastrService.error('Failed to update Journal !');
          }

          this.isSaving = false;
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
          this.isSaving = false;
        }
      );
    } else {
      this.journalApiService.createJounal(journalObject).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Journal is created successfully !');
            this.modal.hide();
            this.modalClose.emit(true);
            setTimeout(() => this.clearForm(), 500);
          } else {
            this.toastrService.error('Failed to create Journal !');
          }

          this.isSaving = false;
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
          this.isSaving = false;
        }
      );
    }
  }

  deleteJournal() {
    this.isDeleting = true;
    const { source } = this.selectedRow;

    this.journalApiService.deleteJournal(source).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Journal is deleted successfully!');
          this.modal.hide();
          this.modalClose.emit(true);
          setTimeout(() => this.clearForm(), 500);
        } else {
          this.toastrService.error('Failed to delete Journal!');
        }

        this.isDeleting = false;
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
        this.isDeleting = false;
      }
    );
  }

  onAccountSelect() {
    this.toAccountCheck = this.journalForm.value.toAccount;
    this.fromAccountCheck = this.journalForm.value.fromAccount;
  }

  onToEntrySelect(event) {
    this.fromAccountEntryType = event.target.value;
  }

  trackByFn(index, item) {
    return item.AccountId;
  }

  openModal(rowData) {
    if (Object.keys(rowData).length > 1) {
      console.log('ROW DATA ::', rowData);
      this.editJournal = true;
      this.selectedRow = rowData;
      const { source } = rowData;
      const { modifiable } = rowData;
      if (modifiable === 'false') {
        this.toastrService.error('System Generated Journals are not Editable !');
        this.closeModal();
        return;
      }
      this.journalApiService.getJournal(source).subscribe(response => {
        if (response.isSuccessful) {
          console.log('RESPONSE :: ', response);
          const { Fund, AccountFrom, AccountTo, When } = response.payload;
          this.journalForm.form.patchValue({
            fund: Fund,
            fromAccount: AccountFrom !== null && AccountFrom.AccountId,
            toAccount: AccountTo !== null && AccountTo.AccountId,
            selectedAsOfDate: {
              startDate: moment(When, 'MM/DD/YYYY'),
              endDate: moment(When, 'MM/DD/YYYY')
            },
            value: AccountFrom !== null ? AccountFrom.Value : AccountTo.Value
          });
        } else {
          this.toastrService.error('Something went wrong!');
        }
      });
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
    this.journalForm.resetForm({
      fund: '',
      fromAccount: '',
      fromAccountValueType: '',
      toAccount: '',
      toAccountValueType: ''
    });
  }
}
