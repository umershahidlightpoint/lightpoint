import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { MonthlyPerformanceData } from 'src/shared/Models';
import { DataGridModalComponent } from '../../../shared/Component/data-grid-modal/data-grid-modal.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-fund-theoretical',
  templateUrl: './fund-theoretical.component.html',
  styleUrls: ['./fund-theoretical.component.css']
})
export class FundTheoreticalComponent implements OnInit, AfterViewInit {
  @ViewChild('dataGridModal') dataGridModal: DataGridModalComponent;

  rowData: Array<Account>;
  fundTheoreticalGrid: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;
  monthlyPerformanceData: Array<MonthlyPerformanceData>;
  currentMonth: string;
  currentYear: number;
  selectedDate = null;
  showDatePicker = false;
  disableCommit = true;
  totalGridRows: number;
  generateFundsDate;
  funds: Array<string>;
  title: string;
  fileToUpload: File = null;

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
    public decimalPipe: DecimalPipe,
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
    let rowNodeId = 1;
    this.financeService.getMonthlyPerformance().subscribe(response => {
      const modifiedData = response.data.map(data => {
        return { ...data, RowId: rowNodeId++ };
      });
      this.totalGridRows = rowNodeId;
      this.monthlyPerformanceData = this.formatPerformanceData(modifiedData);
      if (this.fundTheoreticalGrid) {
        AutoSizeAllColumns(this.fundTheoreticalGrid);
      }

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
      onRowSelected: params => {
        console.log('Params', params);
      },
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
      getRowNodeId: data => {
        return data.rowId;
      },
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {
        this.onCellValueChanged(params);
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

  initCols() {
    const colDefs = this.getColDefs();
    this.fundTheoreticalGrid.api.setColumnDefs(colDefs);
    AutoSizeAllColumns(this.fundTheoreticalGrid);
    this.fundTheoreticalGrid.api.sizeColumnsToFit();
  }

  getColDefs() {
    return [
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      },
      {
        headerName: 'Estimated',
        field: 'estimated',
        cellEditor: 'agSelectCellEditor',
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
          values: ['None', ...this.funds]
        }
      },
      {
        headerName: 'Portfolio*',
        field: 'portfolio',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', 'PORTFOLIO A', 'ASIA_FOCUS']
        }
      },
      {
        headerName: 'Start of Month Estimate NAV*',
        field: 'startOfMonthEstimateNav',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn',
        valueFormatter: params =>
          this.numberFormatter(params.node.data.startOfMonthEstimateNav, false)
      },
      {
        headerName: 'Performance*',
        field: 'performance',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.performance, false)
      },
      {
        headerName: 'Admin Month End NAV*',
        field: 'monthEndNav',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.monthEndNav, false)
      },
      {
        headerName: 'MTD*',
        field: 'mtd',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.mtd, true)
      },
      {
        headerName: 'YTD Net Perf',
        field: 'ytdNetPerformance',
        sortable: true,
        suppressCellFlash: true,
        cellStyle: textAlignRight(),
        valueFormatter: params => this.numberFormatter(params.node.data.ytdNetPerformance, false)
      },
      {
        headerName: 'QTD Net %',
        field: 'qtd',
        sortable: true,
        cellStyle: textAlignRight(),
        valueFormatter: params => this.numberFormatter(params.node.data.qtd, true)
      },
      {
        headerName: 'YTD Net %',
        field: 'ytd',
        sortable: true,
        cellStyle: textAlignRight(),
        valueFormatter: params => this.numberFormatter(params.node.data.ytd, true)
      },
      {
        headerName: 'ITD Net %',
        field: 'itd',
        sortable: true,
        cellStyle: textAlignRight(),
        valueFormatter: params => this.numberFormatter(params.node.data.itd, true)
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        hide: true
      },
      {
        headerName: 'Last Updated By ',
        field: 'lastUpdatedBy ',
        hide: true
      },
      {
        headerName: 'Created Date',
        field: 'createdDate',
        hide: true
      },
      {
        headerName: 'Last Updated Date',
        field: 'lastUpdatedDate',
        hide: true
      }
    ];
  }

  onCellValueChanged(params) {
    if (
      params.colDef.field === 'monthEndNav' ||
      params.colDef.field === 'performance' ||
      (params.colDef.field === 'mtd' && params.newValue != params.oldValue)
    ) {
      this.doCalculation();
      this.disableCommit = false;
    }
    if (params.data.fund !== 'None' || params.data.portfolio !== 'None' || params.data.estimated) {
      this.disableCommit = false;
    }
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
      },
      {
        name: 'View Audit Trail',
        action: () => {
          this.viewRow(params);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  addRow(params) {
    const index = params.node.rowIndex;
    const newRow = this.createRow(
      params.node.data.year,
      params.node.data.month,
      this.totalGridRows + 1
    );
    params.api.updateRowData({
      add: [newRow],
      addIndex: index + 1
    });
    this.totalGridRows += 1;
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

  viewRow(rowNode) {
    const { id } = rowNode.node.data;
    this.financeService.monthlyPerformanceAudit(id).subscribe(response => {
      const { data } = response;
      const modifiedData = this.formatPerformanceData(data);
      const columns = this.getColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Audit Trail';
      this.dataGridModal.openModal(modifiedCols, modifiedData);
    });
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
      this.totalGridRows = count;
    }
    this.showDatePicker = false;
    this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
  }

  onFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadMonthlyPerformance() {
    let rowNodeId = 1;
    this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(response => {
      if (response.isSuccessful) {
        const modifiedData = response.payload.map(data => {
          return { ...data, RowId: rowNodeId++, Estimated: true };
        });
        this.totalGridRows = rowNodeId;
        this.monthlyPerformanceData = this.formatPerformanceData(modifiedData);
        this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
        AutoSizeAllColumns(this.fundTheoreticalGrid);

        this.showDatePicker = false;
        this.disableCommit = false;
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  doCalculation() {
    const rowRecords = [];
    this.fundTheoreticalGrid.api.forEachNode(node => {
      rowRecords.push(node.data);
    });

    const formattedRecords = rowRecords.map(data => ({
      ...data,
      fund: data.fund === 'None' ? null : data.fund,
      portfolio: data.portfolio === 'None' ? null : data.portfolio,
      performanceDate: data.year + '-' + this.getMomentMonth(data.month) + '-' + '01'
    }));

    this.financeService.calMonthlyPerformance(formattedRecords).subscribe(response => {
      const rows = this.formatPerformanceData(response.payload);
      this.fundTheoreticalGrid.api.setRowData(rows);
    });
  }

  commitPerformanceData() {
    const recordsToCommit = [];
    this.fundTheoreticalGrid.api.forEachNode((node, index) => {
      if (node.data.id === 0 || node.data.modified) {
        recordsToCommit.push(node.data);
      }
    });

    let formattedRecords;
    if (recordsToCommit.length > 0) {
      formattedRecords = recordsToCommit.map(data => ({
        ...data,
        fund: data.fund === 'None' ? null : data.fund,
        portfolio: data.portfolio === 'None' ? null : data.portfolio,
        performanceDate: data.year + '-' + this.getMomentMonth(data.month) + '-' + '01'
      }));

      this.financeService.commitMonthlyPerformance(formattedRecords).subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Sucessfully Commited.');
          this.getMonthlyPerformance();
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
    } else {
      this.toastrService.error('No changes to commit.');
    }
    this.disableCommit = true;
  }

  formatPerformanceData(records) {
    const formattedRecords: Array<MonthlyPerformanceData> = records.map(record => ({
      id: record.Id,
      rowId: record.RowId,
      modified: record.Modified,
      estimated: record.Estimated,
      year: this.DateFormatter(record.PerformanceDate, 1, true),
      month: this.DateFormatter(record.PerformanceDate, 2, true),
      fund: record.Fund === null ? 'None' : record.Fund,
      portfolio: record.PortFolio === null ? 'None' : record.portfolio,
      monthEndNav: record.MonthEndNav,
      startOfMonthEstimateNav: record.StartOfMonthEstimateNav,
      performance: record.Performance,
      mtd: record.MTD,
      ytdNetPerformance: record.YTDNetPerformance,
      qtd: record.QTD,
      ytd: record.YTD,
      itd: record.ITD,
      createdBy: record.CreatedBy,
      lastUpdatedBy: record.lastUpdatedBy,
      createdDate: record.createdDate,
      lastUpdatedDate: record.lastUpdatedBy
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
      fund: 'None',
      portfolio: 'None',
      monthEndNav: 0,
      startOfMonthEstimateNav: 0,
      performance: 0,
      mtd: 0,
      ytdNetPerformance: 0,
      qtd: 0,
      ytd: 0,
      itd: 0,
      createdBy: '',
      lastUpdatedBy: '',
      createdDate: '',
      lastUpdatedDate: ''
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

  numberFormatter(numberToFormat, isInPercentage) {
    const formattedValue = this.decimalPipe.transform(numberToFormat, '1.2-2');
    if (isInPercentage) {
      return percentageFormatter(formattedValue);
    }
    return formattedValue.toString();
  }
}

function textAlignRight() {
  return { textAlign: 'end' };
}

function percentageFormatter(number) {
  return (number * 100).toString();
}
