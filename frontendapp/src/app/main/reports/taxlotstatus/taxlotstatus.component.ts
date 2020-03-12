import { CacheService } from 'src/services/common/cache.service';

import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, timer, Subject, forkJoin, Observable } from 'rxjs';
import { debounce, finalize, tap } from 'rxjs/operators';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { SecurityApiService } from 'src/services/security-api.service';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { GridLayoutMenuComponent, CustomGridOptions } from 'lp-toolkit';
import { GridId, GridName, LayoutConfig } from 'src/shared/utils/AppEnums';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { CreateDividendComponent } from 'src/shared/Modal/create-dividend/create-dividend.component';
import { CreateStockSplitsComponent } from 'src/shared/Modal/create-stock-splits/create-stock-splits.component';
import { CreateSecurityComponent } from './../../../../shared/Modal/create-security/create-security.component';
import { DataModalComponent } from 'src/shared/Component/data-modal/data-modal.component';
import { AgGridUtils } from 'src/shared/utils/AgGridUtils';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  FormatNumber4,
  SetDateRange,
  MoneyFormat,
  CommaSeparatedFormat,
  HeightStyle,
  priceFormatterEx,
  DateFormatter
} from 'src/shared/utils/Shared';

@Component({
  selector: 'rep-taxlotstatus',
  templateUrl: './taxlotstatus.component.html',
  styleUrls: ['./taxlotstatus.component.scss']
})
export class TaxLotStatusComponent implements OnInit, AfterViewInit {
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;
  @ViewChild('dividendModal', { static: false }) dividendModal: CreateDividendComponent;
  @ViewChild('stockSplitsModal', { static: false }) stockSplitsModal: CreateStockSplitsComponent;
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;

  gridOptions: CustomGridOptions;
  closingTaxLots: GridOptions;
  pinnedBottomRowData;
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel: string;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  maxDate: moment.Moment;
  data: Array<TrialBalanceReport>;
  stats: TrialBalanceReportStats;
  isLoading = false;
  hideGrid: boolean;
  journalDate: any;
  isExpanded = false;
  taxLotStatusHorizontalConfig: {
    taxLotStatusSize: number;
    closingTaxLotSize: number;
    taxLotStatusView: boolean;
    closingTaxLotView: boolean;
    useTransition: boolean;
  } = {
    taxLotStatusSize: 50,
    closingTaxLotSize: 50,
    taxLotStatusView: true,
    closingTaxLotView: false,
    useTransition: true
  };
  taxLotStatusVerticalConfig: {
    closingTaxLotSize: number;
    journalSize: number;
    closingTaxLotView: boolean;
    journalView: boolean;
    useTransition: boolean;
  } = {
    closingTaxLotSize: 50,
    journalSize: 50,
    closingTaxLotView: true,
    journalView: false,
    useTransition: true
  };

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  // private filterSubject: Subject<string> = new Subject();
  filterBySymbol = '';

  public tradeSelectionSubject = new BehaviorSubject(null);
  public tradeSelectionChanged = this.tradeSelectionSubject.asObservable();

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private cacheService: CacheService,
    private dataService: DataService,
    private financeService: FinanceServiceProxy,
    private reportsApiService: ReportsApiService,
    private securityApiService: SecurityApiService,
    private agGridUtils: AgGridUtils,
    private dataDictionary: DataDictionary,
    private downloadExcelUtils: DownloadExcelUtils,
    private toastrService: ToastrService
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.getFunds();
    this.maxDate = moment();
    // Comment out this API call, In case we need to enable filter from server side
    // this.getReport(
    //   this.startDate,
    //   this.endDate,
    //   this.filterBySymbol,
    //   this.fund === 'All Funds' ? 'ALL' : this.fund
    // );
    // In case we need to enable filter by Symbol from Server Side
    // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
    //   this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    // });
  }

  ngAfterViewInit(): void {
    this.initPageLayout();
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
      }
    });
  }

  initPageLayout() {
    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const horizontalConfig = this.cacheService.getConfigByKey(
      LayoutConfig.taxLotStatusHorizontalConfigKey
    );
    const verticalConfig = this.cacheService.getConfigByKey(
      LayoutConfig.taxLotStatusVerticalConfigKey
    );
    if (horizontalConfig) {
      this.taxLotStatusHorizontalConfig = JSON.parse(horizontalConfig.value);
    }
    if (verticalConfig) {
      this.taxLotStatusVerticalConfig = JSON.parse(verticalConfig.value);
    }

    this.cdRef.detectChanges();
  }

  applyHorizontalPageLayout(event) {
    if (event.sizes) {
      this.taxLotStatusHorizontalConfig.taxLotStatusSize = event.sizes[0];
      this.taxLotStatusHorizontalConfig.closingTaxLotSize = event.sizes[1];
    }

    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.taxLotStatusHorizontalConfigKey);
    const payload = {
      id: !config ? 0 : config.id,
      project: LayoutConfig.projectName,
      uom: 'JSON',
      key: LayoutConfig.taxLotStatusHorizontalConfigKey,
      value: JSON.stringify(this.taxLotStatusHorizontalConfig),
      description: LayoutConfig.taxLotStatusHorizontalConfigKey
    };

    if (!config) {
      this.cacheService.addUserConfig(payload).subscribe(response => {
        console.log('User Config Added');
      });
    } else {
      this.cacheService.updateUserConfig(payload).subscribe(response => {
        console.log('User Config Updated');
      });
    }
  }

  applyVerticalPageLayout(event) {
    if (event.sizes) {
      this.taxLotStatusVerticalConfig.closingTaxLotSize = event.sizes[0];
      this.taxLotStatusVerticalConfig.journalSize = event.sizes[1];
    }

    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.taxLotStatusVerticalConfigKey);
    const payload = {
      id: !config ? 0 : config.id,
      project: LayoutConfig.projectName,
      uom: 'JSON',
      key: LayoutConfig.taxLotStatusVerticalConfigKey,
      value: JSON.stringify(this.taxLotStatusVerticalConfig),
      description: LayoutConfig.taxLotStatusVerticalConfigKey
    };

    if (!config) {
      this.cacheService.addUserConfig(payload).subscribe(response => {
        console.log('User Config Added');
      });
    } else {
      this.cacheService.updateUserConfig(payload).subscribe(response => {
        console.log('User Config Updated');
      });
    }
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      date => {
        if (date.isSuccessful && date.statusCode === 200) {
          this.journalDate = date.payload[0].when;
          this.startDate = this.journalDate;
          this.selected = {
            startDate: moment(this.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.startDate, 'YYYY-MM-DD')
          };
        }
      },
      error => {}
    );
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      /* Custom Method Binding for External Filters from Grid Layout Component */
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      setExternalFilter: this.isExternalFilterPassed.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        // AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },

      columnDefs: [
        {
          field: 'open_id',
          width: 120,
          headerName: 'Order Id',
          sortable: true,
          filter: true,
          hide: true
        },
        {
          field: 'trade_date',
          width: 120,
          headerName: 'Trade Date',
          sortable: true,
          filter: true,
          valueFormatter: dateFormatter
        },
        /*
        {
          field: 'business_date',
          width: 120,
          headerName: 'Date',
          sortable: true,
          filter: true,
          valueFormatter: dateFormatter
        },
        */
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol',
          rowGroup: true,
          enableRowGroup: true,
          sortable: true,
          filter: true
        },
        {
          field: 'status',
          headerName: 'Status',
          sortable: true,
          filter: true,
          width: 120
        },
        {
          field: 'side',
          headerName: 'Side',
          sortable: true,
          filter: true,
          width: 100
        },
        {
          field: 'original_quantity',
          headerName: 'Orig Qty',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter,
          aggFunc: 'sum',
          enableValue: true,
        },
        {
          field: 'quantity',
          headerName: 'Rem Qty',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter,
          aggFunc: 'sum',
          enableValue: true,
        },
        {
          field: 'investment_at_cost',
          headerName: 'IoC (USD)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'eod_px',
          headerName: 'EOD px (Local)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: priceFormatterEx
        },
        {
          field: 'trade_price',
          headerName: 'Trade px (Local)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: priceFormatterEx
        },
        {
          field: 'realized',
          headerName: 'Realized (USD)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'unrealized',
          headerName: 'Unrealized (USD)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'net',
          headerName: 'Net P&L (USD)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'original_investment_at_cost',
          headerName: 'IoC (Local)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'residual_investment_at_cost',
          headerName: 'Residual IoC (Local)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    };
    this.gridOptions.sideBar = SideBar(
      GridId.taxlotStatusId,
      GridName.taxlotStatus,
      this.gridOptions
    );

    this.closingTaxLots = {
      rowData: [],
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onRowDoubleClicked: this.onClosingTaxLotsRowDoubleClicked.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.closingTaxLots.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        // AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      columnDefs: [
        {
          field: 'open_lot_id',
          width: 120,
          headerName: 'Open Tax Lot',
          sortable: true,
          filter: true
        },
        {
          field: 'closing_lot_id',
          width: 120,
          headerName: 'Closing Tax Lot',
          sortable: true,
          filter: true
        },
        {
          field: 'trade_date',
          width: 120,
          headerName: 'Trade Date',
          sortable: true,
          filter: true,
          valueFormatter: dateFormatter
        },
        /*
        {
          field: 'business_date',
          width: 120,
          headerName: 'Business Date',
          sortable: true,
          filter: true,
          valueFormatter: dateFormatter
        },
        */
        {
          field: 'realized_pnl',
          width: 120,
          headerName: 'Realized P&L',
          sortable: true,
          filter: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'quantity',
          headerName: 'Quantity',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'cost_basis',
          width: 120,
          headerName: 'Closing Price',
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: priceFormatter,
          filter: true
        },
        {
          field: 'trade_price',
          width: 120,
          headerName: 'Opening Price',
          sortable: true,
          filter: true,
          cellClass: 'rightAlign',
          valueFormatter: priceFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.closingTaxLots.sideBar = SideBar(
      GridId.closingTaxLotId,
      GridName.closingTaxLots,
      this.closingTaxLots
    );
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
  getReport(toDate, fromDate, symbol, fund) {
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getTaxLotReport(
        moment(toDate).format('YYYY-MM-DD'),
        moment(fromDate).format('YYYY-MM-DD'),
        symbol,
        fund,
        false
      )
      .subscribe(
        response => {
          this.stats = response.stats;
          this.data = response.payload;
          this.gridOptions.api.sizeColumnsToFit();
          this.gridOptions.api.setRowData(this.data);
          this.gridOptions.api.expandAll();

          this.gridOptions.api.hideOverlay();
        },
        error => {
          this.gridOptions.api.hideOverlay();
        }
      );
  }

  onTaxLotSelection(lporderid) {
    const startDate = this.selected.startDate.format('YYYY-MM-DD');
    const endDate = this.selected.endDate.format('YYYY-MM-DD');

    this.reportsApiService.getClosingTaxLots(lporderid, startDate, endDate).subscribe(response => {
      // this.stats = response.stats;
      // this.data = response.data;
      this.closingTaxLots.api.sizeColumnsToFit();
      this.closingTaxLots.api.setRowData(response.payload);

      if (response.payload.length === 0) {
        this.tradeSelectionSubject.next('');
      } else {
        this.tradeSelectionSubject.next(response.payload[0].closing_lot_id);
      }
    });
  }

  onRowDoubleClicked(params) {
    const { open_id } = params.data;

    this.getTrade(open_id);
  }

  onClosingTaxLotsRowDoubleClicked(params) {
    const { closing_lot_id } = params.data;

    this.getTrade(closing_lot_id);
  }

  getTrade(tradeId) {
    this.isLoading = true;

    this.financeService
      .getTrade(tradeId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        response => {
          this.dataModal.openModal(response[0], null, true);
        },
        error => {}
      );
  }

  onRowSelected(event) {
    if (event.node.selected) {
      this.onTaxLotSelection(event.node.data.open_id);
    }
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
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

  doesExternalFilterPass(node: any) {
    // Client Side Filters
    // if (this.fund !== 'All Funds' && this.filterBySymbol !== '' && this.startDate) {
    //   const cellFund = node.data.fund;
    //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
    //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
    //   return (
    //     cellFund === this.fund &&
    //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
    //     this.startDate <= cellDate &&
    //     this.endDate >= cellDate
    //   );
    // }
    // if (this.fund !== 'All Funds' && this.filterBySymbol !== '') {
    //   const cellFund = node.data.fund;
    //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
    //   return cellFund === this.fund && cellSymbol.includes(this.filterBySymbol);
    // }
    // if (this.fund !== 'All Funds' && this.startDate) {
    //   const cellFund = node.data.fund;
    //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
    //   return cellFund === this.fund && this.startDate <= cellDate && this.endDate >= cellDate;
    // }
    // if (this.filterBySymbol !== '' && this.startDate) {
    //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
    //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
    //   return (
    //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
    //     this.startDate <= cellDate &&
    //     this.endDate >= cellDate
    //   );
    // }
    // if (this.fund !== 'All Funds') {
    //   const cellFund = node.data.fund;
    //   return cellFund === this.fund;
    // }
    // if (this.startDate) {
    //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
    //   return this.startDate <= cellDate && this.endDate >= cellDate;
    // }
    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }
    return true;
  }

  openDataGridModal(rowData: any) {
    const { open_id } = rowData;
    this.financeService
      .getTradeJournals(open_id, '', '')
      .pipe(finalize(() => this.gridOptions.api.hideOverlay()))
      .subscribe(response => {
        const { data, meta } = response;
        const someArray = this.agGridUtils.columizeData(data, meta.Columns);
        const columns = this.dataDictionary.getTradeJournalColDefs(meta.Columns);

        this.dataGridModal.openModal(columns, someArray);
      });
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'View Journals',
        action: () => {
          this.gridOptions.api.showLoadingOverlay();
          this.openDataGridModal(params.node.data);
        }
      },
      {
        name: 'Corporate Actions',
        subMenu: [
          {
            name: 'Create Dividend',
            action: () => {
              this.dividendModal.openDividendModalFromOutside(params.node.data.symbol);
            }
          },
          {
            name: 'Create Stock Split',
            action: () => {
              this.stockSplitsModal.openStockSplitModalFromOutside(params.node.data.symbol);
            }
          }
        ]
      },
      {
        name: 'Security Details',
        subMenu: [
          {
            name: 'Extend',
            action: () => {
              this.isLoading = true;

              this.securityApiService.getDataForSecurityModal(params.node.data.symbol).subscribe(
                ([config, securityDetails]: [any, any]) => {

                  this.isLoading = false;
                  if (!config.isSuccessful) {
                  this.toastrService.error('No security type found against the selected symbol!');
                  return;
                }

                  if (securityDetails.payload.length === 0) {
                  this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
                    config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                } else {
                  this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
                    config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
                }

                },
                error => {
                  this.isLoading = false;
                }
              );

            },
          }
        ]
      }
    ];

    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  // getDataForSecurityModal(symbol) {
  //   const config = this.securityApiService.getSecurityConfig(symbol);
  //   const securityDetails = this.securityApiService.getSecurityDetail(symbol);
  //   return forkJoin([
  //     config,
  //     securityDetails
  //   ]);
  // }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();

    if (this.selected.startDate == null) {
      this.selected = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.journalDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, this.journalDate, this.filterBySymbol, 'ALL');
    } else {
      const startDate = this.selected.startDate.format('YYYY-MM-DD');
      const endDate = this.selected.endDate.format('YYYY-MM-DD');
      this.getReport(startDate, endDate, this.filterBySymbol, 'ALL');
    }
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.DateRangeLabel = '';
    this.selected = null;
    this.filterBySymbol = '';
    // Client Side Filters
    // this.gridOptions.api.setRowData(this.data);
    // Server Side Filters
    this.gridOptions.api.setRowData([]);
    this.closingTaxLots.api.setRowData([]);
    this.tradeSelectionSubject.next('');
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
      dateFilter: { startDate: this.startDate, endDate: this.endDate }
    };
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    // In case we need to enable filter from Server Side
    this.getReport(
      this.startDate,
      this.endDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    this.getRangeLabel();
    // this.gridOptions.api.onFilterChanged();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    // In case we need to enable from Server Side
    this.getReport(
      this.startDate,
      this.endDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    // this.gridOptions.api.onFilterChanged();
  }

  onBtExport() {
    const params = {
      fileName: 'Tax Lot Reports',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  onTradeRowSelected(event) {
    if (event.node.selected) {
      this.tradeSelectionSubject.next(event.node.data.closing_lot_id);
    }
  }
}

function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function dateFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return DateFormatter(params.value);
}

function priceFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}
