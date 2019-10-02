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
  FormatNumber4,
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
  selector: 'rep-costbasis',
  templateUrl: './costbasis.component.html',
  styleUrls: ['./costbasis.component.css']
})
export class CostBasisComponent implements OnInit, AfterViewInit {
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
    //this.getReport(null, null, 'ALL');
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

        //AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        /*
        {
          field: 'name',
          width: 120,
          headerName: 'Account Name',
          enableRowGroup: true
        },
        */
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol'
        },
        {
          field: 'Balance',
          headerName: 'Balance',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Quantity',
          headerName: 'Quantity',
          width: 100,
          filter: true,
          cellClass: 'rightAlign',
          sortable: true,
          valueFormatter: absCurrencyFormatter
        },
        {
          field: 'CostBasis',
          headerName: 'Cost Basis',
          width: 100,
          filter: true,
          cellClass: 'rightAlign',
          sortable: true,
          valueFormatter: costBasisFormatter
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

  // Being called twice
  getReport(toDate, fromDate, fund) {
    this.isLoading = true;
    this.financeService.getCostBasisReport(toDate, fromDate, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.data;

      this.isLoading = false;

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

function costBasisFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}

function absCurrencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(Math.abs(params.value));
}
