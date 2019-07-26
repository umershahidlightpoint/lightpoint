import { 
  FormControl, 
  FormGroup, 
  Validators,
  FormArray,
  FormBuilder
 } from '@angular/forms';
import { 
  Component, 
  OnInit, 
  ViewChild, 
  Output, 
  EventEmitter, 
  Inject 
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { CreateAccount, EditAccount } from '../../../shared/Types/account'
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
  nameLabel: string
  clickedAccountId: number
  rowDataSelected: any
  noAccountDef: boolean = false
  
  accountTypeNames: any
  accountTypeTags: any
  
  ledgerForm = new FormGroup({
    //name: new FormControl(''),
    description: new FormControl('',Validators.required),
    category: new FormControl('', Validators.required)
  })

  accountInstance: CreateAccount
  editAccountInstance: EditAccount
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  // Form Aray attributes
  accountForm: FormGroup;
  tags: FormArray;
  
  constructor(
    @Inject(Router) private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService:  ToastrService 
    ) { 
  }

  ngOnInit() {
    this.buildForm()
    this.getAccountCategories()
  }

  buildForm(){
    this.accountForm = this.formBuilder.group({
      tagsList: this.formBuilder.array([]),
    })
    this.tags = this.accountForm.get('tagsList') as FormArray;
  }

  createTag(tag): FormGroup {
    let formGroup
    if(this.editCase){
      formGroup = this.formBuilder.group({
        description: this.formBuilder.control(tag.description),
        isChecked: this.formBuilder.control(tag.isChecked),
        tag_id: this.formBuilder.control(tag.tag_id),
        tag_name: this.formBuilder.control(tag.tag_name),
      });
      return formGroup
    }
    formGroup = this.formBuilder.group({
      // account_cateory_id: this.formBuilder.control(tag.account_cateory_id),
      // account_def_id: this.formBuilder.control(tag.account_def_id),
      description: this.formBuilder.control(tag.description),
      isChecked: this.formBuilder.control(tag.isChecked),
      //table_name:this.formBuilder.control(tag.table_name),
      tag_id: this.formBuilder.control(tag.tag_id),
      tag_name: this.formBuilder.control(tag.tag_name),
    });
    return formGroup 
  }

  addTag(selectedAccTags): void{
    const control = <FormArray>this.accountForm.controls['tagsList'];
    for(let i = control.length-1; i >= 0; i--) {
      control.removeAt(i)
    }
    selectedAccTags.forEach(tag => {
      this.tags.push(this.createTag(tag))
    });
  }

  getAccountTags(type){
    let flag = typeof(type) === "string" ? false : true
    if(!flag && type.slice(0,1) == this.rowDataSelected.Category_Id){
      this.hasExistingAccount(this.rowDataSelected)
    }
    else if(this.editCase && flag){
      this.hasExistingAccount(type)
    }
    else {
      let selectedAccId = type.slice(0,1)
      this.financePocServiceProxy.accountTags().subscribe(response => {
        if(response.payload.length < 1){
          this.noAccountDef = true
          return
        }
        this.accountTypeTags = response.payload.filter(payload => {
          if(payload.account_def_id == selectedAccId){
            payload['isChecked'] = false
            payload['description'] = ''
            return payload
          }
        })
        this.addTag(this.accountTypeTags)
      }, error => {
        this.toastrService.error('Something went wrong. Try again later!')
      })  
    }
  }

  getAccountCategories(){
    this.financePocServiceProxy.accountCategories().subscribe(response => {
      if(response.isSuccessful){
        this.accountTypeNames = response.payload
        console.log('this.accountTypeNames',this.accountTypeNames)
      }
      else {
        this.toastrService.error('Failed to fetch account categories!')
      }
    })
  }

  hasExistingAccount(accountData){
    this.financePocServiceProxy.accountTags().subscribe(response => {
      if(response.payload.length < 1){
        this.noAccountDef = true
        return
      }
      this.accountTypeTags = response.payload.filter(payload => {
        if(payload.account_category_id == accountData.Category_Id){
          payload['isChecked'] = false
          payload['description'] = ''
          return payload
        }
      })
      this.accountTypeTags.map(accountTag => {
        this.rowDataSelected.Tags.forEach(tag => {
          if(tag.Id == accountTag.tag_id){
            accountTag['isChecked'] = true
            accountTag['description'] = tag.Value    
          }
        })
      })
      this.addTag(this.accountTypeTags)
    }, error => {
      this.toastrService.error('Something went wrong. Try again later!')
    })
  }

  show(rowSelected) {
    this.rowDataSelected = rowSelected
    this.clickedAccountId = rowSelected.Id
    if(Object.keys(rowSelected).length !== 0){
      this.editCase = true
      this.ledgerForm.setValue({
        'description': rowSelected.Description,
        'category': {
          id: rowSelected.Category_Id,
          name: rowSelected.Category
        }
      })
      this.nameLabel = rowSelected.Name
      this.categoryLabel = rowSelected.Category
      this.getAccountTags(rowSelected)
      //this.addTag(rowSelected.Tags)
      //this.categoryLabel = { id: rowSelected.Category_Id, name: rowSelected.Category }
      //this.ledgerForm.controls['name'].disable();
    }
    this.modal.show();
  }

  onShown() {
    this.ledgerForm.value.description.focusInput();
  }

  close() {
    this.modalClose.emit(true);
    this.modal.hide();
    setTimeout(() => this.clearForm(),
    1000)
    this.router.navigateByUrl('/accounts')
  }

  onSave(){
  let formValues = this.accountForm.value.tagsList
    let tagsObject = formValues.filter(tag =>
      {
        if(tag.isChecked === true){
          return { id: tag.tag_id, value: tag.description }
        }
      }
    )
    let tagObjectToSend = tagsObject.map(tag => {
      return { id: tag.tag_id, value: tag.description }
    })
    if(this.editCase){
      this.editAccountInstance = {
        id: this.clickedAccountId,
        description: this.ledgerForm.value.description,
        category: this.ledgerForm.value.category.id,
        tags: tagObjectToSend
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
        description: this.ledgerForm.value.description,
        category: this.ledgerForm.value.category.id,
        tags: tagObjectToSend
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
    //this.ledgerForm.controls['name'].reset();
    this.ledgerForm.controls['description'].reset();
    this.ledgerForm.controls['category'].reset();
    //this.ledgerForm.controls['name'].enable();
    this.accountForm.reset()
    this.editCase = false
    this.accountTypeTags = null
    this.categoryLabel = null
  }
}

