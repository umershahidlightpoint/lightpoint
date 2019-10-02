import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { DataService } from '../../../../shared/common/data.service';
import * as moment from 'moment';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  DoesExternalFilterPass,
  FormatNumber,
  SetDateRange,
  CommaSeparatedFormat,
  HeightStyle,
  AutoSizeAllColumns
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';

@Component({
  selector: 'rep-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {
  private gridColumnApi;
  pinnedBottomRowData;
  gridOptions: GridOptions;
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel: string;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  isLoading = false;
  hideGrid: boolean;
  title = 'Account Name';

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getFunds();
    // this.getReport(null, null, 'ALL');
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      sideBar: SideBar,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridColumnApi = params.columnApi;

        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'accountName',
          width: 120,
          headerName: 'Account Name',
          enableRowGroup: true
        },
        {
          field: 'debit',
          width: 120,
          headerName: 'Debit',
          cellStyle: params => {
            if (params.data.debitPercentage > 0) {
              return {
                backgroundSize: !params.data.debitPercentage
                  ? 0
                  : params.data.debitPercentage + '%',
                backgroundRepeat: 'no-repeat'
              };
            }
            return { textAlign: 'end' };
          },
          cellClass: params => {
            if (params.data.debitPercentage > 0) {
              return 'debit';
            }
          },
          valueFormatter: currencyFormatter
        },
        {
          field: 'credit',
          headerName: 'Credit',
          filter: true,
          width: 120,
          cellStyle: params => {
            if (params.data.creditPercentage > 0) {
              return {
                backgroundSize: !params.data.creditPercentage
                  ? 0
                  : params.data.creditPercentage + '%',
                backgroundRepeat: 'no-repeat',
                color: 'red'
              };
            }
            return { textAlign: 'end', color: 'red' };
          },
          cellClass: params => {
            if (params.data.creditPercentage > 0) {
              return 'credit';
            }
          },
          valueFormatter: currencyFormatter
        },
        {
          field: 'balance',
          headerName: 'Balance',
          width: 100,
          filter: true,
          cellClass: 'rightAlign',
          sortable: true,
          cellStyle: params => {
            if (params.data.accountName === 'Total' && params.data.balance !== 0) {
              return { backgroundColor: 'red' };
            }
            if (params.data.accountName !== 'Total' && params.data.balance > 0) {
              return { textAlign: 'end', color: 'green' };
            } else if (params.data.accountName !== 'Total' && params.data.balance < 0) {
              return { textAlign: 'end', color: 'red' };
            }
          },
          valueFormatter: absCurrencyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
        this.getReport(null, null, 'ALL');
      }
    });
    this.dataService.gridColumnApi$.subscribe(obj => (obj = this.gridOptions));
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({
      gridId: GridId.trailBalanceReportId,
      gridName: GridName.trailBalance
    });
  }

  getFunds() {
    this.financeService.getFunds().subscribe(result => {
      this.funds = result.payload.map(item => ({
        fundId: item.FundId,
        fundCode: item.FundCode
      }));
    });
  }

  getReport(toDate, fromDate, fund) {
    this.isLoading = true;
    this.financeService.getTrialBalanceReport(toDate, fromDate, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.data.map(data => ({
        accountName: data.AccountName,
        credit: FormatNumber(data.Credit),
        creditPercentage: data.CreditPercentage,
        debit: FormatNumber(data.Debit),
        debitPercentage: data.DebitPercentage,
        balance: FormatNumber(data.Balance)
      }));
      this.isLoading = false;
      this.pinnedBottomRowData = [
        {
          accountName: 'Total',
          debit: FormatNumber(this.trialBalanceReportStats.totalDebit),
          credit: FormatNumber(this.trialBalanceReportStats.totalCredit),
          balance:
            this.trialBalanceReportStats.totalDebit - this.trialBalanceReportStats.totalCredit
        }
      ];
      this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.api.setRowData(this.trialBalanceReport);
    });
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.setDateRange(dateFilter);

    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate) {
      this.dataService.setExternalFilter({
        fundFilter: this.fund,
        dateFilter:
          this.DateRangeLabel !== ''
            ? this.DateRangeLabel
            : {
                startDate: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
                endDate: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
              }
      });
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    return DoesExternalFilterPass(node, this.fund, this.startDate, this.endDate);
  }

  getContextMenuItems(params) {
    //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(true, null, true, null, params);
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selected = null;
    this.DateRangeLabel = '';
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.getReport(null, null, 'ALL');
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
  }

  onBtExport() {
    const params = {
      fileName: 'Trial Balance Reports',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.getReport(null, null, 'ALL');
  }
}

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function absCurrencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(Math.abs(params.value));
}
