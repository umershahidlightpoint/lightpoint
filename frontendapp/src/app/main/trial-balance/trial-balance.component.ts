/* Core/Libraries Imports */
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentInit
} from '@angular/core';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
/* Services/Components Imports */
import {
  SideBar,
  Ranges,
  Style,
  IgnoreFields,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  DoesExternalFilterPass,
  SetDateRange,
  HeightStyle,
  AutoSizeAllColumns,
  CommonCols,
  CalTotal
} from 'src/shared/utils/Shared';
import { FinanceServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { DataService } from 'src/shared/common/data.service';
import { DataModalComponent } from '../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from '../../../shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ReportModalComponent } from 'src/shared/Component/report-modal/report-modal.component';
import { GetContextMenu, ViewChart } from 'src/shared/utils/ContextMenu';
import { AgGridUtils } from 'src/shared/utils/AgGridUtils';
import { ContextMenu } from 'src/shared/Models/common';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialGridExampleComponent implements OnInit, AfterContentInit {
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;
  @ViewChild('reportModal', { static: false })
  reportModal: ReportModalComponent;
  private rowData: [];
  private columns: Array<any>;

  hideGrid = false;
  gridOptions: GridOptions;
  pinnedBottomRowData;
  totalRecords: number;
  totalDebit: number;
  totalCredit: number;
  fund: any = 'All Funds';
  funds: any;
  DateRangeLabel: any;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  symbol: string;
  startDate: any;
  endDate: any;
  page: number;
  pageSize: number;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: string;
  sortDirection: string;
  tableHeader: string;

  ranges = Ranges;

  ignoreFields = IgnoreFields;

  style = Style;

  styleForHeight = HeightStyle(220);

  excelParams = {
    fileName: 'Trial Balance',
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

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private financeService: FinanceServiceProxy,
    private agGridUtls: AgGridUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
  }

  ngAfterContentInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getTrialBalance();
      }
    });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onCellDoubleClicked: this.openModal.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.expandAll();
        AutoSizeAllColumns(params);
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
    this.gridOptions.sideBar = SideBar(
      GridId.trailBalanceId,
      GridName.trailBalance,
      this.gridOptions
    );
  }

  openModal(row) {
    if (row.colDef.headerName === 'Group') {
      return;
    }
    // We can drive the screen that we wish to display from here
    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  customizeColumns(columns: any) {
    const colDefs = CommonCols(false);

    // Now need to go thru this list and group the right fields
    colDefs.forEach(col => {
      if (col.field === 'AccountCategory') {
        col.rowGroup = true;
      }
      if (col.field === 'accountName') {
        col.rowGroup = true;
      }
    });

    const cdefs = this.agGridUtls.customizeColumns(
      colDefs,
      columns,
      this.ignoreFields,
      false
    );
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addCustomItems: Array<ContextMenu> = [
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
    return GetContextMenu(true, null, false, addCustomItems, params);
  }

  getTrialBalance() {
    this.symbol = 'ALL';
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
      this.funds = localfunds;
      this.cdRef.detectChanges();
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
        for (const item in result.payload) {
          const someObject = {};
          // tslint:disable-next-line: forin
          for (const i in this.columns) {
            const field = this.columns[i].field;
            if (this.columns[i].Type == 'System.DateTime') {
              someObject[field] = moment(result.payload[item][field]).format(
                'MM-DD-YYYY'
              );
            } else {
              someObject[field] = result.payload[item][field];
            }
          }
          someArray.push(someObject);
        }
        this.customizeColumns(this.columns);
        this.rowData = someArray as [];
        this.gridOptions.api.setRowData(this.rowData);
        const fieldsSum: Array<{ name: string; total: number }> = CalTotal(
          this.rowData,
          [
            { name: 'Commission', total: 0 },
            { name: 'Fees', total: 0 },
            { name: 'TradePrice', total: 0 },
            { name: 'NetPrice', total: 0 },
            { name: 'SettleNetPrice', total: 0 },
            { name: 'NetMoney', total: 0 },
            { name: 'LocalNetNotional', total: 0 },
            { name: 'value', total: 0 },
            { name: 'start_price', total: 0 },
            { name: 'end_price', total: 0 },
            { name: 'fxrate', total: 0 }
          ]
        );

        this.pinnedBottomRowData = [
          {
            source: 'Total Records:' + this.totalRecords,
            AccountType: '',
            accountName: '',
            when: '',
            debit: Math.abs(this.totalDebit),
            credit: Math.abs(this.totalCredit),
            balance: Math.abs(this.totalDebit) - Math.abs(this.totalCredit),
            Commission: fieldsSum[0].total,
            Fees: fieldsSum[1].total,
            TradePrice: fieldsSum[2].total,
            NetPrice: fieldsSum[3].total,
            SettleNetPrice: fieldsSum[4].total,
            NetMoney: fieldsSum[5].total,
            LocalNetNotional: fieldsSum[6].total,
            value: fieldsSum[7].total,
            start_price: fieldsSum[8].total,
            end_price: fieldsSum[9].total,
            fxrate: fieldsSum[10].total
          }
        ];
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        this.gridOptions.api.expandAll();

        AutoSizeAllColumns(this.gridOptions);
      });
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      dateFilter:
        this.DateRangeLabel !== ''
          ? this.DateRangeLabel
          : {
              startDate:
                this.startDate !== null
                  ? this.startDate.format('YYYY-MM-DD')
                  : '',
              endDate:
                this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
            }
    };
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getRangeLabel();
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== null ? fundFilter : this.fund;
    this.setDateRange(dateFilter);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent(): boolean {
    if (this.fund !== 'All Funds' || this.startDate) {
      return true;
    }
  }

  doesExternalFilterPass(node: any): boolean {
    return DoesExternalFilterPass(
      node,
      this.fund,
      moment(this.startDate),
      moment(this.endDate)
    );
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== ''
        ? { startDate: this.startDate, endDate: this.endDate }
        : null;
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = 'All Funds';
    this.DateRangeLabel = '';
    this.selected = null;
    this.startDate = '';
    this.endDate = '';
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.api.onFilterChanged();
  }

  openChartModal(data) {
    this.reportModal.openModal(data);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.clearFilters();
    this.getTrialBalance();
  }
}
