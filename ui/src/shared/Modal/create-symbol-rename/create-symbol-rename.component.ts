import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FinanceServiceProxy } from './../../../services/service-proxies'; // for get symbols
import { CorporateActionsApiService } from './../../../services/corporate-actions.api.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '@lightpointfinancialtechnology/lp-toolkit';
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
  editSymbolRename = false;
  selectedRow;

  @ViewChild('symbolRenameModal', { static: false }) symbolRenameModal: ModalComponent;
  @Output() modalClose = new EventEmitter<any>();

  ticker$: Observable<[]>;
  noResult = false;
  isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private financePocServiceProxy: FinanceServiceProxy,
    private corporateActionsApiService: CorporateActionsApiService
  ) {}

  ngOnInit() {
    this.symbolRenameForm = this.formBuilder.group({
      oldSymbol: ['', Validators.required],
      newSymbol: ['', Validators.required],
      executionDate: ['', Validators.required],
      noticeDate: ['', Validators.required]
    });

    this.getSymbols();
  }

  ngOnChanges(changes: SimpleChanges) {}

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(symbol => {
      this.ticker$ = symbol.payload.map(item => item.symbol);
    });
  }

  onSubmit() {
    this.isSaving = true;
    // stop here if form is invalid
    if (this.symbolRenameForm.invalid && !this.noResult) {
      return;
    }

    if (this.symbolRenameForm.value.oldSymbol === this.symbolRenameForm.value.newSymbol) {
      this.isSaving = false;
      this.toastrService.error('Please Select different symbol!');
      return;
    }

    if (this.editSymbolRename) {
      // For Update symbol rename
      const payload = {
        Id: this.selectedRow.id,
        OldSymbol: this.symbolRenameForm.value.oldSymbol,
        NewSymbol: this.symbolRenameForm.value.newSymbol,
        NoticeDate: moment(this.symbolRenameForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
        ExecutionDate: moment(this.symbolRenameForm.value.executionDate.startDate).format(
          'YYYY-MM-DD'
        )
      };

      this.corporateActionsApiService
        .updateSymbolChange(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Symbol update successfully!');
            this.isSaving = false;
            this.symbolRenameModal.hideModal();
            this.modalClose.emit(true);
            this.onReset();
          })
        )
        .subscribe(noop, () => this.toastrService.error('Request failed! Please try again'));
    } else {
      const payload = {
        // Create new symbol rename
        OldSymbol: this.symbolRenameForm.value.oldSymbol,
        NewSymbol: this.symbolRenameForm.value.newSymbol,
        NoticeDate: moment(this.symbolRenameForm.value.noticeDate.startDate).format('YYYY-MM-DD'),
        ExecutionDate: moment(this.symbolRenameForm.value.executionDate.startDate).format(
          'YYYY-MM-DD'
        )
      };

      this.corporateActionsApiService
        .createSymbolChange(payload)
        .pipe(
          tap(data => {
            this.toastrService.success('Symbol renamed successfully!');
            (this.isSaving = false), this.modalClose.emit(true);
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
      this.symbolRenameModal.showModal();
    } else {
      this.selectedRow = {};
      this.selectedRow = data;
      this.editSymbolRename = true;
      this.symbolRenameForm.setValue({
        oldSymbol: data.old_symbol,
        newSymbol: data.new_symbol,
        executionDate: {
          startDate: moment(data.execution_date),
          endDate: moment(data.execution_date)
        },
        noticeDate: { startDate: moment(data.notice_date), endDate: moment(data.notice_date) }
      });
      this.symbolRenameModal.showModal();
    }
  }

  close() {
    this.symbolRenameModal.hideModal();
    this.onReset();
  }

  onCloseModal() {
    this.onReset();
  }

  onReset() {
    this.editSymbolRename = false;
    this.symbolRenameForm.reset();
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }
}
