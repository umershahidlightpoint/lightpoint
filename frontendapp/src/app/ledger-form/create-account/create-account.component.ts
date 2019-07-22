import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Account, EditAccount, AccountCategory } from '../../../shared/Types/account'
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  editCase: boolean = false
  categoryLabel: any
  clickedAccountId: number
  nameLabel: string
  Label: string
  accountTypeNames: any
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
    this.getAccountCategories()
  }

  getAccountCategories(){
    this.financePocServiceProxy.accountCategories().subscribe(response => {
      if(response.isSuccessful){
        this.accountTypeNames = response.payload
      }
      else {
        this.toastrService.error('Failed to fetch account categories!')
      }
    })
  }

  show(rowSelected) {
    this.clickedAccountId = rowSelected.Id
    if(Object.keys(rowSelected).length !== 0){
      this.editCase = true
      this.ledgerForm.patchValue({
        'name': rowSelected.Name,
        'description': rowSelected.Description,
        'category': rowSelected.Category
      })
      this.nameLabel = rowSelected.Name
      this.categoryLabel = { id: rowSelected.Category_Id, name: rowSelected.Category }
      console.log('categoryLabel',this.categoryLabel) 
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
        category: this.categoryLabel.id
      }
      this.financePocServiceProxy.editAccount(this.editAccountInstance).subscribe(response => {
        if(response.isSuccessful){
          this.toastrService.success('Account edited successfully!')
        }
        else {
          this.toastrService.error('Account edition failed!')
        }
      }, error => {
        this.toastrService.error('Something went wrong. Try again later!')
      })
    }
    else{
      this.accountInstance = {
        name: this.ledgerForm.value.name,
        description: this.ledgerForm.value.description,
        category: this.ledgerForm.value.category.id
      }
      this.financePocServiceProxy.createAccount(this.accountInstance).subscribe(response => {
        if(response.isSuccessful){
          this.toastrService.success('Account created successfully!')
        }
        else {
          this.toastrService.error('Account creation failed!')
        }
      }, error => {
        this.toastrService.error('Something went wrong. Try again later!')
      })
    }
    this.modalClose.emit(true)
    this.modal.hide();
    setTimeout(() => this.clearForm(),
    1000)
    this.router.navigateByUrl('/accounts')
  }

  clearForm(){
    this.ledgerForm.controls['name'].reset();
    this.ledgerForm.controls['description'].reset();
    this.ledgerForm.controls['name'].enable();
    this.ledgerForm.controls['category'].enable();
    this.editCase = false
  }
}

