 import { Component, OnInit, Injector, Input, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
 
import * as moment from 'moment';
import { AngularFontAwesomeComponent } from 'angular-font-awesome';
 

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JournalComponent implements OnInit {
  @ViewChild("dtjournal") dtjournal;
  @ViewChild("accountInput") accountInput;
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
  symbal :string;
  valueTimeout: any;
  valueFilter: number;

  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
  }


  ngOnInit() {
    this.accountSearch.id=0;
    this.valueFilter= 0;
    setTimeout(() => {
     
      this.getJournals( );
    }, 250);
    this.initializeCol();
  }


  initializeCol() {
    this.journalCols = [
      { field: 'source', header: 'source' },
      { field: 'AccountType', header: 'Account Type' },
      { field: 'accountName', header: 'Account Name' },
      { field: 'when', header: 'when'  },
      { field: 'value', header: 'Value' } 
    ];
 
  }
  getJournals(   event?: LazyLoadEvent) {
    debugger;
    this.journalGrid = true;
    let page = 1;
    if (event) {
      page = Math.ceil(event.first / 40) + 1;
    }
    const params: any = {};
    this.setSymbal();
    this.loading = true;
   // console.log(`Page No is ${page}`)
    this._fundsService.getJournals(this.symbal  , this.accountSearch.id, this.valueFilter ).subscribe(result => {
      this.totalRecords = 50 ;//result.meta.total;
      this.itemPerPage = 10;//  result.meta.limit;
      this.journals = [];
      debugger;
      console.log(result.payload);
      this.journals = result.payload.map(item => ({
        id: item.id,
        source:item.source,
        AccountType:item.AccountType,
        accountName: item.accountName ,
        accountId: item.account_id,
        value: item.value,
        //when: moment(item.when).format('MMM-DD-YYYY hh:mm:ss A Z')
        when: moment(item.when).format("MMM-DD-YYYY")
        

      }));
 
      this.journalGrid = true;
      this.loading = false;
    });
  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this._fundsService.getAccount(event.query).subscribe(result => {
    this.accounts = result.payload;
    });
  }

  accountSelect(event: any, dtJournal) {

    dtJournal.filter(event.id, 'account_id');
    this.accountSearch.id = event.id;
    this.symbal='Search';
    setTimeout(() => {
      this.getJournals( );
    }, 250);

  }

  onClearAccounts(dtLedger) {
    this.accountSearch.id = 0;
    this.symbal='All';

    setTimeout(() => {
      this.getJournals( );
    }, 250);
  }

  onValueChange(event, dtLedger): void {
    this.valueTimeout = setTimeout(() => {
      this.valueFilter = event.value;
      debugger;
      console.log(event.value);
      this.getJournals( );
    }, 250);
  }

  setSymbal()
  {
    this.symbal='ALL';
    if (this.accountSearch.id > 0 || this.valueFilter > 0)
        {
          this.symbal='Search';
        }
  }

}
