import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  editCase: boolean = false
  accountTypeNames = ['Asset','Cash']
  ledgerForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
  })
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  constructor(
    @Inject(Router) private router: Router 
  ) { 

  }

  ngOnInit() {
  
  }

  show(userData) {
    console.log('object recieved',userData)
    if(Object.keys(userData).length !== 0){
      console.log('in')
      this.editCase = true
      this.ledgerForm.patchValue({
        'name': userData.Name,
        'description': userData.Description,
        'category': userData.Category
      })
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
    this.clearForm()
    this.router.navigateByUrl('/accounts')
  }

  onAdd(){
    console.log('value ==>',this.ledgerForm.value)
    this.modalClose.emit(true)
    this.modal.hide();
    this.clearForm();
    this.router.navigateByUrl('/accounts')
  }

  changeAccountName(){
    console.log('account name')
  }

  clearForm(){
    this.ledgerForm.controls['name'].enable();
    this.ledgerForm.controls['category'].enable();
    this.editCase = false
  }
}

