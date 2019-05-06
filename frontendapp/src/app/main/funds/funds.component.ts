import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { LedgerComponent } from '../ledger/ledger.component';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.css']
})
export class FundsComponent implements OnInit {
  funds: any[];
  @Output() event = new EventEmitter<any>();
  fundsCols: any[];
  isLoading = false;

  @ViewChild("appLedger") appLedger: LedgerComponent;
  constructor(private _fundsService: FinancePocServiceProxy) { }

  ngOnInit() {
    this.getFunds();
    this.initializeCol();
  }

  getFunds() {
    this._fundsService.getFunds().subscribe(result => {
      this.funds = result.data;
      if (this.funds.length > 0) {
        this.getFundLeadger(this.funds[0].id);
      }
      this.isLoading = true;
    });
  }

  onRowSelect(event) {
    console.log(event);
  }

  initializeCol() {
    this.fundsCols = [
      { field: 'name', header: 'Name' },
      { field: 'notes', header: 'Notes' },
    ];
  }
  getFundLeadger(fundId: any) {
    this.event.emit(fundId);
  }
}
