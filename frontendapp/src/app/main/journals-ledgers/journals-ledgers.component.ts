/* Core/Library Imports */
import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
/* Services/Components Imports */
import { SideBar } from 'src/shared/utils/SideBar';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { DataService } from '../../../shared/common/data.service';
import { AgGridUtils } from '../../../shared/utils/ag-grid-utils';
import { JournalModalComponent } from './journal-modal/journal-modal.component';
import { DataModalComponent } from '../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from '../../../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from '../../../shared/utils/AppEnums';

@Component({
  selector: 'app-journals-ledgers',
  templateUrl: './journals-ledgers.component.html',
  styleUrls: ['./journals-ledgers.component.css']
})
export class JournalsLedgersComponent implements OnInit, AfterViewInit {
  @ViewChild('journalGrid') journalGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasureJournal') divToMeasureElement: ElementRef;
  @ViewChild('divToMeasureLedger') divToMeasureElementLedger: ElementRef;
  @ViewChild('modal') modal: ModalDirective;
  @ViewChild('journalModal') jounalModal: JournalModalComponent;
  @ViewChild('dataModal') dataModal: DataModalComponent;

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  public rowData: [];
  private columns: any;

  isEngineRunning = false;
  hideGrid = false;
  columnDefs: any;
  gridOptions: GridOptions;
  gridLayouts: any;
  frameworkComponents: any;
  pinnedBottomRowData;
  bottomData: any;
  totalRecords: number;
  totalDebit: number;
  totalCredit: number;
  fund: any = 'All Funds';
  filterBySymbol = '';
  symbol = '';
  DateRangeLabel: string;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  funds: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  page: any;
  pageSize: any;
  orderId: number;

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private postingEngineService: PostingEngineService,
    private agGridUtls: AgGridUtils
  ) {
    this.hideGrid = false;
    this.initGird();
  }

  ngOnInit() {
    this.isEngineRunning = this.postingEngineService.getStatus();
  }

  initGird() {
    this.gridOptions = {
      rowData: null,
      onCellDoubleClicked: this.openDataModal.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      sideBar: SideBar,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      /* Excel Styling */
      /* onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.excelStyles = [
          {
            id: "twoDecimalPlaces",
            numberFormat: { format: "#,##0" }
          },
          {
            id: "footerRow",
            font: {
              bold: true,
            }
          },
          {
            id: "greenBackground",
            interior: {
             color: "#b5e6b5",
             pattern: "Solid"
            }
          },
          {
            id: "redFont",
            font: {
             fontName: "Calibri Light",
             italic: true,
             color: "#ff0000"
            }
          },
          {
            id: "header",
            interior: {
              color: "#CCCCCC",
              pattern: "Solid"
            },
            borders: {
              borderBottom: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderLeft: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderRight: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderTop: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              }
            }
          },

        ];
      }, */

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

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  customizeColumns(columns: any) {
    const colDefs = [
      {
        field: 'source',
        minWidth: 300,
        headerName: 'Source'
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
        enablePivot: true,
        filter: true,
        width: 120
      },
      {
        field: 'AccountCategory',
        headerName: 'Category',
        enableRowGroup: true,
        width: 100,
        enablePivot: true,
        filter: true
      },

      {
        field: 'AccountType',
        headerName: 'Type',
        enableRowGroup: true,
        width: 200,
        enablePivot: true,
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
        enablePivot: true,
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
    const cdefs = this.agGridUtls.customizeColumns(colDefs, this.columns, this.ignoreFields);
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  ngAfterViewInit() {
    this.dataService.flag.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAllData();
      }
    });
    this.dataService.gridColumnApi.subscribe(obj => (obj = this.gridOptions));
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.journalId, gridName: GridName.journal });
  }

  getAllData() {
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
          debit: Math.abs(tDebit),
          credit: tCredit,
          balance: Math.abs(tDebit) - Math.abs(tCredit)
        }
      ];
      this.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    /*  Align scroll of grid and footer grid */
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
            debit: Math.abs(this.totalDebit),
            credit: Math.abs(this.totalCredit),
            balance: Math.abs(this.totalDebit) - Math.abs(this.totalCredit)
          }
        ];
        this.bottomData = [
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
      });
  }

  public getRangeLabel() {
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
      fileName: 'Journals',
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

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.journalGrid.api.onFilterChanged();
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.journalGrid.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);

    this.journalGrid.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      this.dataService.setExternalFilter({
        fundFilter: this.fund,
        symbolFilter: this.filterBySymbol,
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
    if (this.fund !== 'All Funds' && this.filterBySymbol !== '' && this.startDate) {
      const cellFund = node.data.fund;
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
      const cellDate = new Date(node.data.when);

      return (
        cellFund === this.fund &&
        cellSymbol.includes(this.filterBySymbol) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.fund !== 'All Funds' && this.filterBySymbol !== '') {
      const cellFund = node.data.fund;
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;

      return cellFund === this.fund && cellSymbol.includes(this.filterBySymbol);
    }

    if (this.fund !== 'All Funds' && this.startDate) {
      const cellFund = node.data.fund;
      const cellDate = new Date(node.data.when);

      return (
        cellFund === this.fund &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.filterBySymbol !== '' && this.startDate) {
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
      const cellDate = new Date(node.data.when);

      return (
        cellSymbol.includes(this.filterBySymbol) &&
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

    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;

      return cellSymbol.includes(this.filterBySymbol);
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

  getContextMenuItems(params) {
    const defaultItems = [
      'copy',
      'paste',
      'copyWithHeaders',
      'export',
      {
        name: 'Edit',
        action: () => {
          this.openEditModal(params.node.data);
        }
      }
    ];
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
          const nodeLevelArr = [];
          let nodeFound;
          let levelExists;
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              nodeFound = true;
            }
            if (nodeFound) {
              levelExists = this.isNodeLevelExists(nodeLevelArr, node.level);
              if (!levelExists || levelExists === undefined) {
                node.expanded = true;
                nodeLevelArr.push(node.level);
              }
              if (levelExists && node.level !== 0) {
                node.expanded = true;
              } else {
                if (levelExists && node.level === 0) {
                  nodeFound = false;
                }
              }
            }
          });
          params.api.onGroupExpandedOrCollapsed();
        }
      },
      {
        name: 'Collapse All',
        action: () => {
          const nodeLevelArr = [];
          let nodeFound;
          let levelExists;
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              nodeFound = true;
            }
            if (nodeFound) {
              levelExists = this.isNodeLevelExists(nodeLevelArr, node.level);
              if (!levelExists || levelExists === undefined) {
                node.expanded = false;
                nodeLevelArr.push(node.level);
              }
              if (levelExists && node.level !== 0) {
                node.expanded = false;
              } else {
                if (levelExists && node.level === 0) {
                  nodeFound = false;
                }
              }
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

  isNodeLevelExists(nodeLevelArray, nodeLevel) {
    if (nodeLevelArray.includes(nodeLevel)) {
      return true;
    }
    return false;
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.filterBySymbol = '';
    this.DateRangeLabel = '';
    this.selected = null;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
  }

  greet(row: any) {
    alert('For show popup');
  }

  openJournalModal() {
    this.jounalModal.openModal({});
  }

  closeJournalModal() {
    this.getAllData();
  }

  closeOrderModal() {
    // this.getAllData();
  }

  openDataModal(row) {
    // We can drive the screen that we wish to display from here
    if (row.colDef.headerName === 'Group') {
      return;
    }
    console.log('==');
    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  openEditModal(data) {
    this.jounalModal.openModal(data);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getAllData();
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

function formatNumber(numberToFormat) {
  return numberToFormat === 0
    ? '0.00'
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
