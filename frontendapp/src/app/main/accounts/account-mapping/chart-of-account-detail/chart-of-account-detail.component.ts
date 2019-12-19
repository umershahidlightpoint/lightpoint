import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';

@Component({
  selector: 'app-chart-of-account-detail',
  templateUrl: './chart-of-account-detail.component.html',
  styleUrls: ['./chart-of-account-detail.component.css']
})
export class ChartOfAccountDetailComponent implements OnInit {
  @Input() accountSelect;

  accountDetailForm: FormGroup;
  // Form Array Attributes
  accountSelectedList: FormArray;

  selectedAccount = false;
  isSaving = false;

  uniqueId = 0;

  organisation = '';
  selected: string;
  noResult = false;

  selectedValue: string;
  selectedOption: any;

  states: any[] = [];

  accountDetailList: any = [];
  organisationList: any = [];

  constructor(
    private accountmappingApiService: AccountmappingApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;

    const accountDetail = {
      id: this.selectedOption.AccountId,
      organisation: this.organisation,
      accountName: this.selectedOption.AccountName
    };

    const checkDuplication = this.accountDetailList.some(element => {
      return (
        element.organisation === accountDetail.organisation &&
        element.accountName === accountDetail.accountName
      );
    });

    if (!checkDuplication) {
      this.accountDetailList.push(accountDetail);
    }
  }

  selectOrganisation(event: any): void {
    this.organisation = event.target.value;
    // Deep Copy Organisation List
    let cloneList = JSON.parse(JSON.stringify(this.organisationList));

    cloneList = cloneList.find(element => {
      return element.OrganizationName === this.organisation;
    });

    this.states = cloneList.Accounts;
  }

  onSaveSettings() {
    this.isSaving = true;
    this.accountmappingApiService.postAccountMapping(this.accountDetailList).subscribe(
      response => {
        if (response.isSuccessful) {
          this.isSaving = false;
          this.toastrService.success('Accounts mapped Successfully');
        }
      },
      error => {
        this.isSaving = false;
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  ngOnInit() {
    this.getOrganisations();

    this.accountmappingApiService.selectedAccounList$.subscribe(list => {
      if (!list) {
        return;
      } else {
        console.log('ACCOUNTS LIST ::', list);
      }
    });
  }

  getOrganisations() {
    this.accountmappingApiService.getOrganisation().subscribe(data => {
      this.organisationList = data.payload;
    });
  }

  addAccount() {
    this.selectedAccount = true;
  }

  deleteAccount(obj) {
    const id = obj.id;
    this.accountDetailList = this.accountDetailList.filter(element => {
      return element.id !== id;
    });
  }
}
