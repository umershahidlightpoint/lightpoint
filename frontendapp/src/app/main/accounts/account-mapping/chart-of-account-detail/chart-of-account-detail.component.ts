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

  dropdownArr = [{ Name: 'Select 1' }, { Name: 'Select 2' }, { Name: 'Select 3' }];
  organisation: string;
  selected: string;
  noResult = false;

  selectedValue: string;
  selectedOption: any;
  states: any[] = [
    { id: 1, name: 'Alabama', region: 'South' },
    { id: 2, name: 'Alaska', region: 'West' },
    { id: 3, name: 'Arizona', region: 'West' },
    { id: 4, name: 'Arkansas', region: 'South' },
    { id: 5, name: 'California', region: 'West' },
    { id: 6, name: 'Colorado', region: 'West' },
    { id: 7, name: 'Connecticut', region: 'Northeast' },
    { id: 8, name: 'Delaware', region: 'South' },
    { id: 9, name: 'Florida', region: 'South' },
    { id: 10, name: 'Georgia', region: 'South' },
    { id: 11, name: 'Hawaii', region: 'West' },
    { id: 12, name: 'Idaho', region: 'West' },
    { id: 13, name: 'Illinois', region: 'Midwest' },
    { id: 14, name: 'Indiana', region: 'Midwest' },
    { id: 15, name: 'Iowa', region: 'Midwest' },
    { id: 16, name: 'Kansas', region: 'Midwest' },
    { id: 17, name: 'Kentucky', region: 'South' },
    { id: 18, name: 'Louisiana', region: 'South' },
    { id: 19, name: 'Maine', region: 'Northeast' },
    { id: 21, name: 'Maryland', region: 'South' },
    { id: 22, name: 'Massachusetts', region: 'Northeast' },
    { id: 23, name: 'Michigan', region: 'Midwest' },
    { id: 24, name: 'Minnesota', region: 'Midwest' },
    { id: 25, name: 'Mississippi', region: 'South' },
    { id: 26, name: 'Missouri', region: 'Midwest' },
    { id: 27, name: 'Montana', region: 'West' },
    { id: 28, name: 'Nebraska', region: 'Midwest' },
    { id: 29, name: 'Nevada', region: 'West' },
    { id: 30, name: 'New Hampshire', region: 'Northeast' },
    { id: 31, name: 'New Jersey', region: 'Northeast' },
    { id: 32, name: 'New Mexico', region: 'West' },
    { id: 33, name: 'New York', region: 'Northeast' },
    { id: 34, name: 'North Dakota', region: 'Midwest' },
    { id: 35, name: 'North Carolina', region: 'South' },
    { id: 36, name: 'Ohio', region: 'Midwest' },
    { id: 37, name: 'Oklahoma', region: 'South' },
    { id: 38, name: 'Oregon', region: 'West' },
    { id: 39, name: 'Pennsylvania', region: 'Northeast' },
    { id: 40, name: 'Rhode Island', region: 'Northeast' },
    { id: 41, name: 'South Carolina', region: 'South' },
    { id: 42, name: 'South Dakota', region: 'Midwest' },
    { id: 43, name: 'Tennessee', region: 'South' },
    { id: 44, name: 'Texas', region: 'South' },
    { id: 45, name: 'Utah', region: 'West' },
    { id: 46, name: 'Vermont', region: 'Northeast' },
    { id: 47, name: 'Virginia', region: 'South' },
    { id: 48, name: 'Washington', region: 'South' },
    { id: 49, name: 'West Virginia', region: 'South' },
    { id: 50, name: 'Wisconsin', region: 'Midwest' },
    { id: 51, name: 'Wyoming', region: 'West' }
  ];

  // accountDetail: any[] = [
  //   {
  //     id: 0,
  //     organisation: '',
  //     accountName: ''
  //   }
  // ];

  accountDetailList: any = [];

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
      id: this.uniqueId++,
      organisation: this.organisation,
      accountName: this.selectedOption.name
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
    this.organisation = event.target.value;
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
    this.accountmappingApiService.selectedAccounList$.subscribe(list => {
      if (!list) {
        return;
      } else {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^', list);
      }
    });
  }
  // buildForm() {
  //   this.accountDetailForm = this.formBuilder.group({
  //     description: new FormControl('', Validators.required),
  //     type: new FormControl('', Validators.required),
  //     tagsList: this.formBuilder.array([])
  //   });
  //   this.accountSelectedList = this.accountDetailForm.get('tagsList') as FormArray;
  // }

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

export interface Payload {
  payload: Detail[];
}

export interface Detail {
  Id: string;
  Organisation: string;
  AccountName: string;
}
