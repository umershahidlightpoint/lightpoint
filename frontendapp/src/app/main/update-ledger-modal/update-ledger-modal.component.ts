import {
  Component,
  OnInit,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { LedgerInput } from 'src/shared/Models/account';
import * as moment from 'moment';

@Component({
  selector: 'app-update-ledger-modal',
  templateUrl: './update-ledger-modal.component.html',
  styleUrls: ['./update-ledger-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateLedgerModalComponent implements OnInit {
  active = false;
  tempAccountNumber: '';
  tempCustomerNumber: '';
  accounts: any[];
  customers: any[];
  account: any;
  customer: any;
  effectiveDate = new Date();
  value: number;
  ledger: LedgerInput = new LedgerInput();

  @ViewChild('accountInput') accountInput;
  @Output() modalClose = new EventEmitter<any>();
  @Input() fundId: any;
  @Input() ledgerId: any;

  constructor(private financeService: FinancePocServiceProxy) {}

  ngOnInit() {}

  onShown() {
    this.accountInput.focusInput();
  }

  onSearchAccount(event): void {
    this.tempAccountNumber = event.query;
    this.financeService.getAccounts(event.query).subscribe(result => {
      this.accounts = result.data;
    });
  }

  onSearchCustomer(event): void {
    this.tempCustomerNumber = event.query;
    this.financeService.getCustomers(event.query).subscribe(result => {
      this.customers = result.data;
    });
  }

  getFundId(event) {
    this.ledger.fund_id = event;
  }

  save() {
    this.ledger.effectiveDate = moment(this.effectiveDate).format('YYYY-MM-DD');
    this.ledger.customer_id = this.customer.id;
    this.ledger.account_id = this.account.id;
    if (this.ledgerId > 0 || this.ledgerId !== undefined) {
      this.financeService.updateLedger(this.ledgerId, this.ledger).subscribe(res => {
        this.modalClose.emit(true);
        this.close();
      });
    } else {
      this.financeService.createLedger(this.ledger).subscribe(res => {
        this.modalClose.emit(res);
      });
    }

    this.close();
  }

  show() {}

  getFormData(event: any) {
    this.customer = event.customer;
    this.account = event.account;
    this.ledger.value = event.value;
    this.effectiveDate = new Date(event.effectiveDate);
    this.ledgerId = event.id;
    this.ledger.fund_id = event.fund.id;
  }

  close() {
    this.active = false;
    this.modalClose.emit(true);
  }
}
