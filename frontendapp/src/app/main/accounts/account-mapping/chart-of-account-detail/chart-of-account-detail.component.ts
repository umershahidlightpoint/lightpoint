import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-chart-of-account-detail',
  templateUrl: './chart-of-account-detail.component.html',
  styleUrls: ['./chart-of-account-detail.component.css']
})
export class ChartOfAccountDetailComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @Output() modalClosed = new EventEmitter<any>();

  storeThirdPartyAccounts: any = [];
  selectedAccountList: any = [];
  selectedMappedAccount: any = [];
  accountDetailList: any = [];
  organizationList: any = [];

  rowNodes: any[] = [];
  payload: any[] = [];

  selectedAccount = false;
  isSaving = false;

  organization = '';
  selected: string;
  noResult = false;

  selectedValue: string;
  selectedOption: any;

  states: any[] = [];

  constructor(
    private accountmappingApiService: AccountmappingApiService,
    private toastrService: ToastrService
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
      let account = this.payload.find(x => x.AccountId == element.accountId);
      if (account) {
      } else {
        let thirdPartyAccountMapping = [];
        thirdPartyAccountMapping.push({
          ThirdPartyAccountId: this.selectedOption.AccountId
        });
        const payLoadItem = {
          AccountId: element.accountId,
          ThirdPartyAccountMapping: thirdPartyAccountMapping
        };
        this.payload.push(payLoadItem);
      }
    });
    // this.storeThirdPartyAccounts.push({ThirdPartyAccountId : this.selectedOption.AccountId});

    // const accountDetail = {
    //   id: this.selectedOption.AccountId,
    //   ThirdPartyAccountName: this.selectedOption.AccountName,
    //   OrganizationName: this.organization
    // };

    // const checkDuplication = this.accountDetailList.some(element => {

    //   return (
    //     element.ThirdPartyAccountName === accountDetail.ThirdPartyAccountName &&
    //     element.OrganizationName === accountDetail.OrganizationName
    //   );
    // });

    // if (!checkDuplication) {
    //   this.accountDetailList.push(accountDetail);
    // }
  }

  selectOrganization(event: any): void {
    this.organization = event.target.value;
    // Deep Copy Organization List
    let cloneList = JSON.parse(JSON.stringify(this.organizationList));

    cloneList = cloneList.find(element => {
      return element.OrganizationName === this.organization;
    });

    this.states = cloneList.Accounts;
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
  }

  ngOnInit() {
    this.getOrganizations();
    this.accountmappingApiService.selectedAccounList$.subscribe(list => {
      // if (!list) {
      //   return;
      // } else {
      //   this.selectedAccountList = list;
      //   // Deep Copy Organization List
      //   let cloneLists = JSON.parse(JSON.stringify(this.selectedAccountList));
      //   this.accountDetailList = cloneLists.action === 'edit' ? cloneLists.params[0].thirdPartyMappedAccounts : [];
      // }
      if (list) {
        this.rowNodes = list.rowNodes;
        this.payload = list.payload;
        this.organization = list.organization;
        this.states = list.accounts;
        console.log(list, 'in oberver');
      }
    });
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
    const id = obj.ThirdPartyAccountId;
    this.accountDetailList = this.accountDetailList.filter(element => {
      return element.ThirdPartyAccountId !== id;
    });
  }

  onSave() {
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
