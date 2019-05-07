import { Component, OnInit, Injector, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { DialogModule, Dialog } from 'primeng/dialog';
import { LegderModalComponent } from '../legder-modal/legder-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements AppComponentBase, OnInit {
  newLedger: boolean;
  primengTableHelper: PrimengTableHelper;

  totalRecords: number;
  itemPerPage: number;
  loading: boolean;

  valueTimeout: any;
  valueFilter: number;

  @Input() fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  ledgerGrid = false;
  ledgerInput = false;
  displayDialog: boolean;
  tempAccountNumber: '';
  tempCustomerNumber: '';
  accounts: any[];
  customers: any[];
  accountSearch = { id: undefined };
  customerSearch = { id: undefined };
  tempCustomerSearch = '';
  tempAccountSearch = '';


  @Output() droppable = new EventEmitter<any>();
  @ViewChild('applegdermodal') applegdermodal: LegderModalComponent;
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
  }

  onRowSelect(event) {
    this.newLedger = false;
    this.ledger = [1];
    this.displayDialog = true;

  }
  showDialogToAdd() {
    this.newLedger = true;

    this.displayDialog = true;
  }

  customerSelect(event: any, dtLedger) {
    dtLedger.filter(event.id, 'customer_id');
    this.customerSearch.id = event.id;
  }

  accountSelect(event: any, dtLedger) {
    dtLedger.filter(event.id, 'account_id');
    this.accountSearch.id = event.id;
  }

  onClearAccounts() {
    this.accountSearch.id = undefined
    this.getLegderByFundId(this.fundId);
  }
  onClearCustomers() {
    this.customerSearch.id = undefined
    this.getLegderByFundId(this.fundId);
  }

  /**
   * 
   * @param fundId 
   * @param event 
   */
  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) { this.fundId = fundId; }
    console.log(`${this.fundId} --- fundId`, event);
    //this.loading = true;
    // this.primengTableHelper.defaultRecordsCountPerPage = 40;
    let page = 1;
    if (event) {
      const first = event.first;
      const itemPerPage = event.rows;
      page = (first / itemPerPage) + 1;
    }
    const params: any = {};
    if (this.customerSearch.id) {
      params.customer_id = this.customerSearch.id;
    }
    if (this.accountSearch.id) {
      params.account_id = this.accountSearch.id;
    }
    if (this.valueFilter) {
      params.value = this.valueFilter;
    }

    this._fundsService.getLedger(this.fundId, page, params).subscribe(result => {
      this.totalRecords = result.meta.total;
      this.itemPerPage = result.meta.limit;
      this.ledger = result.data.map(item => ({
        account: item.account.name,
        accountType: item.accountType.name,
        accountId: item.account.id,
        customer: item.customer.name,
        customerId: item.customer.Id,
        value: item.value,
        effectiveDate: moment(item.effectiveDate).format('MMM-DD-YYYY'),
        id: item.id
      }));
      this.ledgerGrid = true;
      this.loading = false;
    });
  }

  editLedger(id: number) {
    this.applegdermodal.ledgerId = id;
    this.applegdermodal.show();
  }

  initializeCol() {
    this.ledgerCols = [
      { field: 'account', header: 'Account' },
      { field: 'accountType', header: 'Account Type' },
      { field: 'customer', header: 'Customer' },
      { field: 'value', header: 'Value' },
      { field: 'effectiveDate', header: 'Effective Date' }
    ];
  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this._fundsService.getAccounts(event.query).subscribe(result => {
      this.accounts = result.data;
    });
  }

  onSearchCustomer(event): void {
    this.tempCustomerNumber = event.query;
    this._fundsService.getCustomers(event.query).subscribe(result => {
      this.customers = result.data;
    });
  }

  onFilterChange(event, dtLedger): void {
    this.valueTimeout = setTimeout(() => {
      this.valueFilter = event.value;
      dtLedger.filter(event.value, 'value', 'gt');
    }, 250);
  }

  ngOnInit() {
    this.initializeCol();
    this.resetFilter();
  }

  resetFilter(): void {
    this.valueTimeout = null;
    this.valueFilter = null;
    this.accountSearch.id = undefined;
    this.customerSearch.id = undefined;
  }

  dragEnd(header: string) {
    if (header === "Account") {
      this.droppable.emit(true);

    }

  }


}
