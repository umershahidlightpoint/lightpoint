import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { timer, Subject } from 'rxjs';
import { debounce, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { SecurityApiService } from 'src/services/security-api.service';
import { ToastrService } from 'ngx-toastr';
import { Fund } from '../../../../shared/Models/account';
import {
  GridLayoutMenuComponent,
  CustomGridOptions,
  GridUtils
} from '@lightpointfinancialtechnology/lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { CreateDividendComponent } from 'src/shared/Modal/create-dividend/create-dividend.component';
import { CreateStockSplitsComponent } from 'src/shared/Modal/create-stock-splits/create-stock-splits.component';
import { CreateSecurityComponent } from './../../../../shared/Modal/create-security/create-security.component';
import { AgGridUtils } from 'src/shared/utils/AgGridUtils';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import {
  Style,
  HeightStyle,
  ExcelStyle,
  SideBar,
  Ranges,
  GetDateRangeLabel,
  SetDateRange,
  CommaSeparatedFormat,
  DateFormatter
} from 'src/shared/utils/Shared';

@Component({
  selector: 'app-detail-pnl-date',
  templateUrl: './detail-pnl-date.component.html',
  styleUrls: ['./detail-pnl-date.component.scss']
})
export class DetailPnlDateComponent implements OnInit, AfterViewInit {
  @ViewChild('dividendModal', { static: false }) dividendModal: CreateDividendComponent;
  @ViewChild('stockSplitsModal', { static: false }) stockSplitsModal: CreateStockSplitsComponent;
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;

  gridOptions: CustomGridOptions;
  hideGrid: boolean;

  // fund: any = 'All Funds';
  // funds: Fund;

  filterBySymbol = '';
  DateRangeLabel: string;
  startDate: any;
  endDate: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  maxDate: moment.Moment;
  journalDate: any;
  data: any[];
  isLoading = false;
  isExpanded = false;

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

  // private filterSubject: Subject<string> = new Subject();

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private dataService: DataService,
    private financeService: FinanceServiceProxy,
    private reportsApiService: ReportsApiService,
    private agGridUtils: AgGridUtils,
    private dataDictionary: DataDictionary,
    private downloadExcelUtils: DownloadExcelUtils,
    private securityApiService: SecurityApiService,
    private toastrService: ToastrService
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.maxDate = moment();

    // In case we add Funds filter later
    // this.getFunds();

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
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        // this.getFunds();
      }
    });
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

        GridUtils.autoSizeAllColumns(params);
      },

      columnDefs: [
        {
          field: 'SecurityId',
          headerName: 'SecurityId'
        },
        {
          field: 'SecurityCode',
          headerName: 'Security Code'
        },
        {
          field: 'SecurityType',
          headerName: 'Security Type'
        },
        {
          field: 'SecurityName',
          headerName: 'Security Name'
        },
        {
          field: 'ISIN',
          headerName: 'ISIN'
        },
        {
          field: 'side',
          headerName: 'Side'
        },
        {
          field: 'Fund',
          headerName: 'Fund'
        },
        {
          field: 'BusDate',
          headerName: 'Business Date',
          valueFormatter: dateFormatter
        },
        {
          field: 'currency',
          headerName: 'currency'
        },
        {
          field: 'position',
          headerName: 'position',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'realizedPnl',
          headerName: 'Realized PnL',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'realizedPnl_FX',
          headerName: 'Realized PnL FX',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'realizedPnl_Net',
          headerName: 'Realized PnL Net',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Cost',
          headerName: 'Cost',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'unrealizedPnl',
          headerName: 'Unrealized PnL',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'unrealizedPnl_FX',
          headerName: 'Unrealized PnL FX',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'unrealizedPnl_FX_Translation',
          headerName: 'Unrealized PnL FX Translation',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'unrealizedPnl_Net',
          headerName: 'Unrealized PnL Net',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'market_Value',
          headerName: 'Market Value',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Pnl',
          headerName: 'PnL',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'commission',
          headerName: 'Commission',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'fees',
          headerName: 'Fees',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        }
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      }
    };
    this.gridOptions.sideBar = SideBar(
      GridId.detailPnlDateId,
      GridName.detailPnlDate,
      this.gridOptions
    );
  }

  // In case we add Funds filter later
  // getFunds() {
  //   this.financeService.getFunds().subscribe(result => {
  //     this.funds = result.payload.map(item => ({
  //       fundId: item.FundId,
  //       fundCode: item.FundCode
  //     }));
  //   });
  // }

  // Being called twice
  getReport(fromDate, toDate, symbol) {
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getDetailPnLToDateReport(
        moment(fromDate).format('YYYY-MM-DD'),
        moment(toDate).format('YYYY-MM-DD'),
        symbol
      )
      .subscribe(
        response => {
          this.gridOptions.api.hideOverlay();

          this.data = response.payload;
          this.gridOptions.api.setRowData(this.data);

          this.gridOptions.api.expandAll();
          GridUtils.autoSizeAllColumns(this.gridOptions);
        },
        error => {
          this.gridOptions.api.hideOverlay();
        }
      );
  }

  onRowSelected(event) {}

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;

    // In case we add Funds filter later
    // this.fund = fundFilter !== undefined ? fundFilter : this.fund;

    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);

    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent(): boolean {
    // In case we add Funds filter later
    // if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
    //   return true;
    // }

    if (this.startDate || this.filterBySymbol !== '') {
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
      const cellSymbol = node.data.SecurityCode === null ? '' : node.data.SecurityCode;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }

    return true;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
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
              let displayFields = {};

              this.securityApiService.getDataForSecurityModal(params.node.data.SecurityCode).subscribe(
                ([config, securityDetails]: [any, any]) => {

                  if (!config.isSuccessful) {
                  this.isLoading = false;
                  this.toastrService.error('No security type found against the selected symbol!');
                  return;
                  }

                  if (securityDetails.payload.length === 0) {
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.SecurityCode,
                    config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                  } else {
                    this.securityApiService.getSecurityType(securityDetails.payload[0].security_type).subscribe( data => {
                    displayFields = data.payload[0].Fields;
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.SecurityCode,
                    securityDetails.payload[0].security_type, displayFields, securityDetails.payload[0], 'extend');
                    displayFields = {};
                  });
                }

                },
                error => {
                  this.isLoading = false;
                }
              );
            }
          }
        ]
      }
    ];

    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, true, null, params);
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

    if (this.selected.startDate == null) {
      this.selected = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.journalDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, this.journalDate, this.filterBySymbol);
    } else {
      const startDate = this.selected.startDate.format('YYYY-MM-DD');
      const endDate = this.selected.endDate.format('YYYY-MM-DD');
      this.getReport(startDate, endDate, this.filterBySymbol);
    }
  }

  clearFilters() {
    // this.fund = 'All Funds';

    this.DateRangeLabel = '';
    this.selected = null;
    this.filterBySymbol = '';

    // Client Side Filters
    // this.gridOptions.api.setRowData(this.data);
    // Server Side Filters
    this.gridOptions.api.setRowData([]);
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
      // In case we add Funds filter later
      // fundFilter: this.fund,
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
      this.filterBySymbol

      // In case we add Funds filter later
      // this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    this.getRangeLabel();
    // this.gridOptions.api.onFilterChanged();
  }

  changeFund(selectedFund) {
    // In case we add Funds filter later
    // this.fund = selectedFund;

    // In case we need to enable from Server Side
    this.getReport(
      this.startDate,
      this.endDate,
      this.filterBySymbol

      // In case we add Funds filter later
      // this.fund === 'All Funds' ? 'ALL' : this.fund
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
