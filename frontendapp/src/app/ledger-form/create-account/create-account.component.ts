import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  accountTypeNames = ['Asset','Cash']
  accountNames = ['First Account','Second Account']
  ledgerForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    accountType: new FormControl(''),
  })
  @ViewChild('modal') modal: ModalDirective;

  constructor() { }

  ngOnInit() {
  }

  onAdd(){
    console.log('value ==>',this.ledgerForm.value)
  }
  

  changeAccountType(){
    console.log('account type')
  }

  changeAccountName(){
    console.log('account name')
  }

}

