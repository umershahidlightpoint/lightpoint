import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { timer, Subject } from 'rxjs';
import { debounce, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import {
  GridLayoutMenuComponent,
  CustomGridOptions
} from '@lightpointfinancialtechnology/lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';
import { DataService } from '../../../../services/common/data.service';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { ReportsApiService } from 'src/services/reports-api.service';
import { SecurityApiService } from 'src/services/security-api.service';
import { ToastrService } from 'ngx-toastr';
import { Fund } from '../../../../shared/Models/account';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { AgGridUtils } from 'src/shared/utils/AgGridUtils';
import { ContextMenu } from 'src/shared/Models/common';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import {
  CalTotalRecords,
  SideBar,
  Ranges,
  GetDateRangeLabel,
  SetDateRange,
  Style,
  HeightStyle,
  ExcelStyle,
  LegendColors,
  FormatDate,
  dateFormatter,
  MoneyFormat,
  moneyFormatter
} from 'src/shared/utils/Shared';

@Component({
  selector: 'rep-daypnl-reconcile',
  templateUrl: './daypnl-reconcile.component.html',
  styleUrls: ['./daypnl-reconcile.component.scss']
})
export class DayPnlComponent implements OnInit, AfterViewInit {
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;

  gridOptions: CustomGridOptions;
  portfolioOptions: GridOptions;
  bookmonOptions: GridOptions;
  action: {
    reconciledGridSize: number;
    accountingBookMonSize: number;
    reconciledGridView: boolean;
    accountingBookMonView: boolean;
    useTransition: boolean;
  } = {
    reconciledGridSize: 50,
    accountingBookMonSize: 50,
    reconciledGridView: true,
    accountingBookMonView: false,
    useTransition: true
  };

  gridColumnApi;
  pinnedBottomRowData;
  fund: any = 'All Funds';
  funds: Fund;
  filterBySymbol = '';
  DateRangeLabel: string;
  selectedDate: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: Date;
  endDate: Date;
  maxDate: moment.Moment;
  isLoading = false;
  hideGrid: boolean;
  chartData: any;
  netpnlData: any;
  unrealizedData: any;
  realizedData: any;
  cbData: any;
  bData: any;
  qData: any;
  title: string;

  reconciledData: any;
  bookmonData: any;
  portfolioData: any;
  showNonZeroBtn = false;
  showNotInAccountingBtn = false;
  showNotInBookMonBtn = false;

  labels: string[] = [];
  displayChart = false;

  journalDate: any;

  ranges: any = Ranges;

  style = Style;

  styleForHeight = HeightStyle(248);

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
    private reportsApiService: ReportsApiService,
    private dataService: DataService,
    private dataDictionary: DataDictionary,
    private agGridUtils: AgGridUtils,
    private securityApiService: SecurityApiService,
    private toastrService: ToastrService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getLatestJournalDate();
    this.getFunds();
    this.maxDate = moment();
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
      }
    });
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      response => {
        if (response.isSuccessful && response.statusCode === 200) {
          this.journalDate = response.payload[0].when;
          this.startDate = this.journalDate;
          this.selectedDate = {
            startDate: moment(this.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.startDate, 'YYYY-MM-DD')
          };
        }
      },
      error => {}
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

  initGrid() {
    this.gridOptions = {
      rowData: [],
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      /* Custom Method Binding for External Filters from Grid Layout Component */
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      setExternalFilter: this.isExternalFilterPassed.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onCellClicked: this.rowSelected.bind(this),
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
        this.gridColumnApi = params.columnApi;
        this.gridOptions.excelStyles = ExcelStyle;
      },
      getRowStyle: params => {
        let style = {};
        if (params.data.nonZero) {
          style = LegendColors.nonZeroStyle;
        }
        if (params.data.notInBookMon) {
          style = LegendColors.notInBookMonStyle;
        }
        if (params.data.notInAccounting) {
          style = LegendColors.notInAccountingStyle;
        }

        return style;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
      },
      columnDefs: [
        {
          field: 'Symbol',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'SecurityType',
          width: 120,
          headerName: 'SecurityType',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'Diff_DayPnl',
          headerName: 'Difference',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Currency',
          width: 50,
          headerName: 'Currency',
          sortable: true,
          filter: true
        },
        {
          headerName: 'Id',
          field: 'id',
          hide: true
        },
        {
          headerName: 'Non-zero',
          field: 'nonZero',
          hide: true
        },
        {
          headerName: 'Not in BookMon',
          field: 'notInBookMon',
          hide: true
        },
        {
          headerName: 'Not in Accounting',
          field: 'notInAccounting',
          hide: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    };
    this.gridOptions.sideBar = SideBar(
      GridId.dayPnlReconcileId,
      GridName.dayPnlReconcile,
      this.gridOptions
    );

    this.bookmonOptions = {
      rowData: [],
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onCellClicked: this.rowSelected.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridColumnApi = params.columnApi;
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
          field: 'SecurityCode',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'DayPnl',
          headerName: 'Day Pnl',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'Currency',
          width: 50,
          headerName: 'Currency',
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

    this.portfolioOptions = {
      rowData: [],
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      onCellClicked: this.rowSelected.bind(this),
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridColumnApi = params.columnApi;
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
          field: 'SecurityCode',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'Fund',
          width: 120,
          headerName: 'Fund',
          sortable: true,
          filter: true
        },
        {
          field: 'DayPnl',
          headerName: 'Day Pnl',
          cellClass: 'rightAlign',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: currencyFormatter
        },
        {
          field: 'currency',
          width: 50,
          headerName: 'Currency',
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
  }

  // Being Called Twice (Fixed)
  getReport(date, fund) {
    this.isLoading = true;
    this.gridOptions.api.showLoadingOverlay();
    this.reportsApiService
      .getReconReport(moment(date).format('YYYY-MM-DD'), fund)
      .subscribe(response => {
        this.reconciledData = this.setIdentifierForReconDataAndCheckMissingRows(
          response.payload[0],
          response.payload[1],
          response.payload[2]
        );
        this.portfolioData = response.payload[1];
        this.bookmonData = response.payload[2];

        this.gridOptions.api.setRowData(this.reconciledData);
        this.gridOptions.api.sizeColumnsToFit();

        this.portfolioOptions.api.setRowData(this.portfolioData);
        this.portfolioOptions.api.sizeColumnsToFit();

        this.bookmonOptions.api.setRowData(this.bookmonData);
        this.bookmonOptions.api.sizeColumnsToFit();

        this.isLoading = false;
      });
  }

  setIdentifierForReconDataAndCheckMissingRows(reconData, accountingData, bookMonData) {
    let i = 0;

    const modifiedReconData = reconData.map(x => ({
      ...x,
      id: i++,
      ...(x.Diff_DayPnl !== 0 ? { nonZero: true } : { nonZero: false }),
      ...(accountingData.find(y => y.SecurityCode === x.Symbol) === undefined
        ? { notInAccounting: true }
        : { notInAccounting: false }),
      ...(bookMonData.find(y => y.SecurityCode === x.Symbol) === undefined
        ? { notInBookMon: true }
        : { notInBookMon: false })
    }));

    this.showNonZeroBtn =
      (modifiedReconData.find(data => data.nonZero === true) || {}).nonZero || false;
    this.showNotInAccountingBtn =
      (modifiedReconData.find(data => data.notInAccounting === true) || {}).notInAccounting ||
      false;
    this.showNotInBookMonBtn =
      (modifiedReconData.find(data => data.notInBookMon === true) || {}).notInBookMon || false;

    return modifiedReconData;
  }

  rowSelected(row) {
    const { symbol } = row.data;

    const mySymbol = row.data.Symbol;

    this.bookmonOptions.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.data.SecurityCode === mySymbol) {
        rowNode.setSelected(true);
        this.bookmonOptions.api.ensureIndexVisible(rowNode.rowIndex);
      } else {
        rowNode.setSelected(false);
      }
    });

    this.portfolioOptions.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.data.SecurityCode === mySymbol) {
        rowNode.setSelected(true);
        this.portfolioOptions.api.ensureIndexVisible(rowNode.rowIndex);
      } else {
        rowNode.setSelected(false);
      }
    });
  }

  onRowDoubleClicked(params: RowDoubleClickedEvent) {
    this.gridOptions.api.showLoadingOverlay();
    this.openDataGridModal(params.data);
  }

  openDataGridModal(rowData: any) {
    console.log('DATA ::', rowData);
    const { Symbol, Diff_DayPnl } = rowData;
    const { startDate } = this.selectedDate;
    this.financeService
      .getTradeJournals('', startDate.format('YYYY-MM-DD'), Symbol)
      .pipe(finalize(() => this.gridOptions.api.hideOverlay()))
      .subscribe(response => {
        const { data, meta } = response;
        const someArray = this.agGridUtils.columizeData(data, meta.Columns);
        const columns = this.dataDictionary.getTradeJournalColDefs(meta.Columns);

        const filteredData = someArray.filter(
          item =>
            item.AccountType === 'CHANGE IN UNREALIZED GAIN/(LOSS)' ||
            item.AccountType === 'REALIZED GAIN/(LOSS)'
        );

        this.title = `Trade Journals (Difference: ${Diff_DayPnl})`;
        this.dataGridModal.openModal(columns, filteredData);
      });
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
    this.getReport(this.startDate, this.fund);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
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
              let displayFields = {};

              this.securityApiService.getDataForSecurityModal(params.node.data.Symbol).subscribe(
                ([config, securityDetails]: [any, any]) => {

                  if (!config.isSuccessful) {
                  this.isLoading = false;
                  this.toastrService.error('No security type found against the selected symbol!');
                  return;
                  }

                  if (securityDetails.payload.length === 0) {
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol,
                    config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                  } else {
                    this.securityApiService.getSecurityType(securityDetails.payload[0].security_type).subscribe( data => {
                    displayFields = data.payload[0].Fields;
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol,
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

    this.selectedDate =
      dateFilter.startDate !== ''
        ? { startDate: moment(this.startDate), endDate: moment(this.endDate) }
        : null;
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

    this.startDate = selectedDate.startDate;
    this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    this.getRangeLabel();
  }

  changeFund(selectedFund) {
    this.fund = selectedFund;
    this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
  }

  clearFilters() {
    this.fund = 'All Funds';
    this.filterBySymbol = '';
    this.DateRangeLabel = '';
    this.selectedDate = null;
    this.endDate = undefined;
    this.showNonZeroBtn = false;
    this.showNotInAccountingBtn = false;
    this.showNotInBookMonBtn = false;
    this.gridOptions.api.setRowData([]);
    this.portfolioOptions.api.setRowData([]);
    this.bookmonOptions.api.setRowData([]);
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.portfolioOptions.api.showLoadingOverlay();
    this.bookmonOptions.api.showLoadingOverlay();

    if (this.selectedDate.startDate == null) {
      this.selectedDate = {
        startDate: moment(this.journalDate, 'YYYY-MM-DD'),
        endDate: moment(this.endDate, 'YYYY-MM-DD')
      };
      this.getReport(this.journalDate, 'ALL');
    } else {
      const startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
      this.getReport(startDate, 'ALL');
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

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}
