import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentInit
} from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';
import * as moment from 'moment';
import { DataService } from 'src/shared/common/data.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialGridExampleComponent implements OnInit, AfterContentInit {
  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private columns: any;

  totalRecords: number;
  rowGroupPanelShow: any;
  sideBar: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  DateRangeLable: any;
  pinnedBottomRowData;
  gridOptions: GridOptions;
  filterChange: any;
  rowSelection = 'single';
  // topOptions = {alignedGrids: [], suppressHorizontalScroll: true};
  // bottomOptions = { alignedGrids: [] };
  columnDefs: any;
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

  @ViewChild('journalGrid') journalGrid;
  // @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasureJournal') divToMeasureElement: ElementRef;
  @ViewChild('divToMeasureLedger') divToMeasureElementLedger: ElementRef;

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
    // Setup of the SideBar
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
      /*      onFilterChanged: function() {

              this.gridOptions.api.forEachNodeAfterFilter( function(rowNode, index) {
                console.log('node ' + rowNode.data.debit + ' passes the filter');
            } )},

      */
      // columnDefs: this.columnDefs,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),

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
        // params.api.sizeColumnsToFit();
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

  ngOnInit() {}

  ngAfterContentInit() {
    this.dataService.flag.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getTrialBalance();
      }
    });
  }

  public onBtForEachNodeAfterFilter() {
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

  // selected: {startDate: moment().startOf('month'), endDate: moment()};
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
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(true);
              // console.log(typeof node.childrenAfterFilter);
              for (const key in node.childrenAfterFilter) {
                if (!node.childrenAfterFilter[key].expanded) {
                  console.log(node.childrenAfterFilter[key].expanded);
                  node.childrenAfterFilter[key].setExpanded(true);
                }
              }
            }
          });
        }
      },
      {
        name: 'Collapse All',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(false);
              // console.log(typeof node.childrenAfterFilter);
              for (const key in node.childrenAfterFilter) {
                if (node.childrenAfterFilter[key].expanded) {
                  console.log(node.childrenAfterFilter[key].expanded);
                  node.childrenAfterFilter[key].setExpanded(false);
                }
              }
            }
          });
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

    this.rowGroupPanelShow = 'after';
    // this.pivotPanelShow = "always";
    // this.pivotColumnGroupTotals = "after";
    // this.pivotRowTotals = "before";

    // align scroll of grid and footer grid
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

        for (const item in result.data) {
          const someObject = {};
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

  public getRangeLabel() {
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

  public isExternalFilterPresent() {
    return true;
  }

  public ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.journalGrid.api.onFilterChanged();
    this.getRangeLabel();
  }

  public ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  public doesExternalFilterPass(node: any) {
    let result = true;
    if (this.startDate) {
      const cellDate = new Date(node.data.when);
      const td = this.startDate.toDate();
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

  public clearFilters() {
    this.gridOptions.api.redrawRows();
    this.DateRangeLable = '';
    this.selected = null;
    this.startDate.value = '';
    this.endDate = null;
    this.fund = null;
    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
    this.startDate = null;
    this.dateRangPicker.value = '';
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

function asDate(dateAsString) {
  const splitFields = dateAsString.split('-');
  return new Date(splitFields[1], splitFields[0], splitFields[2]);
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
