import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { PaginatorModule } from 'primeng/paginator';
import { PrimengTableHelper } from '../shared/helpers/PrimengTableHelper';
import { AppComponentBase } from '../shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FundsComponent } from './main/funds/funds.component';
import { LegderModalComponent } from './main/legder-modal/legder-modal.component';
import { JournalComponent } from './main/journal/journal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AppComponentBase {
  title = 'Finance';
  @ViewChild('applegdermodal') applegdermodal: LegderModalComponent;
  @ViewChild('app-journal') appjournal: JournalComponent;
  fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  accountGrid = false;
  primengTableHelper: PrimengTableHelper;
  ledgerGrid = false;
  ledgerInput = false;
  droppedData: string;
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    super(injector);
  }



  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) { this.fundId = fundId; }
    this.primengTableHelper.defaultRecordsCountPerPage = 40;
    this._fundsService.getLedger(this.fundId, 0, {}).subscribe(result => {
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

  createLedger() {
    this.applegdermodal.show();
  }

  initializeCol() {

    
  }
  ngOnInit() {
    this.initializeCol();
  }
  accountGroupByGrid() {
    this.accountGrid = true;
  }
}
