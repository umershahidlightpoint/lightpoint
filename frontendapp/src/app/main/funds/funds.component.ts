import { Component, OnInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.css']
})
export class FundsComponent implements OnInit {
  funds: any;
  constructor(private _fundsService: FinancePocServiceProxy) { }

  ngOnInit() {
  }

  getFunds() {
    this._fundsService.getFunds().subscribe(result => {
      this.funds = result;
    });
  }
}
