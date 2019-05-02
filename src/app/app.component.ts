import { Component, OnInit, Injector } from '@angular/core';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { PaginatorModule } from 'primeng/paginator';
import { PrimengTableHelper } from '../shared/helpers/PrimengTableHelper';
import { AppComponentBase } from '../shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AppComponentBase {
  title = 'AccountApp';
  funds: any[];
  fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  primengTableHelper: PrimengTableHelper;
  ledgerGrid = false;
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    super(injector);
  }

  getFunds() {
    this._fundsService.getFunds().subscribe(result => {
      this.funds = result.data;
    });
  }

  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    debugger
    if (fundId != null) { this.fundId = fundId; }
    this.primengTableHelper.defaultRecordsCountPerPage = 40;
    this._fundsService.getLedger(this.fundId, 0).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.meta.total;
      this.primengTableHelper.records = result.meta.limit;
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
  initializeCol() {
    this.fundsCols = [
      { field: 'name', header: 'Name' },
      { field: 'notes', header: 'Notes' },
    ];
    this.ledgerCols = [
      { field: 'account', header: 'Account' },
      { field: 'customer', header: 'Customer' },
      { field: 'value', header: 'value' },
      { field: 'effectiveDate', header: 'Effective Date' }
    ];
  }
  ngOnInit() {

    this.getFunds();
    this.initializeCol();
  }
}
