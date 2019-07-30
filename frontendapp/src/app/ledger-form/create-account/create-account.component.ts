import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  FormBuilder
} from "@angular/forms";
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { Router } from "@angular/router";
import {
  CreateAccount,
  EditAccount,
  AccountCategory,
  GridRowData,
  AccountTag
} from "../../../shared/Models/account";
import { FinancePocServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { ToastrService } from "ngx-toastr";
import { Subscription, Subject } from "rxjs";
import { takeWhile } from "rxjs/operators";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.css"]
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  editCase: boolean = false;
  categoryLabel: string;
  nameLabel: string;
  noAccountDef: boolean = false;
  canEditAccount: boolean = true;
  clickedAccountId: number;
  //For unsubscribing all subscriptions
  isSubscriptionAlive: boolean;

  //Account Model
  rowDataSelected: GridRowData;
  accountCategories: AccountCategory;
  accountTypeTags; //: AccountTag
  accountInstance: CreateAccount;
  editAccountInstance: EditAccount;

  @Input("selectedAccCategory") selectedAccountCategory: AccountCategory;
  @ViewChild("modal") modal: ModalDirective;
  @ViewChild("_description") descriptionRef: ElementRef;
  @Output() modalClose = new EventEmitter<any>();

  accountForm: FormGroup;
  // Form Aray attributes
  tags: FormArray;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService: ToastrService
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {
    this.buildForm();
    this.getAccountCategories();
  }

  buildForm() {
    this.accountForm = this.formBuilder.group({
      //name: new FormControl(''),
      description: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      accountDefId: new FormControl(""),
      accountCategoryId: new FormControl(""),
      tagsList: this.formBuilder.array([])
    });
    this.tags = this.accountForm.get("tagsList") as FormArray;
  }

  createTag(tag): FormGroup {
    return this.formBuilder.group({
      description: this.formBuilder.control(tag.description),
      isChecked: this.formBuilder.control(tag.isChecked),
      tagTable: this.formBuilder.control(tag.TableName),
      tagId: this.formBuilder.control(tag.TagId),
      tagName: this.formBuilder.control(tag.TagName)
    });
  }

  addTag(selectedAccTags): void {
    const control = <FormArray>this.accountForm.controls["tagsList"];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }

    selectedAccTags.forEach(accTag => {
      this.accountForm.patchValue({
        accountDefId: accTag.AccountDefId,
        accountCategoryId: accTag.AccountCategoryId
      });
      accTag.AccountTags.forEach(tag => {
        this.tags.push(this.createTag(tag));
      });
    });
  }

  getAccountTags(type) {
    let flag = typeof type === "string" ? false : true;
    if (!flag && type.slice(0, 1) == this.rowDataSelected.Category_Id) {
      this.hasExistingAccount(this.rowDataSelected);
    } else if (this.editCase && flag) {
      this.hasExistingAccount(type);
    } else {
      let selectedAccId = type.slice(0, 1);
      this.financePocServiceProxy
        .accountTags()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(
          response => {
            if (response.payload.length < 1) {
              this.noAccountDef = true;
              return;
            }
            this.accountTypeTags = response.payload.filter(payload => {
              if (payload.AccountCategoryId == selectedAccId) {
                payload.AccountTags.map(tag => {
                  tag["isChecked"] = false;
                  tag["description"] = "";
                });
                return payload;
              }
            });
            this.addTag(this.accountTypeTags);
          },
          error => {
            this.toastrService.error("Something went wrong. Try again later!");
          }
        );
    }
  }

  getAccountCategories() {
    this.financePocServiceProxy
      .accountCategories()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.accountCategories = response.payload;
        } else {
          this.toastrService.error("Failed to fetch account categories!");
        }
      });
  }

  hasExistingAccount(accountData) {
    this.financePocServiceProxy
      .accountTags()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(
        response => {
          if (response.payload.length < 1) {
            this.noAccountDef = true;
            return;
          }
          this.accountTypeTags = response.payload.filter(payload => {
            if (payload.AccountCategoryId == accountData.Category_Id) {
              return payload;
            }
          });

          this.accountTypeTags.map(accountTag => {
            this.rowDataSelected.Tags.forEach(tag => {
              accountTag.AccountTags.forEach(accTag => {
                if (tag.Id == accTag.TagId) {
                  accTag["isChecked"] = true;
                  accTag["description"] = tag.Value;
                }
              });
            });
          });
          this.addTag(this.accountTypeTags);
        },
        error => {
          this.toastrService.error("Something went wrong. Try again later!");
        }
      );
  }

  show(rowSelected) {
    this.rowDataSelected = rowSelected;
    this.clickedAccountId = rowSelected.Id;
    if (Object.keys(rowSelected).length !== 0) {
      this.canEditAccount = rowSelected.CanDeleted;
      this.categoryLabel = this.canEditAccount ? null : rowSelected.Category;
      this.editCase = true;
      this.accountForm.patchValue({
        description: rowSelected.Description,
        category: {
          id: rowSelected.Category_Id,
          name: rowSelected.Category
        }
      });
      this.nameLabel = rowSelected.Name;
      this.categoryLabel = rowSelected.Category;
      this.getAccountTags(rowSelected);
    }
    this.modal.show();
  }

  close() {
    this.modalClose.emit(true);
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
    this.router.navigateByUrl("/accounts");
  }

  onSave() {
    let formValues = this.accountForm.value.tagsList;
    let tagsObject = formValues.filter(tag => {
      if (tag.isChecked === true) {
        return { id: tag.tag_id, value: tag.description };
      }
    });
    let tagObjectToSend = tagsObject.map(tag => {
      return { id: tag.tagId, value: tag.description };
    });
    if (this.editCase) {
      if (!this.canEditAccount) {
        let patchAccountObj = {
          description: this.accountForm.value.description
        };
        this.financePocServiceProxy
          .patchAccount(this.clickedAccountId, patchAccountObj)
          .subscribe(
            response => {
              if (response.isSuccessful) {
                this.toastrService.success("Account edited successfully!");
              } else {
                this.toastrService.error("Account edited failed!");
              }
            },
            error => {
              this.toastrService.error(
                "Something went wrong. Try again later!"
              );
            }
          );
      } else {
        this.editAccountInstance = {
          id: this.clickedAccountId,
          description: this.accountForm.value.description,
          category: this.accountForm.value.category.id,
          tags: tagObjectToSend
        };
        this.financePocServiceProxy
          .editAccount(this.editAccountInstance)
          .subscribe(
            response => {
              if (response.isSuccessful) {
                this.toastrService.success("Account edited successfully!");
              } else {
                this.toastrService.error("Account edition failed!");
              }
            },
            error => {
              this.toastrService.error(
                "Something went wrong. Try again later!"
              );
            }
          );
      }
    } else {
      this.accountInstance = {
        description: this.accountForm.value.description,
        category: this.accountForm.value.category.id,
        tags: tagObjectToSend
      };
      this.financePocServiceProxy.createAccount(this.accountInstance).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success("Account created successfully!");
          } else {
            this.toastrService.error("Account creation failed!");
          }
        },
        error => {
          this.toastrService.error("Something went wrong. Try again later!");
        }
      );
    }
    this.modalClose.emit(true);
    this.modal.hide();
    setTimeout(() => this.clearForm(), 1000);
    this.router.navigateByUrl("/accounts");
  }

  clearForm() {
    //this.accountForm.controls['name'].reset();
    this.accountForm.controls["description"].reset();
    this.accountForm.controls["category"].reset();
    //this.accountForm.controls['name'].enable();
    this.canEditAccount = true;
    this.editCase = false;
    this.accountTypeTags = null;
    this.categoryLabel = null;
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
