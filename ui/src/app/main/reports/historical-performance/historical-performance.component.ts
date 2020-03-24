import { 
    Component,
    ViewChild,
    OnInit, 
    OnDestroy, 
    AfterViewInit,   
    ChangeDetectorRef
} from '@angular/core';

import { timer, Subject } from 'rxjs';
import { debounce } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GridUtils } from '@lightpointfinancialtechnology/lp-toolkit';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { SecurityApiService } from 'src/services/security-api.service';
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
  DateFormatter,
  PercentageFormatter
} from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import {
  GridLayoutMenuComponent,
  CustomGridOptions
} from '@lightpointfinancialtechnology/lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';
import { DataDictionary } from 'src/shared/utils/DataDictionary';

@Component({
  selector: 'app-historical-performance',
  templateUrl: './historical-performance.component.html',
  styleUrls: ['./historical-performance.component.scss']
})
export class HistoricalPerformanceComponent implements OnInit, OnDestroy, AfterViewInit {
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
    private toastrService: ToastrService,
    private financeService: FinanceServiceProxy,
    private reportsApiService: ReportsApiService,
    private securityApiService: SecurityApiService,
    private downloadExcelUtils: DownloadExcelUtils,
    private cdRef: ChangeDetectorRef,
    public dataDictionary: DataDictionary
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
          this.endDate = this.journalDate;
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
      // getContextMenuItems: params => this.getContextMenuItems(params),
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
          field: 'AsOf',
          headerName: 'AsOf',
          valueFormatter: dateFormatter
          // rowGroup: true,
          // enableRowGroup: true
        },
        {
          field: 'DayPnl',
          headerName: 'DayPnl',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'SodNav',
          headerName: 'SodNav',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'EodNav',
          headerName: 'EodNav',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Withdrawls',
          headerName: 'WithDrawls',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'Contributions',
          headerName: 'Contributions',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'DayPnlPer',
          headerName: 'DayPnlPer',
          cellClass: 'rightAlign',
          //valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.DayPnlPer, true)
        },
        {
          field: 'MtdPnlPer',
          headerName: 'MtdPnlPer',
          cellClass: 'rightAlign',
          //valueFormatter: params => this.dataDictionary.numberFormatter(params.node.data.MtdPnlPer, true)
        },
        {
          field: 'QtdPnlPer',
          headerName: 'QtdPnlPer',
          // aggFunc: 'sum',
          cellClass: 'rightAlign',
          //valueFormatter: currencyFormatter
        },
        {
          field: 'YtdPnlPer',
          headerName: 'YtdPnlPer',
          cellClass: 'rightAlign',
          //valueFormatter: currencyFormatter
        },
        {
          field: 'ItdPnlPer',
          headerName: 'ItdPnlPer',
          cellClass: 'rightAlign',
          //valueFormatter: currencyFormatter
        },
        {
          field: 'MtdPnl',
          headerName: 'MtdPnl',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'QtdPnl',
          headerName: 'QtdPnl',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'YtdPnl',
          headerName: 'YtdPnl',
          cellClass: 'rightAlign',
          valueFormatter: currencyFormatter
        },
        {
          field: 'ItdPnl',
          headerName: 'ItdPnl',
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

  getReport(startDate, endDate) {
    this.isLoading = true;
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getHistoricPerformanceReport(startDate, endDate)
      .subscribe(response => {

        this.reportData = response.payload;

        this.isLoading = false;
        this.gridOptions.api.hideOverlay();

        this.gridOptions.api.setRowData(response.payload);
        this.gridOptions.api.sizeColumnsToFit();

        this.cdRef.detectChanges();
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
    // this.getReport(this.startDate, this.filterBySymbol, this.fund);
    this.getReport(this.startDate, this.endDate);
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
            name: 'Extend',
            action: () => {
              this.isLoading = true;

              this.securityApiService.getDataForSecurityModal(params.node.data.EzeTicker).subscribe(
                ([config, securityDetails]: [any, any]) => {
                  this.isLoading = false;
                  if (!config.isSuccessful) {
                    this.toastrService.error('No security type found against the selected symbol!');
                    return;
                  }
                  if (securityDetails.payload.length === 0) {
                    this.securityModal.openSecurityModalFromOutside(
                      params.node.data.EzeTicker,
                      config.payload[0].SecurityType,
                      config.payload[0].Fields,
                      null,
                      'extend'
                    );
                  } else {
                    this.securityModal.openSecurityModalFromOutside(
                      params.node.data.EzeTicker,
                      config.payload[0].SecurityType,
                      config.payload[0].Fields,
                      securityDetails.payload[0],
                      'extend'
                    );
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
    this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
    // this.getReport(
    //   this.startDate,
    //   this.filterBySymbol,
    //   this.fund === 'All Funds' ? 'ALL' : this.fund
    // );
    this.getReport(this.startDate, this.endDate);
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    // this.getReport(
    //   this.startDate,
    //   this.filterBySymbol,
    //   this.fund === 'All Funds' ? 'ALL' : this.fund
    // );
    this.getReport(this.startDate, this.endDate);
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
        endDate: moment(this.journalDate, 'YYYY-MM-DD')
      };
      // this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
      this.getReport(this.startDate, this.endDate);
    } else {
      const startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
      const endDate = this.selectedDate.endDate.format('YYYY-MM-DD');
      this.getReport(startDate, endDate);
      // this.getReport(startDate, this.filterBySymbol, 'ALL');
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

  ngOnDestroy() {}
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
