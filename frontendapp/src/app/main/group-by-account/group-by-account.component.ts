import { Component, OnInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as moment from 'moment';
@Component({
  selector: 'app-group-by-account',
  templateUrl: './group-by-account.component.html',
  styleUrls: ['./group-by-account.component.css']
})
export class GroupByAccountComponent implements OnInit {
  account: any[];
  fundId: any;
  rowGroupMetadata: any;

  constructor(private _service: FinancePocServiceProxy) {
  }

  ngOnInit() {



  }


  getLegderByFundId(fundId?: string, event?: LazyLoadEvent) {
    if (fundId != null) { this.fundId = fundId; }
    this._service.getLedger(this.fundId, 0, undefined, undefined).subscribe(result => {

      this.account = result.data
      this.updateRowGroupMetaData();
      // .map(item => ({
      //   account: item.account.name,
      //   accountType: item.accountType.name,
      //   accountId: item.account.id,
      //   customer: item.customer.name,
      //   customerId: item.customer.Id,
      //   value: item.value,
      //   effectiveDate: moment(item.effectiveDate).format('MMM-DD-YYYY'),
      //   id: item.id
      // }));
      // this.ledgerGrid = true;

    })
  }
  updateRowGroupMetaData() {
    debugger
    this.rowGroupMetadata = {};
    if (this.account) {
      for (let i = 0; i < this.account.length; i++) {
        let rowData = this.account[i];
        let account = rowData.account;
        if (i == 0) {
          this.rowGroupMetadata[account] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.account[i - 1];
          let previousRowGroup = previousRowData.account;
          if (account === previousRowGroup)
            this.rowGroupMetadata[account].size++;
          else
            this.rowGroupMetadata[account] = { index: i, size: 1 };
        }
      }
    }
  }

  getFundId(event) {
    this.fundId = event;
    this.getLegderByFundId();
  }
  // getGroupByCustomerData() {
  //   debugger
  //   this._service.groupByCustomer(this.fundId).subscribe(result => {
  //     this.customers = result.data;
  //   });
  // }

}
