import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanceServiceProxy } from '../../shared/service-proxies/service-proxies';
import { PrimengTableHelper } from '../../shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { LogsComponent } from '../main/logs/logs.component';

@Component({
  selector: 'app-runlogs',
  templateUrl: './runlogs.component.html',
  styleUrls: ['./runlogs.component.css']
})
export class RunLogsComponent implements OnInit {
  @ViewChild('app-logs', { static: false }) journalsLedgers: LogsComponent;

  fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  accountGrid = false;
  primengTableHelper: PrimengTableHelper;
  ledgerGrid = false;
  ledgerInput = false;
  droppedData: string;
  constructor(private financeService: FinanceServiceProxy) {}

  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) {
      this.fundId = fundId;
    }
    this.primengTableHelper.defaultRecordsCountPerPage = 40;
    this.financeService.getLedger(this.fundId, 0, {}).subscribe(result => {
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
    // this.applegdermodal.show();
  }

  initializeCol() {}

  ngOnInit() {
    this.initializeCol();
  }

  accountGroupByGrid() {
    this.accountGrid = true;
  }
}
