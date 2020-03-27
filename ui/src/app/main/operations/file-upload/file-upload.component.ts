import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GridOptions, ColGroupDef, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridUtils } from '@lightpointfinancialtechnology/lp-toolkit';
/* Services/Components Imports */
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { IgnoreFields, HeightStyle, ExcelStyle, LegendColors } from 'src/shared/utils/Shared';

enum FILES {
  MonthlyPerformance = 'Monthly Performance',
  DailyPnL = 'Daily PnL',
  MarketPrices = 'Market Prices',
  FxRates = 'FxRates',
  Trades = 'Trades',
  Journals = 'Journals'
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ConfirmationModalComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  previewGrid: GridOptions;
  previewData: any[] = [];
  exceptionContent: any;
  uploadGrid: GridOptions;
  columns: Array<ColDef | ColGroupDef>;
  rowData: any[] = [];

  ignoreFields = IgnoreFields;
  fileToUpload: File = null;

  displayPreviewGrid = false;
  displayGrid = false;
  disableFileUpload = true;
  uploadLoader = false;
  disableCommit = true;
  commitLoader = false;
  confirmStatus = false;

  fileType = 'Select a File Type';
  fileTypes = [];

  styleForLogsHeight = HeightStyle(220);

  constructor(
    private toastrService: ToastrService,
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private dataDictionary: DataDictionary,
    private downloadExcelUtils: DownloadExcelUtils
  ) {}

  ngOnInit() {
    this.initGrid();
    this.initFileTypes();
  }

  initFileTypes() {
    for (const key in FILES) {
      if (FILES.hasOwnProperty(key)) {
        this.fileTypes.push(FILES[key]);
      }
    }
  }

  initGrid() {
    this.uploadGrid = {
      rowData: [],
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      animateRows: true,
      singleClickEdit: true,
      onGridReady: params => {
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      defaultColDef: {
        resizable: true
      }
    };

    this.previewGrid = {
      rowData: [],
      defaultColDef: {
        resizable: true,
        cellStyle: params => {
          if (params.data.UploadException !== undefined) {
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
          }
        },
        tooltipValueGetter: params => {
          if (params.data.UploadException !== undefined) {
            const exception = JSON.parse(params.data.UploadException);
            if (exception) {
              let message = '';
              const invalid = exception.Fields.some(element => {
                if (element.Name === params.colDef.headerName) {
                  message = element.Message;
                  return true;
                }
              });
              if (invalid) {
                return message;
              }
            } else {
              return '';
            }
          }
        }
      },
      onGridReady: params => {
        GridUtils.autoSizeAllColumns(params);
        this.previewGrid.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        GridUtils.autoSizeAllColumns(params);
      },
      onCellClicked: params => {
        if (params.data.UploadException !== undefined) {
          const exception = JSON.parse(params.data.UploadException);
          if (params.data.UploadException) {
            this.exceptionContent =
              exception.Fields.find(element => element.Name === params.colDef.headerName) || {};
          } else {
            this.exceptionContent = {};
          }
        }
      },
      // onRowClicked: params => {
      //   if (params.data.UploadException) {
      //     this.exceptionContent = JSON.parse(params.data.UploadException);
      //   } else {
      //     this.exceptionContent = {};
      //   }
      // },
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

  onChangeFileType(selectedFileType) {
    this.disableFileUpload =
      this.fileToUpload === null || this.fileType === 'Select a File Type' ? true : false;
    this.fileType = selectedFileType;
  }

  onDownloadTemplate() {
    this.excelTemplate(this.fileType, `${this.fileType} Sheet`);
  }

  excelTemplate(fileName, sheetName) {
    const params = {
      fileName,
      sheetName
    };

    this.previewGrid.api.setColumnDefs(this.getColDefs(this.fileType));
    this.previewGrid.api.exportDataAsCsv(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = this.fileType === 'Select a File Type' ? true : false;
    this.fileToUpload = files.item(0);
  }

  onUploadFile() {
    this.exceptionContent = '';

    if (this.fileType === FILES.MonthlyPerformance) {
      this.uploadLoader = true;
      this.fundTheoreticalApiService.getMonthlyPerformanceStatus().subscribe(
        response => {
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
        },
        error => {
          this.uploadLoader = false;
          this.toastrService.error('Something went wrong! Try Again.');
        }
      );
    } else if (this.fileType === FILES.DailyPnL) {
      this.uploadDailyUnofficialPnl();
    } else if (this.fileType === FILES.MarketPrices) {
      this.uploadMarketData();
    } else if (this.fileType === FILES.FxRates) {
      this.uploadFxRatesData();
    } else if (this.fileType === FILES.Trades) {
      this.uploadTradeData();
    } else if (this.fileType === FILES.Journals) {
      this.uploadJournalData();
    }
  }

  onCommitData() {
    switch (this.fileType) {
      case FILES.MonthlyPerformance:
        this.commitMonthlyPerformanceData();
        break;
      case FILES.DailyPnL:
        this.commitDailyUnofficialPnlData();
        break;
      case FILES.MarketPrices:
        break;
      case FILES.FxRates:
        break;
      case FILES.Trades:
        this.commitTradeData();
        break;
      case FILES.Journals:
        this.commitJournalData();
        break;
      default:
        break;
    }
  }

  uploadMonthlyPerformance() {
    this.uploadLoader = true;
    this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;
        this.confirmStatus = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.showPreviewGrid(response, FILES.MonthlyPerformance);
        } else {
          this.toastrService.error(response.ExceptionMessage);
        }
      },
      error => {
        this.uploadLoader = false;
        this.confirmStatus = false;
        this.toastrService.error(error.ExceptionMessage);
      }
    );
  }

  uploadDailyUnofficialPnl() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadDailyUnofficialPnl(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.showPreviewGrid(response, FILES.DailyPnL);
        } else {
          this.toastrService.error(response.ExceptionMessage);
        }
      },
      error => {
        this.uploadLoader = false;
        this.toastrService.error(error.ExceptionMessage);
      }
    );
  }

  uploadMarketData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadMarketPriceData(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.displayPreviewGrid = false;
          this.displayGrid = false;

          this.clearForm();
          this.toastrService.success('File uploaded successfully!');
        } else if (response.isSuccessful && response.statusCode === 403) {
          this.displayPreviewGrid = false;
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
      },
      error => {
        this.uploadLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  uploadFxRatesData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadFxData(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.displayPreviewGrid = false;
          this.displayGrid = false;

          this.clearForm();
          this.toastrService.success('File uploaded successfully!');
        } else if (response.isSuccessful && response.statusCode === 403) {
          this.displayPreviewGrid = false;
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
      },
      error => {
        this.uploadLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  uploadTradeData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadTradeData(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.showPreviewGrid(response, FILES.Trades);
        } else {
          this.toastrService.error(response.ExceptionMessage);
        }
      },
      error => {
        this.uploadLoader = false;
        this.toastrService.error(error.ExceptionMessage);
      }
    );
  }

  uploadJournalData() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.uploadJournalData(this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.showPreviewGrid(response, FILES.Journals);
        } else {
          this.toastrService.error(response.ExceptionMessage);
        }
      },
      error => {
        this.uploadLoader = false;
        this.toastrService.error(error.ExceptionMessage);
      }
    );
  }

  commitMonthlyPerformanceData() {
    this.commitLoader = true;
    this.financeService.commitMonthlyPerformance(this.previewData).subscribe(
      response => {
        this.commitLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.hidePreviewGrid(FILES.MonthlyPerformance);
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      },
      error => {
        this.commitLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  commitDailyUnofficialPnlData() {
    this.commitLoader = true;
    this.fundTheoreticalApiService.commitDailyUnofficialPnl(this.previewData).subscribe(
      response => {
        this.commitLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.hidePreviewGrid(FILES.DailyPnL);
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      },
      error => {
        this.commitLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  commitTradeData() {
    this.commitLoader = true;
    this.fundTheoreticalApiService.commitTradeData(this.previewData).subscribe(
      response => {
        this.commitLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.hidePreviewGrid(FILES.Trades);
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      },
      error => {
        this.commitLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  commitJournalData() {
    this.commitLoader = true;
    this.fundTheoreticalApiService.commitJournalData(this.previewData).subscribe(
      response => {
        this.commitLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.hidePreviewGrid(FILES.Journals);
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      },
      error => {
        this.commitLoader = false;
        this.toastrService.error('Something went wrong! Try Again.');
      }
    );
  }

  customizeColumns(columns: any) {
    const storeColumns = [];
    for (let i = 1; i < columns.length; i++) {
      storeColumns.push(this.dataDictionary.column(columns[i].field, true));
    }
    this.uploadGrid.api.setColumnDefs(storeColumns);
  }

  showPreviewGrid(response: any, fileType: string) {
    this.displayPreviewGrid = true;
    this.displayGrid = false;

    this.disableCommit = !response.payload.EnableCommit;
    this.previewData = response.payload.Data;

    this.previewGrid.api.setColumnDefs(this.getColDefs(fileType));
    this.previewGrid.api.setRowData(this.previewData);

    this.toastrService.success(`${fileType} uploaded successfully!`);
  }

  hidePreviewGrid(fileType: string) {
    this.displayPreviewGrid = false;
    this.displayGrid = false;

    this.previewGrid.api.setRowData([]);
    this.clearForm();

    this.toastrService.success(`${fileType} committed successfully!`);
  }

  getColDefs(fileType: string) {
    switch (fileType) {
      case FILES.MonthlyPerformance:
        return [
          {
            field: 'PerformanceDate',
            headerName: 'PerformanceDate'
          },
          {
            field: 'Fund',
            headerName: 'Fund'
          },
          {
            field: 'PortFolio',
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
        ];
      case FILES.DailyPnL:
        return [
          {
            field: 'BusinessDate',
            headerName: 'BusinessDate'
          },
          {
            field: 'PortFolio',
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
        ];
      case FILES.MarketPrices:
        return [
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
        ];
      case FILES.FxRates:
        return [
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
        ];
      case FILES.Trades:
        return [
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
        ];
      case FILES.Journals:
        return [
          {
            field: 'When',
            headerName: 'When'
          },
          {
            field: 'Credit',
            headerName: 'Credit'
          },
          {
            field: 'Debit',
            headerName: 'Debit'
          },
          {
            field: 'Value',
            headerName: 'Value'
          },
          {
            field: 'Symbol',
            headerName: 'Symbol'
          },
          {
            field: 'AccountCategory',
            headerName: 'AccountCategory'
          },
          {
            field: 'AccountType',
            headerName: 'AccountType'
          },
          {
            field: 'AccountDescription',
            headerName: 'AccountDescription'
          },
          {
            field: 'Source',
            headerName: 'Source'
          },
          {
            field: 'Fund',
            headerName: 'Fund'
          },
          {
            field: 'Currency',
            headerName: 'FX Currency'
          },
          {
            field: 'Comment',
            headerName: 'Comment'
          },
          {
            field: 'CreditDebit',
            headerName: 'Credit/Debit'
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
        ];
      default:
        break;
    }
  }

  confirmReset() {
    if (this.confirmStatus) {
      this.uploadMonthlyPerformance();
    }
  }

  clearForm() {
    this.fileType = 'Select a File Type';
    this.fileInput.nativeElement.value = '';
    this.fileToUpload = null;
    this.disableFileUpload = true;
    this.disableCommit = true;
  }
}
