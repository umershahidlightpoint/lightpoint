import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FinanceServiceProxy } from '../../../services/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../shared/Models/account';
import { DataService } from 'src/services/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { SideBar, AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import * as moment from 'moment';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { MonthlyPerformanceData } from 'src/shared/Models/funds-theoretical';
import { DataGridModalComponent } from '../../../shared/Component/data-grid-modal/data-grid-modal.component';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { AgGridCheckboxComponent } from '../../../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component';
import { DatePickerModalComponent } from 'src/shared/Component/date-picker-modal/date-picker-modal.component';
import { ContextMenu, CustomColDef } from 'src/shared/Models/common';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';

@Component({
  selector: 'app-fund-theoretical',
  templateUrl: './fund-theoretical.component.html',
  styleUrls: ['./fund-theoretical.component.scss']
})
export class FundTheoreticalComponent implements OnInit, AfterViewInit {
  @ViewChild('dataGridModal', { static: false })
  dataGridModal: DataGridModalComponent;
  @ViewChild('confirmationModal', { static: false })
  confirmationModal: ConfirmationModalComponent;
  @ViewChild('datePickerModal', { static: false })
  datePickerModal: DatePickerModalComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

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
  disableCommit = true;
  totalGridRows: number;
  generateFundsDate;
  funds: Array<string>;
  portfolios: Array<string>;
  title: string;
  fileToUpload: File = null;
  graphObject: any;
  isExpanded = false;
  disableFileUpload = true;
  disableCharts = true;

  isDailyPnLActive = false;
  isTaxRateActive = false;
  isMarketPricesActive = false;
  isFxRateActive = false;

  uploadLoader = false;
  commitLoader = false;

  confirmOption = {
    generateRows: false,
    uploadRows: false
  };

  monthsArray = [
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
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    private dataService: DataService,
    public dataDictionary: DataDictionary,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.portfolios = [];
    this.hideGrid = false;
    this.currentYear = moment().get('year');
    const currentMonthObj = this.monthsArray.find(obj => obj.id === moment().get('month'));
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
    this.getPortfolios();
    this.getMonthlyPerformance();
    this.initGrid();
  }

  activeFundTheretical() {
    this.getMonthlyPerformance();
  }

  activeDailyPnL() {
    this.isDailyPnLActive = true;
  }

  activeTaxRate() {
    this.isTaxRateActive = true;
  }

  activeMarketPrices() {
    this.isMarketPricesActive = true;
  }

  activeFxRate() {
    this.isFxRateActive = true;
  }

  getFunds() {
    this.financeService.getFunds().subscribe(response => {
      this.funds = response.payload.map(item => item.FundCode);
      this.funds.push('None');
      this.initCols();
    });
  }

  getPortfolios() {
    this.financeService.getPortfolios().subscribe(response => {
      if (response && response.payload) {
        this.portfolios = response.payload.map(item => item.PortfolioCode);
      }
      this.portfolios.push('None');
      this.initCols();
    });
  }

  getMonthlyPerformance() {
    let rowNodeId = 1;
    this.fundTheoreticalApiService.getMonthlyPerformance().subscribe(response => {
      const modifiedData = response.payload.map(data => {
        return { ...data, RowId: rowNodeId++ };
      });
      this.totalGridRows = rowNodeId;
      this.monthlyPerformanceData = this.formatPerformanceData(modifiedData);
      if (this.fundTheoreticalGrid) {
        AutoSizeAllColumns(this.fundTheoreticalGrid);
      }

      const isCurrentMonthAdded: MonthlyPerformanceData = this.monthlyPerformanceData.find(
        data => data.month === this.currentMonth && data.year === this.currentYear
      );

      if (!isCurrentMonthAdded && this.monthlyPerformanceData.length > 0) {
        this.monthlyPerformanceData.push(this.createRow(this.currentYear, this.currentMonth, 0));
      }

      if (this.monthlyPerformanceData.length > 0) {
        this.disableCharts = false;
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
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      onFilterChanged: this.generateData.bind(this),
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

  getColDefs(): Array<CustomColDef> {
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
        cellRendererFramework: AgGridCheckboxComponent,
        // To call onCellValueChangedMethod from AgGridCheckboxComponent
        customMethod: params => this.onCellValueChanged(params)
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
          values: this.funds
        }
      },
      {
        headerName: 'Portfolio*',
        field: 'portfolio',
        editable: true,
        filter: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.portfolios
        }
      },
      {
        headerName: 'Start of Month Estimate NAV*',
        field: 'startOfMonthEstimateNav',
        sortable: true,
        editable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.startOfMonthEstimateNav, false)
      },
      {
        headerName: 'Performance*',
        field: 'performance',
        sortable: true,
        editable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.performance, false)
      },
      {
        headerName: 'Admin Month End NAV',
        field: 'monthEndNav',
        sortable: true,
        // editable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.monthEndNav, false)
      },
      {
        headerName: 'MTD*',
        field: 'mtd',
        sortable: true,
        editable: true,
        type: 'numericColumn',
        valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.mtd, true)
      },
      {
        headerName: 'YTD Net Perf',
        field: 'ytdNetPerformance',
        sortable: true,
        suppressCellFlash: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.ytdNetPerformance, false)
      },
      {
        headerName: 'QTD Net %',
        field: 'qtd',
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.qtd, true)
      },
      {
        headerName: 'YTD Net %',
        field: 'ytd',
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.ytd, true)
      },
      {
        headerName: 'ITD Net %',
        field: 'itd',
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.itd, true)
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
      (params.colDef.field === 'monthEndNav' ||
        params.colDef.field === 'performance' ||
        params.colDef.field === 'mtd') &&
      params.newValue != params.oldValue
    ) {
      this.doCalculation();
      params.data.modified = true;
      this.disableCommit = false;
    }

    if (
      (params.colDef.field === 'fund' && params.data.fund !== 'None') ||
      (params.colDef.field === 'portfolio' && params.data.portfolio !== 'None') ||
      params.colDef.field === 'estimated'
    ) {
      this.doCalculation();
      this.disableCommit = false;
      params.data.modified = true;
    }

    if (
      params.colDef.field === 'performance' ||
      params.colDef.field === 'startOfMonthEstimateNav'
    ) {
      let monthEndNavSum;

      if (params.colDef.field === 'performance') {
        monthEndNavSum = +params.newValue + +params.data.startOfMonthEstimateNav;
      } else {
        monthEndNavSum = +params.newValue + +params.data.performance;
      }
      const row = this.fundTheoreticalGrid.api.getRowNode(params.data.rowId);
      params.data.modified = true;
      setTimeout(() => {
        row.setDataValue('monthEndNav', monthEndNavSum.toString());
      }, 500);
    }
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems: Array<ContextMenu> = [
      {
        name: 'Add Current Month',
        action: () => {
          this.addCurrentMonth(params);
        }
      },
      {
        name: 'Add Next Month',
        action: () => {
          this.addNextMonth(params);
        }
      },
      {
        name: 'Add Row',
        action: () => {
          this.datePickerModal.showModal(params);
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

  addCurrentMonth(params) {
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

  addNextMonth(params) {
    const forMonth = moment()
      .year(params.node.data.year)
      .month(params.node.data.month);
    const nextMonth = forMonth.add(1, 'month').format('MMMM');
    const newYear = forMonth.format('YYYY');
    const index = params.node.rowIndex;
    const newRow = this.createRow(newYear, nextMonth, this.totalGridRows + 1);
    params.api.updateRowData({
      add: [newRow],
      addIndex: index + 1
    });
    this.totalGridRows += 1;
  }

  addCustom($event) {
    const params = $event.params;
    const date = $event.selectedDate;
    const year = date.format('YYYY');
    const month = date.format('MMMM');
    const index = params.node.rowIndex;
    const newRow = this.createRow(year, month, this.totalGridRows + 1);
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
    this.fundTheoreticalApiService.monthlyPerformanceAudit(id).subscribe(response => {
      const { payload } = response;
      const modifiedData = this.formatPerformanceData(payload);
      const columns = this.getColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Audit Trail';
      this.dataGridModal.openModal(modifiedCols, modifiedData);
    });
  }

  DateFormatter(date, option, isStringFormat): string {
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
        formattedValue = this.monthsArray.find(obj => obj.id === monthId);
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
    if (this.monthlyPerformanceData.length > 0) {
      this.confirmOption.generateRows = true;
      this.confirmationModal.showModal();
    } else {
      this.generateMonthlyPerformanceRows();
    }
  }

  private generateMonthlyPerformanceRows() {
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
    this.totalGridRows = count;
    this.disableCharts = false;
    this.selectedDate = null;
    this.confirmOption.generateRows = false;
    this.fundTheoreticalGrid.api.setRowData([]);
    this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }

  uploadRows() {
    if (this.monthlyPerformanceData.length > 0) {
      this.confirmOption.uploadRows = true;
      this.confirmationModal.showModal();
    } else {
      this.uploadMonthlyPerformance();
    }
  }

  uploadMonthlyPerformance() {
    let rowNodeId = 1;
    this.uploadLoader = true;
    this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      if (response.isSuccessful) {
        const modifiedData = response.payload.map(data => {
          return { ...data, RowId: rowNodeId++, Estimated: true };
        });
        this.totalGridRows = rowNodeId;
        this.monthlyPerformanceData = this.formatPerformanceData(modifiedData);
        this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
        AutoSizeAllColumns(this.fundTheoreticalGrid);

        this.disableFileUpload = true;
        this.fileInput.nativeElement.value = '';
        this.confirmOption.uploadRows = false;
        this.disableCommit = false;
        this.disableCharts = false;
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  confirmReset() {
    const { generateRows, uploadRows } = this.confirmOption;
    if (generateRows) {
      this.generateMonthlyPerformanceRows();
    } else if (uploadRows) {
      this.uploadMonthlyPerformance();
    }
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

    this.fundTheoreticalApiService.calMonthlyPerformance(formattedRecords).subscribe(response => {
      const rows = this.formatPerformanceData(response.payload);
      this.fundTheoreticalGrid.api.setRowData(rows);
      this.generateData();
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

      this.commitLoader = true;
      this.fundTheoreticalApiService
        .commitMonthlyPerformance(formattedRecords)
        .subscribe(response => {
          this.commitLoader = false;
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

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
    this.generateData();
  }

  generateData() {
    const dataObject = [
      // { label: 'YTDNetPerformance', data: [] },
      { label: 'QTD', data: [] },
      { label: 'YTD', data: [] },
      { label: 'ITD', data: [] }
    ];

    let chartData = {};
    dataObject.forEach(model => {
      this.fundTheoreticalGrid.api.forEachNodeAfterFilter((rowNode, index) => {
        model.data.push({
          date: this.getMomentMonth(rowNode.data.month) + '-' + '01' + '-' + rowNode.data.year,
          value:
            rowNode.data[
              model.label === 'YTDNetPerformance' ? 'ytdNetPerformance' : model.label.toLowerCase()
            ] * 100
        });
      });
      chartData = {
        ...chartData,
        [model.label]: model.data
      };
    });

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: 'Value',
      lineColors: ['#34A9FF', '#FFA000', ' #00BD9A'],
      height: '100%',
      width: '100%',
      chartTitle: 'Monthly Performance',
      propId: 'linePerformance',
      graphData: chartData,
      dateTimeFormat: 'MM-DD-YYYY'
    };
  }

  formatPerformanceData(records): Array<MonthlyPerformanceData> {
    const formattedRecords: Array<MonthlyPerformanceData> = records.map(record => ({
      id: record.Id,
      rowId: record.RowId,
      modified: record.Modified,
      estimated: record.Estimated,
      year: this.DateFormatter(record.PerformanceDate, 1, true),
      month: this.DateFormatter(record.PerformanceDate, 2, true),
      fund: record.Fund === null ? 'None' : record.Fund,
      portfolio: record.PortFolio === null ? 'None' : record.PortFolio,
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

  createRow(generatedYear, generatedMonth, rowNodeId): MonthlyPerformanceData {
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

  getMomentMonth(month): string | number {
    const momentMonth = this.monthsArray.find(obj => obj.month === month);
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
