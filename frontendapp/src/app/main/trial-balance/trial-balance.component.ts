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
import * as moment from 'moment';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';

/* Services/Components Imports */
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { DataService } from 'src/shared/common/data.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialGridExampleComponent implements OnInit, AfterContentInit {
  @ViewChild('journalGrid') journalGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasureJournal') divToMeasureElement: ElementRef;

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private columns: any;
  totalRecords: number;
  sideBar: any;
  DateRangeLable: any;
  pinnedBottomRowData;
  gridOptions: GridOptions;
  // topOptions = {alignedGrids: [], suppressHorizontalScroll: true};
  // bottomOptions = { alignedGrids: [] };
  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund: any = 'All Funds';
  endDate: any;
  symbol: string;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;
  hideGrid = false;
  selected: { startDate: moment.Moment; endDate: moment.Moment };

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 210px)',
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

  ranges: any = {
    ITD: [moment('01-01-1901', 'MM-DD-YYYY'), moment()],
    YTD: [moment().startOf('year'), moment()],
    MTD: [moment().startOf('month'), moment()],
    Today: [moment(), moment()]
  };

  ignoreFields = [
    'id',
    'totalDebit',
    'totalCredit',
    'overall_count',
    'account_id',
    'value',
    'LpOrderId'
  ];

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
  }

  initGrid() {
    /* Setup of the SideBar */
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel'
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel'
        }
      ],
      defaultToolPanel: ''
    };

    this.gridOptions = {
      rowData: null,
      sideBar: this.sideBar,
      rowGroupPanelShow: 'after',
      rowSelection: 'single',
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.excelStyles = [
          {
            id: 'twoDecimalPlaces',
            numberFormat: { format: '#,##0' }
          },
          {
            id: 'footerRow',
            font: {
              bold: true
            }
          },
          {
            id: 'greenBackground',
            interior: {
              color: '#b5e6b5',
              pattern: 'Solid'
            }
          },
          {
            id: 'redFont',
            font: {
              fontName: 'Calibri Light',

              italic: true,
              color: '#ff0000'
            }
          },
          {
            id: 'header',
            interior: {
              color: '#CCCCCC',
              pattern: 'Solid'
            },
            borders: {
              borderBottom: {
                color: '#5687f5',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderLeft: {
                color: '#5687f5',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderRight: {
                color: '#5687f5',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderTop: {
                color: '#5687f5',
                lineStyle: 'Continuous',
                weight: 1
              }
            }
          }
        ];
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

  onBtForEachNodeAfterFilter() {
    this.gridOptions.api.forEachNodeAfterFilter((rowNode, index) => {});
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */

  customizeColumns(columns: any) {
    const colDefs = [
      {
        field: 'source',
        minWidth: 300,
        headerName: 'Source',
        colId: 'greet'
        /*
        cellRendererFramework: TemplateRendererComponent, cellRendererParams: {
          ngTemplate: this.greetCell
        },
        cellClassRules: {
          footerRow: function (params) { if (params.node.rowPinned) return true; else return false; }
        },
        */
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
        rowGroup: true,
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
        field: 'credit',
        aggFunc: 'sum',
        headerName: '$Credit',
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
    const defaultItems = ['copy', 'paste', 'export'];
    const items = [
      {
        name: 'Expand',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(true);
            }
          });
        }
      },
      {
        name: 'Collapse',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(false);
            }
          });
        }
      },
      {
        name: 'Expand All',
        action: () => {
          let totalChildNodes = 0;
          let checkCount = 0;
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              totalChildNodes = node.allChildrenCount;
              node.expanded = true;
            }
            if (totalChildNodes > 0 && checkCount <= totalChildNodes) {
              checkCount++;
              node.expanded = true;
            }
          });
          params.api.onGroupExpandedOrCollapsed();
        }
      },
      {
        name: 'Collapse All',
        action() {
          let totalChildNodes = 0;
          let checkCount = 0;
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              totalChildNodes = node.allChildrenCount;
              node.expanded = false;
            }
            if (totalChildNodes > 0 && checkCount <= totalChildNodes) {
              checkCount++;
              node.expanded = false;
            }
          });
          params.api.onGroupExpandedOrCollapsed();
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
    this.gridOptions.onFilterChanged = function() {
      let tTotal = 0;
      let tCredit = 0;
      let tDebit = 0;
      this.api.forEachNodeAfterFilter((rowNode, index) => {
        tTotal += 1;
        tCredit += rowNode.data.credit;
        tDebit += rowNode.data.debit;
      });

      this.pinnedBottomRowData = [
        {
          source: 'Total Records: ' + tTotal,
          AccountType: '',
          accountName: '',
          when: '',
          debit: tDebit,
          credit: tCredit
        }
      ];
      // this.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };

    /* align scroll of grid and footer grid */
    // this.gridOptions.alignedGrids.push(this.bottomOptions);
    // this.bottomOptions.alignedGrids.push(this.gridOptions);

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
            debit: this.totalCredit,
            credit: this.totalDebit
          }
        ];
        // this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        this.bottomData = [
          {
            source: 'Total Records:' + this.totalRecords,
            AccountType: '',
            accountName: '',
            when: '',
            debit: this.totalCredit,
            credit: this.totalDebit
          }
        ];
      });
  }

  getRangeLabel() {
    this.DateRangeLable = '';
    if (
      moment('01-01-1901', 'MM-DD-YYYY').diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'ITD';
      return;
    }
    if (
      moment()
        .startOf('year')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'YTD';
      return;
    }
    if (
      moment()
        .startOf('month')
        .diff(this.startDate, 'days') === 0 &&
      moment().diff(this.endDate, 'days') === 0
    ) {
      this.DateRangeLable = 'MTD';
      return;
    }
    if (moment().diff(this.startDate, 'days') === 0 && moment().diff(this.endDate, 'days') === 0) {
      this.DateRangeLable = 'Today';
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

  isExternalFilterPresent() {
    return true;
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.journalGrid.api.onFilterChanged();
    this.getRangeLabel();
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  doesExternalFilterPass(node: any) {
    let result = true;
    if (this.startDate) {
      const cellDate = new Date(node.data.when);
      if (this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate) {
        result = true;
      } else {
        result = false;
      }
    }
    if (result === true) {
      if (this.fund && this.fund !== 'All Funds') {
        const cellFund = node.data.Fund;
        result = this.fund === cellFund;
      }
    }
    return result;
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.DateRangeLable = '';
    this.dateRangPicker.value = '';
    this.selected = null;
    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
    this.startDate = '';
    this.endDate = '';
  }

  greet(row: any) {
    // alert(`${ row.country } says "${ row.greeting }!`);
    alert('For show popup');
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
    ? ''
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
