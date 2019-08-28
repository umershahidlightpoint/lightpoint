import { Component, OnInit, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { LogsComponent } from '../logs/logs.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('app-logs') journalsLedgers: LogsComponent;

  fundId: any;
  ledger: any[];
  ledgerCols: any[];
  fundsCols: any[];
  accountGrid = false;
  primengTableHelper: PrimengTableHelper;
  ledgerGrid = false;
  ledgerInput = false;
  droppedData: string;

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 180px)',
    boxSizing: 'border-box'
  };

  messagesDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 300px)',
    boxSizing: 'border-box',
    overflow: 'scroll'
  };

  constructor(private financeService: FinancePocServiceProxy) {}

  ngOnInit() {
    this.initializeCol();
  }

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

  initializeCol() {}

  accountGroupByGrid() {
    this.accountGrid = true;
  }
}
