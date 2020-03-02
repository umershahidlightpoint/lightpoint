import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, noop } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { FinanceServiceProxy } from '../../../services/service-proxies'; // for get symbols
import { SecurityApiService } from '../../../services/security-api.service';

@Component({
  selector: 'app-create-security',
  templateUrl: './create-security.component.html',
  styleUrls: ['./create-security.component.scss']
})
export class CreateSecurityComponent implements OnInit {

  securityForm: FormGroup;

  @ViewChild('securityModal', { static: false }) securityModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  showTrade = true;
  showFinancing = true;

  symbol$: Observable<[]>;
  noResult = false;
  isSaving = false;
  isDeleting = false;

  isCollapsedTrade = false;
  isCollapsedFinance = false;

  resetDate = false;
  endDate = false;

  constructor(private formBuilder: FormBuilder,
              private financePocServiceProxy: FinanceServiceProxy,
              private toastrService: ToastrService,
              private securityApiService: SecurityApiService,
              ) { }

  ngOnInit() {

    this.showTrade = false;
    this.initializeForm();
    this.getSymbols();
    this.onChanges();

  }

  initializeForm() {
    this.securityForm = this.formBuilder.group({
      // Trade
      security: [''],
      currency: [''],
      tradeQuantity: [''],
      tradeDate: [''],
      executionDate: [''],
      payer: [''],
      payee: [''],
      localNetPrice: [''],
      localNetNotional: [''],
      // Financing
      symbol: ['', Validators.required],
      maturityDate: [''],
      valuationDate: [''],
      securityReturnDesc: [''],
      spread: [''],
      financingLeg: [''],
      financingEndDate: [''],
      financingPayDate: [''],
      financingResetDateType: [''],
      financingResetDate: [''],
      nextFinancingEndDateType: [''],
      nextFinancingEndDate: [''],
      fixedRate: [''],
      dccFixedRate: [''],
      floatingRate: [''],
      dccFloatingRate: [''],
      primaryMarket: [''],
      referenceEquity: [''],
      referenceObligation: [''],
      upfront: [''],
      premiumRate: [''],
      frequencyRate: [''],
  });
  }

  getSymbols() {
    this.financePocServiceProxy.getSymbol().subscribe(symbol => {
      this.symbol$ = symbol.payload.map(item => item.symbol);
    });
  }

  onChanges(): void {
    this.securityForm.get('financingResetDateType').valueChanges.subscribe(val => {
      if (!val || val !== null || val !== undefined) {
        this.resetDate = true;
      }
    });

    this.securityForm.get('nextFinancingEndDateType').valueChanges.subscribe(value => {
      if (!value || value !== null || value !== undefined) {
        this.endDate = true;
      }
    });
  }

  // convenience getter for easy access to form fields
  get formFields() {
     return this.securityForm.controls;
  }

  openModal(data) {
    this.securityModal.show();
  }

  openSecurityModalFromOutside(data, entryPoint) {
    const symbol = data;

    if (entryPoint === 'createSecurity') {
      this.showTrade = false;
      this.showFinancing = true;
    } else {
      this.showTrade = true;
      this.showFinancing = true;
    }

    this.securityForm.patchValue({
      security: symbol
    });

    this.securityModal.show();
  }

  onReset() {
    this.isDeleting = false;
    this.securityForm.reset();
  }

  onSubmit() {
    this.isSaving = true;
    // stop here if form is invalid
    if (this.securityForm.invalid && !this.noResult) {
        return;
    }

    const payload = {
        Symbol : this.securityForm.value.symbol,
        MaturityDate: moment(this.securityForm.value.maturityDate.startDate).format('YYYY-MM-DD'),
        ValuationDate: moment(this.securityForm.value.valuationDate.startDate).format('YYYY-MM-DD'),
        SecurityReturnDescription: moment(this.securityForm.value.securityReturnDesc.startDate).format('YYYY-MM-DD'),
        Spread: this.securityForm.value.spread,
        FinancingLeg: this.securityForm.value.financingLeg,
        FinancingEndDate: moment(this.securityForm.value.financingEndDate.startDate).format('YYYY-MM-DD'),
        FinancingPaymentDate: moment(this.securityForm.value.financingPayDate.startDate).format('YYYY-MM-DD'),
        FinancingResetDateType: this.securityForm.value.financingResetDateType,
        FinancingResetDate: moment(this.securityForm.value.financingResetDate.startDate).format('YYYY-MM-DD'),
        NextFinancingEndDateType: this.securityForm.value.nextFinancingEndDateType,
        NextFinancingEndDate: moment(this.securityForm.value.nextFinancingEndDate.startDate).format('YYYY-MM-DD'),
        FixedRate: this.securityForm.value.fixedRate,
        DCCFixedRate: this.securityForm.value.dccFixedRate,
        FloatingRate: this.securityForm.value.floatingRate,
        DCCFloatingRate: this.securityForm.value.dccFloatingRate,
        PrimaryMarket: this.securityForm.value.primaryMarket,
        ReferenceEquity: this.securityForm.value.referenceEquity,
        ReferenceObligation: this.securityForm.value.referenceObligation,
        Upfront: this.securityForm.value.upfront,
        PremiumRate: this.securityForm.value.premiumRate,
        PremiumFrequency: this.securityForm.value.frequencyRate,
      };

    this.securityApiService.createSecurity(payload)
      .pipe(
        tap(data => {
          this.toastrService.success('Financing created successfully!');
          // this.getDividends();
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

  close() {
    this.securityModal.hide();
    this.isCollapsedTrade = false;
    this.isCollapsedFinance = false;
    this.resetDate = false;
    this.endDate = false;
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

}
