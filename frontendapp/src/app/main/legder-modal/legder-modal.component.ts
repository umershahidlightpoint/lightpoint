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
  effectiveDate: any;
  value: number;
  ledger: LedgerInput = new LedgerInput();
  constructor(private _service: FinancePocServiceProxy) { }

  ngOnInit() {
  }


  onShown() {

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
    this.ledger.fund = event;
  }

  save() {

    this.ledger.effectiveDate = moment(this.effectiveDate);
    this.ledger.customer = this.customer.id;
    this.ledger.account = this.account.id;
    if (this.ledgerId > 0 || this.ledgerId !== undefined) {
      this._service.updateLedger(this.ledgerId, this.ledger).subscribe(res => {
        debugger
      })
    }
    this._service.createLedger(this.ledger).subscribe(res => {
      this.close();
      this.modalClose.emit(res);
    })

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
      debugger
      this.ledger.effectiveDate = moment(result.effectiveDate);
      this.customer = result.customer;
      this.account = result.account;
      this.ledger.value = result.value;
    })
  }


  close() {
    this.active = false;
    this.modalClose.emit(true);
    this.modal.hide();
  }
}
