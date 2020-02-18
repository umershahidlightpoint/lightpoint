import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
import { ToastrService } from 'ngx-toastr';
import { Observable, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-dividend',
  templateUrl: './create-dividend.component.html',
  styleUrls: ['./create-dividend.component.scss']
})
export class CreateDividendComponent implements OnInit, OnChanges {

  dividentForm: FormGroup;
  editDividend = false;
  selectedRow;

  @ViewChild('dividendModal', { static: false }) dividendModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  @Input() dividends: any;

  currencies$: Observable<string[]>;
  ticker$: Observable<[]>;
  noResult = false;
  noCurrencyFound = false;
  isSaving = false;
  isDeleting = false;
  found = false;

  constructor(
     private formBuilder: FormBuilder,
     private toastrService: ToastrService,
     private settingApiService: SettingApiService,
     private financePocServiceProxy: FinanceServiceProxy,
     private corporateActionsApiService: CorporateActionsApiService,
     ) {}

  ngOnInit() {

    this.dividentForm = this.formBuilder.group({
      ticker: ['', Validators.required],
      noticeDate: ['', Validators.required],
      exDate: ['', Validators.required],
      recordDate: ['', Validators.required],
      payDate: ['', [Validators.required]],
      ratio: ['', Validators.required],
      currency: ['', Validators.required],
      holdingRate: ['', Validators.required],
      fxRate: ['', Validators.required]
  });

    this.getCurrencies();
    this.getSymbols();
    this.getDividends();
  }

  ngOnChanges(changes: SimpleChanges) {}

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
      this.isSaving = true;
      // stop here if form is invalid
      if (this.dividentForm.invalid && !this.noResult && !this.noCurrencyFound) {
          return;
      }

      if (this.editDividend) { // For Update dividend
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

        this.found = this.dividends.filter(x => x.id !== payload.Id).some(
          items => items.symbol === payload.Symbol &&
                   moment(items.execution_date).format('YYYY-MM-DD') === payload.ExecutionDate
          );

        if (this.found) {
          this.toastrService.error('Error! Duplicate record exists, Please chnage symbol or execution date');
          this.isSaving = false;
        } else {

        this.corporateActionsApiService.updateDividend(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Dividend update successfully!');
            this.isSaving = false;
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

        this.found = this.dividends.some(
          items => items.symbol === payload.Symbol && moment(items.execution_date).format('YYYY-MM-DD') === payload.ExecutionDate
          );

        if (this.found) {
          this.toastrService.error('Error! Duplicate record exists, Please chnage symbol or execution date');
          this.isSaving = false;

        } else {
        this.corporateActionsApiService.createDividend(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Dividend create successfully!');
            this.isSaving = false,
            this.modalClose.emit(true);
            this.onReset();
          })
        )
        .subscribe(
          noop, // perform no operation
          () => this.toastrService.error('Request failed! Please try again')
        );
        }
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

      this.selectedRow = {};
      this.selectedRow = data;
      this.editDividend = true;
      this.dividentForm.setValue({
        ticker: data.symbol,
        noticeDate: { startDate: moment(data.notice_date), endDate: moment(data.notice_date) },
        exDate: { startDate: moment(data.execution_date), endDate: moment(data.execution_date) },
        recordDate: { startDate: moment(data.record_date), endDate: moment(data.record_date) },
        payDate: { startDate: moment(data.pay_date), endDate: moment(data.pay_date) },
        ratio: data.rate,
        currency: data.currency,
        holdingRate: data.withholding_rate,
        fxRate: data.fx_rate
      });
      this.dividendModal.show();
    }

  }

  close() {
    this.dividendModal.hide();
    this.onReset();
  }

  onReset() {
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
