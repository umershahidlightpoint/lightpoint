import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridOptions, ColGroupDef, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridLayoutMenuComponent } from 'lp-toolkit';
/* Services/Components Imports */
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';
import { IgnoreFields, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ConfirmationModalComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  styleForLogsHeight = HeightStyle(220);
  uploadGrid: GridOptions;
  displayGrid = false;
  fxRateDupList: any;
  ignoreFields = IgnoreFields;
  columns: Array<ColDef | ColGroupDef>;
  rowData: any[] = [];

  fileToUpload: File = null;
  disableFileUpload = true;
  uploadLoader = false;
  confirmStatus = false;
  fileType = 'Select a File Type';
  fileTypes = ['Monthly Performance', 'Daily PnL', 'Market Prices', 'FxRates'];

  constructor(
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    private dataDictionary: DataDictionary
  ) {}

  ngOnInit() {
    this.initGrid();
  }

  initGrid() {
    this.uploadGrid = {
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotRowTotals: 'after',
      pivotColumnGroupTotals: 'after',
      animateRows: true,
      singleClickEdit: true,
      getExternalFilterState: () => {
        return {};
      },
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      onGridReady: params => {
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
  }

  changeFileType(selectedFileType) {
    this.disableFileUpload =
      this.fileToUpload === null || this.fileType === 'Select a File Type' ? true : false;
    this.fileType = selectedFileType;
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = this.fileType === 'Select a File Type' ? true : false;
    this.fileToUpload = files.item(0);
  }

  uploadRows() {
    if (this.fileType === 'Monthly Performance') {
      this.uploadLoader = true;
      this.fundTheoreticalApiService.getMonthlyPerformanceStatus().subscribe(response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          if (response.payload) {
            this.confirmStatus = true;
            this.confirmationModal.showModal();
          } else {
            this.uploadMonthlyPerformance();
          }
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
    } else if (this.fileType === 'Daily PnL') {
      this.uploadDailyUnofficialPnl();
    } else if (this.fileType === 'Market Prices') {
      this.uploadMarketData();
    } else if (this.fileType === 'FxRates') {
      this.uploadFxRatesData();
    }
  }

  confirmReset() {
    if (this.confirmStatus) {
      this.uploadMonthlyPerformance();
    }
  }

  uploadMonthlyPerformance() {
    this.uploadLoader = true;
    this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      this.confirmStatus = false;
      if (response.isSuccessful) {
        this.displayGrid = false;
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  uploadDailyUnofficialPnl() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService
      .uploadDailyUnofficialPnl(this.fileToUpload)
      .subscribe(response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          this.displayGrid = false;
          this.clearForm();
          this.toastrService.success('File uploaded successfully!');
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
  }

  uploadMarketData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadMarketPriceData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      if (response.isSuccessful && response.statusCode == 200) {
        this.displayGrid = false;
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else if (response.isSuccessful && response.statusCode == 403) {
        this.displayGrid = true;

        this.columns = response.meta;
        this.rowData = response.payload;

        this.customizeColumns(this.columns);
        this.uploadGrid.api.setRowData(this.rowData);

        this.clearForm();
        this.toastrService.error('Error: Duplication Detected!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  uploadFxRatesData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadFxData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      this.displayGrid = false;
      if (response.isSuccessful && response.statusCode == 200) {
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else if (response.isSuccessful && response.statusCode == 403) {
        this.displayGrid = true;

        this.columns = response.meta;
        this.rowData = response.payload;

        this.customizeColumns(this.columns);
        this.uploadGrid.api.setRowData(this.rowData);

        this.clearForm();
        this.toastrService.error('Error: Duplication Detected!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  customizeColumns(columns: any) {
    const storeColumns = [];
    for (let i = 1; i < columns.length; i++) {
      storeColumns.push(this.dataDictionary.column(columns[i].field, true));
    }
    this.uploadGrid.api.setColumnDefs(storeColumns);
  }

  clearForm() {
    this.disableFileUpload = true;
    this.fileType = 'Select a File Type';
    this.fileToUpload = null;
    this.fileInput.nativeElement.value = '';
  }
}
