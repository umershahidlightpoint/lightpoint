/* Core/Libraries */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
/* Services/Components */
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { JournalApiService } from 'src/services/journal-api.service';
import { AccountApiService } from 'src/services/account-api.service';
import { SettingApiService } from 'src/services/setting-api.service';
import { Response } from 'src/shared/Models/response';
import { Journal, JournalAccount } from '../../../../../shared/Models/journal';
import { Fund, AccountCategory, Account } from '../../../../../shared/Models/account';
import { CacheService } from 'src/services/common/cache.service';

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

  entryTypes: { name: string; value: string }[] = [
    { name: 'Debit', value: 'debit' },
    { name: 'Credit', value: 'credit' }
  ];

  toAccountCategories: AccountCategory[] = [];
  selectedToAccountCategory: AccountCategory;
  toAccountTypes: AccountCategory[] = [];
  selectedToAccountType: AccountCategory;

  fromAccountCategories: AccountCategory[] = [];
  selectedFromAccountCategory: AccountCategory;
  fromAccountTypes: AccountCategory[] = [];
  selectedFromAccountType: AccountCategory;

  dummyAccountCategory: AccountCategory;
  dummyAccountType: AccountCategory;
  dummyAccount: Account;

  symbols: any = [];
  currencies: string[] = [];

  selectedAsOfDate: { startDate: moment.Moment; endDate: moment.Moment };

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
  isLoading = false;
  isFetchingToAccountTypes = false;
  isFetchingFromAccountTypes = false;
  isSaving = false;
  isDeleting = false;

  constructor(
    private financePocServiceProxy: FinanceServiceProxy,
    private accountApiService: AccountApiService,
    private journalApiService: JournalApiService,
    private settingApiService: SettingApiService,
    private cacheService: CacheService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.initJournalData();
    this.editJournal = false;
    this.maxDate = moment();
  }

  initJournalData() {
    this.isLoading = true;
    this.requestJournalData().subscribe(
      ([
        fundsResponse,
        accountCategoriesResponse,
        symbolsResponse,
        currenciesResponse,
        accountsResponse
      ]: [
        Response<Fund>,
        Response<AccountCategory[]>,
        Response<any[]>,
        Response<any[]>,
        Response<any[]>
      ]) => {
        this.getFunds(fundsResponse);
        this.getAccountCategories(accountCategoriesResponse);
        this.getSymbols(symbolsResponse);
        this.getCurrencies(currenciesResponse);
        this.getAccounts(accountsResponse);

        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  requestJournalData(): Observable<any[]> {
    const fundsResponse = this.financePocServiceProxy.getFunds();
    const accountCategoriesResponse = this.accountApiService.accountCategories().pipe(
      map(response => {
        response.payload = response.payload.map(element => ({
          id: element.Id,
          name: element.Name
        }));

        return response as Response<AccountCategory[]>;
      })
    );
    const symbolsResponse = this.financePocServiceProxy.getSymbol();
    const currenciesResponse = this.settingApiService.getReportingCurrencies();
    const accountsResponse = this.cacheService.getDummyAccount();

    return forkJoin([
      fundsResponse,
      accountCategoriesResponse,
      symbolsResponse,
      currenciesResponse,
      accountsResponse
    ]);
  }

  getFunds(response) {
    if (response.payload) {
      this.funds = response.payload;
    } else {
      this.toastrService.error('Failed to fetch funds!');
    }
  }

  getAccountCategories(response: Response<AccountCategory[]>) {
    if (response.isSuccessful) {
      this.toAccountCategories = response.payload.filter(element => element.id !== 0);
      this.fromAccountCategories = response.payload.filter(element => element.id !== 0);
    } else {
      this.toastrService.error('Failed to fetch account categories!');
    }
  }

  getAccountTypes(accountCategoryId: number): Observable<Response<AccountCategory[]>> {
    return this.accountApiService.accountTypes(accountCategoryId).pipe(
      map(response => {
        response.payload = response.payload.map(element => ({
          id: element.Id,
          name: element.Name
        }));

        return response as Response<AccountCategory[]>;
      })
    );
  }

  getSymbols(response) {
    if (response.isSuccessful) {
      this.symbols = response.payload.map(item => item.symbol);
    } else {
      this.toastrService.error('Failed to fetch symbols!');
    }
  }

  getCurrencies(response) {
    if (response.isSuccessful) {
      this.currencies = response.payload;
    } else {
      this.toastrService.error('Failed to fetch currencies!');
    }
  }

  getAccounts(response) {
    if (response.isSuccessful) {
      this.dummyAccount = {
        accountId: response.payload.AccountId,
        name: response.payload.AccountName,
        description: response.payload.Description,
        typeId: response.payload.TypeId,
        type: response.payload.Type,
        categoryId: response.payload.CategoryId,
        category: response.payload.Category,
        hasJournal: response.payload.HasJournal,
        canDeleted: response.payload.CanDeleted,
        canEdited: response.payload.CanEdited
      };

      this.dummyAccountCategory = {
        id: this.dummyAccount.categoryId,
        name: this.dummyAccount.category
      };
      this.dummyAccountType = {
        id: this.dummyAccount.typeId,
        name: this.dummyAccount.type
      };
    } else {
      this.toastrService.error('Failed to fetch Accounts!');
    }
  }

  saveJournal() {
    this.isSaving = true;

    const journalPayload = this.getPayload();
    console.log('JOURNAL PAYLOAD', journalPayload);

    if (this.editJournal) {
      const { source } = this.selectedRow;

      this.journalApiService.updateJournal(source, journalPayload).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Journal is updated successfully!');

            this.modal.hide();
            this.modalClose.emit(true);

            setTimeout(() => this.clearForm(), 500);
          } else {
            this.toastrService.error('Failed to update Journal!');
          }

          this.isSaving = false;
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');

          this.isSaving = false;
        }
      );
    } else {
      this.journalApiService.createJounal(journalPayload).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Journal is created successfully!');

            this.modal.hide();
            this.modalClose.emit(true);

            setTimeout(() => this.clearForm(), 500);
          } else {
            this.toastrService.error('Failed to create Journal!');
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

  getPayload() {
    const {
      fund,
      toAccountEntryType,
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
        entryType: toAccountEntryType,
        accountCategoryId: this.selectedToAccountCategory.id,
        accountTypeId: this.selectedToAccountType.id,
        accountCategory: toAccountCategory,
        accountType: toAccountType,
        accountSymbol: toAccountSymbol,
        accountCurrency: toAccountCurrency
      },
      accountFrom:
        fromAccountCategory && this.selectedFromAccountCategory.id !== 0
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
              // ...(this.editJournal &&
              //   !this.contraEntryMode && {
              //     journalId: this.selectedJournal.AccountFrom.JournalId
              //   }),
              accountId: this.dummyAccount.accountId,
              entryType: this.getEntryType(),
              accountCategoryId: this.dummyAccountCategory.id,
              accountTypeId: this.dummyAccountType.id,
              accountCategory: this.dummyAccountCategory.name,
              accountType: this.dummyAccountType.name,
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

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onToEntrySelect(event: Event) {
    this.journalForm.form.patchValue({
      fromAccountEntryType: this.getEntryType()
    });
  }

  getEntryType() {
    return this.journalForm.value.toAccountEntryType === 'debit' ? 'credit' : 'debit';
  }

  onToAccountCategorySelected(event: TypeaheadMatch): void {
    this.selectedToAccountCategory = event.item;
    this.journalForm.form.patchValue({
      toAccountType: ''
    });

    this.isFetchingToAccountTypes = true;
    this.getAccountTypes(event.item.id)
      .pipe(
        finalize(() => {
          this.isFetchingToAccountTypes = false;
        })
      )
      .subscribe(response => (this.toAccountTypes = response.payload));
  }

  onToAccountCategoryChange(value: string): void {
    if (value === '') {
      this.journalForm.form.patchValue({
        toAccountType: ''
      });
      this.toAccountTypes = [];
    }
  }

  onToAccountTypeSelected(event: TypeaheadMatch): void {
    this.selectedToAccountType = event.item;
  }

  onFromAccountCategorySelected(event: TypeaheadMatch): void {
    this.selectedFromAccountCategory = event.item;
    this.journalForm.form.patchValue({
      fromAccountType: ''
    });

    this.isFetchingFromAccountTypes = true;
    this.getAccountTypes(event.item.id)
      .pipe(
        finalize(() => {
          this.isFetchingFromAccountTypes = false;
        })
      )
      .subscribe(response => (this.fromAccountTypes = response.payload));
  }

  onFromAccountCategoryChange(value: string): void {
    if (value === '') {
      this.journalForm.form.patchValue({
        fromAccountType: ''
      });
      this.fromAccountTypes = [];
    }
  }

  onFromAccountTypeSelected(event: TypeaheadMatch): void {
    this.selectedFromAccountType = event.item;
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

      this.isLoading = true;
      this.journalApiService.getJournal(source).subscribe(
        response => {
          if (response.isSuccessful) {
            const { Fund, AccountTo, AccountFrom, When, Comment } = response.payload;
            this.selectedJournal = response.payload;
            this.selectedRow.balance = AccountTo.Value;

            // this.setContraEntryMode(AccountFrom);
            this.setJournalAccountsValue(AccountTo, AccountFrom);

            this.setFormValues(
              Fund,
              AccountTo.CreditDebit,
              AccountTo.AccountCategory,
              AccountTo.AccountType,
              AccountTo.Symbol,
              AccountTo.FxCurrency,
              AccountFrom ? AccountFrom.CreditDebit : null,
              AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.AccountCategory,
              AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.AccountType,
              AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.Symbol,
              AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.FxCurrency,
              When,
              AccountTo.Value,
              Comment
            );
          } else {
            this.toastrService.error('Failed to fetch Journal details. Try again later!');
          }

          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
    } else if (contraEntryMode) {
      this.contraEntryMode = true;

      this.selectedRow = rowData;
      const { when, balance, AccountType } = this.selectedRow;

      // TODO :: Set Journal Accounts Value For Contra Entry Here

      this.setFormValues(
        this.funds[0].FundCode,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        when,
        balance,
        'A Contra Journal Entry!'
      );
    }

    this.modal.show();
  }

  setJournalAccountsValue(toAccount: JournalAccount, fromAccount: JournalAccount) {
    this.selectedToAccountCategory = this.getMappedJournalAccount(toAccount, 'Category');
    this.selectedToAccountType = this.getMappedJournalAccount(toAccount, 'Type');
    if (fromAccount) {
      this.selectedFromAccountCategory = this.getMappedJournalAccount(fromAccount, 'Category');
      this.selectedFromAccountType = this.getMappedJournalAccount(fromAccount, 'Type');
    }

    this.isFetchingToAccountTypes = true;
    this.getAccountTypes(toAccount.AccountCategoryId)
      .pipe(
        finalize(() => {
          this.isFetchingToAccountTypes = false;
        })
      )
      .subscribe(response => (this.toAccountTypes = response.payload));

    if (fromAccount) {
      this.isFetchingFromAccountTypes = true;
      this.getAccountTypes(fromAccount.AccountCategoryId)
        .pipe(
          finalize(() => {
            this.isFetchingFromAccountTypes = false;
          })
        )
        .subscribe(response => (this.fromAccountTypes = response.payload));
    }
  }

  getMappedJournalAccount(journalAccount: JournalAccount, accountProperty: string) {
    return {
      id: journalAccount[`Account${accountProperty}Id`],
      name: journalAccount[`Account${accountProperty}`]
    };
  }

  setContraEntryMode(fromAccount: JournalAccount) {
    this.contraEntryMode = fromAccount == null;
  }

  isEditMode(data: any, contraEntryMode: boolean) {
    return Object.entries(data).length > 0 && !contraEntryMode;
  }

  setFormValues(
    fund: string,
    toAccountEntryType: string,
    toAccountCategory: string,
    toAccountType: string,
    toAccountSymbol: string,
    toAccountCurrency: string,
    fromAccountEntryType: string,
    fromAccountCategory: string,
    fromAccountType: string,
    fromAccountSymbol: string,
    fromAccountCurrency: string,
    when: Date,
    value: number,
    comments: string
  ) {
    this.journalForm.form.patchValue({
      ...(fund && { fund }),
      ...(toAccountEntryType && { toAccountEntryType }),
      ...(toAccountCategory && { toAccountCategory }),
      ...(toAccountType && { toAccountType }),
      ...(toAccountSymbol && { toAccountSymbol }),
      ...(toAccountCurrency && { toAccountCurrency }),
      ...(fromAccountEntryType && { fromAccountEntryType }),
      ...(fromAccountCategory && { fromAccountCategory }),
      ...(fromAccountType && { fromAccountType }),
      ...(fromAccountSymbol && { fromAccountSymbol }),
      ...(fromAccountCurrency && { fromAccountCurrency }),
      ...(when && {
        selectedAsOfDate: {
          startDate: moment(when, 'MM/DD/YYYY'),
          endDate: moment(when, 'MM/DD/YYYY')
        }
      }),
      ...(value && { value: Math.abs(value) }),
      ...(comments && { comments })
    });
  }

  closeModal() {
    this.modal.hide();

    setTimeout(() => this.clearForm(), 1000);
  }

  clearForm() {
    this.editJournal = false;
    this.contraEntryMode = false;

    this.toAccountTypes = [];
    this.fromAccountTypes = [];
    this.selectedToAccountCategory = null;
    this.selectedToAccountType = null;
    this.selectedFromAccountCategory = null;
    this.selectedFromAccountType = null;

    this.journalForm.resetForm({
      fund: '',
      toAccountEntryType: '',
      toAccountCategory: '',
      toAccountType: '',
      toAccountSymbol: '',
      toAccountCurrency: '',
      fromAccountEntryType: '',
      fromAccountCategory: '',
      fromAccountType: '',
      fromAccountSymbol: '',
      fromAccountCurrency: ''
    });
  }
}
