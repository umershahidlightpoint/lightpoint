/* Core/Library Imports */
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { FinanceServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { DataService } from '../../../../shared/common/data.service';
import { JournalModalComponent } from '../journals-client-side/journal-modal/journal-modal.component';
import { ReportModalComponent } from 'src/shared/Component/report-modal/report-modal.component';
import { DataModalComponent } from '../../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from '../../../../shared/Component/grid-layout-menu/grid-layout-menu.component';
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
  GetDateRangeLabel,
  SetDateRange,
  HeightStyle,
  AutoSizeAllColumns,
  CommonCols,
  CalTotal
} from 'src/shared/utils/Shared';

@Component({
  selector: 'app-journals-server-side',
  templateUrl: './journals-server-side.component.html',
  styleUrls: ['./journals-server-side.component.css']
})
export class JournalsServerSideComponent implements OnInit, AfterViewInit {
  @ViewChild('journalModal', { static: false }) journalModal: JournalModalComponent;
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;
  @ViewChild('reportModal', { static: false }) reportModal: ReportModalComponent;

  private filterSubject: Subject<string> = new Subject();
  rowData: any[] = [];

  isEngineRunning = false;
  hideGrid = false;
  gridOptions: GridOptions;
  gridLayouts: any;
  colDefs: Array<ColDef | ColGroupDef>;
  pinnedBottomRowData: any;
  totalRecords = 0;
  fieldsSum: Array<{ name: string; total: number }>;
  fund = 'All Funds';
  funds: any;
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
  isDataStreaming = false;

  ranges: any = Ranges;

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
      const { fund, symbol, when } = this.getServerSideExternalFilter();
      const payload = {
        ...params.request,
        externalFilterModel: { fund, symbol, when },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };

      // console.log('PARAMS :: ', JSON.stringify(params.request, null, 1));
      // console.log('PAYLOAD :: ', JSON.stringify(payload, null, 1));
      console.log('GET ROWS CALLED ::');

      this.financeService.getServerSideJournals(payload).subscribe(
        result => {
          if (result.isSuccessful) {
            result.payload.forEach(item => {
              item.when = moment(item.when).format('MM-DD-YYYY');
            });
            if (this.pageNumber === 1) {
              this.rowData = result.payload;
              this.toastrService.clear();
              this.toastrService.success(result.message);
            } else {
              this.rowData = result.payload;
            }

            params.successCallback(this.rowData, result.meta.LastRow);
            if (result.meta.LastRow === 0) {
              this.gridOptions.api.showNoRowsOverlay();
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

            this.gridOptions.api.refreshCells();
            AutoSizeAllColumns(this.gridOptions);
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
    private toastrService: ToastrService
  ) {
    this.hideGrid = false;
    this.DateRangeLabel = '';

    this.resetFieldsSum();
    this.initColDefs();
    this.initGird();
  }

  ngOnInit() {
    this.isEngineRunning = this.postingEngineService.getStatus();
    this.filterSubject.pipe(debounce(() => timer(500))).subscribe(() => {
      this.gridOptions.api.onFilterChanged();
    });

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

  getFunds() {
    this.financeService.getFunds().subscribe(result => {
      const localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      this.funds = localfunds;
    });
  }

  getJournalsTotal(payload) {
    this.financeService.getServerSideJournalsTotal(payload).subscribe(
      response => {
        if (response.isSuccessful) {
          this.pinnedBottomRowData = [
            {
              // source: 'Total Records: ' + this.totalRecords,
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

  initColDefs() {
    const payload = {
      tableName: 'vwJournal',
      filters: ['fund', 'symbol', 'AccountCategory', 'AccountType', 'AccountName', 'fx_currency']
    };
    this.financeService.getServerSideJournalsMeta(payload).subscribe(result => {
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
      const colDefs = [...commonColDefs, this.dataDictionary.column('fxrate', true)];

      const cdefs = this.agGridUtls.customizeColumns(
        colDefs,
        metaColumns,
        this.ignoreFields,
        true,
        false
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
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onSortChanged: this.onSortChanged.bind(this),
      onColumnRowGroupChanged: this.onColumnRowGroupChanged.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      onCellDoubleClicked: this.openDataModal.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowSelection: 'single',
      rowModelType: 'serverSide',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      floatingFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
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
      getChildCount: data => {
        // Data Contains a Group that is returned from the API
        return data ? data.groupCount : 0;
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(
      GridId.journalsLedgersId,
      GridName.journalsLedgers,
      this.gridOptions
    );
  }

  onFilterChanged(event) {
    this.resetBottomRowData();

    const { filterModel } = event.api.serverSideRowModel.cacheParams;
    const { fund, symbol, when } = this.getServerSideExternalFilter();
    const payload = {
      filterModel,
      externalFilterModel: {
        ...(fund && { fund }),
        ...(symbol && { symbol }),
        ...(when && { when })
      }
    };

    // console.log('PAYLOAD OF FILTERS ::', payload);
    this.getJournalsTotal(payload);
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
    const addDefaultItems = [
      {
        name: 'Edit',
        action: () => {
          this.openEditModal(params.node.data);
        }
      }
    ];
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
    //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
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

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;

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

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
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
      ...(this.startDate !== null && {
        when: {
          dateFrom: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
          dateTo: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : '',
          filterType: 'date'
        }
      })
    };
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.filterBySymbol = '';
    this.DateRangeLabel = '';
    this.selected = null;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
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
    this.gridOptions.api.showLoadingOverlay();
    this.gridOptions.api.setServerSideDatasource(this.datasource);
  }

  openJournalModal() {
    this.journalModal.openModal({});
  }

  openEditModal(data) {
    this.journalModal.openModal(data);
  }

  closeJournalModal() {}

  closeOrderModal() {}

  openDataModal(row) {
    // We can Drive the Screen that we Wish to Display from here
    if (row.colDef.headerName === 'Group') {
      return;
    }
    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  openChartModal(data) {
    this.reportModal.openModal(data);
  }
}
