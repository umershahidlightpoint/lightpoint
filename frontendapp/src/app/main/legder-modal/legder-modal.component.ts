import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FinancePocServiceProxy, LedgerInput } from '../../../shared/service-proxies/service-proxies';
import * as moment from "moment";

@Component({
  selector: 'app-legder-modal',
  templateUrl: './legder-modal.component.html',
  styleUrls: ['./legder-modal.component.css']
})
export class LegderModalComponent implements OnInit {

  active = false;
  @ViewChild("accountInput") accountInput;
  @ViewChild('modal') modal: ModalDirective;
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
    if (this.ledgerId)
      this.getLedgerById(this.ledgerId);
    this.active = true;
    this.modal.show();
  }

  getLedgerById(id) {
    debugger
    this._service.getLedgerById(id).subscribe(result => {
      this.ledger.effectiveDate = result.effectiveDate;

      this.customer = result.customer;
      this.account = result.account;
      this.ledger.value = result.value;
      this.ledger.fund_id = result.fund.id;
    })
  }


  close() {
    this.active = false;
    this.modalClose.emit(true);
    this.modal.hide();
  }
}
