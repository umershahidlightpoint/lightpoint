 import { Component, OnInit, Injector, Input, ViewChild, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
 
import * as moment from 'moment';
 

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
   
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
  }


  ngOnInit() {
    setTimeout(() => {
      this.getJournals();
    }, 250);
    this.initializeCol();
  }


  initializeCol() {
    this.journalCols = [
     // { field: 'id', header: 'id' },
      { field: 'accountName', header: 'Account Name' },
      { field: 'when', header: 'when' },
      { field: 'value', header: 'Value' } 
    ];
 
  }
  getJournals(  event?: LazyLoadEvent) {
     
    let page = 1;
    if (event) {
      page = Math.ceil(event.first / 40) + 1;
    }
    const params: any = {};
     

    console.log(`Page No is ${page}`)
    this._fundsService.getJournal( ).subscribe(result => {
      this.totalRecords = 50 ;//result.meta.total;
      this.itemPerPage = 10;//  result.meta.limit;
      this.journals = [];
       
      this.journals = result.map(item => ({
        id: item.id,
        accountName: item.accountName ,
        accountId: item.account_id,
        value: item.value,
        when: moment(item.when).format('MMM-DD-YYYY')
        
      }));
 
      this.journalGrid = true;
      this.loading = false;
    });
  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this._fundsService.getAccounts(event.query).subscribe(result => {
      this.accounts = result.data;
    });
  }

  accountSelect(event: any, dtJournal) {
    dtJournal.filter(event.id, 'account_id');
    this.accountSearch.id = event.id;
  }

  onClearAccounts(dtLedger) {
    this.accountSearch.id = undefined;
    dtLedger.filter(null, 'account_id');
  }
}
