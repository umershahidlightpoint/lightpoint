import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from '../../../../services/common/data.service';
import { BehaviorSubject } from 'rxjs';
import {
  Style,
  SideBar,
  SetDateRange,
  ExcelStyle,
  FormatNumber4,
  MoneyFormat,
  CommaSeparatedFormat,
  HeightStyle,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateDividendComponent } from '../create-dividend/create-dividend.component';
import * as moment from 'moment';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';

@Component({
  selector: 'app-dividends',
  templateUrl: './dividends.component.html',
  styleUrls: ['./dividends.component.scss']
})
export class DividendsComponent implements OnInit, AfterViewInit {

  @ViewChild('dividendModal', { static: false }) dividendModal: CreateDividendComponent;
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;

  pinnedBottomRowData;
  gridOptions: GridOptions;
  dividendDetailsGrid: GridOptions;
  data: any;

  isLoading = false;
  hideGrid: boolean;
  journalDate: any;
  title: string;

  filterBySymbol = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;

  style = Style;
  styleForHeight = HeightStyle(220);

  constructor(
    private dataService: DataService,
    private corporateActionsApiService: CorporateActionsApiService
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getDividends();
    this.getDividendDetails();
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      // onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      onCellClicked: this.rowSelected.bind(this),
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
          field: 'id',
          width: 120,
          headerName: 'Id',
          sortable: true,
          filter: true,
          hide: true
        },
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
          field: 'notice_date',
          headerName: 'Notice Date',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: dateFormatter
        },
        {
          field: 'execution_date',
          headerName: 'Execution Date',
          sortable: true,
          filter: true,
          width: 100,
          valueFormatter: dateFormatter
        },
        {
          field: 'record_date',
          headerName: 'Record Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'pay_date',
          headerName: 'Pay Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'rate',
          headerName: 'Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'currency',
          headerName: 'Currency',
          width: 100,
          filter: true,
          sortable: true,
        },
        {
          field: 'withholding_rate',
          headerName: 'Holding Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'fx_rate',
          headerName: 'Fx Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
        },
        {
          field: 'active_flag',
          headerName: 'Active Flag',
          width: 100,
          filter: true,
          sortable: true,
          hide: true
        }

      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;


    this.dividendDetailsGrid = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      // onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
      // onFilterChanged: this.onFilterChanged.bind(this),
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.dividendDetailsGrid.excelStyles = ExcelStyle;
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
          field: 'id',
          width: 120,
          headerName: 'Id',
          sortable: true,
          filter: true,
          hide: true
        },
        {
          field: 'fund',
          headerName: 'Fund',
          width: 100,
          rowGroup: true,
          enableRowGroup: true,
          filter: true,
          sortable: true,
        },
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
          field: 'quantity',
          width: 120,
          headerName: 'Quantity',
          sortable: true,
          filter: true,
          valueFormatter: moneyFormatter
        },
        {
          field: 'execution_date',
          headerName: 'Execution Date',
          sortable: true,
          sort: 'asc',
          filter: true,
          width: 100,
          valueFormatter: dateFormatter
        },
        {
          field: 'fx_rate',
          headerName: 'Fx Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'currency',
          headerName: 'Currency',
          width: 100,
          filter: true,
          sortable: true,
        },
        {
          field: 'base_gross_dividend',
          headerName: 'Base Gross Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'base_withholding_amount',
          headerName: 'Base Withholding Amount',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'base_net_dividend',
          headerName: 'Base Net Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'settlement_gross_dividend',
          headerName: 'Settlement Gross Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'settlement_withholdings_amount',
          headerName: 'Settlement Withholding Amount',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'settlement_local_net_dividend',
          headerName: 'Settlement Local Net Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'active_flag',
          headerName: 'Active Flag',
          width: 100,
          filter: true,
          sortable: true,
          hide: true
        }

      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;


    this.gridOptions.sideBar = SideBar(
      GridId.dividendsId,
      GridName.dividends,
      this.gridOptions
    );
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        // this.getFunds();
      }
    });
  }

  getDividends() {
    this.corporateActionsApiService.getDividends().subscribe(response => {
      this.data = response.payload;
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.api.setRowData(this.data);

    });
  }

  getDividendDetails() {
    this.corporateActionsApiService.getDividendDetails().subscribe(response => {
      this.data = response.payload;
      this.dividendDetailsGrid.api.sizeColumnsToFit();
      this.dividendDetailsGrid.api.setRowData(this.data);
    });
  }

  openEditModal(data) {
    this.dividendModal.openModal(data);
  }

  openDividendModal() {
    this.dividendModal.openModal(null);
  }

  closeDividendModal() {
    this.getDividends();
    this.getDividendDetails();
  }

  rowSelected(row) {
    const { id } = row.data;
    let node;
    this.dividendDetailsGrid.api.forEachLeafNode((rowNode) => {
      if (rowNode.data.id === id) {
        rowNode.setSelected(true);
        node = rowNode;
      } else {
        rowNode.setSelected(false);
      } 
    });
    if(node){
      this.dividendDetailsGrid.api.ensureIndexVisible(node.rowIndex);
    }
  }

  /////////// External Filters Code //////////////

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  onFilterChanged() {
    // this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeDates(e) {
    if (!this.selected.startDate) {
      return;
    }
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPassed(object) {
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);
    this.gridOptions.api.onFilterChanged();
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  isExternalFilterPresent() {
    if ( this.filterBySymbol !== '' || this.startDate) {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {

    if (this.filterBySymbol !== '' && this.startDate) {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      const cellDate = new Date(node.data.execution_date);
      return (
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }

    if (this.startDate !== '') {
      const cellDate = new Date(node.data.execution_date);
      return (
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
        );
    }

    return true;
  }

  getExternalFilterState() {
    return {
      symbolFilter: this.filterBySymbol,
      dateFilter: {
        startDate: this.startDate !== undefined ? this.startDate : '',
        endDate: this.endDate !== undefined ? this.endDate : ''
      }
    };
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.getDividends();
  }

  clearFilters() {
    this.selected = null;
    this.filterBySymbol = '';
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.gridOptions.api.setRowData([]);
  }

/////////// End External Filters Code //////////////

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [{
      name: 'Edit',
      action: () => {
        this.openEditModal(params.node.data);
      }
    },
    {
      name: 'Audit Trail',
      action: () => {
        this.openDataGridModal(params);
      }
    }];
    const addCustomItems = [];
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.corporateActionsApiService.getDividendDetail(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Dividend Detail';
      this.dataGridModal.openModal(modifiedCols, payload);
    });
  }

  getAuditColDefs(): Array<ColDef | ColGroupDef> {

    return [
      {
        field: 'id',
        width: 120,
        headerName: 'Id',
        sortable: true,
        filter: true,
        hide: true
      },
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
        field: 'notice_date',
        headerName: 'Notice Date',
        sortable: true,
        filter: true,
        width: 120
      },
      {
        field: 'execution_date',
        headerName: 'Execution Date',
        sortable: true,
        filter: true,
        width: 100
      },
      {
        field: 'record_date',
        headerName: 'Record Date',
        width: 100,
        filter: true,
        sortable: true,
      },
      {
        field: 'pay_date',
        headerName: 'Pay Date',
        width: 100,
        filter: true,
        sortable: true,
      },
      {
        field: 'rate',
        headerName: 'Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'currency',
        headerName: 'Currency',
        width: 100,
        filter: true,
        sortable: true,
      },
      {
        field: 'withholding_rate',
        headerName: 'Holding Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'fx_rate',
        headerName: 'Fx Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter,
      },
      {
        field: 'active_flag',
        headerName: 'Active Flag',
        width: 100,
        filter: true,
        sortable: true,
        hide: true
      }

    ];
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

