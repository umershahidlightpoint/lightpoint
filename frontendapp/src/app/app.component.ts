import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../shared/service-proxies/service-proxies';
import { PaginatorModule } from 'primeng/paginator';
import { PrimengTableHelper } from '../shared/helpers/PrimengTableHelper';
import { AppComponentBase } from '../shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FundsComponent } from './main/funds/funds.component';
import { LegderModalComponent } from './main/legder-modal/legder-modal.component';
import { JournalComponent } from './main/journal/journal.component';
import { AgGridExampleComponent } from './main/ag-grid-example/ag-grid-example.component';
import { LogsComponent } from './main/logs/logs.component';
import { onMainContentChange } from './menu/animations/animations';
import { SidenavService } from '../shared/common/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange]
})
export class AppComponent extends AppComponentBase {
  title = 'Finance';
  @ViewChild('applegdermodal') applegdermodal: LegderModalComponent;
  @ViewChild('app-journal') appjournal: JournalComponent;
  @ViewChild('app-ag-grid-example') agGridExample: AgGridExampleComponent;

  fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  accountGrid = false;
  primengTableHelper: PrimengTableHelper;
  ledgerGrid = false;
  ledgerInput = false;
  droppedData: string;
  public onSideNavChange: boolean;
  constructor(
    injector: Injector,
    private _fundsService: FinancePocServiceProxy,
    private _sidenavService: SidenavService
  ) {
    super(injector);
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    });
  }

  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) {
      this.fundId = fundId;
    }
    this.primengTableHelper.defaultRecordsCountPerPage = 40;
    this._fundsService.getLedger(this.fundId, 0, {}).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.meta.Total;
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
    });
  }

  createLedger() {
    this.applegdermodal.show();
  }

  initializeCol() {}

  ngOnInit() {
    this.initializeCol();
  }

  accountGroupByGrid() {
    this.accountGrid = true;
  }
}
