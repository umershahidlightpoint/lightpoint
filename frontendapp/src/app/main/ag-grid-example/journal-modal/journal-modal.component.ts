import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { GridRowData, Fund } from '../../../../shared/Models/account'
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies'
import { takeWhile } from "rxjs/operators";

@Component({
  selector: 'app-journal-modal',
  templateUrl: './journal-modal.component.html',
  styleUrls: ['./journal-modal.component.css']
})
export class JournalModalComponent implements OnInit {
  
  allAccounts: GridRowData
  funds: Fund
  isSubscriptionAlive: boolean
  journalForm: FormGroup

  @ViewChild('modal') modal: ModalDirective
  @Output() modalClose = new EventEmitter<any>() 

  
  constructor(
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private financePocServiceProxy: FinancePocServiceProxy
  ) { }

  ngOnInit() {
    this.getAccounts()
    this.getFunds()
    this.buildForm()
    this.isSubscriptionAlive = true
  }

  getAccounts(){
    this.financePocServiceProxy.getAllAccounts().pipe(takeWhile(() => this.isSubscriptionAlive))
    .subscribe(response => {
      console.log('response ==>',response)
      if(response.isSuccessful){
        this.allAccounts = response.payload
      }
    })
  }

  getFunds(){
    this.financePocServiceProxy.getFunds().pipe(takeWhile(() => this.isSubscriptionAlive))
    .subscribe(response => {
      console.log('response funds ==>',response)
      if(response.payload){
        this.funds = response.payload
      }
    })
  }

  buildForm(){
    this.journalForm = this.formBuilder.group({
      fund: ['', Validators.required],
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      value: ['', Validators.required]
    })
  }

  saveJournal(){
    //console.log('saved journal',this.journalForm.value)
    const journalObject = {
      "accountFrom": this.journalForm.value.fromAccount,
      "accountTo": this.journalForm.value.toAccount,
      "value": this.journalForm.value.value,
      "fund": this.journalForm.value.fund
    }
    //console.log('create journal response',journalObject)
    this.financePocServiceProxy.createJounal(journalObject).subscribe(response => {
      //console.log('create journal response',response)
      if(response.isSuccessful){        
        this.toastrService.success('Journal is created successfully !')
        this.modal.hide()
        this.modalClose.emit(true);     
      }
      else {
        this.toastrService.success('Journal is created successfully !')        
      }
    })
  }

  onAccountSelect(value){
    console.log('on account select',value)
  }

  openModal(){
    this.modal.show()
  }

  closeModal(){
    this.clearForm()
    this.modal.hide()
  }

  clearForm(){
    this.isSubscriptionAlive = false
    this.journalForm.controls['fund'].reset()
    this.journalForm.controls['toAccount'].reset()
    this.journalForm.controls['fromAccount'].reset()
    this.journalForm.controls['value'].reset()
  }

}
