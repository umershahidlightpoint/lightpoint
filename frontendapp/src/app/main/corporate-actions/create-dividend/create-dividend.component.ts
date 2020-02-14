import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SettingApiService } from 'src/services/setting-api.service'; // for get currencies
import { FinanceServiceProxy } from './../../../../services/service-proxies'; // for get symbols
import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-dividend',
  templateUrl: './create-dividend.component.html',
  styleUrls: ['./create-dividend.component.scss']
})
export class CreateDividendComponent implements OnInit {

  dividentForm: FormGroup;
  submitted = false;
  editDividend = false;
  selectedRow;

  @ViewChild('dividendModal', { static: false }) dividendModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  currencies$: Observable<string[]>;
  ticker$: Observable<[]>;
  noResult = false;
  noCurrencyFound = false;
  isDeleting = false;
  maxDate: moment.Moment;

  constructor(
     private formBuilder: FormBuilder,
     private toastrService: ToastrService,
     private settingApiService: SettingApiService,
     private financePocServiceProxy: FinanceServiceProxy,
     private corporateActionsApiService: CorporateActionsApiService
     ) { }

  ngOnInit() {

    this.dividentForm = this.formBuilder.group({
      ticker: ['', Validators.required],
      noticeDate: ['', Validators.required],
      exDate: ['', Validators.required],
      recordDate: ['', Validators.required],
      payDate: ['', [Validators.required]],
      ratio: ['', Validators.required],
      currency: ['', Validators],
      holdingRate: ['', Validators],
      fxRate: ['', Validators]
  });
    this.getCurrencies();
    this.getSymbols();
    this.getDividends();
    this.maxDate = moment();
  }

  getDividends() {
    this.corporateActionsApiService.getDividends().subscribe(data => {
    });
  }


  getCurrencies() {
    this.settingApiService.getReportingCurrencies().subscribe(currencies => {
      this.currencies$ = currencies.payload;
    });
  }

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(symbol => {
      this.ticker$ = symbol.payload.map(item => item.symbol);
    });
  }

  deleteDividend() {
    this.isDeleting = true;
    this.corporateActionsApiService.deleteDividend(this.selectedRow.id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Dividend is deleted successfully!');

          this.dividendModal.hide();
          this.modalClose.emit(true);

          setTimeout(() => this.onReset(), 500);
        } else {
          this.toastrService.error('Failed to delete Dividend!');
        }

        this.isDeleting = false;
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');

        this.isDeleting = false;
      }
    );
  }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.dividentForm.invalid && !this.noResult && !this.noCurrencyFound) {
          return;
      }

      if (this.editDividend) {
        const payload = {
          Id: this.selectedRow.id,
          Symbol : this.dividentForm.value.ticker,
          NoticeDate: moment(this.dividentForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.dividentForm.value.exDate.startDate).format('YYYY-MM-DD'),
          RecordDate: moment(this.dividentForm.value.recordDate.startDate).format('YYYY-MM-DD'),
          PayDate: moment(this.dividentForm.value.payDate.startDate).format('YYYY-MM-DD'),
          Rate: this.dividentForm.value.ratio,
          Currency: this.dividentForm.value.currency,
          WithholdingRate: this.dividentForm.value.holdingRate,
          FxRate: this.dividentForm.value.fxRate,
        };

        this.corporateActionsApiService.updateDividend(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Dividend update successfully!');
            this.dividendModal.hide();
            this.modalClose.emit(true);
            this.onReset();
          })
        )
        .subscribe(
          noop,
          () => this.toastrService.error('Request failed! Please try again')
        );

      } else {
        const payload = {
          Symbol : this.dividentForm.value.ticker,
          NoticeDate: moment(this.dividentForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.dividentForm.value.exDate.startDate).format('YYYY-MM-DD'),
          RecordDate: moment(this.dividentForm.value.recordDate.startDate).format('YYYY-MM-DD'),
          PayDate: moment(this.dividentForm.value.payDate.startDate).format('YYYY-MM-DD'),
          Rate: this.dividentForm.value.ratio,
          Currency: this.dividentForm.value.currency,
          WithholdingRate: this.dividentForm.value.holdingRate,
          FxRate: this.dividentForm.value.fxRate,
        };

        this.corporateActionsApiService.createDividend(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Dividend create successfully!');
            this.dividendModal.hide();
            this.modalClose.emit(true);
            this.onReset();
          })
        )
        .subscribe(
          noop,
          () => this.toastrService.error('Request failed! Please try again')
        );

      }

  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.dividentForm.controls;
  }

  openModal(data) {
    if (data === undefined || !data || data == null) {
      this.dividendModal.show();
    } else {
      this.dividentForm.setValue({
        ticker: data.symbol,
        noticeDate: data.notice_date,
        exDate: data.execution_date,
        recordDate: data.record_date,
        payDate: data.pay_date,
        ratio: data.rate,
        currency: data.currency,
        holdingRate: data.withholding_rate,
        fxRate: data.fx_rate
      });
      this.selectedRow = {};
      this.selectedRow = data;
      this.editDividend = true;
      this.dividendModal.show();
    }

  }

  close() {
    this.dividendModal.hide();
    this.onReset();
    // setTimeout(() => this.clearForm(), 250);
    // this.router.navigateByUrl('/accounts');
  }

  onReset() {
    this.submitted = false;
    this.editDividend = false;
    this.isDeleting = false;
    this.dividentForm.reset();
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  typeaheadNoCurrency(event: boolean): void {
    this.noCurrencyFound = event;
  }

}
