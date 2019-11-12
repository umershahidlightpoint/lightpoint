import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { DataService } from '../../../../shared/common/data.service';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  FormatNumber4,
  SetDateRange,
  CommaSeparatedFormat,
  HeightStyle,
  FormatDate,
  DateFormatter
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
  gridOptions: GridOptions;
  timeseriesOptions: GridOptions;
  gridColumnApi;
  pinnedBottomRowData;
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel: string;
  selectedDate: any;
  startDate: any;
  endDate: any;
  trialBalanceReport: Array<TrialBalanceReport>;
  trialBalanceReportStats: TrialBalanceReportStats;
  isLoading = false;
  hideGrid: boolean;
  chartData: any;
  netpnlData: any;
  unrealizedData: any;
  realizedData: any;
  cbData: any;
  bData: any;
  qData: any;

  labels: string[] = [];
  displayChart = false;

  selectedChartOption: any = 'CostBasis';
  selectedChartTitle: any = 'Cost Basis';
  chartOptions: any = [
    { key: 'CostBasis', value: 'Cost Basis' },
    { key: 'Balance', value: 'Balance' },
    { key: 'Quantity', value: 'Quantity' }
  ];

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  propIDCostBasis = 'CostBasisLineChart';
  propIDBalance = 'BalanceLineChart';
  propIDQuantity = 'QuantityLineChart';
  divHeight = 180;
  divWidth = '95%';
  lineColors = ['#ff6960', '#00bd9a'];

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
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      // Custom made methods for Grid Menu Layout
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      rowSelection: 'single',
      onCellClicked: this.rowSelected.bind(this),
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
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol'
        },
        {
          field: 'Balance',
          headerName: 'Exposure (at Cost)',
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
          valueFormatter: currencyFormatter
        },
        {
          field: 'CostBasis',
          headerName: 'Cost Basis',
          width: 100,
          filter: true,
          cellClass: 'rightAlign',
          sortable: true,
          valueFormatter: costBasisFormatter
        },
        {
          field: 'Side',
          width: 50,
          headerName: 'Side'
        },
        {
          field: 'unrealized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Unrealized P&L',
          valueFormatter: currencyFormatter
        },
        {
          field: 'realized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Realized P&L',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Pnl',
          cellClass: 'rightAlign',
          headerName: 'Net P&L',
          valueFormatter: currencyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(GridId.costBasisId, GridName.costBasis, this.gridOptions);

    this.timeseriesOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      // Custom made methods for Grid Menu Layout
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
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
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'Date',
          width: 120,
          headerName: 'Date',
          valueFormatter: dateFormatter
        },
        {
          field: 'Balance',
          headerName: 'Exposure (at Cost)',
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
          valueFormatter: currencyFormatter
        },
        {
          field: 'CostBasis',
          headerName: 'Cost Basis',
          width: 100,
          filter: true,
          cellClass: 'rightAlign',
          sortable: true,
          valueFormatter: costBasisFormatter
        },
        {
          field: 'Side',
          width: 50,
          headerName: 'Side'
        },
        {
          field: 'unrealized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Unrealized P&L',
          valueFormatter: currencyFormatter
        },
        {
          field: 'realized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Realized P&L',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Pnl',
          cellClass: 'rightAlign',
          headerName: 'Net P&L',
          valueFormatter: currencyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.timeseriesOptions.sideBar = SideBar(GridId.timeseriesId, GridName.timeseries, this.timeseriesOptions);
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
        this.getReport(null, 'ALL');
      }
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
  getReport(date, fund) {
    this.isLoading = true;
    this.financeService.getCostBasisReport(date, fund).subscribe(response => {
      this.trialBalanceReportStats = response.stats;
      this.trialBalanceReport = response.payload;
      this.gridOptions.api.setRowData(this.trialBalanceReport);
      this.gridOptions.api.sizeColumnsToFit();
      this.isLoading = false;
    });
  }

  rowSelected(row) {
    const { symbol } = row.data;
    this.financeService.getCostBasisChart(symbol).subscribe(response => {
      debugger
      this.chartData = response.payload;
      this.chartData = this.chartData.sort((x,y) => {return new Date(y.Date).getTime() - new Date(x.Date).getTime()});

      this.mapCostBasisData(response.payload, this.selectedChartOption);
      this.mapChartsData(response.payload);
      this.timeseriesOptions.api.setRowData(this.chartData);
      this.timeseriesOptions.api.sizeColumnsToFit();
      this.displayChart = true;
    });
  }

  mapCostBasisData(data: any, chartType: string) {
    this.labels = data.map(item => item.Date);
    this.cbData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item[chartType]
    }));
  }

  mapChartsData(data: any) {
    this.labels = data.map(item => item.Date);

    this.bData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item.Balance
    }));
    this.qData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item.Quantity
    }));

    this.unrealizedData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item.unrealized_pnl
    }));
    this.realizedData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item.realized_pnl
    }));
    this.netpnlData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item.Pnl
    }));
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
    this.getReport(this.startDate, this.fund);
  }

  isExternalFilterPresent() {}

  doesExternalFilterPass(node: any) {}

  getContextMenuItems(params) {
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(true, null, true, null, params);
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selectedDate =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selectedDate = null;
    this.DateRangeLabel = '';
    this.startDate = '';
    this.endDate = '';
    this.getReport(null, 'ALL');
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      dateFilter: {
        startDate: this.startDate !== undefined ? this.startDate : '',
        endDate: this.endDate !== undefined ? this.endDate : ''
      }
    };
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
  }

  changeChart(selectedChart) {
    this.selectedChartOption = selectedChart;
    this.selectedChartTitle = this.chartOptions.find(({ key }) => selectedChart === key).value;
    if (this.chartData) {
      this.mapCostBasisData(this.chartData, this.selectedChartOption);
    }
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.clearFilters();
    this.getReport(null, 'ALL');
  }

  onBtExport() {
    const params = {
      fileName: 'Cost Basis Reports',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }
}

function dateFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return DateFormatter(params.value);
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
