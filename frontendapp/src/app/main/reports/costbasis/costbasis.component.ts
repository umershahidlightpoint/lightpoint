import { Component, OnInit, AfterViewInit } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { DataService } from '../../../../services/common/data.service';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  FormatNumber4,
  FormatNumber2,
  MoneyFormat,
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
import { ContextMenu } from 'src/shared/Models/common';
import * as moment from 'moment';
import { GraphObject } from 'src/shared/Models/graph-object';
import { ReportsApiService } from 'src/services/reports-api.service';

@Component({
  selector: 'rep-costbasis',
  templateUrl: './costbasis.component.html',
  styleUrls: ['./costbasis.component.scss']
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

  // private filterSubject: Subject<string> = new Subject();
  filterBySymbol = '';

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

  journalDate: Date;

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
  divHeight = 200;
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
  graphObject: GraphObject = null;
  marketPriceChart = false;

  constructor(
    private financeService: FinanceServiceProxy,
    private reportsApiService: ReportsApiService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.getFunds();
    // In case we need to enable filter by symbol from server side
    // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
    //   this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    // });
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      date => {
        if (date.isSuccessful && date.statusCode === 200) {
          this.journalDate = date.payload[0].when;
          this.startDate = this.journalDate;
          this.selectedDate = {
            startDate: moment(this.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.endDate, 'YYYY-MM-DD')
          };
        }
      },
      error => {}
    );
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
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
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'Balance',
          headerName: 'Exposure (at Cost)',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: moneyFormatter
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
          sortable: true,
          filter: true,
          cellClass: 'rightAlign',
          valueFormatter: costBasisFormatter
        },
        {
          field: 'Side',
          width: 50,
          headerName: 'Side',
          sortable: true,
          filter: true
        },
        {
          field: 'unrealized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Unrealized P&L',
          valueFormatter: moneyFormatter
        },
        {
          field: 'realized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Realized P&L',
          valueFormatter: moneyFormatter
        },
        {
          field: 'Pnl',
          cellClass: 'rightAlign',
          headerName: 'Net P&L',
          valueFormatter: moneyFormatter
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
      rowData: [],
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
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
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'Balance',
          headerName: 'Exposure (at Cost)',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: moneyFormatter
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
          sortable: true,
          filter: true,
          headerName: 'Side'
        },
        {
          field: 'unrealized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Unrealized P&L',
          sortable: true,
          valueFormatter: moneyFormatter
        },
        {
          field: 'realized_pnl',
          cellClass: 'rightAlign',
          headerName: 'Realized P&L',
          sortable: true,
          valueFormatter: moneyFormatter
        },
        {
          field: 'Pnl',
          cellClass: 'rightAlign',
          headerName: 'Net P&L',
          sortable: true,
          valueFormatter: moneyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.timeseriesOptions.sideBar = SideBar(
      GridId.timeseriesId,
      GridName.timeseries,
      this.timeseriesOptions
    );
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
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
  getReport(date, symbol, fund) {
    this.isLoading = true;
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getCostBasisReport(moment(date).format('YYYY-MM-DD'), symbol, fund)
      .subscribe(response => {
        this.trialBalanceReportStats = response.stats;
        this.trialBalanceReport = response.payload;
        if (this.trialBalanceReport.length === 0) {
          this.timeseriesOptions.api.setRowData([]);
          this.displayChart = false;
        }
        this.gridOptions.api.setRowData(this.trialBalanceReport);
        this.gridOptions.api.sizeColumnsToFit();
        this.isLoading = false;
      });
  }

  rowSelected(row) {
    const { symbol } = row.data;
    this.getMarketPriceData(symbol);
    this.getDataForCostBasisChart(symbol);
  }

  getDataForCostBasisChart(symbol: any) {
    this.reportsApiService.getCostBasisChart(symbol).subscribe(response => {
      this.chartData = response.payload;
      this.chartData = this.chartData.sort((x, y) => {
        return new Date(y.Date).getTime() - new Date(x.Date).getTime();
      });
      this.mapCostBasisData(response.payload, this.selectedChartOption);
      this.mapChartsData(response.payload);
      this.timeseriesOptions.api.setRowData(this.chartData);
      this.timeseriesOptions.api.sizeColumnsToFit();
      this.displayChart = true;
    });
  }

  getMarketPriceData(symbol) {
    this.financeService.getMarketPriceForSymbol(symbol).subscribe(response => {
      this.mapMarketPriceChartData(response.payload, symbol);
    });
  }

  mapMarketPriceChartData(chartData, symbol) {
    const data = {};
    const toDate =
      chartData != null ? moment(chartData[0].BusinessDate).format('YYYY-MM-DD') : null;
    data[symbol] = [];

    for (let item in chartData) {
      data[symbol].push({
        date: moment(chartData[item].BusinessDate).format('YYYY-MM-DD'),
        value: chartData[item].Price
      });
    }

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: 'Symbol',
      lineColors: ['#ff6960', '#00bd9a'],
      height: 220,
      width: '95%',
      chartTitle: symbol,
      propId: 'marketPriceCostBasis',
      graphData: data,
      dateTimeFormat: 'YYYY-MM-DD',
      referenceDate: toDate
    };

    this.marketPriceChart = true;
  }

  mapCostBasisData(data: any, chartType: string) {
    this.labels = data.map(item => item.Date);
    this.cbData = {
      chartType: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item[chartType]
      }))
    };
  }

  mapChartsData(data: any) {
    this.labels = data.map(item => item.Date);

    this.bData = {
      Balance: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item.Balance
      }))
    };

    this.qData = {
      Quantity: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item.Quantity
      }))
    };

    this.unrealizedData = {
      unrealized_pnl: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item.unrealized_pnl
      }))
    };

    this.realizedData = {
      realized_pnl: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item.realized_pnl
      }))
    };

    this.netpnlData = {
      Pnl: data.map(item => ({
        date: FormatDate(item.Date, 'YYYY-MM-DD'),
        value: item.Pnl
      }))
    };
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);
    this.getReport(this.startDate, this.filterBySymbol, this.fund);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }
    return true;
  }

  getContextMenuItems(params): Array<ContextMenu> {
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

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
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
    this.getReport(
      this.startDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(
      this.startDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
  }

  changeChart(selectedChart) {
    this.selectedChartOption = selectedChart;
    this.selectedChartTitle = this.chartOptions.find(({ key }) => selectedChart === key).value;
    if (this.chartData) {
      this.mapCostBasisData(this.chartData, this.selectedChartOption);
    }
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selectedDate = null;
    this.DateRangeLabel = '';
    this.endDate = undefined;
    this.filterBySymbol = '';
    this.gridOptions.api.setRowData([]);
    this.timeseriesOptions.api.setRowData([]);
    this.displayChart = false;
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.timeseriesOptions.api.setRowData([]);
    this.displayChart = false;
    if (this.selectedDate.startDate == null) {
      this.selectedDate = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.endDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
    } else {
      const startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
      this.getReport(startDate, this.filterBySymbol, 'ALL');
    }
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

function dateFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return DateFormatter(params.value);
}

function currencyFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function costBasisFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}

function decimnalFormatter2(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber2(params.value);
}

function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

function absCurrencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(Math.abs(params.value));
}
