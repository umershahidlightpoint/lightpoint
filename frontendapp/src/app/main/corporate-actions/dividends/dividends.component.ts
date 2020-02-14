import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from '../../../../services/common/data.service';
import { BehaviorSubject } from 'rxjs';
import {
  Style,
  SideBar,
  ExcelStyle,
  FormatNumber4,
  MoneyFormat,
  CommaSeparatedFormat,
  HeightStyle,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateDividendComponent } from '../create-dividend/create-dividend.component';

@Component({
  selector: 'app-dividends',
  templateUrl: './dividends.component.html',
  styleUrls: ['./dividends.component.scss']
})
export class DividendsComponent implements OnInit, AfterViewInit {

  @ViewChild('dividendModal', { static: false }) dividendModal: CreateDividendComponent;

  pinnedBottomRowData;
  gridOptions: GridOptions;
  dividendDetailsGrid: GridOptions;
  data: any;

  isLoading = false;
  hideGrid: boolean;
  journalDate: any;


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
      // onFilterChanged: this.onFilterChanged.bind(this),
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

  openDividendModal(){
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

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [{
      name: 'Edit',
      action: () => {
        this.openEditModal(params.node.data);
      }
    }];
    const addCustomItems = [];
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
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

