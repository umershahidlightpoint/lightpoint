import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { debounce, finalize } from 'rxjs/operators';
import { timer, Subject } from 'rxjs';
import { Fund } from '../../../../shared/Models/account';
import {
  TrialBalanceReport,
  TrialBalanceReportStats
} from '../../../../shared/Models/trial-balance';
import { DataService } from '../../../../services/common/data.service';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
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
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions, RowNode } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { ContextMenu } from 'src/shared/Models/common';
import { MaintenanceApiService } from 'src/services/maintenance-api.service';
import { DataModalComponent } from 'src/shared/Component/data-modal/data-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DataDictionary } from 'src/shared/utils/DataDictionary';

@Component({
  selector: 'app-taxlots-maintenance',
  templateUrl: './taxlots-maintenance.component.html',
  styleUrls: ['./taxlots-maintenance.component.scss']
})
export class TaxlotsMaintenanceComponent implements OnInit, AfterViewInit {
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;

  pinnedBottomRowData;
  gridOptions: GridOptions;
  closingTaxLots: GridOptions;
  fund: any = 'All Funds';
  funds: Fund;
  DateRangeLabel: string;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  data: Array<TrialBalanceReport>;
  stats: TrialBalanceReportStats;
  isLoading = false;
  show = true;
  hideGrid: boolean;
  journalDate: any;

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);
  activeTradeSymbol: string;
  activeTradeSide: string;


  // private filterSubject: Subject<string> = new Subject();
  filterBySymbol = '';
  tradeGridOptions: GridOptions;

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
    private financeService: FinanceServiceProxy,
    private maintenanceApiService: MaintenanceApiService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils,
    private toasterService: ToastrService,
    public dataDictionary: DataDictionary
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.getFunds();
    this.onTaxLotSelection();
    // In case we need to enable filter by symbol from server side
    // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
    //   this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    // });
  }

  getLatestJournalDate() {
    this.maintenanceApiService.getLatestJournalDate().subscribe(
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
      onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
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
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
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
          field: 'trade_price',
          width: 120,
          headerName: 'Trade Price',
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
          aggFunc: 'sum'
        },
        {
          field: 'quantity',
          headerName: 'Rem Qty',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'investment_at_cost',
          headerName: 'Investment @ Cost',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(
      GridId.taxlotsMaintenanceId,
      GridName.taxlotsMaintenance,
      this.gridOptions
    );

    this.closingTaxLots = {
      rowData: [],
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onRowDoubleClicked: this.onClosingTaxLotsRowDoubleClicked.bind(this),
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItemsForClosingLots(params),
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
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
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
      this.gridOptions
    );

    this.tradeGridOptions = {
      rowData: [],
      pinnedBottomRowData: [],
      alignedGrids: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      enableFilter: true,
      animateRows: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItemsForProspectiveTrades(params),
      onGridReady: params => {
        this.closingTaxLots.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
        params.api.sizeColumnsToFit();
      },

      columnDefs: [
        {
          field: 'tradePrice',
          width: 120,
          headerName: 'Trade Price',
          sortable: true,
          hide: true,
          filter: true
        },
        {
          field: 'lpOrderId',
          width: 120,
          headerName: 'LPOrderId',
          sortable: true,
          filter: true
        },
        {
          field: 'quantity',
          width: 120,
          headerName: 'Quantity',
          sortable: true,
          filter: true,
          valueFormatter: currencyFormatter,
        },
        {
          field: 'remainingQuantity',
          width: 120,
          headerName: 'Remaining Quantity',
          sortable: true,
          filter: true,
          valueFormatter: currencyFormatter,
        },
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'side',
          width: 120,
          headerName: 'Side',
          sortable: true,
          filter: true
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
      this.gridOptions
    );
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
      }
    });
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
    this.maintenanceApiService
      .getTaxLotReport(
        moment(toDate).format('YYYY-MM-DD'),
        moment(fromDate).format('YYYY-MM-DD'),
        symbol,
        fund,
        true
      )
      .subscribe(response => {
        this.stats = response.stats;
        this.data = response.payload;
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.api.setRowData(this.data);
        this.gridOptions.api.forEachNodeAfterFilter((rowNode: RowNode) => {
          rowNode.expanded = true;
        });
        this.gridOptions.api.onGroupExpandedOrCollapsed();
      });
  }

  onTaxLotSelection() {
    if(this.closingTaxLots.api) {
      this.closingTaxLots.api.showLoadingOverlay();
    }
    this.maintenanceApiService.getAllClosingTaxLots().subscribe(response => {
      this.closingTaxLots.api.sizeColumnsToFit();
      this.closingTaxLots.api.setRowData(response.payload);

      if (response.payload.length == 0) {
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
    const { open_id } = event.data;
    if (
      (event.data.side === 'BUY' || event.data.side === 'SHORT') &&
      (event.data.status === 'Open' || event.data.status === 'Partially Closed')
    ) {
      if (
        event.data.symbol !== this.activeTradeSymbol ||
        event.data.side !== this.activeTradeSide
      ) {
        this.getProspectiveTrades(event.data.symbol, event.data.side);
      }
    }
    if (this.closingTaxLots.api) {
      this.closingTaxLots.api.forEachNodeAfterFilter((rowNode, index) => {
        if (rowNode.data.open_lot_id === open_id) {
          rowNode.setSelected(true);
          this.closingTaxLots.api.ensureIndexVisible(rowNode.rowIndex);
        } else {
          rowNode.setSelected(false);
        }
      });
    }
  }

  getProspectiveTrades(symbol, side){
    this.tradeGridOptions.api.showLoadingOverlay();
    this.maintenanceApiService.getProspectiveTradesToAlleviateTaxLot(symbol, side).subscribe(resp => {
      if(resp.isSuccessful){
        const trades = resp.payload.map(x => ({
          quantity: x.Quantity,
          remainingQuantity : x.RemainingQuantity,
          lpOrderId : x.LPOrderId,
          symbol : x.Symbol,
          side: x.Side,
          tradePrice: x.TradePrice
        }))

        this.activeTradeSide = side;
        this.activeTradeSymbol = symbol;
        this.tradeGridOptions.api.setRowData(trades);
      }
    }, error => {

    })
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
    this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }
    return true;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(true, null, true, null, params);
  }

  getContextMenuItemsForClosingLots(params) {
    const addDefaultItems = [
      {
        name: 'Reverse Tax Lot Alleviation',
        action: () => {
          this.reverseTaxLotAlleviation();
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  getContextMenuItemsForProspectiveTrades(params) {
    const addDefaultItems = [
      {
        name: 'Manually Alleviate Tax Lot',
        action: () => {
          this.alleviateTaxLot();
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  alleviateTaxLot() {
    this.isLoading = true;
    this.show = false;
    const taxLotStatus = this.gridOptions.api.getSelectedRows();
    const trades = this.tradeGridOptions.api.getSelectedRows();

    if (taxLotStatus.length == 0) {
      this.toasterService.info('Tax lot(s) not selected');
      this.isLoading = false;
      this.show = true;
      return;
    }
    if (trades.length == 0) {
      this.toasterService.info('Trade not selected');
      this.isLoading = false;
      this.show = true;
      return;
    }

    const taxLotStatusPayload = taxLotStatus.map(x => ({
      Id: x.id,
      OpenLotId: x.open_id,
      Symbol: x.symbol,
      Status: x.status,
      Side: x.side,
      OriginalQuantity: x.original_quantity,
      RemainingQuantity: x.quantity,
      TradePrice: x.trade_price
    }));

    const tradesPayload = trades.map(x => ({
      LpOrderId: x.lpOrderId,
      Symbol: x.symbol,
      Side: x.side,
      Quantity: x.quantity,
      RemainingQuantity: x.remainingQuantity,
      TradePrice: x.tradePrice
    }));

    const payload = {
      OpenTaxLots: taxLotStatusPayload,
      ProspectiveTrade: tradesPayload[0]
    };

    this.maintenanceApiService.alleviateTaxLot(payload).subscribe(
      resp => {
        if (resp.isSuccessful) {
          this.toasterService.info('Tax lot(s) alleviated successfully');
          this.isLoading = false;
          this.show = true;
          this.refreshTaxLots();
        } else {
          this.toasterService.error('An error occured while alleviating tax lots');
          this.isLoading = false;
          this.show = true;
        }
      },
      error => {
        this.toasterService.error('An error occured while alleviating tax lots');
      }
    );
  }

  reverseTaxLotAlleviation() {
    this.isLoading = true;
    this.show = false;
    const taxLotStatus = this.gridOptions.api.getSelectedRows();
    const closingTaxLots = this.closingTaxLots.api.getSelectedRows();

    if (closingTaxLots.length == 0) {
      this.toasterService.info('Closing lot not selected');
      this.isLoading = false;
      this.show = true;
      return;
    }

    const taxLotStatusPayload = taxLotStatus.map(x => ({
      Id: x.id,
      OpenLotId: x.open_id,
      Symbol: x.symbol,
      Status: x.status,
      Side: x.side,
      OriginalQuantity: x.original_quantity,
      RemainingQuantity: x.quantity
    }));

    const closingTaxLotPayload = closingTaxLots.map(x => ({
      Id: x.id,
      OpenLotId: x.open_lot_id,
      ClosingLotId: x.closing_lot_id,
      Quantity: x.quantity
    }));

    const payload = {
      ClosingLots: closingTaxLotPayload,
      OpenLots: taxLotStatusPayload
    };

    this.maintenanceApiService.taxLotReversal(payload).subscribe(
      resp => {
        if (resp.isSuccessful) {
          this.toasterService.info('Tax lot(s) reversed successfully');
          this.isLoading = false;
          this.show = true;
          this.refreshTaxLots();
        } else {
          this.toasterService.error('An error occured while reversing tax lots');
          this.isLoading = false;
          this.show = true;
        }
      },
      error => {
        this.toasterService.error('An error occured while reversing tax lots');
      }
    );
  }

  refreshTaxLots() {
    this.onTaxLotSelection();
    this.refreshReport();
    this.getProspectiveTrades(this.activeTradeSymbol, this.activeTradeSide);
  }

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
    this.onTaxLotSelection();
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
    this.gridOptions.api.setRowData([]);
    this.closingTaxLots.api.setRowData([]);
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
    this.getReport(
      this.startDate,
      this.endDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(
      this.startDate,
      this.endDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
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
    const { open_lot_id } = event.data;
    const { closing_lot_id } = event.data;
    if (this.gridOptions.api) {
      this.gridOptions.api.forEachLeafNode(rowNode => {
        if (rowNode.data.open_id === open_lot_id) {
          rowNode.setSelected(true);
          this.gridOptions.api.ensureIndexVisible(rowNode.rowIndex);
        } else {
          rowNode.setSelected(false);
        }
      });
    }

    this.closingTaxLots.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.data.closing_lot_id === closing_lot_id) {
        rowNode.setSelected(true);
        this.gridOptions.api.forEachLeafNode(rowNodeInternal => {
          if (rowNodeInternal.data.open_id === rowNode.data.open_lot_id) {
            rowNodeInternal.setSelected(true);
          }
        });
      } else {
        rowNode.setSelected(false);
      }
    });
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
