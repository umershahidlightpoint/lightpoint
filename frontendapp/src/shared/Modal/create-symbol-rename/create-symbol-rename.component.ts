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
import { FinanceServiceProxy } from './../../../services/service-proxies'; // for get symbols
import { CorporateActionsApiService } from './../../../services/corporate-actions.api.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-symbol-rename',
  templateUrl: './create-symbol-rename.component.html',
  styleUrls: ['./create-symbol-rename.component.scss']
})
export class CreateSymbolRenameComponent implements OnInit, OnChanges {

  symbolRenameForm: FormGroup;
  editStockSplit = false;
  selectedRow;

  @ViewChild('symbolRenameModal', { static: false }) symbolRenameModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  stockSplits: any;

  ticker$: Observable<[]>;
  noResult = false;
  isSaving = false;
  isDeleting = false;

  constructor(
     private formBuilder: FormBuilder,
     private toastrService: ToastrService,
     private financePocServiceProxy: FinanceServiceProxy,
     private corporateActionsApiService: CorporateActionsApiService,
     ) {}

  ngOnInit() {

    this.symbolRenameForm = this.formBuilder.group({
      oldSymbol: ['', Validators.required],
      newSymbol: ['', Validators.required],
      executionDate: ['', Validators.required],
      noticeDate: ['', Validators.required],
  });

    this.getSymbols();
  }

  ngOnChanges(changes: SimpleChanges) {}

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(symbol => {
      this.ticker$ = symbol.payload.map(item => item.symbol);
    });
  }

  getStockSplits() {
    this.corporateActionsApiService.getStockSplits().subscribe(response => {
      this.stockSplits = response.payload;
    });
  }

  onSubmit() {
      this.isSaving = true;
      // stop here if form is invalid
      if (this.symbolRenameForm.invalid && !this.noResult) {
          return;
      }

      if (this.editStockSplit) { // For Update symbol rename
        const payload = {
          Id: this.selectedRow.id,
          OldSymbol : this.symbolRenameForm.value.oldSymbol,
          NewSymbol: this.symbolRenameForm.value.newSymbol,
          NoticeDate: moment(this.symbolRenameForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.symbolRenameForm.value.executionDate.startDate).format('YYYY-MM-DD')
        };

        this.corporateActionsApiService.updateStockSplit(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Symbol update successfully!');
            this.isSaving = false;
            this.symbolRenameModal.hide();
            this.modalClose.emit(true);
            this.onReset();
          })
        )
        .subscribe(
          noop,
          () => this.toastrService.error('Request failed! Please try again')
        );

      } else {
        const payload = { // Create new symbol rename
          OldSymbol : this.symbolRenameForm.value.oldSymbol,
          NewSymbol: this.symbolRenameForm.value.newSymbol,
          NoticeDate: moment(this.symbolRenameForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
          ExecutionDate: moment(this.symbolRenameForm.value.executionDate.startDate).format('YYYY-MM-DD')
        };

        this.corporateActionsApiService.createStockSplit(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Symbol renamed successfully!');
            this.getStockSplits();
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

  // convenience getter for easy access to form fields
  get formFields() {
    return this.symbolRenameForm.controls;
  }

  openModal(data) {

    if (data === undefined || !data || data == null) {
      this.symbolRenameModal.show();
    } else {

      this.selectedRow = {};
      this.selectedRow = data;
      this.editStockSplit = true;
      this.symbolRenameForm.setValue({
        oldSymbol: data.symbol,
        newSymbol: data.newSymbol,
        executionDate: {startDate: moment(data.execution_date), endDate: moment(data.execution_date)},
        noticeDate: {startDate: moment(data.notice_date), endDate: moment(data.notice_date)}
      });
      this.symbolRenameModal.show();
    }
    this.getStockSplits();
  }

  openStockSplitModalFromOutside(data) {
    const symbol = data;
    this.symbolRenameForm.patchValue({
      ticker: symbol
    });

    this.symbolRenameModal.show();
  }

  close() {
    this.symbolRenameModal.hide();
    this.onReset();
  }

  onReset() {
    this.editStockSplit = false;
    this.isDeleting = false;
    this.symbolRenameForm.reset();
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

}
