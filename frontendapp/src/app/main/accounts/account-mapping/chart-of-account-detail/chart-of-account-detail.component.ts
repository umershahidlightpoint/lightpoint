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
  // Form Aray attributes
  accountSelectedList: FormArray;

  selectedAccount: Boolean = false;
  isSaving = false;

  uniqueId: number = 0;

  organisation: string = '';
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
    let accountDetail = {
      id: this.selectedOption.AccountId,
      organisation: this.organisation,
      accountName: this.selectedOption.AccountName
    };

    var checkDuplication = this.accountDetailList.some(function(elem) {
      return (
        elem.organisation === accountDetail.organisation &&
        elem.accountName == accountDetail.accountName
      );
    });

    if (!checkDuplication) {
      this.accountDetailList.push(accountDetail);
    }
  }

  selectOrganisation(event: any): void {
    let org = event.target.value;
    this.organisation = event.target.value;
    let cloneList = JSON.parse(JSON.stringify(this.organisationList));

    cloneList = cloneList
      .filter(function(el) {
        return el.OrganizationName == org;
      })
      .map(items => {
        return items.Accounts;
      });

    this.states = cloneList[0];
  }

  onSaveSettings() {
    this.isSaving = true;
    this.accountmappingApiService.postAccountMapping(this.accountDetailList).subscribe(response => {
      if (response.isSuccessful) {
        this.isSaving = false;
        this.toastrService.success('Saved Successfully');
      }
    }),
      error => {
        this.isSaving = false;
        this.toastrService.error('Something went wrong. Try again later!');
      };
  }

  ngOnInit() {
    this.getOrganisations();
    this.accountmappingApiService.selectedAccounList$.subscribe(list => {
      if (!list) {
        return;
      } else {
        // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^', list);
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
    let id = obj.id;
    this.accountDetailList = this.accountDetailList.filter(function(el) {
      return el.id !== id;
    });
  }
}
