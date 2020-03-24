import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, noop } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
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

  showFinancing = true;

  symbol$: Observable<[]>;
  securityType$;
  selectSymbol;
  displayFields;

  noResult = false;
  noSecurityType = false;
  isSaving = false;
  isLoading = false;

  editSecurity = false;
  // isDeleting = false;
  selectedRow;

  resetDate = false;
  endDate = false;

  // Boolean
  MaturityDate = false;
  ValuationDate = false;
  Spread = false;
  SecurityReturnDescription = false;
  FinancingLeg = false;
  FinancingEndDate = false;
  FinancingPaymentDate = false;
  FinancingResetDateType = false;

  fNoOfDays = false;
  nextFinanceNoOfDays = false;

  FinancingResetDate = false;
  NextFinancingEndDateType = false;
  NextFinancingEndDate = false;
  FixedRate = false;
  DCCFixedRate = false;
  FloatingRate = false;
  DCCFloatingRate = false;
  PrimaryMarket = false;
  ReferenceEquity = false;
  ReferenceObligation = false;
  Upfront = false;
  PremiumRate = false;
  PremiumFrequency = false;

  constructor(private formBuilder: FormBuilder,
              private financePocServiceProxy: FinanceServiceProxy,
              private toastrService: ToastrService,
              private securityApiService: SecurityApiService,
              ) { }

  ngOnInit() {

    this.initializeForm();
    this.getSymbols();
    this.getSecurityTypes();
    this.onChanges();
  }

  initializeForm() {
    this.securityForm = this.formBuilder.group({
      symbol: ['', Validators.required],
      securityType: ['', Validators.required],
      maturityDate: [''],
      valuationDate: [''],
      securityReturnDesc: [''],
      spread: [''],
      financingLeg: [''],
      financingEndDate: [''],
      financingPayDate: [''],
      financingResetDateType: [''],
      financingNoOfDays: [''],
      financingResetDate: [''],
      nextFinancingEndDateType: [''],
      nextFinancingNoOfDays: [''],
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

  getSecurityTypes() {
    this.securityApiService.getSecurityTypes().subscribe(securityType => {
        this.securityType$ = securityType.payload.map(item => item.SecurityTypeCode);
    });
  }

  onChanges(): void {
    this.securityForm.get('financingResetDateType').valueChanges.subscribe(val => {
      if (val === null ) {
        this.resetDate = false;
        this.fNoOfDays = false;
      }

      if (val === 'Date') {
        this.resetDate = true;
        this.securityForm.patchValue({
          financingNoOfDays: ''
        });
        this.fNoOfDays = false;
      }

      if (val === 'No of days' || val === 'Monthly' || val === 'Quarterly' || val === 'Yearly') {
        this.resetDate = false;
        this.securityForm.patchValue({
          FinancingResetDate: ''
        });
        this.fNoOfDays = true;
      }

    });

    this.securityForm.get('nextFinancingEndDateType').valueChanges.subscribe(value => {
      if (value == null) {
        this.endDate = false;
        this.nextFinanceNoOfDays = false;
      }
      if (value === 'Date') {
        this.endDate = true;
        this.securityForm.patchValue({
          nextFinancingNoOfDays: ''
        });
        this.nextFinanceNoOfDays = false;
      }

      if (value === 'No of days' || value === 'Monthly' || value === 'Quarterly' || value === 'Yearly') {
        this.endDate = false;
        this.securityForm.patchValue({
          nextFinancingEndDate: ''
        });
        this.nextFinanceNoOfDays = true;
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // convenience getter for easy access to form fields
  get formFields() {
     return this.securityForm.controls;
  }

  openModal(data) {
    if (data === undefined || !data || data == null) {
      this.securityModal.show();
    }
  }

  openSecurityModalFromOutside(symbol, securityType, secFields, FormData, EntryPoint) {
    const secSymbol = symbol;
    const secType = securityType;
    const fields = secFields;

    if (FormData === null) {
      this.editSecurity = false;
      this.showFields(fields);
      this.securityForm.patchValue({
      symbol: secSymbol,
      securityType: secType
    });
      this.securityModal.show();
    } else {
      this.selectedRow = {};
      this.editSecurity = true;
      this.selectedRow = FormData;
      this.showFields(fields);
      this.patchValues(symbol, securityType, FormData);
      this.securityModal.show();
    }
  }

  openEditModal(data, securityType, secFields, FormData, EntryPoint) {

    this.selectedRow = {};
    this.selectedRow = data;
    let secType;
    secType = null;
    secType = data.security_type ? data.security_type : securityType;
    const fields = secFields;
    this.editSecurity = true;
    this.showFields(fields);
    this.patchValues(data.symbol, secType, FormData);
    this.securityModal.show();
  }

  onSubmit() {
    this.isSaving = true;
    // stop here if form is invalid
    if (this.securityForm.invalid && !this.noResult && !this.noSecurityType) {
        return;
    }

    if (this.editSecurity) { // for update security

      let updateNoOfdays = null;
      let updateResetDate = null;

      if (this.securityForm.value.financingResetDateType !== 'Date') {
        updateNoOfdays = this.securityForm.value.financingNoOfDays;
        updateResetDate = null;
      }

      if (this.securityForm.value.financingResetDateType === 'Date') {
        updateNoOfdays = null;
        updateResetDate = this.securityForm.value.financingResetDate ?
        moment(this.securityForm.value.financingResetDate.startDate).format('YYYY-MM-DD') : null;
      }

      // For NextFinanceDateType
      let nextFnoOfdays = null;
      let nextFresetDate = null;

      if (this.securityForm.value.nextFinancingEndDateType !== 'Date') {
        nextFnoOfdays = this.securityForm.value.nextFinancingNoOfDays;
        nextFresetDate = null;
      }

      if (this.securityForm.value.nextFinancingEndDateType === 'Date') {
        nextFnoOfdays = null;
        nextFresetDate = this.securityForm.value.nextFinancingEndDate ?
          moment(this.securityForm.value.nextFinancingEndDate.startDate).format('YYYY-MM-DD') : null;
      }
      // End NextFinanceDateType
      const payload = {
        Id: this.selectedRow.id,
        Symbol : this.securityForm.value.symbol,
        SecurityType : this.securityForm.value.securityType,
        MaturityDate:  this.securityForm.value.maturityDate ?
                       moment(this.securityForm.value.maturityDate.startDate).format('YYYY-MM-DD') : null,
        ValuationDate: this.securityForm.value.valuationDate ?
                       moment(this.securityForm.value.valuationDate.startDate).format('YYYY-MM-DD') : null,
        SecurityReturnDescription: this.securityForm.value.securityReturnDesc,
        Spread: this.securityForm.value.spread,
        FinancingLeg: this.securityForm.value.financingLeg,
        FinancingEndDate: this.securityForm.value.financingEndDate ?
                          moment(this.securityForm.value.financingEndDate.startDate).format('YYYY-MM-DD') : null,
        FinancingPaymentDate: this.securityForm.value.financingPayDate ?
                              moment(this.securityForm.value.financingPayDate.startDate) : null,
        FinancingResetDateType: this.securityForm.value.financingResetDateType,
        FinancingResetDate: updateNoOfdays !== null ? updateNoOfdays : updateResetDate,
        NextFinancingEndDateType: this.securityForm.value.nextFinancingEndDateType,
        NextFinancingEndDate: nextFnoOfdays !== null ? nextFnoOfdays : nextFresetDate,
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

      if (payload.FinancingResetDate === 'Invalid date') {
        payload.FinancingResetDate = null;
      }

      if (payload.NextFinancingEndDate === 'Invalid date') {
        payload.NextFinancingEndDate = null;
      }

      this.securityApiService.updateSecurity(payload)
      .pipe(
        tap(data => {
          if(data.statusCode === 200) {
            this.toastrService.success('Security details updated successfully!');
            this.isSaving = false,
            this.securityModal.hide();
            this.modalClose.emit(true);
            this.resetFields();
          } else {
            this.toastrService.error(data.Message);
          }
        })
      )
      .subscribe(
        noop, // perform no operation
        () => this.toastrService.error('The request failed')
      );

    } else { // for newly create security

      //For Finance ResetDateType
      let noOfdays = null;
      let resetDate = null;

      if (this.securityForm.value.financingResetDateType !== 'Date') {
        noOfdays = this.securityForm.value.financingNoOfDays;
        resetDate = null;
      }

      if (this.securityForm.value.financingResetDateType === 'Date') {
        noOfdays = null;
        resetDate = this.securityForm.value.financingResetDate ?
          moment(this.securityForm.value.financingResetDate.startDate).format('YYYY-MM-DD') : null;
      }

      // For NextFinanceDateType
      let nextFnoOfdays = null;
      let nextFresetDate = null;

      if (this.securityForm.value.nextFinancingEndDateType !== 'Date') {
        nextFnoOfdays = this.securityForm.value.nextFinancingNoOfDays;
        nextFresetDate = null;
      }

      if (this.securityForm.value.nextFinancingEndDateType === 'Date') {
        nextFnoOfdays = null;
        nextFresetDate = this.securityForm.value.nextFinancingEndDate ?
          moment(this.securityForm.value.nextFinancingEndDate.startDate).format('YYYY-MM-DD') : null;
      }

      const payload = {
        Symbol : this.securityForm.value.symbol,
        SecurityType: this.securityForm.value.securityType,
        MaturityDate:  this.securityForm.value.maturityDate ?
                       moment(this.securityForm.value.maturityDate.startDate).format('YYYY-MM-DD') : null,
        ValuationDate: this.securityForm.value.valuationDate ?
                       moment(this.securityForm.value.valuationDate.startDate).format('YYYY-MM-DD') : null,
        SecurityReturnDescription: this.securityForm.value.securityReturnDesc,
        Spread: this.securityForm.value.spread,
        FinancingLeg: this.securityForm.value.financingLeg,
        FinancingEndDate: this.securityForm.value.financingEndDate ?
                          moment(this.securityForm.value.financingEndDate.startDate).format('YYYY-MM-DD') : null,
        FinancingPaymentDate: this.securityForm.value.financingPayDate ?
                              moment(this.securityForm.value.financingPayDate.startDate) : null,
        FinancingResetDateType: this.securityForm.value.financingResetDateType,
        FinancingResetDate:  noOfdays !== null ? noOfdays : resetDate,
        NextFinancingEndDateType: this.securityForm.value.nextFinancingEndDateType,
        NextFinancingEndDate: nextFnoOfdays !== null ? nextFnoOfdays : nextFresetDate,
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

      if (payload.FinancingResetDate === 'Invalid date') {
        payload.FinancingResetDate = null;
      }

      if (payload.NextFinancingEndDate === 'Invalid date') {
        payload.NextFinancingEndDate = null;
      }

      this.securityApiService.createSecurity(payload)
      .pipe(
        tap(data => {
          if(data.statusCode === 200) {
            this.toastrService.success('Security details created successfully!');
            this.isSaving = false,
            this.modalClose.emit(true);
            this.resetFields();
            this.securityModal.hide();
          } else {
            this.toastrService.error(data.Message);
          }
        })
      )
      .subscribe(
        noop, // perform no operation
        () => this.toastrService.error('The request failed')
      );
    }

  }

  close() {
    this.securityModal.hide();
    this.resetFields();
    this.selectSymbol = null;
  }

  selectedSymbol(event: TypeaheadMatch): void {
    this.isLoading = true;
    this.selectSymbol = event.value;
    this.resetFields();

    this.securityApiService.getDataForSecurityModal(event.item).subscribe(
      ([config, securityDetails]: [any, any]) => {
        // config : contains securityType and fields related to securityType
        // securityDetails : fetch details or populate fields related to the securityType

        if (config.statusCode !== 200) {
          this.isLoading = false;
          this.toastrService.error(config.message);
          return;
        }

        if (securityDetails.statusCode !== 200) {
          this.isLoading = false;
          this.toastrService.error(securityDetails.message);
          return;
        }

        if (!config.isSuccessful) {
          this.isLoading = false;
          this.toastrService.error(config.message);
          return;
        }

        if (securityDetails.payload.length === 0) {
          this.isLoading = false;
          this.securityForm.patchValue({
            symbol: event.item,
            securityType: config.payload[0].SecurityType
          });
          this.showFields(config.payload[0].Fields);
      } else {
        this.resetSpecificFields();
        this.securityApiService.getSecurityType(securityDetails.payload[0].security_type).subscribe( data => {
          this.displayFields = data.payload[0].Fields;
          this.isLoading = false;
          this.editSecurity = true;
          this.showFields(this.displayFields);
          this.patchValues(event.item, securityDetails.payload[0].security_type, securityDetails.payload[0]);
          this.displayFields = {};
        });
      }

      },
      error => {
        this.toastrService.error('The request failed');
      }
    );
  }

  selectedSecurityType(event: TypeaheadMatch): void {
    this.displayFields = null;
    this.securityApiService.getSecurityType(event.item).subscribe(data => {
      this.displayFields = data.payload[0].Fields;
    });

    this.fNoOfDays = false;
    this.nextFinanceNoOfDays = false;
    this.resetSpecificFields();
    this.onChanges();

    if (this.securityForm.value.symbol === null || this.securityForm.value.symbol === '' || this.securityForm.value.symbol === undefined) {

      this.securityApiService.getSecurityType(event.item).subscribe(data => {

        this.showFields(data.payload[0].Fields);
      });

    } else {
      this.resetSpecificFields();
      this.securityApiService.getDataForSecurityModal(this.securityForm.value.symbol).subscribe(
        ([config, securityDetails]: [any, any]) => {

          if (securityDetails.payload.length === 0 && this.securityForm.value.securityType !== config.payload[0].SecurityType) {
            this.securityForm.patchValue({
              symbol: this.securityForm.value.symbol,
              securityType: this.securityForm.value.securityType
            });
            this.showFields(this.displayFields);
          }

          if (securityDetails.payload.length === 0 && this.securityForm.value.securityType === config.payload[0].SecurityType) {
            this.securityForm.patchValue({
              symbol: this.securityForm.value.symbol,
              securityType: config.payload[0].SecurityType
            });
            this.showFields(config.payload[0].Fields);

        } else {
          if (this.securityForm.value.securityType === securityDetails.payload[0].security_type) {
            this.editSecurity = true;
            this.showFields(config.payload[0].Fields);
            this.patchValues(this.securityForm.value.symbol, this.securityForm.value.securityType, securityDetails.payload[0]);
          } else {
            this.editSecurity = true;
            this.showFields(this.displayFields);
            this.displayFields = null;
          }
        }
        }

      )
    }
  }

  showFields(fields) {
    fields.map(items => {
      if (items.FieldName === 'MaturityDate') { this.MaturityDate = true; }
      if (items.FieldName === 'ValuationDate') { this.ValuationDate = true; }
      if (items.FieldName === 'Spread') { this.Spread = true; }
      if (items.FieldName === 'SecurityReturnDescription') { this.SecurityReturnDescription = true; }
      if (items.FieldName === 'FinancingLeg') { this.FinancingLeg = true; }
      if (items.FieldName === 'FinancingEndDate') { this.FinancingEndDate = true; }
      if (items.FieldName === 'FinancingResetDate') { this.FinancingResetDate = true; }
      if (items.FieldName === 'NextFinancingEndDate') { this.NextFinancingEndDate = true; }
      if (items.FieldName === 'FinancingPaymentDate') { this.FinancingPaymentDate = true; }
      if (items.FieldName === 'FixedRate') { this.FixedRate = true; }
      if (items.FieldName === 'DCCFixedRate') { this.DCCFixedRate = true; }
      if (items.FieldName === 'FloatingRate') { this.FloatingRate = true; }
      if (items.FieldName === 'DCCFloatingRate') { this.DCCFloatingRate = true; }
      if (items.FieldName === 'PrimaryMarket') { this.PrimaryMarket = true; }
      if (items.FieldName === 'ReferenceEquity') { this.ReferenceEquity = true; }
      if (items.FieldName === 'ReferenceObligation') { this.ReferenceObligation = true; }
      if (items.FieldName === 'Upfront') { this.Upfront = true; }
      if (items.FieldName === 'PremiumRate') { this.PremiumRate = true; }
      if (items.FieldName === 'PremiumFrequency') { this.PremiumFrequency = true; }
    });
  }

  patchValues(symb, secType, formData) {
    this.securityForm.patchValue({
      symbol: symb,
      securityType: secType
    });
    if (formData.maturity_date !== null) {
      this.securityForm.patchValue({
      maturityDate: { startDate: moment(formData.maturity_date), endDate: moment(formData.maturity_date) },
    });
    }
    if (formData.valuation_date !== null) {
      this.securityForm.patchValue({
      valuationDate: { startDate: moment(formData.valuation_date), endDate: moment(formData.valuation_date) },
    });
    }
    if (formData.spread !== null) {
       this.securityForm.patchValue({
        spread: formData.spread
      });
    }
    if (formData.security_return_description !== null) {
       this.securityForm.patchValue({
        securityReturnDesc: formData.security_return_description
      });
    }
    if (formData.financing_leg !== null) {
      this.securityForm.patchValue({
       financingLeg: formData.security_return_description
     });
   }
    if (formData.financing_end_date !== null) {
    this.securityForm.patchValue({
      financingEndDate: { startDate: moment(formData.financing_end_date), endDate: moment(formData.financing_end_date) },
   });
   }
    if (formData.financing_payment_date !== null) {
    this.securityForm.patchValue({
      financingPayDate: { startDate: moment(formData.financing_payment_date), endDate: moment(formData.financing_payment_date) },
   });
   }
    if (formData.financing_reset_date_type !== null) {
    this.securityForm.patchValue({
      financingResetDateType: formData.financing_reset_date_type
   });
   }
    if (formData.financing_reset_date !== null ) {
      if (formData.financing_reset_date_type !== 'Date') {
        this.securityForm.patchValue({
          financingNoOfDays: formData.financing_reset_date
       });
      } else {
        this.securityForm.patchValue({
          financingResetDate: { startDate: moment(formData.financing_reset_date), endDate: moment(formData.financing_reset_date) },
       });
      }
   }
    if (formData.next_financing_end_date_type !== null) {
    this.securityForm.patchValue({
      nextFinancingEndDateType: formData.next_financing_end_date_type
   });
   }
    if (formData.next_financing_end_date !== null) {
      if (formData.next_financing_end_date_type !== 'Date') {
        this.securityForm.patchValue({
          nextFinancingNoOfDays: formData.next_financing_end_date
       });
      } else {
        this.securityForm.patchValue({
          nextFinancingEndDate: { startDate: moment(formData.next_financing_end_date), endDate: moment(formData.next_financing_end_date) },
       });
      }
   }
    if (formData.fixed_rate !== null) {
    this.securityForm.patchValue({
      fixedRate: formData.fixed_rate
   });
   }
    if (formData.dcc_fixed_rate !== null) {
    this.securityForm.patchValue({
      dccFixedRate: formData.dcc_fixed_rate
   });
   }
    if (formData.floating_rate !== null) {
    this.securityForm.patchValue({
      floatingRate: formData.floating_rate
   });
   }
    if (formData.dcc_floating_rate !== null) {
    this.securityForm.patchValue({
      dccFloatingRate: formData.dcc_floating_rate
   });
   }
    if (formData.primary_market !== null) {
    this.securityForm.patchValue({
      primaryMarket: formData.primary_market
   });
   }
    if (formData.reference_equity !== null) {
    this.securityForm.patchValue({
      referenceEquity: formData.reference_equity
   });
   }
    if (formData.reference_obligation !== null) {
    this.securityForm.patchValue({
      referenceObligation: formData.reference_obligation
   });
   }
    if (formData.upfront !== null) {
    this.securityForm.patchValue({
      upfront: formData.upfront
   });
   }
    if (formData.premium_rate !== null) {
    this.securityForm.patchValue({
      premiumRate: formData.premium_rate
   });
   }
    if (formData.premium_frequency !== null) {
    this.securityForm.patchValue({
      frequencyRate: formData.premium_frequency
   });
   }

  }

  resetFields() {

    // this.isDeleting = false;
    this.editSecurity = false;
    // this.selectSymbol = null;

    this.MaturityDate = false;
    this.ValuationDate = false;

    this.Spread = false;
    this.SecurityReturnDescription = false;
    this.FinancingLeg = false;
    this.FinancingEndDate = false;
    this.FinancingPaymentDate = false;
    this.resetDate = false;
    this.endDate = false;
    this.FinancingResetDate = false;
    this.NextFinancingEndDate = false;
    this.FixedRate = false;
    this.DCCFixedRate = false;
    this.FloatingRate = false;
    this.DCCFloatingRate = false;
    this.PrimaryMarket = false;
    this.ReferenceEquity = false;
    this.ReferenceObligation = false;
    this.Upfront = false;
    this.PremiumRate = false;
    this.PremiumFrequency = false;
    this.securityForm.reset();
  }

  resetSpecificFields(){
    this.editSecurity = false;

    this.MaturityDate = false;
    this.ValuationDate = false;

    this.Spread = false;
    this.SecurityReturnDescription = false;
    this.FinancingLeg = false;
    this.FinancingEndDate = false;
    this.FinancingPaymentDate = false;
    this.resetDate = false;
    this.endDate = false;
    this.FinancingResetDate = false;
    this.NextFinancingEndDate = false;
    this.FixedRate = false;
    this.DCCFixedRate = false;
    this.FloatingRate = false;
    this.DCCFloatingRate = false;
    this.PrimaryMarket = false;
    this.ReferenceEquity = false;
    this.ReferenceObligation = false;
    this.Upfront = false;
    this.PremiumRate = false;
    this.PremiumFrequency = false;

    this.securityForm.patchValue({
      maturityDate: '',
      valuationDate: '',
      securityReturnDesc: '',
      spread: '',
      financingLeg: '',
      financingEndDate: '',
      financingPayDate: '',
      financingResetDateType: '',
      financingNoOfDays: '',
      financingResetDate: '',
      nextFinancingEndDateType: '',
      nextFinancingNoOfDays: '',
      nextFinancingEndDate: '',
      fixedRate: '',
      dccFixedRate: '',
      floatingRate: '',
      dccFloatingRate: '',
      primaryMarket: '',
      referenceEquity: '',
      referenceObligation: '',
      upfront: '',
      premiumRate: '',
      frequencyRate: '',
   });
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }
  typeaheadNoSecurityFound(event: boolean): void {
    this.noSecurityType = event;
  }

}
