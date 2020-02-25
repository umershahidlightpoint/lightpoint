import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-create-security',
  templateUrl: './create-security.component.html',
  styleUrls: ['./create-security.component.scss']
})
export class CreateSecurityComponent implements OnInit {

  securityForm: FormGroup;

  @ViewChild('securityModal', { static: false }) securityModal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  isCollapsedTrade = true;
  isCollapsedFinance = false;

  //Dropdown boolean
  noOfDays = false;
  date = false;
  monthly = false;
  quarterly = false;
  yearly = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  this.initializeForm();
  this.onChanges();
  }

  initializeForm() {
    this.securityForm = this.formBuilder.group({
      security: ['', Validators.required],
      currency: ['', Validators.required],
      tradeQuantity: ['', Validators.required],
      payer: ['', Validators.required],
      payee: ['', [Validators.required]],
      localNetPrice: ['', Validators.required],
      localNetNotional: ['', [Validators.required]],
      tradeDate: [''],
      executionDate: [''],
      maturityDate: [''],
      valuationDate: [''],
      securityReturnDesc: [''],
      spread: [''],
      financingLeg: [''],
      financingEndDate: [''],
      financingPayDate: [''],
      financingResetDate: [''],
      financingResetMonthSelection: [''], ////////////
      financingResetQuarterSelection: [''], //llllllllllllllll
      financingResetDateSelection: [''], //llllllllllllllll
      nextFinancingEndDate: [''],
      fixedRate: [''],
      docFixedRate: [''],
      floatingRate: [''],
      docFloatingRate: [''],
      primaryMarket: [''],
      referenceEquity: [''],
      referenceObligation: [''],
      upfront: [''],
      premiumRate: [''],
      frequencyRate: [''],
  });
  }


  onChanges(): void {
    this.securityForm.get('financingResetDate').valueChanges.subscribe(val => {

      if (val === 'No of days') {
        this.noOfDays = true;
        this.date = false;
        this.monthly = false;
        this.quarterly = false;
        this.yearly = false;
      }
      if (val === 'Date') {
        this.noOfDays = false;
        this.date = true;
        this.monthly = false;
        this.quarterly = false;
        this.yearly = false;
      }
      if (val === 'Monthly') {
        this.noOfDays = false;
        this.date = false;
        this.monthly = true;
        this.quarterly = false;
        this.yearly = false;
      }
      if (val === 'Quarterly') {
        this.noOfDays = false;
        this.date = false;
        this.monthly = false;
        this.quarterly = true;
        this.yearly = false;
      }
      if (val === 'Yearly') {
        this.noOfDays = false;
        this.date = false;
        this.monthly = false;
        this.quarterly = false;
        this.yearly = true;
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

  close() {
    this.securityModal.hide();
    this.isCollapsedTrade = false;
    this.isCollapsedFinance = true;
  }

}
