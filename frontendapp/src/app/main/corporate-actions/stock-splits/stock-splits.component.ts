
import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SideBar,
  SetDateRange,
  ExcelStyle,
  FormatNumber4,
  MoneyFormat,
  CommaSeparatedFormat,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateStockSplitsComponent } from 'src/shared/Modal/create-stock-splits/create-stock-splits.component';
import * as moment from 'moment';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';

@Component({
  selector: 'app-stock-splits',
  templateUrl: './stock-splits.component.html',
  styleUrls: ['./stock-splits.component.scss']
})
export class StockSplitsComponent implements OnInit {

  @ViewChild('stockSplitsModal', { static: false }) stockSplitsModal: CreateStockSplitsComponent;
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;

  pinnedBottomRowData;
  gridOptions: GridOptions;
  stockSplitDetailsGrid: GridOptions;
  data: any;

  isLoading = false;
  hideGrid: boolean;
  journalDate: any;
  title: string;

  filterBySymbol = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  createDividend = false;

  stockSplitScreenRatio: {
    stockSplitSize: number;
    detailsSize: number;
    stockSplitView: boolean;
    detailsView: boolean;
    useTransition: boolean;
  } = {
    stockSplitSize: 50,
    detailsSize: 50,
    stockSplitView: true,
    detailsView: false,
    useTransition: true
  };

  constructor(
    private corporateActionsApiService: CorporateActionsApiService
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getStockSplits();
    this.getStockSplitDetails();
  }

  getStockSplits() {
    this.corporateActionsApiService.getStockSplits().subscribe(response => {
      this.data = response.payload.map(obj => ({ ...obj, ratio:   obj.top_ratio + '' + '/' + obj.bottom_ratio }));
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.api.setRowData(this.data);
      this.gridOptions.api.expandAll();
    });
  }

  getStockSplitDetails() {
    this.corporateActionsApiService.getStockSplitDetails().subscribe(response => {
      let stockSplitDetail = response.payload;
      this.stockSplitDetailsGrid.api.setRowData(stockSplitDetail);
      this.stockSplitDetailsGrid.api.sizeColumnsToFit();
      this.stockSplitDetailsGrid.api.expandAll();
    });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
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
          field: 'top_ratio',
          headerName: 'Top Ratio',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          hide: true
        },
        {
          field: 'bottom_ratio',
          headerName: 'Bottom Ratio',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          hide: true,
          valueFormatter: moneyFormatter
        },
        {
          field: 'ratio',
          headerName: 'Ratio',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
        },
        {
          field: 'adjustment_factor',
          headerName: 'Adjustment Factor',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
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


    this.stockSplitDetailsGrid = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.stockSplitDetailsGrid.excelStyles = ExcelStyle;
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
          headerName: 'Portfolio',
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
          field: 'pre_split_quantity',
          width: 120,
          headerName: 'Pre-Split-Quantity',
          sortable: true,
          filter: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'post_split_quantity',
          headerName: 'Post-Split-Quantity',
          sortable: true,
          filter: true,
          width: 100,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'cost_basis_pre_split',
          headerName: 'Cost Basis(Pre-Split)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'cost_basis_post_split',
          headerName: 'Cost Basis(Post-Split)',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'pre_split_investment_at_cost',
          headerName: 'Pre-Split Investment at cost',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          aggFunc: 'sum'
        },
        {
          field: 'post_split_investment_at_cost',
          headerName: 'Post-Spli Investment at Cost',
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
    } as GridOptions;


    this.gridOptions.sideBar = SideBar(
      GridId.stockSplitsId,
      GridName.stockSplits,
      this.gridOptions
    );
  }

  openEditModal(data) {
    this.stockSplitsModal.openModal(data);
  }

  openStockSplitModal() {
    this.stockSplitsModal.openModal(null);
  }

  closeStockSplitModal() {
    this.getStockSplits();
    this.getStockSplitDetails();
  }

  rowSelected(row) {
    const { id } = row.data;
    let node;
    this.stockSplitDetailsGrid.api.forEachLeafNode((rowNode) => {
      if (rowNode.data.id === id) {
        rowNode.setSelected(true);
        node = rowNode;
      } else {
        rowNode.setSelected(false);
      }
    });
    if (node) {
      this.stockSplitDetailsGrid.api.ensureIndexVisible(node.rowIndex);
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
    this.stockSplitDetailsGrid.api.showLoadingOverlay();
    this.getStockSplits();
    this.getStockSplitDetails();
    this.stockSplitScreenRatio.detailsView = false;
  }

  clearFilters() {
    this.selected = null;
    this.filterBySymbol = '';
    this.stockSplitScreenRatio.detailsView = false;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.gridOptions.api.setRowData([]);
    this.stockSplitDetailsGrid.api.setRowData([]);
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
    this.corporateActionsApiService.getStockSplitAudit(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Stock Split Audit Trail';
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
        field: 'top_ratio',
        headerName: 'Top Ratio',
        width: 100,
        filter: true,
        sortable: true,
      },
      {
        field: 'bottom_ratio',
        headerName: 'Bottom Ratio',
        width: 100,
        filter: true,
        sortable: true,
      },
      {
        field: 'adjustment_factor',
        headerName: 'Adjustment Factor',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
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

