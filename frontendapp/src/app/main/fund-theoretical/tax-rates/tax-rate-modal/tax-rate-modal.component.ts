import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';

@Component({
  selector: 'app-tax-rate-modal',
  templateUrl: './tax-rate-modal.component.html',
  styleUrls: ['./tax-rate-modal.component.css']
})
export class TaxRateModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @Output() closeModalEvent = new EventEmitter<any>();

  taxRate: any;
  selectedDate = null;
  longTermTaxRate = 0;
  shortTermTaxRate = 0;
  shortTermPeriod = 365;
  lastTaxRateData;
  editTaxRate: boolean;
  backdrop: any;

  constructor(
    private toastrService: ToastrService,
    private fundTheoreticalApiService: FundTheoreticalApiService
  ) {}

  ngOnInit() {
    this.editTaxRate = false;
  }

  changeDate(date) {
    this.selectedDate = date;
  }

  saveTaxRate() {
    const taxRatePayload = {
      effectiveFrom: this.selectedDate.startDate.format('YYYY-MM-DD'),
      effectiveTo: this.selectedDate.endDate.format('YYYY-MM-DD'),
      longTermTaxRate: this.longTermTaxRate,
      shortTermTaxRate: this.shortTermTaxRate,
      ShortTermPeriod: this.shortTermPeriod
    };
    if (this.editTaxRate) {
      const { id } = this.taxRate;
      this.fundTheoreticalApiService.editTaxRate(id, taxRatePayload).subscribe(
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
      this.fundTheoreticalApiService.createTaxRate(taxRatePayload).subscribe(response => {
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

  taxRateValidation(taxRateObject, lastTaxRateData) {
    if (lastTaxRateData === null) {
      return 1;
    }
    const effectiveFrom = moment(taxRateObject.effectiveFrom);
    const effectiveTo = moment(this.lastTaxRateData.effectiveTo);
    const dayDiff = effectiveFrom.diff(effectiveTo, 'days');
    return effectiveFrom.diff(effectiveTo, 'days');
  }

  openModal(rowData, previoustaxRateData) {
    this.lastTaxRateData = previoustaxRateData;
    if (rowData && Object.keys(rowData).length > 1) {
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
}
