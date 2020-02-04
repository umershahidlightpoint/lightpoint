/* Core/Libraries */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import * as moment from 'moment';
/* Services/Components */
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { JournalApiService } from 'src/services/journal-api.service';
import { AccountApiService } from 'src/services/account-api.service';
import { Journal, JournalAccount } from '../../../../../shared/Models/journal';
import { Fund, AccountCategory, Account } from '../../../../../shared/Models/account';

@Component({
  selector: 'app-journal-modal',
  templateUrl: './journal-modal.component.html',
  styleUrls: ['./journal-modal.component.scss']
})
export class JournalModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('journalForm', { static: true }) journalForm: NgForm;
  @Output() modalClose = new EventEmitter<any>();

  funds: Fund;

  valueTypes: { name: string; value: string }[] = [
    { name: 'Debit', value: 'debit' },
    { name: 'Credit', value: 'credit' }
  ];

  toAccountCategories: AccountCategory[];
  selectedToAccountCategory: AccountCategory;
  toAccountTypes: AccountCategory[];
  selectedToAccountType: AccountCategory;

  fromAccountCategories: AccountCategory[];
  selectedFromAccountCategory: AccountCategory;
  fromAccountTypes: AccountCategory[];
  selectedFromAccountType: AccountCategory;

  dummyAccountCategory: any;
  dummyAccountType: any;

  symbols: any = [];
  currencies: string[] = ['USD'];

  selectedAsOfDate: { startDate: moment.Moment; endDate: moment.Moment };

  allAccounts: Account[];
  dummyAccount: Account;
  fromAccountCheck: number;
  toAccountCheck: number;

  selectedRow: {
    source?: string;
    when?: Date;
    balance?: number;
    event?: string;
    AccountType?: string;
  } = {
    balance: 0
  };
  selectedJournal: Journal;

  backdrop: any;
  maxDate: moment.Moment;
  isAsOfDateValid = false;
  noResult = false;
  editJournal: boolean;
  contraEntryMode = false;
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

  constructor(
    private toastrService: ToastrService,
    private financePocServiceProxy: FinanceServiceProxy,
    private journalApiService: JournalApiService,
    private accountApiService: AccountApiService
  ) {}

  ngOnInit() {
    this.getFunds();
    this.getAccountCategories();
    this.getSymbols();
    this.getAccounts();
    this.editJournal = false;
    this.maxDate = moment();
  }

  getFunds() {
    this.financePocServiceProxy.getFunds().subscribe(response => {
      if (response.payload) {
        this.funds = response.payload;
      }
    });
  }

  getAccountCategories() {
    this.accountApiService.accountCategories().subscribe(response => {
      if (response.isSuccessful) {
        this.toAccountCategories = response.payload.map(element => {
          if (element.Name !== 'Dummy') {
            return { id: element.Id, name: element.Name };
          }
        });
        this.fromAccountCategories = response.payload.map(element => {
          if (element.Name !== 'Dummy') {
            return { id: element.Id, name: element.Name };
          }
        });

        this.dummyAccountCategory = response.payload.find(item => item.Name === 'Dummy');
        this.getAccountTypes(this.dummyAccountCategory.Id, 'dummy');
      } else {
        this.toastrService.error('Failed to fetch account categories!');
      }
    });
  }

  getAccountTypes(accountCategoryId: number, entryType: string) {
    this.accountApiService.accountTypes(accountCategoryId).subscribe(response => {
      if (response.isSuccessful) {
        if (entryType === 'to') {
          this.toAccountTypes = response.payload.map(element => ({
            id: element.Id,
            name: element.Name
          }));
        } else if (entryType === 'from') {
          this.fromAccountTypes = response.payload.map(element => ({
            id: element.Id,
            name: element.Name
          }));
        } else if (entryType === 'dummy') {
          this.dummyAccountType = response.payload.find(item => item.Name === 'Dummy Type');
        }
      } else {
        this.toastrService.error('Failed to fetch account categories!');
      }
    });
  }

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(data => {
      this.symbols = data.payload.map(item => item.symbol);
    });
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
        this.dummyAccount = this.allAccounts.find(item => item.categoryId === 0);

        this.copyAccountFromList = JSON.parse(JSON.stringify(this.accountFrom));
        this.copyAccountToList = JSON.parse(JSON.stringify(this.accountTo));
      }
    });
  }

  saveJournal() {
    // this.isSaving = true;

    const journalPayload = this.getPayload();
    console.log('JOURNAL PAYLOAD', journalPayload);

    // if (this.editJournal) {
    //   const { source } = this.selectedRow;

    //   this.journalApiService.updateJournal(source, journalPayload).subscribe(
    //     response => {
    //       if (response.isSuccessful) {
    //         this.toastrService.success('Journal is updated successfully !');

    //         this.modal.hide();
    //         this.modalClose.emit(true);

    //         setTimeout(() => this.clearForm(), 500);
    //       } else {
    //         this.toastrService.error('Failed to update Journal !');
    //       }

    //       this.isSaving = false;
    //     },
    //     error => {
    //       this.toastrService.error('Something went wrong. Try again later!');

    //       this.isSaving = false;
    //     }
    //   );
    // } else {
    //   this.journalApiService.createJounal(journalPayload).subscribe(
    //     response => {
    //       if (response.isSuccessful) {
    //         this.toastrService.success('Journal is created successfully !');

    //         this.modal.hide();
    //         this.modalClose.emit(true);

    //         setTimeout(() => this.clearForm(), 500);
    //       } else {
    //         this.toastrService.error('Failed to create Journal !');
    //       }

    //       this.isSaving = false;
    //     },
    //     error => {
    //       this.toastrService.error('Something went wrong. Try again later!');

    //       this.isSaving = false;
    //     }
    //   );
    // }
  }

  getPayload() {
    const {
      fund,
      toAccountValueType,
      toAccountCategory,
      toAccountType,
      toAccountSymbol,
      toAccountCurrency,
      fromAccountCategory,
      fromAccountType,
      fromAccountSymbol,
      fromAccountCurrency,
      selectedAsOfDate,
      value,
      comments
    } = this.journalForm.value;

    return {
      fund,
      accountTo: {
        ...(this.editJournal && {
          journalId: this.selectedJournal.AccountTo.JournalId
        }),
        entryType: toAccountValueType,
        accountCategoryId: this.selectedToAccountCategory.id,
        accountTypeId: this.selectedToAccountType.id,
        accountCategory: toAccountCategory,
        accountType: toAccountType,
        accountSymbol: toAccountSymbol,
        accountCurrency: toAccountCurrency
      },
      accountFrom: fromAccountCategory
        ? {
            ...(this.editJournal &&
              !this.contraEntryMode && {
                journalId: this.selectedJournal.AccountFrom.JournalId
              }),
            entryType: this.getEntryType(),
            accountCategoryId: this.selectedFromAccountCategory.id,
            accountTypeId: this.selectedFromAccountType.id,
            accountCategory: fromAccountCategory,
            accountType: fromAccountType,
            accountSymbol: fromAccountSymbol,
            accountCurrency: fromAccountCurrency
          }
        : {
            ...(this.editJournal &&
              !this.contraEntryMode && {
                journalId: this.selectedJournal.AccountFrom.JournalId
              }),
            accountId: this.dummyAccount.accountId,
            entryType: this.getEntryType(),
            accountCategoryId: this.dummyAccountCategory.Id,
            accountTypeId: this.dummyAccountType.Id,
            accountCategory: this.dummyAccountCategory.Name,
            accountType: this.dummyAccountType.Name,
            accountSymbol: '',
            accountCurrency: ''
          },
      asOf: moment(selectedAsOfDate.startDate).format('YYYY-MM-DD'),
      value: this.contraEntryMode ? this.selectedRow.balance * -1 : value,
      ...(this.editJournal && { commentId: this.selectedJournal.CommentId }),
      comments,
      contraEntryMode: this.contraEntryMode
    };
  }

  getEntryType() {
    return this.journalForm.value.toAccountValueType === 'debit' ? 'credit' : 'debit';
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

  onToAccountCategorySelected(event: TypeaheadMatch): void {
    this.selectedToAccountCategory = event.item;
    this.getAccountTypes(event.item.id, 'to');
  }

  onFromAccountCategorySelected(event: TypeaheadMatch): void {
    this.selectedFromAccountCategory = event.item;
    this.getAccountTypes(event.item.id, 'from');
  }

  onToAccountTypeSelected(event: TypeaheadMatch): void {
    this.selectedToAccountType = event.item;
  }

  onFromAccountTypeSelected(event: TypeaheadMatch): void {
    this.selectedFromAccountType = event.item;
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

  onSelectAccountTo(event: TypeaheadMatch): void {
    this.selectedAccountToObj = event.item;
    this.accountFrom = this.accountFrom.filter(accountName => {
      return accountName.name !== event.value;
    });
  }

  onSelectAccountFrom(event: TypeaheadMatch): void {
    this.selectedAccountFromObj = event.item;
    this.accountTo = this.accountFrom.filter(accountName => {
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

  onDatesChanged(selectedDate) {
    if (selectedDate) {
      this.isAsOfDateValid = selectedDate.startDate != null;
    }
  }

  openModal(rowData = {} as any, contraEntryMode = false) {
    if (this.isEditMode(rowData, contraEntryMode)) {
      this.editJournal = true;
      this.selectedRow = rowData;
      const { source, event } = this.selectedRow;

      if (event !== 'manual') {
        this.closeModal();
        this.toastrService.error('Only User Generated Journals are Editable !');

        return;
      }

      this.journalApiService.getJournal(source).subscribe(response => {
        if (response.isSuccessful) {
          this.selectedJournal = response.payload;
          const { Fund, Symbol, AccountFrom, AccountTo, When, Comment } = this.selectedJournal;
          this.selectedRow.balance = AccountTo.Value;

          this.setContraEntryMode(AccountFrom);
          const { fromAccount, toAccount } = this.setAccountsValue(AccountFrom, AccountTo);

          this.accountTo = this.accountFrom.filter(accountName => {
            return accountName.name !== this.selectedAccountFrom;
          });

          this.accountFrom = this.accountFrom.filter(accountName => {
            return accountName.name !== this.selectedAccountTo;
          });

          this.setFormValues(
            Fund,
            Symbol,
            fromAccount,
            AccountFrom != null ? AccountFrom.CreditDebit : null,
            toAccount,
            AccountTo.CreditDebit,
            When,
            AccountTo.Value,
            Comment
          );
        } else {
          this.toastrService.error('Something went wrong!');
        }
      });
    } else if (contraEntryMode) {
      this.contraEntryMode = true;

      this.selectedRow = rowData;
      const { when, balance, AccountType } = this.selectedRow;

      const accountTo: Account = this.allAccounts.find(element => element.type === AccountType);
      this.selectedAccountTo = accountTo.categoryId !== 0 ? accountTo.name : '';
      this.selectedAccountToObj = accountTo;

      this.setFormValues(
        this.funds[0].FundCode,
        null,
        null,
        null,
        accountTo,
        this.valueTypes[0].value,
        when,
        balance,
        'A Contra Journal Entry!'
      );
    }

    this.modal.show();
  }

  setAccountsValue(AccountFrom: any, AccountTo: any): { fromAccount: Account; toAccount: Account } {
    const fromAccountJournal: Account =
      AccountFrom != null
        ? this.allAccounts.find(item => item.accountId === AccountFrom.AccountId)
        : null;
    const toAccountJournal: Account =
      AccountTo != null
        ? this.allAccounts.find(item => item.accountId === AccountTo.AccountId)
        : null;

    this.selectedAccountFrom =
      fromAccountJournal != null && fromAccountJournal.categoryId !== 0
        ? fromAccountJournal.name
        : '';
    this.selectedAccountFromObj = fromAccountJournal;
    this.selectedAccountTo = toAccountJournal.name;
    this.selectedAccountToObj = toAccountJournal;

    return { fromAccount: fromAccountJournal, toAccount: toAccountJournal };
  }

  setContraEntryMode(accountFrom: JournalAccount) {
    this.contraEntryMode = accountFrom == null ? true : false;
  }

  isEditMode(data: any, contraEntryMode: boolean) {
    return Object.entries(data).length > 0 && !contraEntryMode;
  }

  setFormValues(
    fund: string,
    symbol: string,
    fromAccount: Account,
    fromAccountValueType: string,
    toAccount: Account,
    toAccountValueType: string,
    when: Date,
    value: number,
    comments: string
  ) {
    this.journalForm.form.patchValue({
      ...(fund != null && { fund }),
      ...(symbol != null && { symbol }),
      ...(fromAccount != null && { fromAccount }),
      ...(fromAccountValueType != null && { fromAccountValueType }),
      ...(toAccount != null && { toAccount }),
      ...(toAccountValueType != null && { toAccountValueType }),
      ...(when != null && {
        selectedAsOfDate: {
          startDate: moment(when, 'MM/DD/YYYY'),
          endDate: moment(when, 'MM/DD/YYYY')
        }
      }),
      ...(value != null && { value: Math.abs(value) }),
      ...(comments != null && { comments })
    });
  }

  closeModal() {
    this.modal.hide();

    setTimeout(() => this.clearForm(), 1000);
  }

  clearForm() {
    this.editJournal = false;
    this.contraEntryMode = false;

    this.toAccountCheck = null;
    this.fromAccountCheck = null;
    this.selectedAccountTo = '';
    this.selectedAccountToObj = null;
    this.selectedAccountFrom = '';
    this.selectedAccountFromObj = null;

    this.journalForm.resetForm({
      fund: '',
      symbol: '',
      fromAccount: '',
      fromAccountValueType: '',
      toAccount: '',
      toAccountValueType: ''
    });
  }
}
