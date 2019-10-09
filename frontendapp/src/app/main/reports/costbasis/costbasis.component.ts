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
  DoesExternalFilterPass,
  FormatNumber4,
  SetDateRange,
  CommaSeparatedFormat,
  HeightStyle,
  FormatDate
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
  cbData: any;
  labels: string[] = [];
  displayChart = false;

  selectedChartOption: any = 'CostBasis';
  chartOptions: any = [
    { key: 'CostBasis', value: 'Cost Basis' },
    { key: 'Balance', value: 'Balance' },
    { key: 'Quantity', value: 'Quantity' }
  ];

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  propID = 'LineChart';
  divHeight = '100%';
  divWidth = '100%';
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
    this.gridOptions.sideBar = SideBar(GridId.costBasisId, GridName.costBasis, this.gridOptions);
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
      this.trialBalanceReport = response.data;
      this.gridOptions.api.setRowData(this.trialBalanceReport);
      this.gridOptions.api.sizeColumnsToFit();
      this.isLoading = false;
    });
  }

  rowSelected(row) {
    const { symbol } = row.data;
    this.financeService.getCostBasisChart(symbol).subscribe(response => {
      this.chartData = response.data;

      this.mapChartData(this.chartData);
      this.displayChart = true;
    });
  }

  mapChartData(data: any) {
    this.labels = data.map(item => item.Date);
    this.cbData = data.map(item => ({
      date: FormatDate(item.Date, 'YYYY-MM-DD'),
      value: item[this.selectedChartOption]
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
    if (this.chartData) {
      this.mapChartData(this.chartData);
    }
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.getReport(null, 'ALL');
  }

  onBtExport() {
    const params = {
      fileName: 'Trial Balance Reports',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
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
