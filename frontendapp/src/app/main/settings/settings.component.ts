import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FinanceServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { AgGridUtils } from '../../../shared/utils/AgGridUtils';
import { Style, HeightStyle } from '../../../shared/utils/Shared';
import { Observable, forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
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

  private gridOptions: GridOptions;
  private allocationsGridOptions: GridOptions;

  bottomOptions = { alignedGrids: [] };
  accrualsData: any;
  allocationAccrualsData: any;
  columnDefs: Array<ColDef | ColGroupDef>;
  page: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;

  style = Style;

  styleForHeight = HeightStyle(180);

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(
    private financeService: FinanceServiceProxy,
    private toastrService: ToastrService,
    private agGridUtils: AgGridUtils
  ) {
    this.createDates();

    // this.initGrids();
  }

  ngOnInit() {
    this.getCurrencies();

    // this.alignGrids();
  }

  onChangeReportingMonth(selectedMonth) {
    this.days = this.dates.find(date => date.month === selectedMonth).days;
  }

  getCurrencies() {
    this.financeService.getReportingCurrencies().subscribe(
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
    this.financeService.getSettings().subscribe(
      response => {
        if (response.isSuccessful && response.statusCode === 200) {
          this.requestType = 'PUT';
          this.onChangeReportingMonth(response.payload[0].fiscal_month);

          this.settingId = response.payload[0].id;
          this.settingsForm.form.patchValue({
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
      currencyCode: this.settingsForm.value.currency,
      taxMethodology: this.settingsForm.value.methodology,
      fiscalMonth: this.settingsForm.value.month,
      fiscalDay: this.settingsForm.value.day
    };

    const requestMethod = this.requestType === 'POST' ? 'createSettings' : 'saveSettings';
    this.financeService[requestMethod](payload).subscribe(
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

  // initGrids() {
  //   this.gridOptions = {
  //     rowData: [],
  //     columnDefs: this.columnDefs,
  //     onGridReady: () => {
  //       // this.gridOptions.api.sizeColumnsToFit();
  //     },
  //     onFirstDataRendered: () => {
  //       // params.api.sizeColumnsToFit();
  //     },
  //     rowSelection: 'single',
  //     enableFilter: true,
  //     animateRows: true,
  //     alignedGrids: [],
  //     suppressHorizontalScroll: false
  //   } as GridOptions;

  //   this.allocationsGridOptions = {
  //     rowData: [],
  //     columnDefs: this.columnDefs,
  //     onGridReady: () => {
  //       // this.gridOptions.api.sizeColumnsToFit();
  //     },
  //     onFirstDataRendered: () => {
  //       // params.api.sizeColumnsToFit();
  //     },
  //     enableFilter: true,
  //     animateRows: true,
  //     alignedGrids: [],
  //     suppressHorizontalScroll: false
  //   } as GridOptions;
  // }

  // alignGrids() {
  //   // Align Scroll of Grid and Footer Grid
  //   this.gridOptions.alignedGrids.push(this.bottomOptions);
  //   this.bottomOptions.alignedGrids.push(this.gridOptions);
  //   this.page = 0;
  //   this.pageSize = 0;
  //   this.accountSearch.id = 0;
  //   this.valueFilter = 0;
  //   this.sortColum = '';
  //   this.sortDirection = '';
  //   this.financeService.getAccruals().subscribe(result => {
  //     this.accrualsData = result;
  //     const someArray = this.agGridUtils.columizeData(result.data, this.accrualsData.meta.Columns);
  //     const cdefs = this.agGridUtils.customizeColumns([], this.accrualsData.meta.Columns, [], false);
  //   });
  // }

  // onRowSelected(event) {
  //   if (event.node.selected) {
  //     this.financeService.getAccrualAllocations(event.node.data.AccrualId).subscribe(result => {
  //       this.allocationAccrualsData = result;
  //       const someArray = this.agGridUtils.columizeData(
  //         result.data,
  //         this.allocationAccrualsData.meta.Columns
  //       );
  //       const cdefs = this.agGridUtils.customizeColumns(
  //         [],
  //         this.allocationAccrualsData.meta.Columns,
  //         ['Id', 'AllocationId', 'EMSOrderId'],
  //         false
  //       );

  //       // this.allocationsGridOptions.api.setColumnDefs(cdefs);
  //     });
  //   }
  // }
}
