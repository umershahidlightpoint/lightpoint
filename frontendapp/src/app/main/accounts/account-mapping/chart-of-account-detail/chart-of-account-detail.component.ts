import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  ComponentRef,
  ComponentFactoryResolver,
  ElementRef
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-of-account-detail',
  templateUrl: './chart-of-account-detail.component.html',
  styleUrls: ['./chart-of-account-detail.component.css']
})
export class ChartOfAccountDetailComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @Output() modalClosed = new EventEmitter<any>();

  storeThirdPartyAccounts: any = [];
  selectedAccountList: any = [];
  selectedMappedAccount: any = [];
  accountDetailList: any = [];
  organizationList: any = [];

  rowNodes: any[] = [];
  payload: any[] = [];
  thirdPartyAccountList: any[] = [];

  selectedAccount = false;
  isSaving = false;

  organization = '';
  selected: string;
  noResult = false;

  selectedValue: string;
  selectedOption: any;

  states: any[] = [];

  modificationSubscription: Subscription;

  constructor(
    private accountmappingApiService: AccountmappingApiService,
    private toastrService: ToastrService,
    private elementRef: ElementRef
  ) {}

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    if (this.accountDetailList.length === 1) {
      return;
    }

    this.rowNodes.forEach(element => {
      const account = this.payload.find(x => x.AccountId == element.accountId);
      if (account) {
        account.ThirdPartyAccountMapping.push({
          ThirdPartyAccountId: this.selectedOption.AccountId,
          OrganizationName: this.organization
        });
      } else {
        const thirdPartyAccountMapping = [];
        thirdPartyAccountMapping.push({
          ThirdPartyAccountId: this.selectedOption.AccountId,
          OrganizationName: this.organization
        });
        const payLoadItem = {
          AccountId: element.accountId,
          ThirdPartyAccountMapping: thirdPartyAccountMapping
        };
        this.payload.push(payLoadItem);
      }

      this.thirdPartyAccountList.push({
        LPAccountId: element.accountId,
        ThirdPartyAccountId: this.selectedOption.AccountId
      });

      // Removing duplicate object with same organization name
      element.thirdPartyMappedAccounts.forEach((mappedAccount, index, object) => {
        if (
          mappedAccount.OrganizationName === this.organization &&
          !mappedAccount.hasOwnProperty('ThirdPartyAccountId') &&
          !mappedAccount.hasOwnProperty('ThirdPartyAccountName')
        ) {
          object.splice(index, 1);
        }
      });

      // TODO modify third party mapping in row node
      element.thirdPartyMappedAccounts.push({
        ThirdPartyAccountId: this.selectedOption.AccountId,
        ThirdPartyAccountName: this.selectedOption.AccountName,
        OrganizationName: this.organization,
        isCommitted: false,
        isModified: true
      });
    });
    // TODO iterate over row nodes and modify hasmapping and account name property
    this.accountDetailList.push({
      ThirdPartyAccountName: this.selectedOption.AccountName,
      OrganizationName: this.organization
    });

    // console.log('ACCOUNT WITH SAME ORG', accountWithSameOrg);
    console.log(this.payload, 'modified payload after insertion');
    console.log(this.rowNodes, 'modified row nodes after insertion');
  }

  onSaveSettings() {
    this.isSaving = true;
    const payload = [];
    this.selectedAccountList.params.forEach((element, index) => {
      payload.push({
        AccountId: element.accountId,
        ThirdPartyAccountMapping: this.storeThirdPartyAccounts
      });
    });

    this.accountmappingApiService.postAccountMapping(payload).subscribe(
      response => {
        if (response.isSuccessful) {
          this.isSaving = false;
          this.clearForm();
          this.toastrService.success('Saved Successfully');
          this.payload = [];
        }
      },
      error => {
        this.isSaving = false;
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  clearForm() {
    this.storeThirdPartyAccounts = [];
    this.selectedAccountList = [];
    this.accountDetailList = [];
    this.organizationList = [];
    this.organization = '';
    this.states = [];
    this.selected = '';
    this.rowNodes = [];
    this.payload = [];
    this.thirdPartyAccountList = [];
  }

  ngOnInit() {
    this.getOrganizations();
    this.modificationSubscription = this.accountmappingApiService.selectedAccounList$.subscribe(
      list => {
        if (list) {
          this.rowNodes = JSON.parse(JSON.stringify(list.rowNodes));
          this.payload = JSON.parse(JSON.stringify(list.payload));
          this.organization = list.organization;
          this.states = list.accounts;
          this.rowNodes.forEach(element => {
            element.thirdPartyMappedAccounts.forEach(object => {
              if (object.OrganizationName == this.organization) {
                this.thirdPartyAccountList.push({
                  LPAccountId: element.accountId,
                  ...object
                });
              }
            });
          });

          if (this.thirdPartyAccountList.length > 0) {
            this.accountDetailList.push({
              ThirdPartyAccountName: this.thirdPartyAccountList[0].ThirdPartyAccountName,
              OrganizationName: this.thirdPartyAccountList[0].OrganizationName,
              MapId: this.thirdPartyAccountList[0].MapId
            });
          }
          console.log(list, 'in oberver');
        }
      }
    );
  }

  ngOnDestroy() {
    this.modificationSubscription.unsubscribe();
    this.elementRef.nativeElement.remove();
  }

  getOrganizations() {
    this.accountmappingApiService.getOrganisation().subscribe(data => {
      this.organizationList = data.payload;
    });
  }

  addAccount() {
    this.selectedAccount = true;
  }

  deleteAccount(obj) {
    this.rowNodes.forEach(element => {
      const referenceThirdParty = this.thirdPartyAccountList.find(
        x => x.LPAccountId === element.accountId
      );
      const account = this.payload.find(x => x.AccountId == element.accountId);

      // Modifying the payload

      element.thirdPartyMappedAccounts.forEach((mappedAccount, index) => {
        if (
          mappedAccount.ThirdPartyAccountId === referenceThirdParty.ThirdPartyAccountId &&
          mappedAccount.OrganizationName === this.organization
        ) {
          // Deleting all properties except organization name and flags(is committed and is modified)
          delete mappedAccount.MapId;
          delete mappedAccount.ThirdPartyAccountId;
          delete mappedAccount.ThirdPartyAccountName;
          mappedAccount.isCommitted = false;
          mappedAccount.isModified = true;
        }
      });

      if (account) {
        if (obj.MapId) {
          account.ThirdPartyAccountMapping.push({
            MapId: referenceThirdParty.MapId,
            ThirdPartyAccountId: referenceThirdParty.ThirdPartyAccountId
          });
        } else {
          // If map id is not present, we need to remove it from the payload instead of adding it.
          const filteredThirdPartAccounts = account.ThirdPartyAccountMapping.filter(item => {
            return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId;
          });

          account.ThirdPartyAccountMapping = filteredThirdPartAccounts;
        }
      }
      // adding element for the first time
      else {
        if (obj.MapId) {
          const thirdPartyMapping = [];
          thirdPartyMapping.push({
            MapId: referenceThirdParty.MapId,
            ThirdPartyAccountId: referenceThirdParty.ThirdPartyAccountId
          });

          this.payload.push({
            AccountId: element.accountId,
            ThirdPartyAccountMapping: thirdPartyMapping
          });
        } else {
          // if map id is not present, we need to remove it from the payload instead of adding it.
        }
      }
      // Modifying row nodes
      const thirdPartyMappedAccounts = element.thirdPartyMappedAccounts.filter(item => {
        return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId;
      });

      element.thirdPartyMappedAccounts = thirdPartyMappedAccounts;

      // Modifying third party account list.
      const thirdPartyAccountList = this.thirdPartyAccountList.filter(item => {
        return item.LPAccountId !== referenceThirdParty.LPAccountId;
      });
      this.thirdPartyAccountList = thirdPartyAccountList;
    });

    this.accountDetailList = [];
    // TODO iterate over row nodes and modify third party accounts
    console.log(this.payload, 'modified payload after deletion');
    console.log(this.rowNodes, 'modified row nodes after deletion');
  }

  onSave() {
    const changes = {
      payload: this.payload,
      rowNodes: this.rowNodes
    };
    this.accountmappingApiService.dispatchChanges(changes);
    this.onClose();
  }

  show() {
    this.modal.show();
  }

  onClose() {
    this.clearForm();
    this.modal.hide();
  }
}
