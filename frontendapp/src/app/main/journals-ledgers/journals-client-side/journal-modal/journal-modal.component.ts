/* Core/Libraries */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
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
  allAccounts: Account[];
  dummyAccount: Account;
  fromAccountCheck: number;
  toAccountCheck: number;
  selectedAsOfDate: { startDate: moment.Moment; endDate: moment.Moment };
  maxDate: any;

  isAsOfDateValid = false;
  valueTypes: { name: string; value: string }[] = [
    { name: 'Debit', value: 'debit' },
    { name: 'Credit', value: 'credit' }
  ];
  selectedRow: Journal;
  editJournal: boolean;
  commentId = 0;
  backdrop: any;
  isSaving = false;
  isDeleting = false;

  selectedAccountTo: string;
  accountTo: Account[] = [];
  selectedAccountToObj: Account;
  copyAccountToList: Account[] = [];

  selectedAccountFrom: string;
  accountFrom: Account[] = [];
  selectedAccountFromObj: Account;
  copyAccountFromList: Account[] = [];

  noResult = false;

  constructor(
    private toastrService: ToastrService,
    private journalApiService: JournalApiService,
    private financePocServiceProxy: FinanceServiceProxy,
    private accountApiService: AccountApiService
  ) {
    this.maxDate = moment();
  }

  ngOnInit() {
    this.getAccounts();
    this.getFunds();
    this.editJournal = false;
  }

  getAccounts() {
    this.accountApiService.getAllAccounts().subscribe(response => {
      if (response.isSuccessful) {
        this.allAccounts = response.payload.map(element => ({
          accountId: element.AccountId,
          name: element.AccountName,
          description: element.Description,
          typeId: element.TypeId,
          type: element.Type,
          categoryId: element.CategoryId,
          category: element.Category,
          hasJournal: element.HasJournal,
          canDeleted: element.CanDeleted,
          canEdited: element.CanEdited
        }));
        this.accountTo = this.allAccounts.filter(element => element.categoryId !== 0);
        this.accountFrom = this.allAccounts.filter(element => element.categoryId !== 0);
        this.copyAccountFromList = JSON.parse(JSON.stringify(this.accountFrom));
        this.copyAccountToList = JSON.parse(JSON.stringify(this.accountTo));
        this.dummyAccount = this.allAccounts.find(item => item.categoryId === 0);
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
    const journalObject = {
      fund: this.journalForm.value.fund,
      accountFrom:
        this.selectedAccountFromObj !== null
          ? {
              accountId: this.selectedAccountFromObj.accountId,
              entryType: this.journalForm.value.toAccountValueType === 'debit' ? 'credit' : 'debit',
              accountCategoryId: this.selectedAccountFromObj.categoryId,
              accountTypeId: this.selectedAccountFromObj.typeId
            }
          : {
              accountId: this.dummyAccount.accountId,
              entryType: this.journalForm.value.toAccountValueType === 'debit' ? 'credit' : 'debit',
              accountCategoryId: 0,
              accountTypeId: this.dummyAccount.typeId
            },
      accountTo: {
        accountId: this.selectedAccountToObj.accountId,
        entryType: this.journalForm.value.toAccountValueType,
        accountCategoryId: this.selectedAccountToObj.categoryId,
        accountTypeId: this.selectedAccountToObj.typeId
      },
      asOf: moment(this.journalForm.value.selectedAsOfDate.startDate).format('YYYY-MM-DD'),
      value: this.journalForm.value.value,
      commentId: this.commentId,
      comments: this.journalForm.value.comments
    };
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

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSelectAccountTo(event: TypeaheadMatch): void {
    this.selectedAccountToObj = event.item;
    this.accountFrom = this.accountFrom.filter(accountName => {
        return accountName.name !== event.value;
    });
  }

  accountToChange(event) {
    if (event == null || event === '') {
      this.selectedAccountTo = '';
      this.accountFrom = this.copyAccountFromList;
      this.selectedAccountToObj = null;
    }
  }

  accountFromChange(event) {
    if (event == null || event === '') {
      this.selectedAccountFrom = '';
      this.accountTo = this.copyAccountToList;
      this.selectedAccountFromObj = null;
    }
  }

  onSelectAccountFrom(event: TypeaheadMatch): void {
    this.selectedAccountFromObj = event.item;
    this.accountTo =  this.accountFrom.filter(accountName => {
      return accountName.name !== event.value;
  });
  }

  onToEntrySelect(event: Event) {
    this.journalForm.form.patchValue({
      fromAccountValueType:
        (event.target as HTMLSelectElement).value === 'debit' ? 'credit' : 'debit'
    });
  }

  trackByFn(index, item) {
    return item.accountId;
  }

  openModal(rowData) {
    if (Object.keys(rowData).length > 1) {
      this.editJournal = true;
      this.selectedRow = rowData;
      const { source, event } = rowData;
      if (event !== 'manual') {
        this.toastrService.error('Only User Generated Journals are Editable !');
        this.closeModal();
        return;
      }
      this.journalApiService.getJournal(source).subscribe(response => {
        if (response.isSuccessful) {
          const { Fund, AccountFrom, AccountTo, When, CommentId, Comment } = response.payload;
          this.commentId = CommentId;
          const journalAccountFrom: Account =
            AccountFrom !== null
              ? this.allAccounts.find(item => item.accountId === AccountFrom.AccountId)
              : null;
          const journalAccountTo: Account =
            AccountTo !== null
              ? this.allAccounts.find(item => item.accountId === AccountTo.AccountId)
              : null;

          this.selectedAccountTo = journalAccountTo.name;
          this.selectedAccountToObj = journalAccountTo;
          this.selectedAccountFrom = journalAccountFrom.name === "Dummy Type"? '' : journalAccountFrom.name;
          this.selectedAccountFromObj = journalAccountFrom;

          this.accountTo =  this.accountFrom.filter(accountName => {
            return accountName.name !== this.selectedAccountFrom;
          });

          this.accountFrom =  this.accountFrom.filter(accountName => {
          return accountName.name !== this.selectedAccountTo;
          });

          this.journalForm.form.patchValue({
            fund: Fund,
            fromAccount: journalAccountFrom,
            fromAccountValueType: AccountFrom !== null && AccountFrom.CreditDebit,
            toAccount: journalAccountTo,
            toAccountValueType: AccountTo !== null && AccountTo.CreditDebit,
            selectedAsOfDate: {
              startDate: moment(When, 'MM/DD/YYYY'),
              endDate: moment(When, 'MM/DD/YYYY')
            },
            value: Math.abs(AccountTo.Value),
            comments: Comment
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
    this.selectedAccountTo =  '';
    this.selectedAccountToObj = null;
    this.selectedAccountFrom = '';
    this.selectedAccountFromObj = null;

    this.journalForm.resetForm({
      fund: '',
      fromAccount: '',
      fromAccountValueType: '',
      toAccount: '',
      toAccountValueType: ''
    });
  }
}
