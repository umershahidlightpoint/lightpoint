import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Account, EditAccount } from '../../../shared/Types/account'
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  editCase: boolean = false
  categoryLabel: string
  clickedAccountId: number
  nameLabel: string
  Label: string
  accountTypeNames = [
    {
      id: 1, 
      type: 'Liability'
    },
    {
      id: 2, 
      type: 'Asset'
    }
  ]
  ledgerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('',Validators.required),
    category: new FormControl('', Validators.required),
  })
  accountInstance: Account
  editAccountInstance: EditAccount
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  constructor(
    @Inject(Router) private router: Router,
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService:  ToastrService 
  ) { 
  }

  ngOnInit() {
  }

  show(userData) {
    console.log('object recieved',userData)
    this.clickedAccountId = userData.Id
    if(Object.keys(userData).length !== 0){
      console.log('in')
      this.editCase = true
      this.ledgerForm.patchValue({
        'name': userData.Name,
        'description': userData.Description,
        'category': userData.Category 
      })
      this.nameLabel = userData.Name
      this.categoryLabel = userData.Category 
      console.log('after dispatch',this.ledgerForm.value.category)
      this.ledgerForm.controls['name'].disable();
      this.ledgerForm.controls['category'].disable();
    }
    this.modal.show();
  }

  onShown() {
    this.ledgerForm.value.name.focusInput();
  }

  close() {
    this.modalClose.emit(true);
    this.modal.hide();
    setTimeout(() => this.clearForm(),
    1000)
    this.router.navigateByUrl('/accounts')
  }

  onSave(){
    if(this.editCase){
      this.editAccountInstance = {
        id: this.clickedAccountId,
        name: this.nameLabel,
        description: this.ledgerForm.value.description,
        category: this.categoryLabel === "Liability" ? 1 : 2
      }
      this.financePocServiceProxy.editAccount(this.editAccountInstance).subscribe(response => {
        if(response){
          this.toastrService.success('Account edited successfully!')
        }
      })
    }
    else{
      this.accountInstance = {
        name: this.ledgerForm.value.name,
        description: this.ledgerForm.value.description,
        category: this.ledgerForm.value.category === "Liability" ? 1 : 2
      }
      if(this.editCase){
        console.log('Account object -- Edit',this.accountInstance)  
      }
      else {
        this.financePocServiceProxy.createAccount(this.accountInstance).subscribe(response => {
          if(response){
            this.toastrService.success('New account created successfully!')
          }
          else {
            this.toastrService.warning('Failed to create new account!')
          }
        })
      }
    }
    this.modalClose.emit(true)
    this.modal.hide();
    setTimeout(() => this.clearForm(),
    1000)
    this.router.navigateByUrl('/accounts')
  }

  changeAccountType(){
    console.log('account name')
  }

  clearForm(){
    this.ledgerForm.controls['name'].reset();
    this.ledgerForm.controls['description'].reset();
    this.ledgerForm.controls['name'].enable();
    this.ledgerForm.controls['category'].enable();
    this.editCase = false
  }

}

