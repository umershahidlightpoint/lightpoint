import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { Fund } from '../../../../shared/Models/account';
import { DataService } from '../../../../services/common/data.service';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  SetDateRange,
  CommaSeparatedFormat,
  HeightStyle,
  FormatDate,
  LegendColors
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { ContextMenu } from 'src/shared/Models/common';
import { ReportsApiService } from 'src/services/reports-api.service';

@Component({
  selector: 'rep-bookmon-reconcile',
  templateUrl: './bookmon-reconcile.component.html',
  styleUrls: ['./bookmon-reconcile.component.css']
})
export class BookmonReconcileComponent implements OnInit, AfterViewInit {
  gridOptions: GridOptions;
  portfolioOptions: GridOptions;
  bookmonOptions: GridOptions;

  gridColumnApi;
  pinnedBottomRowData;
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel: string;
  selectedDate: any;
  startDate: Date;
  endDate: Date;
  isLoading = false;
  hideGrid: boolean;
  chartData: any;
  netpnlData: any;
  unrealizedData: any;
  realizedData: any;
  cbData: any;
  bData: any;
  qData: any;

  reconciledData: any;
  bookmonData: any;
  portfolioData: any;
  showNonZeroBtn = false;
  showNotInAccountingBtn = false;
  showNotInBookMonBtn = false;

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

  styleForHeight = HeightStyle(244);

  journalDate: any;

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
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      date => {
        if (date.isSuccessful && date.statusCode === 200) {
          this.journalDate = date.payload[0].when;
          this.startDate = this.journalDate;
          this.selectedDate = {
            startDate: moment(this.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.startDate, 'YYYY-MM-DD')
          };
          this.getReport(this.startDate, 'ALL');
        } else {
          const currentDate = new Date();
          const formattedDate =
            currentDate.getDate() +
            '-' +
            (currentDate.getMonth() + 1) +
            '-' +
            currentDate.getFullYear();
          this.getReport(formattedDate, 'ALL');
        }
      },
      error => {}
    );
  }

  initGrid() {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
    this.gridOptions = {
      rowData: [],
      pinnedBottomRowData: [],
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
      getRowStyle: params => {
        let style = {};
        if (params.data.nonZero) {
          style = LegendColors.nonZeroStyle;
        }
        if (params.data.notInBookMon) {
          style = LegendColors.notInBookMonStyle;
        }
        if (params.data.notInAccounting) {
          style = LegendColors.notInAccountingStyle;
        }

        return style;
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'Symbol',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'SecurityType',
          width: 120,
          headerName: 'Security Type',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'Diff_Quantity',
          headerName: 'Quantity Diff',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Diff_Exposure',
          headerName: 'Exposure Diff',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Diff_Price',
          headerName: 'Price Diff',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Currency',
          width: 50,
          headerName: 'Currency',
          sortable: true,
          filter: true
        },
        {
          headerName: 'Id',
          field: 'id',
          hide: true
        },
        {
          headerName: 'Non-zero',
          field: 'nonZero',
          hide: true
        },
        {
          headerName: 'Not in BookMon',
          field: 'notInBookMon',
          hide: true
        },
        {
          headerName: 'Not in Accounting',
          field: 'notInAccounting',
          hide: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(GridId.costBasisId, GridName.costBasis, this.gridOptions);

    this.bookmonOptions = {
      rowData: [],
      pinnedBottomRowData: [],
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
          field: 'SecurityCode',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'Quantity',
          headerName: 'Quantity',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Exposure',
          headerName: 'Exposure',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Price',
          headerName: 'Price',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
    {
          field: 'Currency',
          width: 50,
          headerName: 'Currency',
          sortable: true,
          filter: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;

    this.portfolioOptions = {
      rowData: [],
      pinnedBottomRowData: [],
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
          field: 'SecurityCode',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'Quantity',
          headerName: 'Quantity',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Exposure',
          headerName: 'Exposure',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Price',
          headerName: 'Price',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Currency',
          width: 50,
          headerName: 'Currency',
          sortable: true,
          filter: true
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
        this.getReport(this.startDate, 'ALL');
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
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService.getBookmonReconReport(date, fund).subscribe(response => {
      this.reconciledData = this.setIdentifierForReconDataAndCheckMissingRows(
        response.payload[0],
        response.payload[1],
        response.payload[2]
      );
      this.portfolioData = response.payload[1];
      this.bookmonData = response.payload[2];

      this.gridOptions.api.setRowData(this.reconciledData);
      this.gridOptions.api.sizeColumnsToFit();

      this.portfolioOptions.api.setRowData(this.portfolioData);
      this.portfolioOptions.api.sizeColumnsToFit();

      this.bookmonOptions.api.setRowData(this.bookmonData);
      this.bookmonOptions.api.sizeColumnsToFit();

      this.isLoading = false;
    });
  }

  setIdentifierForReconDataAndCheckMissingRows(reconData, accountingData, bookMonData) {
    let i = 0;
    const modifiedReconData = reconData.map(x => ({
      ...x,
      id: i++,
      ...(x.Diff_Quantity !== 0 || x.Diff_Exposure !== 0 ? { nonZero: true } : { nonZero: false }),
      ...(accountingData.find(y => y.SecurityCode === x.Symbol) === undefined
        ? { notInAccounting: true }
        : { notInAccounting: false }),
      ...(bookMonData.find(y => y.SecurityCode === x.Symbol) === undefined
        ? { notInBookMon: true }
        : { notInBookMon: false })
    }));

    this.showNonZeroBtn =
      (modifiedReconData.find(data => data.nonZero === true) || {}).nonZero || false;
    this.showNotInAccountingBtn =
      (modifiedReconData.find(data => data.notInAccounting === true) || {}).notInAccounting ||
      false;
    this.showNotInBookMonBtn =
      (modifiedReconData.find(data => data.notInBookMon === true) || {}).notInBookMon || false;

    return modifiedReconData;
  }

  rowSelected(row) {
    const { symbol } = row.data;
    let mySymbol = row.data.Symbol;

    this.bookmonOptions.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.data.SecurityCode === mySymbol) {
        rowNode.setSelected(true);
      } else {
        rowNode.setSelected(false);
      }
    });

    this.portfolioOptions.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.data.SecurityCode === mySymbol) {
        rowNode.setSelected(true);
      } else {
        rowNode.setSelected(false);
      }
    });

    /*
    this.financeService.getCostBasisChart(symbol).subscribe(response => {
      debugger
      this.chartData = response.payload;
      this.chartData = this.chartData.sort((x,y) => {return new Date(y.Date).getTime() - new Date(x.Date).getTime()});

      this.mapCostBasisData(response.payload, this.selectedChartOption);
      this.mapChartsData(response.payload);
      this.displayChart = true;
    });
    */
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

  getContextMenuItems(params): Array<ContextMenu> {
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

  clearFilters() {
    this.fund = 'All Funds';
    this.DateRangeLabel = '';
    this.endDate = undefined;
    this.selectedDate = null;
    this.gridOptions.api.setRowData([]);
    this.portfolioOptions.api.setRowData([]);
    this.bookmonOptions.api.setRowData([]);
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.portfolioOptions.api.showLoadingOverlay();
    this.bookmonOptions.api.showLoadingOverlay();

    if (this.selectedDate.startDate == null) {
      this.selectedDate = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.endDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, 'ALL');
    } else {
      const startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
      this.getReport(startDate, 'ALL');
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

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}
