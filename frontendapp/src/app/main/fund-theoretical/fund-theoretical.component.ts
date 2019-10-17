import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../shared/Models/account';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { SideBar, AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import * as moment from 'moment';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';

@Component({
  selector: 'app-fund-theoretical',
  templateUrl: './fund-theoretical.component.html',
  styleUrls: ['./fund-theoretical.component.css']
})
export class FundTheoreticalComponent implements OnInit, AfterViewInit {
  rowData: Array<Account>;
  fundTheoreticalGrid: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;
  monthlyPerformanceData;
  currentMonth: string;
  currentYear;
  components;
  funds;
  selectedDate = null;
  showDatePicker = false;
  generateFundsDate;

  momentMonths = [
    { id: 0, month: 'January' },
    { id: 1, month: 'February' },
    { id: 2, month: 'March' },
    { id: 3, month: 'April' },
    { id: 4, month: 'May' },
    { id: 5, month: 'June' },
    { id: 6, month: 'July' },
    { id: 7, month: 'August' },
    { id: 8, month: 'September' },
    { id: 9, month: 'October' },
    { id: 10, month: 'November' },
    { id: 11, month: 'December' }
  ];

  style = Style;

  styleForHeight = HeightStyle(224);

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
    this.currentYear = moment().get('year');
    const currentMonthObj = this.momentMonths.find(obj => obj.id === moment().get('month'));
    this.currentMonth = currentMonthObj.month;
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
      }
    });
  }

  ngOnInit() {
    this.getFunds();
    this.getMonthlyPerformance();
    this.initGrid();
  }

  getFunds() {
    this.financeService.getFunds().subscribe(response => {
      this.funds = response.payload.map(item => item.FundCode);
      this.initCols();
    });
  }

  getMonthlyPerformance() {
    // const mockData = [
    //   {
    //     id: 0,
    //     rowId: 1,
    //     Modified: false,
    //     estimated: true,
    //     year: 2018,
    //     month: 'March',
    //     fund: '',
    //     portfolio: '',
    //     monthEndNav: 0,
    //     performance: 0,
    //     mtd: 0,
    //     ytdNetPerformance: 0,
    //     qtdNetPercentage: 0,
    //     ytdNetPercentage: 0,
    //     itdNetPercentage: 0
    //   }
    // ];
    this.financeService.getMonthlyPerformance().subscribe(response => {
      this.monthlyPerformanceData = this.formatPerformanceData(response.data);
      AutoSizeAllColumns(this.fundTheoreticalGrid);

      const isCurrentMonthAdded = this.monthlyPerformanceData.find(
        data => data.month === this.currentMonth && data.year === this.currentYear
      );

      if (!isCurrentMonthAdded && this.monthlyPerformanceData.length > 0) {
        this.monthlyPerformanceData.push(this.createRow(this.currentYear, this.currentMonth, 0));
      }

      if (this.monthlyPerformanceData.length === 0) {
        this.showDatePicker = true;
      }

      this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
    });
  }

  initGrid() {
    this.fundTheoreticalGrid = {
      columnDefs: null,
      rowData: this.monthlyPerformanceData,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      clearExternalFilter: () => {},
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableCellChangeFlash: true,
      animateRows: true,
      deltaRowDataMode: true,
      // columnTypes: {
      //   valueColumn: {
      //     cellClass: 'number-cell',
      //     cellRenderer: 'agAnimateShowChangeCellRenderer'
      //   }
      // },
      getRowNodeId: data => {
        return data.rowId;
      },
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {
        if (
          params.colDef.field === 'monthEndNav' ||
          params.colDef.field === 'performance' ||
          params.colDef.field === 'mtd'
        ) {
          this.doCalculation();
        }
      },
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.fundTheoreticalGrid.sideBar = SideBar(
      GridId.fundTheoreticalId,
      GridName.fundTheoretical,
      this.fundTheoreticalGrid
    );
  }
  // this.columnTypes = {
  //   valueColumn: {
  //     editable: true,
  //     aggFunc: "sum",
  //     valueParser: "Number(newValue)",
  //     cellClass: "number-cell",
  //     cellRenderer: "agAnimateShowChangeCellRenderer",
  //     filter: "agNumberColumnFilter"
  //   },

  initCols() {
    const colDefs = [
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      },
      {
        headerName: 'Estimated',
        field: 'estimated',
        sortable: true,
        cellRenderer: params => {
          return `<input type='checkbox' ${params.node.data.estimated ? 'checked' : ''} />`;
        }
      },
      {
        headerName: 'Year',
        field: 'year',
        sortable: true,
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Month',
        field: 'month',
        sortable: true,
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Fund*',
        field: 'fund',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [...this.funds]
        }
      },
      {
        headerName: 'Portfolio*',
        field: 'portfolio',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Portfolio A', 'Asia_Focus']
        }
      },
      {
        headerName: 'Admin Month End NAV*',
        field: 'monthEndNav',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn'
      },
      {
        headerName: 'Start of Month Estimate NAV',
        field: 'startMonthEstimateNav',
        sortable: true,
        cellStyle: textAlignRight()
      },
      {
        headerName: 'Performance*',
        field: 'performance',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn'
      },
      {
        headerName: 'MTD*',
        field: 'mtd',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'valueColumn'
      },
      {
        headerName: 'YTD Net Perf',
        field: 'ytdNetPerformance',
        sortable: true,
        suppressCellFlash: true,
        cellStyle: textAlignRight()
      },
      {
        headerName: 'QTD Net %',
        field: 'qtdNetPercentage',
        sortable: true,
        cellStyle: textAlignRight()
      },
      {
        headerName: 'YTD Net %',
        field: 'ytdNetPercentage',
        sortable: true,
        cellStyle: textAlignRight()
      },
      {
        headerName: 'ITD Net %',
        field: 'itdNetPercentage',
        sortable: true,
        cellStyle: textAlignRight()
      }
    ];
    this.fundTheoreticalGrid.api.setColumnDefs(colDefs);
    AutoSizeAllColumns(this.fundTheoreticalGrid);
    this.fundTheoreticalGrid.api.sizeColumnsToFit();
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      {
        name: 'Add Row',
        action: () => {
          this.addRow(params);
        }
      },
      {
        name: 'Delete Row',
        action: () => {
          this.deleteRow(params);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  addRow(params) {
    const index = params.node.rowIndex;
    const newRow = this.createRow(params.node.data.year, params.node.data.month, 0);
    params.api.updateRowData({
      add: [newRow],
      addIndex: index + 1
    });
  }

  deleteRow(params) {
    const rowData = params.node.data;
    if (rowData.id === 0) {
      params.api.updateRowData({
        remove: [rowData]
      });
    } else {
      this.toastrService.error('Cannot delete this record!');
    }
  }

  DateFormatter(date, option, isStringFormat) {
    let dateObject;
    if (isStringFormat) {
      dateObject = moment(date);
    } else {
      dateObject = date;
    }
    let formattedValue;
    switch (option) {
      case 1:
        formattedValue = moment(dateObject).get('year');
        break;
      case 2:
        const monthId = moment(dateObject).get('month');
        formattedValue = this.momentMonths.find(obj => obj.id === monthId);
        formattedValue = formattedValue.month;
        break;
    }
    return formattedValue;
  }

  changeDate(date) {
    const { startDate } = date;
    this.generateFundsDate = startDate;
  }

  generateRows() {
    const today = moment();
    const totalMonths = today.diff(this.generateFundsDate, 'months');
    let count = 0;
    const generateFundsDate = this.generateFundsDate;
    this.monthlyPerformanceData = [];
    while (count <= totalMonths) {
      this.monthlyPerformanceData.push(
        this.createRow(
          this.DateFormatter(generateFundsDate, 1, false),
          this.DateFormatter(generateFundsDate, 2, false),
          count
        )
      );
      generateFundsDate.add(1, 'month');
      count++;
    }
    // this.showDatePicker = false;
    this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
  }

  doCalculation() {
    const rowRecords = [];
    this.fundTheoreticalGrid.api.forEachNode(node => {
      rowRecords.push(node.data);
    });
    const formatteRecords = rowRecords.map(data => ({
      ...data,
      performanceDate: data.year + '-' + this.getMomentMonth(data.month) + '-' + '01'
    }));
    console.log('formatted record for calculation', formatteRecords);
    this.financeService.calMonthlyPerformance(formatteRecords).subscribe(response => {
      console.log('response', response);
      const updatedPerformanceData = response;

      const rows = this.formatPerformanceData(response);
      const updateRow = { update: [rows] };
      // var params = {
      //   force: isForceRefreshSelected(),
      //   rowNodes: rows
      // };
      // callRefreshAfterMillis(rows, 5000, this.fundTheoreticalGrid.api);
      console.log('rows', rows);
      this.fundTheoreticalGrid.api.setRowData(rows);
    });
  }

  commitPerformanceData() {
    const recordsToCommit = [];
    this.fundTheoreticalGrid.api.forEachNode((node, index) => {
      if (node.data.id === 0 || node.data.Modified) {
        recordsToCommit.push(node.data);
      }
    });
    const formatteRecords = recordsToCommit.map(data => ({
      ...data,
      performanceDate: data.year + '-' + this.getMomentMonth(data.month) + '-' + '01'
    }));
    console.log('Rows to Push', formatteRecords);
    this.financeService.commitMonthlyPerformance(formatteRecords).subscribe(response => {
      console.log('response after commmit', response);
    });
  }

  formatPerformanceData(records) {
    console.log('records for format performace', records);
    const formattedRecords = records.map(record => ({
      id: record.Id,
      rowId: record.RowId,
      modified: record.Modified,
      estimated: record.Estimated,
      year: this.DateFormatter(record.PerformanceDate, 1, true),
      month: this.DateFormatter(record.PerformanceDate, 2, true),
      fund: record.Fund,
      portfolio: record.PortFolio,
      monthEndNav: record.MonthEndNav,
      performance: record.Performance,
      mtd: record.MTD,
      ytdNetPerformance: record.YTDNetPerformance,
      qtdNetPercentage: record.QTD,
      ytdNetPercentage: record.YTD,
      itdNetPercentage: record.ITD
    }));
    return formattedRecords;
  }

  createRow(generatedYear, generatedMonth, rowNodeId) {
    return {
      id: 0,
      rowId: rowNodeId,
      modified: false,
      estimated: true,
      year: generatedYear,
      month: generatedMonth,
      fund: '',
      portfolio: '',
      monthEndNav: 0,
      startMonthEstimateNav: 0,
      performance: 0,
      mtd: 0,
      ytdNetPerformance: 0,
      qtdNetPercentage: 0,
      ytdNetPercentage: 0,
      itdNetPercentage: 0
    };
  }

  getMomentMonth(month) {
    const momentMonth = this.momentMonths.find(obj => obj.month === month);
    const monthInNum = momentMonth.id + 1;
    if (monthInNum < 9) {
      return '0' + monthInNum;
    } else {
      return monthInNum;
    }
  }

  onBtExport() {
    const params = {
      fileName: 'Accounts',
      sheetName: 'First Sheet',
      columnKeys: ['accountName', 'description', 'category', 'hasJournal', 'type']
    };
    this.fundTheoreticalGrid.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  refreshGrid() {
    this.fundTheoreticalGrid.api.showLoadingOverlay();
  }
}

function textAlignRight() {
  return { textAlign: 'end' };
}
