import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { FinancePocServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tax-rate-modal',
  templateUrl: './tax-rate-modal.component.html',
  styleUrls: ['./tax-rate-modal.component.css']
})
export class TaxRateModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalDirective;
  @Output() closeModalEvent = new EventEmitter<any>();

  taxRate: any;
  selectedDate = null;
  longTermTaxRate = 0;
  shortTermTaxRate = 0;
  shortTermPeriod = 365;
  editTaxRate: boolean;
  isSubscriptionAlive: boolean;
  backdrop: any;

  constructor(
    private toastrService: ToastrService,
    private financeService: FinancePocServiceProxy
  ) {}

  ngOnInit() {
    this.editTaxRate = false;
    this.isSubscriptionAlive = true;
  }

  changeDate(date) {
    this.selectedDate = date;
  }

  saveTaxRate() {
    const taxRatePayload = {
      effectiveFrom: this.selectedDate.startDate,
      effectiveTo: this.selectedDate.endDate,
      longTermTaxRate: this.longTermTaxRate,
      shortTermTaxRate: this.shortTermTaxRate,
      ShortTermPeriod: this.shortTermPeriod
    };
    if (this.editTaxRate) {
      const { id } = this.taxRate;
      this.financeService.editTaxRate(id, taxRatePayload).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Tax Rate is edited successfully !');
            this.modal.hide();
            this.closeModalEvent.emit(true);
            setTimeout(() => this.clearForm(), 500);
          } else {
            this.modal.hide();
            this.toastrService.error('Failed to edit Tax Rate !');
          }
        },
        error => {
          this.modal.hide();
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
    } else {
      this.financeService.createTaxRate(taxRatePayload).subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Tax Rate is created successfully !');
          this.modal.hide();
          this.closeModalEvent.emit(true);
          setTimeout(() => this.clearForm(), 500);
        } else {
          this.toastrService.error('Failed to create Tax Rate !');
        }
      });
    }
  }

  openModal(rowData) {
    if (Object.keys(rowData).length > 1) {
      this.editTaxRate = true;
      this.taxRate = rowData;
      this.selectedDate = {
        startDate: moment(this.taxRate.effectiveFrom),
        endDate: moment(this.taxRate.effectiveTo)
      };
      this.longTermTaxRate = this.taxRate.longTermTaxRate;
      this.shortTermTaxRate = this.taxRate.shortTermTaxRate;
      this.shortTermPeriod = this.taxRate.shortTermPeriod;
    }
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
  }

  clearForm() {
    this.editTaxRate = false;
    this.selectedDate = null;
    this.longTermTaxRate = 0;
    this.shortTermTaxRate = 0;
    this.shortTermPeriod = 365;
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
