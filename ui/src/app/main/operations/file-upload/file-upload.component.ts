/* Angular/Packages Imports */
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridUtils } from '@lightpointfinancialtechnology/lp-toolkit';
/* Components/Services Imports */
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { HeightStyle, ExcelStyle, LegendColors } from 'src/shared/utils/Shared';

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

  dataReviewGrid: GridOptions;
  reviewGridData: any[] = [];
  exceptionContent: any;

  fileToUpload: File = null;

  displayReviewGrid = false;
  disableFileUpload = true;
  disableCommit = true;
  uploadLoader = false;
  commitLoader = false;
  confirmStatus = false;

  fileType = 'Select a File Type';
  fileTypes = [];

  styleForLogsHeight = HeightStyle(220);

  constructor(
    private toastrService: ToastrService,
    private fundTheoreticalApiService: FundTheoreticalApiService,
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
    this.dataReviewGrid = {
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
        this.dataReviewGrid.excelStyles = ExcelStyle;
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

    this.dataReviewGrid.api.setColumnDefs(this.getColDefs(this.fileType));
    this.dataReviewGrid.api.exportDataAsCsv(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = this.fileType === 'Select a File Type' ? true : false;
    this.fileToUpload = files.item(0);
  }

  onUploadFile() {
    this.exceptionContent = '';

    switch (this.fileType) {
      case FILES.MonthlyPerformance:
        this.confirmUploadMonthlyPerformance();
        break;
      case FILES.DailyPnL:
        this.uploadData('uploadDailyUnofficialPnl', FILES.DailyPnL);
        break;
      case FILES.MarketPrices:
        this.uploadData('uploadMarketPriceData', FILES.MarketPrices);
        break;
      case FILES.FxRates:
        this.uploadData('uploadFxData', FILES.FxRates);
        break;
      case FILES.Trades:
        this.uploadData('uploadTradeData', FILES.Trades);
        break;
      case FILES.Journals:
        this.uploadData('uploadJournalData', FILES.Journals);
        break;
      default:
        break;
    }
  }

  onCommitData() {
    switch (this.fileType) {
      case FILES.MonthlyPerformance:
        this.commitData('commitMonthlyPerformanceData', FILES.MonthlyPerformance);
        break;
      case FILES.DailyPnL:
        this.commitData('commitDailyUnofficialPnl', FILES.DailyPnL);
        break;
      case FILES.MarketPrices:
        this.commitData('commitMarketPriceData', FILES.MarketPrices);
        break;
      case FILES.FxRates:
        this.commitData('commitFxRateData', FILES.FxRates);
        break;
      case FILES.Trades:
        this.commitData('commitTradeData', FILES.Trades);
        break;
      case FILES.Journals:
        this.commitData('commitJournalData', FILES.Journals);
        break;
      default:
        break;
    }
  }

  uploadData(functionName: string, fileType: string) {
    this.uploadLoader = true;
    this.fundTheoreticalApiService[functionName](this.fileToUpload).subscribe(
      response => {
        this.uploadLoader = false;
        this.confirmStatus = false;
        if (response.isSuccessful && response.statusCode === 200) {
          this.showReviewGrid(response, fileType);
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

  commitData(functionName: string, fileType: string) {
    this.commitLoader = true;
    this.fundTheoreticalApiService[functionName](this.reviewGridData).subscribe(
      response => {
        this.commitLoader = false;

        if (response.isSuccessful && response.statusCode === 200) {
          this.hideReviewGrid(fileType);
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

  showReviewGrid(response: any, fileType: string) {
    this.displayReviewGrid = true;

    this.disableCommit = !response.payload.EnableCommit;
    this.reviewGridData = response.payload.Data;

    this.dataReviewGrid.api.setColumnDefs(this.getColDefs(fileType));
    this.dataReviewGrid.api.setRowData(this.reviewGridData);

    this.toastrService.success(`${fileType} uploaded successfully!`);
  }

  hideReviewGrid(fileType: string) {
    this.displayReviewGrid = false;

    this.dataReviewGrid.api.setRowData([]);
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
            field: 'BusinessDate',
            headerName: 'Date'
          },
          {
            field: 'Symbol',
            headerName: 'Symbol'
          },
          {
            field: 'Price',
            headerName: 'Price'
          },
          {
            field: 'Currency',
            headerName: 'Currency'
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
            field: 'BusinessDate',
            headerName: 'Date'
          },
          {
            field: 'Price',
            headerName: 'Price'
          },
          {
            field: 'Currency',
            headerName: 'Currency'
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

  confirmUploadMonthlyPerformance() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService.getMonthlyPerformanceStatus().subscribe(
      response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          if (response.payload) {
            this.confirmStatus = true;
            this.confirmationModal.showModal();
          } else {
            this.uploadData('uploadMonthlyPerformance', FILES.MonthlyPerformance);
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
  }

  confirmReset() {
    if (this.confirmStatus) {
      this.uploadData('uploadMonthlyPerformance', FILES.MonthlyPerformance);
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
