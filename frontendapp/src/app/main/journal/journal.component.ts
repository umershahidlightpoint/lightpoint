import { Component, OnInit, Injector, Input, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';

import * as moment from 'moment';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JournalComponent implements OnInit {
  @ViewChild('dtjournal') dtjournal;
  @ViewChild('accountInput') accountInput;
  newLedger: boolean;
  primengTableHelper: PrimengTableHelper;
  journals: any[];
  totalRecords: number;
  itemPerPage: number;
  loading: boolean;
  journalGrid = false;
  journalCols: any;
  tempAccountSearch = '';
  tempAccountNumber: '';
  accountSearch = { id: undefined };
  accounts: any[];
  symbal: string;
  valueTimeout: any;
  valueFilter: number;
  pageSize: any;
  totalCredit: number;
  totalDebit: number;
  sortColum: any;
  sortDirection: any;
  funds = ['LP', 'FRED', 'SIMON'];

  constructor(injector: Injector,
              private _fundsService: FinancePocServiceProxy) {
    (injector);
  }


  ngOnInit() {
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.pageSize = 100;
    this.sortColum = "id";
    this.sortDirection = 0;
    setTimeout(() => {

      this.getJournals();
    }, 250);
    this.initializeCol();
  }


  initializeCol() {
    this.journalCols = [
      { field: 'source', header: 'Source' },
      { field: 'AccountType', header: 'Account Type' },
      { field: 'accountName', header: 'Account Name' },
      { field: 'when', header: 'when' },
      { field: 'debit', header: 'Debit' },
      { field: 'credit', header: 'Credit' }
    ];

  }
  getJournals(event?: LazyLoadEvent) {
    debugger;
    let page = 1;
    if (event) {
      if (event.sortField)
        if (event.sortField != "when" && event.sortField != "source") {
          this.sortColum = "id";
          this.sortDirection = 1;
          return;
        }
      this.sortColum = event.sortField;
      this.sortDirection = event.sortOrder;
    }


    if (!this.loading) {
      this.loading = true;
      this.journalGrid = true;

      if (this.sortColum != "when" && this.sortColum != "source") {
        this.sortColum = "id";
        this.sortDirection = 1;
      }
      const params: any = {};
      this.setSymbal();
      this.loading = true;

      this._fundsService.getFunds().subscribe ( result => {

        debugger;

        // NOw populate the funds list
        this.funds = result.payload.map( item => ({
          FundCode:item.FundCode,
        }));
      });

      this._fundsService.getJournals(this.symbal, page, this.pageSize, this.accountSearch.id, this.valueFilter, this.sortColum, this.sortDirection).subscribe(result => {

        this.totalRecords = result.meta.Total;//result.meta.total;
        this.itemPerPage = 100;//  result.meta.limit;
        this.journals = [];


        this.journals = result.data.map(item => ({
          id: item.id,
          source: item.source,
          AccountType: item.AccountType,
          accountName: item.accountName,
          accountId: item.account_id,
          debit: item.value < 0 ? item.value : '',
          credit: item.value > 0 ? item.value : '',
          //when: moment(item.when).format('MMM-DD-YYYY hh:mm:ss A Z')
          when: moment(item.when).format("MMM-DD-YYYY"),



        }));
        this.totalCredit = 0;``
        this.totalDebit = 0;
        this.journals.forEach(element => {
          this.totalCredit += Number(element.credit);
          this.totalDebit += Number(element.debit);
        });
        this.journalGrid = true;
        this.loading = false;
      });
    }
  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this._fundsService.getAccount(event.query).subscribe(result => {
      this.accounts = result.payload;
    });
  }

  customSort(event): void {
    console.log(event);
    debugger;
    let dd = event.id;

  }

  accountSelect(event: any, dtJournal) {

    dtJournal.filter(event.id, 'account_id');
    this.accountSearch.id = event.id;
    this.symbal = 'ALL';
    setTimeout(() => {
      this.getJournals();
    }, 250);

  }

  onClearAccounts(dtLedger) {
    this.accountSearch.id = 0;
    this.symbal = 'All';

    setTimeout(() => {
      this.getJournals();
    }, 250);
  }

  onValueChange(event, dtLedger): void {
    this.valueTimeout = setTimeout(() => {
      this.valueFilter = event.value;
      debugger;
      console.log(event.value);
      this.getJournals();
    }, 250);
  }

  setSymbal() {
    this.symbal = 'ALL';
    if (this.accountSearch.id > 0 || this.valueFilter > 0) {
      this.symbal = 'ALL';
    }
  }
  onGoToPage2() {
    alert("To show popup");

  }

}
