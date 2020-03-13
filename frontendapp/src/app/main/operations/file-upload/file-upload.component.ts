import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GridOptions, ColGroupDef, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridLayoutMenuComponent } from 'lp-toolkit';
/* Services/Components Imports */
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { IgnoreFields, HeightStyle, ExcelStyle, LegendColors } from 'src/shared/utils/Shared';

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
  monthlyPerformanceGridPreview: GridOptions;
  dailyPnLGridPreview: GridOptions;
  marketPricesGridPreview: GridOptions;
  fxratesGridPreview: GridOptions;
  tradesGridPreview: GridOptions;
  displayGrid = false;
  fxRateDupList: any;
  ignoreFields = IgnoreFields;
  columns: Array<ColDef | ColGroupDef>;
  rowData: any[] = [];
  exceptionContent: any;

  fileToUpload: File = null;
  disableFileUpload = true;
  uploadLoader = false;
  confirmStatus = false;
  fileType = 'Select a File Type';
  fileTypes = ['Monthly Performance', 'Daily PnL', 'Market Prices', 'FxRates', 'Trades'];

  displayTradeGrid = false;
  commitLoader = false;
  tradePreviewData : any = null

  constructor(
    private toastrService: ToastrService,
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
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

    this.monthlyPerformanceGridPreview = {
      rowData: [],
      columnDefs: [
        {
          field: 'PerformanceDate',
          headerName: 'PerformanceDate',
          hide: true
        },
        {
          field: 'Fund',
          headerName: 'Fund'
        },
        {
          field: 'Portfolio',
          headerName: 'Portfolio'
        },
        {
          field: 'StartOfMonthEstimateNav',
          headerName: 'StartOfMonthEstimateNav'
        },
        {
          field: 'Performance',
          headerName: 'Performance'
        },
        {
          field: 'MonthEndNav',
          headerName: 'MonthEndNav'
        },
        {
          field: 'MTD',
          headerName: 'MTD'
        }
      ],
      onGridReady: params => {
        this.monthlyPerformanceGridPreview.excelStyles = ExcelStyle;
      }
    };

    this.dailyPnLGridPreview = {
      rowData: [],
      columnDefs: [
        {
          field: 'BusinessDate',
          headerName: 'BusinessDate'
        },
        {
          field: 'Portfolio',
          headerName: 'Portfolio'
        },
        {
          field: 'Fund',
          headerName: 'Fund'
        },
        {
          field: 'TradePnL',
          headerName: 'TradePnL'
        },
        {
          field: 'Day',
          headerName: 'Day'
        },
        {
          field: 'DailyPercentageReturn',
          headerName: 'DailyPercentageReturn'
        },
        {
          field: 'LongPnL',
          headerName: 'LongPnL'
        },
        {
          field: 'LongPercentageChange',
          headerName: 'LongPercentageChange'
        },
        {
          field: 'ShortPnL',
          headerName: 'ShortPnL'
        },
        {
          field: 'ShortPercentageChange',
          headerName: 'ShortPercentageChange'
        },
        {
          field: 'LongExposure',
          headerName: 'LongExposure'
        },
        {
          field: 'ShortExposure',
          headerName: 'ShortExposure'
        },
        {
          field: 'GrossExposure',
          headerName: 'GrossExposure'
        },
        {
          field: 'NetExposure',
          headerName: 'NetExposure'
        },
        {
          field: 'SixMdBetaNetExposure',
          headerName: 'SixMdBetaNetExposure'
        },
        {
          field: 'TwoYwBetaNetExposure',
          headerName: 'TwoYwBetaNetExposure'
        },
        {
          field: 'SixMdBetaShortExposure',
          headerName: 'SixMdBetaShortExposure'
        },
        {
          field: 'NavMarket',
          headerName: 'NavMarket'
        },
        {
          field: 'DividendUSD',
          headerName: 'DividendUSD'
        },
        {
          field: 'CommUSD',
          headerName: 'CommUSD'
        },
        {
          field: 'FeeTaxesUSD',
          headerName: 'FeeTaxesUSD'
        },
        {
          field: 'FinancingUSD',
          headerName: 'FinancingUSD'
        },
        {
          field: 'OtherUSD',
          headerName: 'OtherUSD'
        },
        {
          field: 'PnLPercentage',
          headerName: 'PnLPercentage'
        }
      ],
      onGridReady: params => {
        this.dailyPnLGridPreview.excelStyles = ExcelStyle;
      }
    };

    this.marketPricesGridPreview = {
      rowData: [],
      columnDefs: [
        {
          field: 'Date',
          headerName: 'Date'
        },
        {
          field: 'SecurityId',
          headerName: 'SecurityId'
        },
        {
          field: 'Price',
          headerName: 'Price'
        },
        {
          field: 'CCY',
          headerName: 'CCY'
        }
      ],
      onGridReady: params => {
        this.marketPricesGridPreview.excelStyles = ExcelStyle;
      }
    };

    this.fxratesGridPreview = {
      rowData: [],
      columnDefs: [
        {
          field: 'Date',
          headerName: 'Date'
        },
        {
          field: 'Price',
          headerName: 'Price'
        },
        {
          field: 'CCY',
          headerName: 'CCY'
        }
      ],
      onGridReady: params => {
        this.fxratesGridPreview.excelStyles = ExcelStyle;
      }
    };

    this.tradesGridPreview = {
      rowData: [],
      columnDefs: [
        {
          field: 'Action',
          headerName: 'Action'
        },
        {
          field: 'Symbol',
          headerName: 'Symbol'
        },
        {
          field: 'Side',
          headerName: 'Side'
        },
        {
          field: 'Quantity',
          headerName: 'Quantity'
        },
        {
          field: 'TimeInForce',
          headerName: 'TimeInForce'
        },
        {
          field: 'OrderType',
          headerName: 'OrderType'
        },
        {
          field: 'SecurityType',
          headerName: 'SecurityType'
        },
        {
          field: 'BloombergCode',
          headerName: 'BloombergCode'
        },
        {
          field: 'EzeTicker',
          headerName: 'EzeTicker'
        },
        {
          field: 'SecurityCode',
          headerName: 'SecurityCode'
        },
        {
          field: 'CustodianCode',
          headerName: 'CustodianCode'
        },
        {
          field: 'ExecutionBroker',
          headerName: 'ExecutionBroker'
        },
        {
          field: 'Fund',
          headerName: 'Fund'
        },
        {
          field: 'PMCode',
          headerName: 'PMCode'
        },
        {
          field: 'PortfolioCode',
          headerName: 'PortfolioCode'
        },
        {
          field: 'Trader',
          headerName: 'Trader'
        },
        {
          field: 'TradeCurrency',
          headerName: 'TradeCurrency'
        },
        {
          field: 'TradePrice',
          headerName: 'TradePrice'
        },
        {
          field: 'TradeDate',
          headerName: 'TradeDate'
        },
        {
          field: 'SettleCurrency',
          headerName: 'SettleCurrency'
        },
        {
          field: 'SettlePrice',
          headerName: 'SettlePrice'
        },
        {
          field: 'SettleDate',
          headerName: 'SettleDate'
        },
        {
          field: 'TradeType',
          headerName: 'TradeType'
        },
        {
          field: 'TransactionCategory',
          headerName: 'TransactionCategory'
        },
        {
          field: 'TransactionType',
          headerName: 'TransactionType'
        },
        {
          field: 'Status',
          headerName: 'Status'
        },
        {
          field: 'NetMoney',
          headerName: 'NetMoney'
        },
        {
          field: 'Commission',
          headerName: 'Commission'
        },
        {
          field: 'Fees',
          headerName: 'Fees'
        },
        {
          field: 'SettleNetMoney',
          headerName: 'SettleNetMoney'
        },
        {
          field: 'NetPrice',
          headerName: 'NetPrice'
        },
        {
          field: 'SettleNetPrice',
          headerName: 'SettleNetPrice'
        },
        {
          field: 'OrderSource',
          headerName: 'OrderSource'
        },
        {
          field: 'LocalNetNotional',
          headerName: 'LocalNetNotional'
        },
        {
          field: 'TradeTime',
          headerName: 'TradeTime'
        },
        {
          field: 'LPOrderId',
          headerName: 'LPOrderId'
        },
        {
          field: 'TradeId',
          headerName: 'TradeId'
        },
        {
          field: 'SecurityId',
          headerName: 'SecurityId',
          hide: true
        },
        {
          field: 'Reason',
          headerName: 'Reason'
        },
        {
          field: 'IsUploadInValid',
          headerName: 'IsUploadInValid',
          hide: true
        },
        {
          field: 'UploadException',
          headerName: 'UploadException',
          hide: true
        }
      ],
      defaultColDef: {
        cellStyle: params => {
          const exception = JSON.parse(params.data.UploadException);
          if (exception) {
            const invalid = exception.Fields.some(
              element => element.Name === params.colDef.headerName
            );
            if (invalid) {
              return LegendColors.nonZeroStyle;
            }
          } else {
            return null;
          }
        },
        tooltipValueGetter: params => {
          const exception = JSON.parse(params.data.UploadException);
          if (exception) {
            let message = '';
            const invalid = exception.Fields.some(element => {
              if (element.Name === params.colDef.headerName) {
                message = element.Message;
                return true;
              }
            });
            console.log('INVALID ::', invalid);
            if (invalid) {
              return message;
            }
          } else {
            return '';
          }
        }
      },
      onGridReady: params => {
        this.tradesGridPreview.excelStyles = ExcelStyle;
      },
      onRowClicked: params => {
        if (params.data.UploadException) {
          this.exceptionContent = JSON.parse(params.data.UploadException);
        } else {
          this.exceptionContent = {};
        }
      },
      // getRowStyle: params => {
      //   if (params.data.IsUploadInValid) {
      //     return LegendColors.nonZeroStyle;
      //   }
      // },
      suppressColumnVirtualisation: true,
      enableBrowserTooltips: true,
      rowSelection: 'single'
    };
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
    } else if (this.fileType === 'Trades') {
      this.uploadTradeData();
    }
  }

  commitData(){
      this.commitTradeData();
  }

  downloadTemplate() {
    const template = this.fileType
      .split(' ')
      .map((word, i) => {
        if (i === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');
    this.excelTemplate(this.fileType, `${this.fileType} Sheet`, template);
  }

  excelTemplate(fileName, sheetName, template) {
    const params = {
      fileName,
      sheetName
    };
    this[`${template}GridPreview`].api.exportDataAsCsv(params);
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
      if (response.isSuccessful && response.statusCode === 200) {
        this.displayGrid = false;
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else if (response.isSuccessful && response.statusCode === 403) {
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
      if (response.isSuccessful && response.statusCode === 200) {
        this.displayGrid = false;
        this.displayTradeGrid = true;
        this.tradePreviewData = response.payload;
        this.tradesGridPreview.api.setRowData(response.payload);
        this.clearForm();
        this.toastrService.success('Trades uploaded successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  commitTradeData() {
    this.commitLoader = true;
    this.fundTheoreticalApiService.commitTradeData(this.tradePreviewData).subscribe(response => {
      this.commitLoader = false;
      if (response.isSuccessful && response.statusCode === 200) {
        this.displayGrid = false;
        this.displayTradeGrid = false;
        this.tradesGridPreview.api.setRowData([]);
        this.clearForm();
        this.toastrService.success('Trades committed successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    }, err => {
      this.toastrService.error(err.Message);
    });
  }

  uploadFxRatesData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadFxData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      this.displayGrid = false;
      if (response.isSuccessful && response.statusCode === 200) {
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else if (response.isSuccessful && response.statusCode === 403) {
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
