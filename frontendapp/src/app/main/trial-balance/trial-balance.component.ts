/* Core/Libraries Imports */
import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentInit
} from '@angular/core';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
/* Services/Components Imports */
import {
  SideBar,
  Ranges,
  Style,
  IgnoreFields,
  ExcelStyle,
  CalTotalRecords
} from 'src/shared/utils/Shared';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { DataService } from 'src/shared/common/data.service';
import { DataModalComponent } from '../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from '../../../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ReportModalComponent } from 'src/shared/Component/report-modal/report-modal.component';
import { Expand, Collapse, ExpandAll, CollapseAll } from 'src/shared/utils/ContextMenu';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialGridExampleComponent implements OnInit, AfterContentInit {
  @ViewChild('journalGrid') journalGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('divToMeasureJournal') divToMeasureElement: ElementRef;
  @ViewChild('dataModal') dataModal: DataModalComponent;
  @ViewChild('reportModal') reportModal: ReportModalComponent;

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private columns: any;

  hideGrid = false;
  gridOptions: GridOptions;
  pinnedBottomRowData;
  totalRecords: number;
  totalDebit: number;
  totalCredit: number;
  fund: any = 'All Funds';
  funds: any;
  DateRangeLabel: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  symbol: string;
  startDate: any;
  endDate: any;
  bottomData: any;
  page: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  orderId: number;
  tableHeader: string;

  ranges = Ranges;

  ignoreFields = IgnoreFields;

  style = Style;

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private financeService: FinancePocServiceProxy
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
  }

  ngAfterContentInit() {
    this.dataService.flag.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getTrialBalance();
      }
    });
    this.dataService.gridColumnApi.subscribe(obj => (obj = this.gridOptions));
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.trailBalanceId, gridName: GridName.trailBalance });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      sideBar: SideBar,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onCellDoubleClicked: this.openModal.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // this.gridOptions.api.sizeColumnsToFit();
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
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

  openModal(row) {
    if (row.colDef.headerName === 'Group') {
      return;
    }
    // We can drive the screen that we wish to display from here
    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  customizeColumns(columns: any) {
    const colDefs = [
      {
        field: 'id',
        minWidth: 50,
        headerName: 'Id',
        colId: 'id'
      },
      {
        field: 'source',
        minWidth: 300,
        headerName: 'Source',
        colId: 'source'
      },
      {
        field: 'fund',
        headerName: 'Fund',
        enableRowGroup: true,
        filter: true,
        width: 120
      },
      {
        field: 'AccountCategory',
        headerName: 'Category',
        enableRowGroup: true,
        rowGroup: true,
        width: 100,
        filter: true
      },

      {
        field: 'AccountType',
        headerName: 'Type',
        enableRowGroup: true,
        rowGroup: false,
        width: 200,
        filter: true
      },
      {
        field: 'accountName',
        headerName: 'Account Name',
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: 'when',
        headerName: 'when',
        sortable: true,
        enableRowGroup: true,
        width: 100,
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator(filterLocalDateAtMidnight, cellValue) {
            const dateAsString = cellValue;
            const dateParts = dateAsString.split('/');
            const cellDate = new Date(
              Number(dateParts[2]),
              Number(dateParts[1]) - 1,
              Number(dateParts[0])
            );

            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
              return 0;
            }

            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }

            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        }
      },
      {
        field: 'debit',
        aggFunc: 'sum',
        headerName: '$Debit',
        valueFormatter: currencyFormatter,
        width: 100,
        cellStyle: { 'text-align': 'right' },
        cellClass: 'twoDecimalPlaces',
        cellClassRules: {
          // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value < -300; },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
      },
      {
        field: 'credit',
        aggFunc: 'sum',
        headerName: '$Credit',
        valueFormatter: currencyFormatter,
        width: 100,
        cellStyle: { 'text-align': 'right' },
        cellClass: 'twoDecimalPlaces',
        cellClassRules: {
          // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
          redFont(params) {
            if (params.node.rowPinned) {
              return false;
            } else {
              return params.value != 0;
            }
          },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
      },
      {
        field: 'balance',
        aggFunc: 'sum',
        headerName: '$Balance',
        valueFormatter: currencyFormatter,
        width: 100,
        cellStyle: { 'text-align': 'right' },
        cellClass: 'twoDecimalPlaces',
        cellClassRules: {
          // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
          greenFont(params) {
            if (params.node.rowPinned) {
              return false;
            } else {
              return params.value > 0;
            }
          },
          redFont(params) {
            if (params.node.rowPinned) {
              return false;
            } else {
              return params.value < 0;
            }
          },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
      },
      {
        field: 'TradeCurrency',
        width: 100,
        headerName: 'Trade Ccy',
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: 'SettleCurrency',
        headerName: 'Settle Ccy',
        sortable: true,
        enableRowGroup: true,
        filter: true,
        width: 100
      },
      {
        field: 'Symbol',
        headerName: 'Symbol',
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: 'Side',
        headerName: 'Side',
        sortable: true,
        enableRowGroup: true,
        filter: true,
        width: 100
      }
    ];

    const cdefs = Object.assign([], colDefs);

    // tslint:disable-next-line: forin
    for (const i in this.columns) {
      const column = this.columns[i];
      // Check to see if it's an ignored field
      if (this.ignoreFields.filter(i => i == column.field).length == 0) {
        // Check to see if we have not already defined it
        if (cdefs.filter(i => i.field == column.field).length == 0) {
          const clone = { ...colDefs[0] };
          clone.field = column.field;
          clone.headerName = column.headerName;
          clone.filter = column.filter;
          clone.colId = undefined;
          if (
            column.Type == 'System.Int32' ||
            column.Type == 'System.Decimal' ||
            column.Type == 'System.Double'
          ) {
            clone.cellStyle = { 'text-align': 'right' };
            clone.cellClass = 'twoDecimalPlaces';
            clone.valueFormatter = currencyFormatter;
            clone.cellClassRules = {
              // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
              greenFont(params) {
                if (params.node.rowPinned) {
                  return false;
                } else {
                  return params.value > 0;
                }
              },
              redFont(params) {
                if (params.node.rowPinned) {
                  return false;
                } else {
                  return params.value < 0;
                }
              },
              footerRow(params) {
                if (params.node.rowPinned) {
                  return true;
                } else {
                  return false;
                }
              }
            };
          } else if (column.Type == 'System.DateTime') {
            clone.enableRowGroup = true;
            clone.cellStyle = { 'text-align': 'right' };
            clone.cellClass = 'twoDecimalPlaces';
            clone.minWidth = 50;
          } else {
            clone.enableRowGroup = true;
          }

          cdefs.push(clone);
        }
      }
    }
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  getContextMenuItems(params) {
    const defaultItems = ['copy', 'paste', 'copyWithHeaders', 'export'];
    const items = [
      {
        name: 'View Chart',
        action: () => {
          const data = [];
          let stats: object;
          let totalDebit = 0;
          let totalCredit = 0;
          params.api.forEachNode((node, index) => {
            if (node.group && node.level === 0) {
              this.tableHeader =
                node.columnApi.columnController.rowGroupColumns[0].colDef.headerName;
              data.push({
                accountName: node.key,
                debit: node.aggData.debit,
                credit: node.aggData.credit,
                debitPercentage: 0,
                creditPercentage: 0,
                balance: node.aggData.balance
              });
              totalDebit += node.aggData.debit;
              totalCredit += node.aggData.debit;
            }
          });
          stats = {
            totalDebit,
            totalCredit
          };
          data.forEach(row => {
            row.debitPercentage = (row.debit * 100) / totalDebit;
            row.creditPercentage = (row.credit * 100) / totalCredit;
          });
          this.openChartModal({ data, stats });
        }
      },
      {
        name: 'Expand',
        action() {
          Expand(params);
        }
      },
      {
        name: 'Collapse',
        action() {
          Collapse(params);
        }
      },
      {
        name: 'Expand All',
        action: () => {
          ExpandAll(params);
        }
      },
      {
        name: 'Collapse All',
        action: () => {
          CollapseAll(params);
        }
      },
      ...defaultItems
    ];
    if (params.node.group) {
      return items;
    }
    return defaultItems;
  }

  getTrialBalance() {
    this.symbol = 'ALL';
    const localThis = this;
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';
    this.financeService.getFunds().subscribe(result => {
      const localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      localThis.funds = localfunds;
      localThis.cdRef.detectChanges();
    });
    this.financeService
      .getJournals(
        this.symbol,
        this.page,
        this.pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(result => {
        this.columns = result.meta.Columns;
        this.totalRecords = result.meta.Total;
        this.totalCredit = result.stats.totalCredit;
        this.totalDebit = result.stats.totalDebit;
        this.rowData = [];
        const someArray = [];
        // tslint:disable-next-line: forin
        for (const item in result.data) {
          const someObject = {};
          // tslint:disable-next-line: forin
          for (const i in this.columns) {
            const field = this.columns[i].field;
            if (this.columns[i].Type == 'System.DateTime') {
              someObject[field] = moment(result.data[item][field]).format('MM-DD-YYYY');
            } else {
              someObject[field] = result.data[item][field];
            }
          }
          someArray.push(someObject);
        }
        this.customizeColumns(this.columns);
        this.rowData = someArray as [];
        this.gridOptions.api.setRowData(this.rowData);
        this.pinnedBottomRowData = [
          {
            source: 'Total Records:' + this.totalRecords,
            AccountType: '',
            accountName: '',
            when: '',
            debit: Math.abs(this.totalDebit),
            credit: Math.abs(this.totalCredit),
            balance: Math.abs(this.totalDebit) - Math.abs(this.totalCredit)
          }
        ];
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        console.log('===>', this.pinnedBottomRowData);
      });
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    if (
      moment('01-01-1901', 'MM-DD-YYYY').diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLabel = 'ITD';
      return;
    }
    if (
      moment()
        .startOf('year')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLabel = 'YTD';
      return;
    }
    if (
      moment()
        .startOf('month')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLabel = 'MTD';
      return;
    }
    if (moment().diff(this.startDate, 'days') === 0 && moment().diff(this.endDate, 'days') === 0) {
      this.DateRangeLabel = 'Today';
      return;
    }
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onBtExport() {
    const params = {
      fileName: 'Trial Balance',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getRangeLabel();
    this.journalGrid.api.onFilterChanged();
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.setDateRange(dateFilter);

    this.journalGrid.api.onFilterChanged();
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
    if (this.fund !== 'All Funds' && this.startDate) {
      const cellFund = node.data.fund;
      const cellDate = new Date(node.data.when);

      return (
        cellFund === this.fund &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.fund !== 'All Funds') {
      const cellFund = node.data.fund;

      return cellFund === this.fund;
    }

    if (this.startDate) {
      const cellDate = new Date(node.data.when);

      return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
    }
  }

  setDateRange(dateFilter: any) {
    if (typeof dateFilter === 'object') {
      this.startDate = moment(dateFilter.startDate);
      this.endDate = moment(dateFilter.endDate);
    }

    switch (dateFilter) {
      case 'ITD':
        this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment();
        break;
      case 'YTD':
        this.startDate = moment().startOf('year');
        this.endDate = moment();
        break;
      case 'MTD':
        this.startDate = moment().startOf('month');
        this.endDate = moment();
        break;
      case 'Today':
        this.startDate = moment();
        this.endDate = moment();
        break;
      default:
        break;
    }

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.DateRangeLabel = '';
    this.dateRangPicker.value = '';
    this.selected = null;
    this.startDate = '';
    this.endDate = '';
    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
  }

  openChartModal(data) {
    this.reportModal.openModal(data);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getTrialBalance();
  }

  setGroupingState(value: boolean) {
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }
}

function currencyFormatter(params) {
  return formatNumber(params.value);
}

function formatNumber(numberToFormat: number) {
  return numberToFormat === 0
    ? '0.00'
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
