/* Core/Library Imports */
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { timer, Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';
import 'ag-grid-enterprise';
import {
  GridOptions,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  ColDef,
  ColGroupDef
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
/* Services/Components Imports */
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { PostingEngineService } from 'src/services/common/posting-engine.service';
import { DataService } from '../../../../services/common/data.service';
import { JournalModalComponent } from '../journals-client-side/journal-modal/journal-modal.component';
import { ReportModalComponent } from 'src/shared/Component/report-modal/report-modal.component';
import { DataModalComponent } from '../../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent, CustomGridOptions } from 'lp-toolkit';
import { GetContextMenu, ViewChart } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { AgGridUtils } from '../../../../shared/utils/AgGridUtils';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';
import { GridId, GridName } from '../../../../shared/utils/AppEnums';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import {
  SideBar,
  Ranges,
  Style,
  IgnoreFields,
  ExcelStyle,
  ApplyRowStyles,
  GetDateRangeLabel,
  SetDateRange,
  HeightStyle,
  AutoSizeAllColumns,
  CommonCols,
  getRange
} from 'src/shared/utils/Shared';
import { JournalApiService } from 'src/services/journal-api.service';
import { CacheService } from 'src/services/common/cache.service';

@Component({
  selector: 'app-journals-server-side',
  templateUrl: './journals-server-side.component.html',
  styleUrls: ['./journals-server-side.component.scss']
})
export class JournalsServerSideComponent implements OnInit, AfterViewInit {
  @Input() defaultView = '';
  @ViewChild('journalModal', { static: false }) journalModal: JournalModalComponent;
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;
  @ViewChild('reportModal', { static: false }) reportModal: ReportModalComponent;

  private filterSubject: Subject<string> = new Subject();
  rowData: any[] = [];
  isEngineRunning = false;
  hideGrid = false;
  gridOptions: CustomGridOptions;
  gridLayouts: any;
  colDefs: Array<ColDef | ColGroupDef>;
  pinnedBottomRowData: any;
  totalRecords = 0;
  fieldsSum: Array<{ name: string; total: number }>;
  fund = 'All Funds';
  funds: any;
  fundsRange: any;
  filterBySymbol = '';
  symbol = '';
  DateRangeLabel: string;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: moment.Moment;
  endDate: moment.Moment;
  accountSearch = { id: undefined };
  valueFilter = 0;
  sortColum = '';
  sortDirection = '';
  page: number;
  pageNumber = 0;
  pageSize = 100;
  tableHeader: string;
  dataRequestCount = 0;
  isDataStreaming = false;
  infiniteCount = null;
  filterByZeroBalance = 0;
  havingColumns = ['balance'];
  absoluteSorting: string[] = [];
  absoluteSortingAsc = false;
  absoluteSortingDesc = false;
  isJournalModalActive = false;

  ranges: any;

  ignoreFields = IgnoreFields;

  style = Style;

  styleForHeight = HeightStyle(220);

  excelParams = {
    fileName: 'Journals',
    sheetName: 'First Sheet'
  };

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: true
  };

  datasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      this.pageNumber = params.request.endRow / this.pageSize;
      const havingColumns = this.havingColumns;
      const { fund, symbol, when, balance } = this.getServerSideExternalFilter();
      const payload = {
        ...params.request,
        havingColumns,
        absoluteSorting: this.absoluteSorting,
        externalFilterModel: { fund, symbol, when, balance },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };

      // console.log('PARAMS :: ', JSON.stringify(params.request, null, 1));
      // console.log('PAYLOAD :: ', JSON.stringify(payload, null, 1));
      // console.log('GET ROWS CALLED ::');

      this.journalApiService.getServerSideJournals(payload).subscribe(
        result => {
          if (result.isSuccessful) {
            this.dataRequestCount++;
            result.payload.forEach(item => {
              item.when = moment(item.when).format('MM-DD-YYYY');
            });

            if (this.gridOptions.columnApi.getAllColumns() !== null) {
              this.rowData = result.payload;
              this.rowData = this.checkIfASingleFilterIsAppliedOnAccountCategory(
                params,
                this.rowData
              );
              this.rowData = this.getGroupedAccountCategoryData(params, this.rowData);

              params.successCallback(this.rowData, result.meta.LastRow);
            }

            if (result.meta.LastRow === 0) {
              this.gridOptions.api.showNoRowsOverlay();
            }

            if (result.meta.FooterSum) {
              if (result.meta.LastRow < 0) {
                this.infiniteCount = 'Showing ' + payload.endRow + ' of more';
              } else {
                this.infiniteCount =
                  'Showing ' + result.meta.LastRow + ' of ' + result.meta.LastRow;
              }
              if (this.pinnedBottomRowData != null) {
                this.pinnedBottomRowData[0].source = this.infiniteCount;
                this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
              }
            }

            // if (result.meta.FooterSum && this.pageNumber === 1) {
            //   console.log('FIELDS SUM :: ', this.fieldsSum);
            //   this.resetFieldsSum();
            //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
            // } else if (result.meta.FooterSum) {
            //   console.log('FIELDS SUM :: ', this.fieldsSum);
            //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
            // }

            // this.pinnedBottomRowData = [
            //   {
            //     source: 'Total Records: ' + this.totalRecords,
            //     AccountType: '',
            //     accountName: '',
            //     when: '',
            //     security_id: 0,
            //     debit: Math.abs(this.fieldsSum[0].total),
            //     credit: Math.abs(this.fieldsSum[1].total),
            //     balance: Math.abs(this.fieldsSum[0].total) - Math.abs(this.fieldsSum[1].total),
            //     Commission: Math.abs(this.fieldsSum[2].total),
            //     Fees: Math.abs(this.fieldsSum[3].total),
            //     TradePrice: this.fieldsSum[4].total,
            //     NetPrice: Math.abs(this.fieldsSum[5].total),
            //     SettleNetPrice: Math.abs(this.fieldsSum[6].total),
            //     NetMoney: Math.abs(this.fieldsSum[7].total),
            //     LocalNetNotional: Math.abs(this.fieldsSum[8].total),
            //     value: Math.abs(this.fieldsSum[9].total),
            //     start_price: 0,
            //     end_price: 0
            //   }
            // ];
            // this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);

            if (this.dataRequestCount <= 2) {
              AutoSizeAllColumns(this.gridOptions);
            }

            this.gridOptions.api.refreshCells();
          } else {
            params.failCallback();
          }
        },
        error => {
          params.failCallback();
        }
      );
    }
  };

  constructor(
    private financeService: FinanceServiceProxy,
    private dataService: DataService,
    private postingEngineService: PostingEngineService,
    private agGridUtls: AgGridUtils,
    private dataDictionary: DataDictionary,
    private journalApiService: JournalApiService,
    private cacheService: CacheService,
    private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {
    this.hideGrid = false;
    this.DateRangeLabel = '';
  }

  ngOnInit() {
    this.isEngineRunning = this.postingEngineService.getStatus();
    this.filterSubject.pipe(debounce(() => timer(500))).subscribe(() => {
      this.gridOptions.api.onFilterChanged();
    });

    this.resetFieldsSum();
    this.initGird();
    this.getJournalsTotal({ filterModel: {}, externalFilterModel: {} });
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
        this.initColDefs();
      }
    });
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  getGroupedAccountCategoryData(params: IServerSideGetRowsParams, rowData: any) {
    const accountCategoryIndex = params.request.rowGroupCols.findIndex(
      item => item.id === 'AccountCategory'
    );
    const groupKey = params.request.groupKeys[accountCategoryIndex];

    return rowData.map(item => {
      if (!item.hasOwnProperty('AccountCategory')) {
        return { ...item, AccountCategory: groupKey };
      }

      return item;
    });
  }

  checkIfASingleFilterIsAppliedOnAccountCategory(params: IServerSideGetRowsParams, rowData: any) {
    let filteredCategory;
    if (params.request.filterModel.hasOwnProperty('AccountCategory')) {
      const obj = params.request.filterModel['AccountCategory'];
      const filterList: Array<string>[] = obj['values'];
      if (filterList.length === 1) {
        filteredCategory = filterList[0];
      }
    }

    if (filteredCategory) {
      return rowData.map(item => {
        if (!item.hasOwnProperty('AccountCategory')) {
          return { ...item, AccountCategory: filteredCategory };
        }
        return item;
      });
    } else {
      return rowData;
    }
  }

  getFunds() {
    this.financeService.getFunds().subscribe(result => {
      const localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      this.funds = localfunds;
    });
  }

  getJournalsTotal(payload) {
    this.journalApiService.getServerSideJournalsTotal(payload).subscribe(
      response => {
        if (response.isSuccessful) {
          this.pinnedBottomRowData = [
            {
              source: this.infiniteCount,
              AccountType: '',
              accountName: '',
              when: '',
              security_id: 0,
              debit: Math.abs(response.payload[0].debit),
              credit: Math.abs(response.payload[0].credit),
              balance: Math.abs(response.payload[0].balance),
              Commission: Math.abs(this.fieldsSum[2].total),
              Fees: Math.abs(this.fieldsSum[3].total),
              TradePrice: this.fieldsSum[4].total,
              NetPrice: Math.abs(this.fieldsSum[5].total),
              SettleNetPrice: Math.abs(this.fieldsSum[6].total),
              NetMoney: Math.abs(this.fieldsSum[7].total),
              LocalNetNotional: Math.abs(this.fieldsSum[8].total),
              value: Math.abs(this.fieldsSum[9].total),
              start_price: 0,
              end_price: 0
            }
          ];
          this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
      },
      error => {}
    );
  }

  getMainMenuItems(params) {
    switch (params.column.getId()) {
      case 'balance':
        const menuItems = params.defaultItems.slice(0);
        menuItems.push({
          name: 'Sort by absolute value',
          action: () => {
            this.sortByAbsoluteValue('asc', params.column.getId());
          },
          checked: this.absoluteSortingAsc
        });
        // menuItems.push({
        //   name: "Sort by absolute value DESC",
        //   action: () => {
        //     this.sortByAbsoluteValue('desc', params.column.getId());
        //   },
        //   checked: this.absoluteSortingDesc
        // });
        return menuItems;
      default:
        return params.defaultItems;
    }
  }

  sortByAbsoluteValue(sortDirection, colId) {
    this.absoluteSortingAsc = !this.absoluteSortingAsc;
    if (this.absoluteSortingAsc) {
      this.absoluteSorting = [];
      this.absoluteSorting.push(colId);
    } else {
      this.absoluteSorting = [];
    }
    const sort = [
      {
        colId,
        sort: sortDirection
      }
    ];
    // this.gridOptions.api.setSortModel(sort);
  }

  initColDefs() {
    const payload = {
      GridName: GridName.journalsLedgers
    };
    this.cacheService.getServerSideJournalsMeta(payload).subscribe(result => {
      this.fundsRange = result.payload.FundsRange;
      this.ranges = getRange(this.getCustomFundRange());
      this.cdRef.detectChanges();

      const metaColumns = result.payload.Columns;
      const commonColDefs = CommonCols(true, result.payload.Filters);
      const disabledFilters = [
        'id',
        'source',
        // 'accountDescription',
        // 'debit',
        // 'credit',
        'balance'
        // 'Quantity',
        // 'TradeCurrency',
        // 'SettleCurrency',
        // 'Side',
        // 'fxrate',
        // 'event',
        // 'security_id',
        // 'fx_currency',
        // 'value',
        // 'start_price',
        // 'end_price'
      ];
      const colDefs = [
        ...commonColDefs,
        this.dataDictionary.column('fxrate', true),
        this.dataDictionary.column('start_price', true),
        this.dataDictionary.column('end_price', true)
      ];

      const cdefs = this.agGridUtls.customizeColumns(
        colDefs,
        metaColumns,
        this.ignoreFields,
        true,
        result.payload.Filters
      );
      const afterDisableFilters = this.agGridUtls.disableColumnFilters(cdefs, disabledFilters);

      this.gridOptions.api.setColumnDefs(afterDisableFilters);
      // console.log('COL DEFS :: ', cdefs);
      // console.log('COL DEFS :: ', afterDisableFilters);
    });
  }

  /*
  Drives the Columns that will be Defined on the UI, and What can be Done with those Fields
  */
  customizeColumns(columns: any) {
    const colDefs = [
      ...CommonCols(true),
      this.dataDictionary.column('TradePrice', true),
      this.dataDictionary.column('NetPrice', true),
      this.dataDictionary.column('SettleNetPrice', true),
      this.dataDictionary.column('start_price', true),
      this.dataDictionary.column('end_price', true),
      this.dataDictionary.column('fxrate', true)
    ];
    const cdefs = this.agGridUtls.customizeColumns(colDefs, columns, this.ignoreFields, true);
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  initGird() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      /* Custom Method Binding for External Filters for Grid Layout Component */
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilters: this.clearExternalFilters.bind(this),
      setExternalFilter: this.setExternalFilter.bind(this),
      /* Default Grid Options */
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onSortChanged: this.onSortChanged.bind(this),
      onColumnRowGroupChanged: this.onColumnRowGroupChanged.bind(this),
      onCellDoubleClicked: this.openDataModal.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowModelType: 'serverSide',
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      animateRows: true,
      enableFilter: true,
      floatingFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      alignedGrids: [],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      },
      getMainMenuItems: this.getMainMenuItems.bind(this),
      onGridReady: params => {
        params.api.setServerSideDatasource(this.datasource);
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        // params.api.forEachNode(node => {
        //   node.expanded = true;
        // });
        // params.api.onGroupExpandedOrCollapsed();
      },
      getRowStyle: params => ApplyRowStyles(params),
      getChildCount: data => {
        // Data Contains a Group that is returned from the API
        return data ? data.groupCount : 0;
      }
    };
    this.gridOptions.sideBar = SideBar(
      GridId.journalsLedgersId,
      GridName.journalsLedgers,
      this.gridOptions,
      this.defaultView,
      this.datasource
    );
  }

  onFilterChanged(event) {
    try {
      this.resetBottomRowData();
      const havingColumns = this.havingColumns;
      const { filterModel, valueCols } = event.api.serverSideRowModel.cacheParams;
      const { fund, symbol, when, balance } = this.getServerSideExternalFilter();
      const payload = {
        filterModel,
        valueCols,
        havingColumns,
        externalFilterModel: {
          ...(fund && { fund }),
          ...(symbol && { symbol }),
          ...(when && { when }),
          ...(balance && { balance })
        }
      };

      // console.log('PAYLOAD OF FILTERS ::', payload);
      this.getJournalsTotal(payload);
    } catch (ex) {
      console.log('Filter Error :: ', ex);
    }
  }

  onSortChanged() {
    // console.log('SORTING CHANGED ::');
    // this.resetBottomRowData();
  }

  onColumnRowGroupChanged() {
    // console.log('GROUPING CHANGED ::');
    // this.resetBottomRowData();
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [];

    if (params.node.data.event === 'manual') {
      addDefaultItems.push({
        name: 'Edit',
        action: () => {
          this.openEditModal(params.node.data, false);
        }
      });
    }
    const addCustomItems = [
      {
        name: 'View Chart',
        action: () => {
          const record = ViewChart(params);
          this.tableHeader = record[0];
          this.openChartModal(record[1]);
        }
      }
    ];
    if (params.node.field === 'AccountType' && params.node.data.balance !== 0) {
      addCustomItems.push({
        name: 'Contra Entry',
        action: () => {
          this.openEditModal(params.node.data, true);
        }
      });
    }

    //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
  }

  ngModelChangeFund(e) {
    this.fund = e;

    this.ranges = getRange(this.getCustomFundRange(e));
    this.cdRef.detectChanges();
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
  }

  ngModelChangeZeroBalance(e) {
    this.filterByZeroBalance = e;
    this.gridOptions.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterSubject.next(e.srcElement.value);

    // For the Moment we React to Each Key Stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;

    this.getRangeLabel();
    this.gridOptions.api.onFilterChanged();
  }

  setExternalFilter(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;
    const { zeroBalanceFilter } = object;
    const { absoluteSortingModel } = object;

    this.filterByZeroBalance = zeroBalanceFilter;
    this.absoluteSorting = absoluteSortingModel.sortingOn;
    this.absoluteSortingAsc = absoluteSortingModel.sortingApplied;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;

    this.setDateRange(dateFilter);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent(): boolean {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  doesExternalFilterPass(node: any): boolean {
    if (this.fund !== 'All Funds' && this.filterBySymbol !== '' && this.startDate) {
      const cellFund = node.data.fund;
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
      const cellDate = new Date(node.data.when);
      return (
        cellFund === this.fund &&
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
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
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
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
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getCustomFundRange(fund = 'All Funds') {
    const customRange: any = {};

    this.fundsRange.forEach(element => {
      if (fund === 'All Funds' && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      } else if (fund === element.fund && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      }
    });

    return customRange;
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
      zeroBalanceFilter: this.filterByZeroBalance,
      absoluteSortingModel: {
        sortingApplied: this.absoluteSortingAsc,
        sortingOn: this.absoluteSorting
      },
      dateFilter:
        this.DateRangeLabel !== ''
          ? this.DateRangeLabel
          : {
              startDate: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
              endDate: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
            }
    };
  }

  getServerSideExternalFilter() {
    return {
      ...(this.fund !== 'All Funds' && {
        fund: { values: this.fund, filterType: 'set' }
      }),
      ...(this.filterBySymbol !== '' && {
        symbol: { values: this.filterBySymbol, filterType: 'text' }
      }),
      ...(this.filterByZeroBalance === 1 && {
        balance: { values: 0, filterType: 'number', type: 'notEqual' }
      }),
      ...(this.startDate !== null && {
        when: {
          dateFrom: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
          dateTo: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : '',
          filterType: 'date'
        }
      })
    };
  }

  clearExternalFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.filterBySymbol = '';
    this.filterByZeroBalance = 0;
    this.DateRangeLabel = '';
    this.selected = null;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.absoluteSortingAsc = false;
    this.absoluteSorting = [];
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.api.onFilterChanged();
  }

  resetFieldsSum() {
    return (this.fieldsSum = [
      { name: 'debit', total: 0 },
      { name: 'credit', total: 0 },
      { name: 'Commission', total: 0 },
      { name: 'Fees', total: 0 },
      { name: 'TradePrice', total: 0 },
      { name: 'NetPrice', total: 0 },
      { name: 'SettleNetPrice', total: 0 },
      { name: 'NetMoney', total: 0 },
      { name: 'LocalNetNotional', total: 0 },
      { name: 'value', total: 0 }
    ]);
  }

  resetBottomRowData() {
    this.pinnedBottomRowData = null;
  }

  refreshGrid() {
    this.totalRecords = 0;
    this.rowData = [];
    this.cacheService.purgeServerSideJournalsMeta();
    this.gridOptions.api.showLoadingOverlay();
    this.initColDefs();
    this.gridOptions.api.setServerSideDatasource(this.datasource);
  }

  openJournalModal() {
    this.isJournalModalActive = true;

    setTimeout(() => {
      this.journalModal.openModal();
    }, 250);
  }

  openEditModal(data, contraEntryMode) {
    this.journalModal.openModal(data, contraEntryMode);
  }

  closeJournalModal() {
    this.refreshGrid();
  }

  openDataModal(row) {
    // We can Drive the Screen that we Wish to Display from here
    if (row.colDef.headerName === 'Group') {
      return;
    }

    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  closeDataModal() {}

  openChartModal(data) {
    this.reportModal.openModal(data);
  }
}
