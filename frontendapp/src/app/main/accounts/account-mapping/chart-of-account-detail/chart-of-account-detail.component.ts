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
  thirdPartyAccountList : any[] = [];

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
      let account = this.payload.find(x=> x.AccountId == element.accountId);
      if(account) {
        account.ThirdPartyAccountMapping.push({
          ThirdPartyAccountId: this.selectedOption.AccountId
        })
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
      //TODO modify third party mapping in row node
    });
      //TODO iterate over row nodes and modify hasmapping and account name property
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
      if(list){
        this.rowNodes = list.rowNodes;
        this.payload = list.payload;
        this.organization = list.organization;
        this.states = list.accounts;
        this.rowNodes.forEach(element => {
          element.thirdPartyMappedAccounts.forEach(object => {
            if(object.OrganizationName == this.organization){
              this.thirdPartyAccountList.push({
                LPAccountId : element.accountId,
                ...object
              })
            }
          });
        });
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
    this.rowNodes.forEach(element => {
      const referenceThirdParty = this.thirdPartyAccountList.find(x=> x.LPAccountId === element.accountId);
      let account = this.payload.find(x=> x.AccountId == element.accountId);
      // modifying the payload
      if(account){
        if(obj.MapId){
          account.ThirdPartyAccountMapping.push({
            MapId: referenceThirdParty.MapId,
            ThirdPartyAccountId: referenceThirdParty.ThirdPartyAccountId
          })
        } else{
          const filteredThirdPartAccounts = account.ThirdPartyAccountMapping.filter((item) => {
            return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId
          });
          account.ThirdPartyAccountMapping = filteredThirdPartAccounts;
        }
      }
      //modifying row nodes
      const thirdPartyMappedAccounts = element.thirdPartyMappedAccounts.filter((item) => {
        return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId
      })
      element.thirdPartyMappedAccounts = thirdPartyMappedAccounts;
    });

    //TODO iterate over row nodes and modify hasmapping and account name property
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
