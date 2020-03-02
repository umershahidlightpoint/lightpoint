import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';
import * as moment from 'moment';
import { GridUtils } from 'lp-toolkit';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { Fund } from '../../../../shared/Models/account';
import {
  Ranges,
  Style,
  SideBar,
  ExcelStyle,
  GetDateRangeLabel,
  FormatNumber4,
  FormatNumber2,
  MoneyFormat,
  SetDateRange,
  CommaSeparatedFormat,
  HeightStyle,
  DateFormatter
} from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { GridLayoutMenuComponent, CustomGridOptions } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';

@Component({
  selector: 'app-position-market-value-appraisal',
  templateUrl: './position-market-value-appraisal.component.html',
  styleUrls: ['./position-market-value-appraisal.component.scss']
})
export class PositionMarketValueAppraisalComponent implements OnInit, AfterViewInit {
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;

  gridOptions: CustomGridOptions;
  funds: Fund;
  fund: any = 'All Funds';
  DateRangeLabel: string;
  selectedDate: any;
  startDate: any;
  endDate: any;
  maxDate: moment.Moment;

  // private filterSubject: Subject<string> = new Subject();
  filterBySymbol = '';

  reportData: any;
  isLoading = false;
  hideGrid: boolean;

  journalDate: Date;

  labels: string[] = [];

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(220);

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
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.getFunds();
    this.maxDate = moment();
    // In case we need to enable filter by symbol from server side
    // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
    //   this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    // });
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFunds();
      }
    });
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      date => {
        if (date.isSuccessful && date.statusCode === 200) {
          this.journalDate = date.payload[0].when;
          this.startDate = this.journalDate;
          this.selectedDate = {
            startDate: moment(this.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.endDate, 'YYYY-MM-DD')
          };
        }
      },
      error => {}
    );
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      /* Custom Method Binding for External Filters from Grid Layout Component */
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      setExternalFilter: this.isExternalFilterPassed.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      onCellClicked: this.rowSelected.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      groupIncludeFooter: true,
      suppressAggFuncInHeader: true,
      groupIncludeTotalFooter: true,
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      deltaRowDataMode: true,
      getRowNodeId: data => {
        return data.id;
      },
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
      },
      columnDefs: [
        {
          field: 'position',
          headerName: 'Position',
          rowGroup: true,
          enableRowGroup: true
        },
        {
          field: 'EzeTicker',
          headerName: 'Symbol'
        },
        {
          field: 'EzeSecurityType',
          headerName: 'EzeSecurityType',
          rowGroup: true,
          enableRowGroup: true
        },
        {
          field: 'ISIN',
          headerName: 'ISIN'
        },
        {
          field: 'Sedol',
          headerName: 'Sedol'
        },
        {
          field: 'Cusip',
          headerName: 'Cusip'
        },
        {
          field: 'instrument_name',
          headerName: 'Instrument Name'
        },
        {
          field: 'quantity',
          headerName: 'End Quantity',
          aggFunc: 'sum',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'business_date',
          headerName: 'Business Date',
          cellClass: 'rightAlign',
          valueFormatter: dateFormatter
        },
        {
          field: 'cost_basis_local',
          headerName: 'Cost Basis(Local)',
          cellClass: 'rightAlign'
        },
        {
          field: 'end_Price_local',
          headerName: 'End Price(Local)',
          cellClass: 'rightAlign'
        },
        {
          field: 'price_percent_change',
          headerName: 'Price % Change',
          cellClass: 'rightAlign'
        },
        {
          field: 'local_currency',
          headerName: 'Local Currency'
        },
        {
          field: 'fx_rate_to_reporting_currency',
          headerName: 'FX Rate to Reporting Currency'
        },
        {
          field: 'cost_local',
          headerName: 'Cost(Local)',
          cellClass: 'rightAlign'
        },
        {
          field: 'unrealized_pnl_local',
          headerName: 'Unrealized PnL(Local)',
          cellClass: 'rightAlign'
        },
        {
          field: 'end_market_value_local',
          headerName: 'End Market Value(Local)',
          cellClass: 'rightAlign'
        },
        {
          field: 'reporting_cost_basis',
          headerName: 'Reporting Cost Basis',
          cellClass: 'rightAlign'
        }
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      }
    };
    this.gridOptions.sideBar = SideBar(
      GridId.positionMarketValueAppraisalId,
      GridName.positionMarketValueAppraisal,
      this.gridOptions
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

  getReport(date, symbol, fund) {
    this.isLoading = true;
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getPositionMarketValueAppraisalReport(moment(date).format('YYYY-MM-DD'))
      .subscribe(response => {
        this.reportData = response.payload;

        this.gridOptions.api.setRowData(this.reportData);
        GridUtils.autoSizeAllColumns(this.gridOptions);

        this.isLoading = false;
        this.gridOptions.api.hideOverlay();
      });
  }

  rowSelected(row) {}

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the Moment we react to each Key Stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  onFilterChanged() {}

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);
    this.getReport(this.startDate, this.filterBySymbol, this.fund);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.EzeTicker === null ? '' : node.data.EzeTicker;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }
    return true;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'Security Details',
        subMenu: [
          {
            name: 'Create Security',
            action: () => {
              this.securityModal.openSecurityModalFromOutside(
                params.node.data.symbol,
                'createSecurity'
              );
            }
          },
          {
            name: 'Extend',
            action: () => {
              this.securityModal.openSecurityModalFromOutside(params.node.data.symbol, 'extend');
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

    this.selectedDate =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
      dateFilter: {
        startDate: this.startDate !== undefined ? this.startDate : '',
        endDate: this.endDate !== undefined ? this.endDate : ''
      }
    };
  }

  changeDate(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }
    this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
    this.getReport(
      this.startDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(
      this.startDate,
      this.filterBySymbol,
      this.fund === 'All Funds' ? 'ALL' : this.fund
    );
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.selectedDate = null;
    this.DateRangeLabel = '';
    this.endDate = undefined;
    this.filterBySymbol = '';
    this.gridOptions.api.setRowData([]);
  }

  refreshReport() {
    if (this.selectedDate.startDate == null) {
      this.selectedDate = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.endDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
    } else {
      const startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
      this.getReport(startDate, this.filterBySymbol, 'ALL');
    }
  }

  onBtExport() {
    const params = {
      fileName: 'Cost Basis Reports',
      sheetName: 'First Sheet'
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }
}

function dateFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return DateFormatter(params.value);
}

function currencyFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function costBasisFormatter(params): string {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}

function decimnalFormatter2(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber2(params.value);
}

function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

function absCurrencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(Math.abs(params.value));
}
