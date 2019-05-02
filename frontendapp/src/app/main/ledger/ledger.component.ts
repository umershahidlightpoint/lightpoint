import { Component, OnInit, Injector, Input } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { DialogModule, Dialog } from 'primeng/dialog'

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements AppComponentBase {
  newLedger: boolean;
  primengTableHelper: PrimengTableHelper;
  @Input() fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  ledgerGrid = false;
  ledgerInput = false;
  displayDialog: boolean;
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
  }

  onRowSelect(event) {
    this.newLedger = false;
    this.ledger = [1];
    this.displayDialog = true;

  }
  delete() {

    this.displayDialog = false;
  }
  showDialogToAdd() {
    this.newLedger = true;

    this.displayDialog = true;
  }
  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    debugger
    if (fundId != null) { this.fundId = fundId; }
    // this.primengTableHelper.defaultRecordsCountPerPage = 40;
    this._fundsService.getLedger(this.fundId, 0).subscribe(result => {
      // this.primengTableHelper.totalRecordsCount = result.meta.total;
      // this.primengTableHelper.records = result.meta.limit;
      this.ledger = result.data.map(item => ({
        account: item.account.name,
        accountId: item.account.id,
        customer: item.customer.name,
        customerId: item.customer.Id,
        value: item.value,
        effectiveDate: item.effectiveDate
      }));
      this.ledgerGrid = true;

    })
  }

  createLedger() {
    this.ledgerInput = true;
  }

  initializeCol() {

    this.ledgerCols = [
      { field: 'account', header: 'Account' },
      { field: 'customer', header: 'Customer' },
      { field: 'value', header: 'Value' },
      { field: 'effectiveDate', header: 'Effective Date' }
    ];
  }
  ngOnInit() {
    this.initializeCol();
  }

}
