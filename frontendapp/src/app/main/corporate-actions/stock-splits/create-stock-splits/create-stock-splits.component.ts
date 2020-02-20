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
import { FinanceServiceProxy } from './../../../../../services/service-proxies'; // for get symbols
import { CorporateActionsApiService } from './../../../../../services/corporate-actions.api.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-stock-splits',
  templateUrl: './create-stock-splits.component.html',
  styleUrls: ['./create-stock-splits.component.scss']
})
export class CreateStockSplitsComponent implements OnInit, OnChanges {

  stockSplitForm: FormGroup;
  editStockSplit = false;
  selectedRow;

  @ViewChild('stockSplitsModal', { static: false }) stockSplitsModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  @Input() stockSplits: any;

  ticker$: Observable<[]>;
  noResult = false;
  isSaving = false;
  isDeleting = false;
  found = false;

  constructor(
     private formBuilder: FormBuilder,
     private toastrService: ToastrService,
     private financePocServiceProxy: FinanceServiceProxy,
     private corporateActionsApiService: CorporateActionsApiService,
     ) {}

  ngOnInit() {

    const pattern = '^[1-9]+$';
    this.stockSplitForm = this.formBuilder.group({
      ticker: ['', Validators.required],
      noticeDate: ['', Validators.required],
      executionDate: ['', Validators.required],
      topRatio: ['', [Validators.required, Validators.pattern(pattern), Validators.min(1)]],
      bottomRatio: ['', [Validators.required, Validators.pattern(pattern), Validators.min(1)]],
      adjustmentFactor: [''],
  });

    this.onChanges();
    this.getSymbols();
  }

  ngOnChanges(changes: SimpleChanges) {}

  onChanges(): void {
    this.stockSplitForm.get('topRatio').valueChanges.subscribe(val => {
      if (val > 0 && this.stockSplitForm.value.bottomRatio > 0) {
        const adjustmentFactor = val / this.stockSplitForm.value.bottomRatio;
        this.setAdjustmentFactor(adjustmentFactor);
      }
    });

    this.stockSplitForm.get('bottomRatio').valueChanges.subscribe(val => {
      if (val > 0 && this.stockSplitForm.value.topRatio > 0) {
        const adjustmentFactor = this.stockSplitForm.value.topRatio / val;
        this.setAdjustmentFactor(adjustmentFactor);
      }
    });
  }

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(symbol => {
      this.ticker$ = symbol.payload.map(item => item.symbol);
    });
  }

  deleteStockSplit() {
    this.isDeleting = true;
    this.corporateActionsApiService.deleteStockSplit(this.selectedRow.id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Stock Splits is deleted successfully!');

          this.stockSplitsModal.hide();
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
      if (this.stockSplitForm.invalid && !this.noResult) {
          return;
      }

      if (this.editStockSplit) { // For Update stock split
        const payload = {
          Id: this.selectedRow.id,
          Symbol : this.stockSplitForm.value.ticker,
          NoticeDate: moment(this.stockSplitForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.stockSplitForm.value.executionDate.startDate).format('YYYY-MM-DD'),
          TopRatio: this.stockSplitForm.value.topRatio,
          BottomRatio: this.stockSplitForm.value.bottomRatio,
          AdjustmentFactor: this.stockSplitForm.value.adjustmentFactor
        };

        // execution date should grater than notice date
        if (payload.ExecutionDate < payload.NoticeDate) {
          this.toastrService.error('Error! Execution date should be greater than notice date');
          this.isSaving = false;
          return;
        }

        this.found = this.stockSplits.filter(x => x.id !== payload.Id).some(
          items => items.symbol === payload.Symbol &&
                   moment(items.execution_date).format('YYYY-MM-DD') === payload.ExecutionDate
          );


        if (this.found) {
          this.toastrService.error('Error! Duplicate record exists, Please chnage symbol or execution date');
          this.isSaving = false;
        } else {

        this.corporateActionsApiService.updateStockSplit(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Stock Split update successfully!');
            this.isSaving = false;
            this.stockSplitsModal.hide();
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
        const payload = { // Create new stock split

          Symbol : this.stockSplitForm.value.ticker,
          NoticeDate: moment(this.stockSplitForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.stockSplitForm.value.executionDate.startDate).format('YYYY-MM-DD'),
          TopRatio: this.stockSplitForm.value.topRatio,
          BottomRatio: this.stockSplitForm.value.bottomRatio,
          AdjustmentFactor: this.stockSplitForm.value.adjustmentFactor
        };

        // execution date should grater than notice date
        if (payload.ExecutionDate < payload.NoticeDate) {
          this.toastrService.error('Error! Execution date should be greater than notice date');
          this.isSaving = false;
          return;
        }

        this.found = this.stockSplits.some(
          items => items.symbol === payload.Symbol && moment(items.execution_date).format('YYYY-MM-DD') === payload.ExecutionDate
          );

        if (this.found) {
          this.toastrService.error('Error! Duplicate record exists, Please chnage symbol or execution date');
          this.isSaving = false;

        } else {
        this.corporateActionsApiService.createStockSplit(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Stock Splits create successfully!');
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
    return this.stockSplitForm.controls;
  }

  setAdjustmentFactor(value) {
    this.stockSplitForm.patchValue({
      adjustmentFactor: value
    });
  }

  openModal(data) {

    if (data === undefined || !data || data == null) {
      this.stockSplitsModal.show();
    } else {

      this.selectedRow = {};
      this.selectedRow = data;
      this.editStockSplit = true;
      this.stockSplitForm.setValue({
        ticker: data.symbol,
        noticeDate: { startDate: moment(data.notice_date), endDate: moment(data.notice_date) },
        executionDate: { startDate: moment(data.execution_date), endDate: moment(data.execution_date) },
        topRatio: data.top_ratio,
        bottomRatio: data.bottom_ratio,
        adjustmentFactor: data.adjustment_factor
      });
      this.stockSplitsModal.show();
    }

  }

  close() {
    this.stockSplitsModal.hide();
    this.onReset();
  }

  onReset() {
    this.editStockSplit = false;
    this.isDeleting = false;
    this.stockSplitForm.reset();
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

}
