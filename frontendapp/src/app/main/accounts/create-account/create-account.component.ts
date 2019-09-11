import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import {
  CreateAccount,
  EditAccount,
  AccountCategory,
  GridRowData,
  AccountTag
} from '../../../../shared/Models/account';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit, OnChanges {
  editCase: boolean = false;
  accTypeLabel: string;
  accTypeId: number = 0;
  accountCategory: string;
  noAccountDef: boolean = false;
  canEditAccount: boolean = true;
  // For unsubscribing all subscriptions
  isSubscriptionAlive: boolean;

  // Account Model
  rowDataSelected: GridRowData;
  accountTypes: AccountCategory;
  accountTags: Array<AccountTag>;
  accountInstance: CreateAccount;
  editAccountInstance: EditAccount;

  @Input('selectedAccCategory') selectedAccountCategory: AccountCategory;
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();

  accountForm: FormGroup;
  // Form Aray attributes
  tags: FormArray;
  backdrop: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService: ToastrService
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.accountForm = this.formBuilder.group({
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      tagsList: this.formBuilder.array([])
    });
    this.tags = this.accountForm.get('tagsList') as FormArray;
  }

  getAccountTypes(selectedAccountCategoryId) {
    this.financePocServiceProxy
      .accountTypes(selectedAccountCategoryId)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.accountTypes = response.payload;
        } else {
          this.toastrService.error('Failed to fetch account categories!');
        }
      });
  }

  createTag(tag): FormGroup {
    return this.formBuilder.group({
      description: this.formBuilder.control(tag.description),
      isChecked: this.formBuilder.control(tag.isChecked),
      tagId: this.formBuilder.control(tag.Id),
      tagName: this.formBuilder.control(tag.Name)
    });
  }

  addTag(selectedAccTags): void {
    selectedAccTags['description'] = '';
    selectedAccTags['isChecked'] = true;
    this.tags.push(this.createTag(selectedAccTags));
  }

  deleteTag(tagToDelete) {
    const control = <FormArray>this.accountForm.controls['tagsList'];
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.at(i).value.tagId === tagToDelete.tagId) {
        control.removeAt(i);
      }
    }
    this.accountTags.forEach(tag => {
      if (tag.Id == tagToDelete.tagId) {
        tag['isChecked'] = false;
        tag['description'] = '';
      }
    });
  }

  getAccountTags(typeId) {
    const accTypeId = typeId;
    if (this.editCase) {
      this.financePocServiceProxy
        .accountTags()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(
          response => {
            if (response.payload.length < 1) {
              this.noAccountDef = true;
              return;
            }
            this.accountTags = response.payload;
            if (accTypeId !== this.rowDataSelected.typeId) {
              this.clearTagsListArray();
            } else {
              this.hasExistingAccount(this.rowDataSelected);
            }
          },
          error => {
            this.toastrService.error('Something went wrong. Try again later!');
          }
        );
    } else {
      this.financePocServiceProxy
        .accountTags()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(
          response => {
            if (response.payload.length < 1) {
              this.noAccountDef = true;
              return;
            }
            this.accountTags = response.payload;
          },
          error => {
            this.toastrService.error('Something went wrong. Try again later!');
          }
        );
    }
  }

  hasExistingAccount(accountData) {
    this.financePocServiceProxy.getAccountTags(accountData.accountId).subscribe(response => {
      const { payload } = response;
      const { Tags } = payload[0];
      if (Tags.length > 0) {
        let temp = this.accountTags;
        temp.map(accountTags => {
          Tags.forEach(tag => {
            if (tag.Id === accountTags.Id) {
              accountTags['isChecked'] = true;
              accountTags['description'] = tag['Value'];
              return accountTags;
            }
          });
        });
        temp = temp.filter(tag => {
          if (tag.hasOwnProperty('isChecked')) {
            return tag;
          }
        });
        temp.forEach(tag => {
          this.tags.push(this.createTag(tag));
        });
      }
    });
  }

  show(rowSelected) {
    this.rowDataSelected = rowSelected;
    if (Object.keys(rowSelected).length !== 0) {
      this.accountCategory = rowSelected.category;
      this.canEditAccount = rowSelected.canDeleted;
      this.accTypeLabel = !this.canEditAccount ? null : rowSelected.type;
      this.editCase = true;
      this.getAccountTypes(rowSelected.categoryId);
      this.getAccountTags(rowSelected.typeId);
      this.accountForm.patchValue({
        description: rowSelected.description,
        type: {
          id: rowSelected.typeId,
          name: rowSelected.type
        }
      });
      this.accTypeId = rowSelected.typeId;
      this.accTypeLabel = rowSelected.type;
    }
    this.modal.show();
  }

  onShown() {
    this.accountForm.value.description.focusInput();
  }

  close() {
    this.modal.hide();
    setTimeout(() => this.clearForm(), 250);
    this.router.navigateByUrl('/accounts');
  }

  onSave() {
    const formValues = this.accountForm.value.tagsList;
    const tagsObject = formValues.filter(tag => {
      if (tag.isChecked === true) {
        return { id: tag.tag_id, value: tag.description };
      }
    });
    const tagObjectToSend = tagsObject.map(tag => {
      return { id: tag.tagId, value: tag.description };
    });
    if (this.editCase) {
      if (!this.canEditAccount) {
        const patchAccountObj = {
          description: this.accountForm.value.description
        };
        this.financePocServiceProxy
          .patchAccount(this.rowDataSelected.accountId, patchAccountObj)
          .subscribe(
            response => {
              if (response.isSuccessful) {
                this.toastrService.success('Account edited successfully!');
              } else {
                this.toastrService.error('Account edited failed!');
              }
            },
            error => {
              this.toastrService.error('Something went wrong. Try again later!');
            }
          );
      } else {
        this.editAccountInstance = {
          id: this.rowDataSelected.accountId,
          description: this.accountForm.value.description,
          type: this.accountForm.value.type || this.rowDataSelected.typeId,
          tags: tagObjectToSend
        };
        this.financePocServiceProxy.editAccount(this.editAccountInstance).subscribe(
          response => {
            if (response.isSuccessful) {
              this.toastrService.success('Account edited successfully!');
            } else {
              this.toastrService.error('Account edition failed!');
            }
          },
          error => {
            this.toastrService.error('Something went wrong. Try again later!');
          }
        );
      }
    } else {
      this.accountInstance = {
        description: this.accountForm.value.description,
        type: this.accountForm.value.type,
        tags: tagObjectToSend
      };
      this.financePocServiceProxy.createAccount(this.accountInstance).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Account created successfully!');
          } else {
            this.toastrService.error('Account creation failed!');
          }
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
    }
    this.modalClose.emit(true);
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
    this.router.navigateByUrl('/accounts');
  }

  clearForm() {
    this.accountForm.controls['description'].reset();
    this.accountForm.controls['type'].reset();
    this.clearTagsListArray();
    this.accountTags = null;
    this.canEditAccount = true;
    this.editCase = false;
    this.accTypeLabel = null;
    this.accountTags = null;
    this.noAccountDef = false;
    this.accTypeId = null;
  }

  clearTagsListArray() {
    const control = <FormArray>this.accountForm.controls['tagsList'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  accountTagSelected(tag) {
    this.addTag(tag);
  }

  unCheck(instance) {
    this.deleteTag(instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { selectedAccountCategory } = changes;
    const { currentValue } = selectedAccountCategory;
    if (currentValue) {
      this.getAccountTypes(currentValue.id);
    }
  }
}
