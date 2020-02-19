import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataService } from 'src/services/common/data.service';
import { SettingApiService } from '../../../../services/setting-api.service';
import { Style, HeightStyle } from '../../../../shared/utils/Shared';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('settingsForm', { static: true }) settingsForm: NgForm;

  currencies = [];
  methods = [
    { code: 'FIFO', description: 'First In First Out' },
    { code: 'LIFO', description: 'Last In First Out' },
    { code: 'MINTAX', description: 'Minimum Tax' }
  ];
  months = moment.months();
  days = [];
  dates: Array<{ month: string; days: Array<number> }> = [];
  settingId = 0;
  day = '';
  requestType = 'PUT';
  isLoading = true;
  isSaving = false;
  isGridViewsActive = false;
  hideGrid: boolean;

  style = Style;

  styleForHeight = HeightStyle(180);

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(
    private settingApiService: SettingApiService,
    private dataService: DataService,
    private toastrService: ToastrService
  ) {
    this.hideGrid = false;
    this.createDates();
  }

  ngOnInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getCurrencies();
      }
    });
  }

  activateTab(tab: string) {
    switch (tab) {
      case 'GridViews':
        this.isGridViewsActive = true;
        break;
      default:
        break;
    }
  }

  onChangeReportingMonth(selectedMonth) {
    this.days = this.dates.find(date => date.month === selectedMonth).days;
  }

  getCurrencies() {
    this.settingApiService.getReportingCurrencies().subscribe(
      response => {
        if (response.isSuccessful) {
          this.currencies = response.payload;
        }

        this.getSettings();
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  getSettings() {
    this.settingApiService.getSettings().subscribe(
      response => {
        if (response.isSuccessful && response.statusCode === 200) {
          this.requestType = 'PUT';
          this.onChangeReportingMonth(response.payload[0].fiscal_month);

          this.settingId = response.payload[0].id;
          this.settingsForm.form.patchValue({
            theme: response.payload[0].theme,
            currency: response.payload[0].currency_code,
            methodology: response.payload[0].tax_methodology,
            month: response.payload[0].fiscal_month
          });
          this.day = response.payload[0].fiscal_day;
        } else if (response.isSuccessful && response.statusCode === 404) {
          this.requestType = 'POST';
        }

        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  onSaveSettings() {
    this.isSaving = true;
    const payload = {
      id: this.settingId,
      theme: this.settingsForm.value.theme,
      currencyCode: this.settingsForm.value.currency,
      taxMethodology: this.settingsForm.value.methodology,
      fiscalMonth: this.settingsForm.value.month,
      fiscalDay: this.settingsForm.value.day
    };

    const requestMethod = this.requestType === 'POST' ? 'createSettings' : 'saveSettings';
    this.settingApiService[requestMethod](payload).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Settings Saved Successfully');
        }

        this.isSaving = false;
        this.getSettings();
      },
      error => {
        this.isSaving = false;
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  createDates() {
    this.months.forEach(month => {
      this.dates.push({
        month,
        days: this.getListofDaysByMonth(month)
      });
    });
  }

  getListofDaysByMonth(month: string) {
    const days = [];
    for (let i = 1; i <= moment(moment().month(month)).daysInMonth(); i++) {
      days.push(i);
    }

    return days;
  }
}
