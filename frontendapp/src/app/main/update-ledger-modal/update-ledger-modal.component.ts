import { Component, OnInit, ViewChild, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import { LedgerInput, FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import * as moment from "moment";

@Component({
  selector: 'app-update-ledger-modal',
  templateUrl: './update-ledger-modal.component.html',
  styleUrls: ['./update-ledger-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateLedgerModalComponent implements OnInit {


  active = false;
  @ViewChild("accountInput") accountInput;
  @Output() modalClose = new EventEmitter<any>();
  @Input() fundId: any;
  @Input() ledgerId: any;
  tempAccountNumber: "";
  tempCustomerNumber: "";
  accounts: any[];
  customers: any[];
  account: any;
  customer: any;
  effectiveDate = new Date();
  value: number;
  ledger: LedgerInput = new LedgerInput();
  constructor(private _service: FinancePocServiceProxy) { }

  ngOnInit() {
  }


  onShown() {
    this.accountInput.focusInput();

  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this._service.getAccounts(event.query).subscribe(result => {

      this.accounts = result.data;
    });
  }

  onSearchCustomer(event): void {
    this.tempCustomerNumber = event.query;
    this._service.getCustomers(event.query).subscribe(result => {

      this.customers = result.data;
    });
  }

  getFundId(event) {
    this.ledger.fund_id = event;
  }

  save() {
    debugger
    this.ledger.effectiveDate = moment(this.effectiveDate).format('YYYY-MM-DD');
    this.ledger.customer_id = this.customer.id;
    this.ledger.account_id = this.account.id;
    if (this.ledgerId > 0 || this.ledgerId !== undefined) {
      this._service.updateLedger(this.ledgerId, this.ledger).subscribe(res => {
        this.modalClose.emit(res);
      });
    }
    else {
      this._service.createLedger(this.ledger).subscribe(res => {
        this.modalClose.emit(res);
      });
    }

    this.close();

  }

  show() {

  }

  getFormData(event: any) {
    debugger
    this.customer = event.customer;
    this.account = event.account;
    this.ledger.value = event.value;
    this.effectiveDate = event.effectiveDate;
    this.ledgerId = event.id;
    this.ledger.fund_id = event.fund.id;
  }


  close() {
    this.active = false;
    this.modalClose.emit(true);
  }
}
