import { Component, OnInit, Injector, Input, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { DialogModule, Dialog } from 'primeng/dialog'
import { LegderModalComponent } from '../legder-modal/legder-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements AppComponentBase {
  newLedger: boolean;
  primengTableHelper: PrimengTableHelper;

  totalRecords: number;
  itemPerPage: number;
  loading: boolean;

  @Input() fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  ledgerGrid = false;
  ledgerInput = false;
  displayDialog: boolean;
  tempAccountNumber: "";
  tempCustomerNumber: "";
  accounts: any[];
  customers: any[];
  accountSearch = { id: undefined };
  customerSearch = { id: undefined };
  tempCustomerSearch = "";
  tempAccountSearch = "";
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

  customerSelect(event: any) {
    this.customerSearch.id = event.id;
    this.getLegderByFundId(this.fundId);
  }
  accountSelect(event: any) {
    this.accountSearch.id = event.id;
    this.getLegderByFundId(this.fundId);
  }
  onClearAccounts() {
    this.accountSearch.id = undefined
    this.getLegderByFundId(this.fundId);
  }
  onClearCustomers() {
    this.customerSearch.id = undefined
    this.getLegderByFundId(this.fundId);
  }
  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) { this.fundId = fundId; }
    this.loading = true;
    // this.primengTableHelper.defaultRecordsCountPerPage = 40;

    this._fundsService.getLedger(this.fundId, 0, this.customerSearch.id, this.accountSearch.id).subscribe(result => {

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
    debugger
    this.tempAccountNumber = event.query;
    this._fundsService.getAccounts(event.query).subscribe(result => {
      this.accounts = result.data;
    });
  }

  onSearchCustomer(event): void {
    debugger
    this.tempCustomerNumber = event.query;
    this._fundsService.getCustomers(event.query).subscribe(result => {
      this.customers = result.data;
    });
  }
  ngOnInit() {

    this.initializeCol();
  }


}
