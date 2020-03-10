import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridOptions, ColGroupDef, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridLayoutMenuComponent } from 'lp-toolkit';
/* Services/Components Imports */
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';
import { IgnoreFields, HeightStyle, ExcelStyle } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';


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
  tradesGridPreview: GridOptions;
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
  fileTypes = ['Monthly Performance', 'Daily PnL', 'Market Prices', 'FxRates', 'Trades'];

  constructor(
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    private dataDictionary: DataDictionary,
    private downloadExcelUtils: DownloadExcelUtils
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

    this.tradesGridPreview = {
      rowData: [],
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => {},
      onGridReady: params => {
        this.tradesGridPreview.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        // AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'Action',
          width: 120,
          headerName: 'Action',
        },
        {
          field: 'Symbol',
          width: 120,
          headerName: 'Symbol',
        },
        {
          field: 'Side',
          width: 120,
          headerName: 'Side',
        },
        {
          field: 'Quantity',
          width: 120,
          headerName: 'Quantity',
        },
        {
          field: 'TimeInForce',
          width: 120,
          headerName: 'TimeInForce',
        },
        {
          field: 'OrderType',
          width: 120,
          headerName: 'OrderType',
        },
        {
          field: 'SecurityType',
          width: 120,
          headerName: 'SecurityType',
        },
        {
          field: 'BloombergCode',
          width: 120,
          headerName: 'BloombergCode',
        },
        {
          field: 'EzeTicker',
          width: 120,
          headerName: 'EzeTicker',
        },
        {
          field: 'SecurityCode',
          width: 120,
          headerName: 'SecurityCode',
        },
        {
          field: 'CustodianCode',
          width: 120,
          headerName: 'CustodianCode',
        },
        {
          field: 'ExecutionBroker',
          width: 120,
          headerName: 'ExecutionBroker',
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
        },
        {
          field: 'PMCode',
          width: 120,
          headerName: 'PMCode',
        },
        {
          field: 'PortfolioCode',
          width: 120,
          headerName: 'PortfolioCode',
        },
        {
          field: 'Trader',
          width: 120,
          headerName: 'Trader',
        },
        {
          field: 'TradeCurrency',
          width: 120,
          headerName: 'TradeCurrency',
        },
        {
          field: 'TradePrice',
          width: 120,
          headerName: 'TradePrice',
        },
        {
          field: 'TradeDate',
          width: 120,
          headerName: 'TradeDate',
        },
        {
          field: 'SettleCurrency',
          width: 120,
          headerName: 'SettleCurrency',
        },
        {
          field: 'SettlePrice',
          width: 120,
          headerName: 'SettlePrice',
        },
        {
          field: 'SettleDate',
          width: 120,
          headerName: 'SettleDate',
        },
        {
          field: 'TradeType',
          width: 120,
          headerName: 'TradeType',
        },
        {
          field: 'TransactionCategory',
          width: 120,
          headerName: 'TransactionCategory',
        },
        {
          field: 'TransactionType',
          width: 120,
          headerName: 'TransactionType',
        },
        {
          field: 'ParentSymbol',
          width: 120,
          headerName: 'ParentSymbol',
        },
        {
          field: 'Status',
          width: 120,
          headerName: 'Status',
        },
        {
          field: 'NetMoney',
          width: 120,
          headerName: 'NetMoney',
        },
        {
          field: 'Commission',
          width: 120,
          headerName: 'Commission',
        },
        {
          field: 'Fees',
          width: 120,
          headerName: 'Fees',
        },
        {
          field: 'SettleNetMoney',
          width: 120,
          headerName: 'SettleNetMoney',
        },
        {
          field: 'NetPrice',
          width: 120,
          headerName: 'NetPrice',
        },
        {
          field: 'SettleNetPrice',
          width: 120,
          headerName: 'SettleNetPrice',
        },
        {
          field: 'OrderSource',
          width: 120,
          headerName: 'OrderSource',
        },
        {
          field: 'LocalNetNotional',
          width: 120,
          headerName: 'LocalNetNotional',
        },
        {
          field: 'TradeTime',
          width: 120,
          headerName: 'TradeTime',
        },
        {
          field: 'LPOrderId',
          width: 120,
          headerName: 'LPOrderId',
        },
        {
          field: 'AccrualId',
          width: 120,
          headerName: 'AccrualId',
        },
        {
          field: 'TradeId',
          width: 120,
          headerName: 'TradeId',
        },
        {
          field: 'SecurityId',
          width: 120,
          headerName: 'SecurityId',
        },
        {
          field: 'ParentOrderId',
          width: 120,
          headerName: 'ParentOrderId',
        },
        {
          field: 'UpdatedOn',
          width: 120,
          headerName: 'UpdatedOn',
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
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
    } else if(this.fileType === "Trades"){
      this.uploadTradeData();
    }
  }

  downloadTemplate(){
    if(this.fileType === "Trades"){
      this.excelTemplate('Trades', 'Trade Sheet')
    }
  }

  excelTemplate(fileName, sheetName) {
    const params = {
      fileName: fileName,
      sheetName: sheetName
    };
    this.tradesGridPreview.api.exportDataAsCsv(params);
    this.downloadExcelUtils.ToastrMessage();
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

  uploadTradeData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadTradeData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      if (response.isSuccessful && response.statusCode == 200) {
        this.displayGrid = false;
        this.clearForm();
        this.toastrService.success('Trades uploaded successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    }, err=> {
      this.toastrService.error(err.Message);
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
