import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridUtils } from '../../../../../shared/utils/AgGridUtils';
import { DataModalComponent } from '../../../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { DataService } from 'src/services/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { PostingEngineService } from 'src/services/common/posting-engine.service';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { PostingEngineApiService } from 'src/services/posting-engine-api.service';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss']
})
export class TradesComponent implements OnInit, AfterViewInit {
  @ViewChild('dataModal', { static: false }) dataModal: DataModalComponent;
  @Output() titleEmitter = new EventEmitter<string>();
  @Input() tradeType = '';

  gridOptions: GridOptions;
  rowData: [];

  bottomOptions = { alignedGrids: [] };
  pageSize: number;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: string;
  sortDirection: string;
  page: number;
  columnDefs: Array<ColDef | ColGroupDef>;
  tradesData: any;
  hideGrid: boolean;
  title = '';
  orderId: number;
  filterBySymbol = '';

  // Process Trade state
  key: string;

  style = Style;

  styleForHeight = HeightStyle(550);

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(
    private financeService: FinanceServiceProxy,
    private postingEngineService: PostingEngineService,
    private postingEngineApiService: PostingEngineApiService,
    private dataService: DataService,
    private agGridUtils: AgGridUtils
  ) {
    this.initGrid();
    this.hideGrid = false;
  }

  ngOnInit() {
    // this.getTrades();
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getTrades();
      }
    });
  }

  splitColId(colId: any) {
    const modifiedColId = colId.split('_');
    return modifiedColId[0];
  }

  openModal = row => {
    // We can drive the screen that we wish to display from here
    if (row.colDef.headerName === 'Group') {
      return;
    }
    const cols = this.gridOptions.columnApi.getColumnState();
    const modifiedCols = cols.map(i => ({
      colId: this.splitColId(i.colId),
      hide: i.hide
    }));
    if (row.colDef.headerName === 'LPOrderId') {
      this.title = 'Allocation Details';
      this.dataModal.openModal(row, modifiedCols);
      return;
    }

    if (row.colDef.headerName === 'AccrualId') {
      this.title = 'Accrual Details';
      this.dataModal.openModal(row, modifiedCols);
      return;
    }
  };

  getTrades() {
    // align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    if (this.tradeType === 'trade') {
      this.financeService.getTrades().subscribe(result => {
        this.tradesData = result;
        this.rowData = [];
        const someArray = this.agGridUtils.columizeData(result.data, this.tradesData.meta.Columns);
        const cdefs = this.agGridUtils.customizeColumns(
          [],
          this.tradesData.meta.Columns,
          [],
          false
        );
        this.gridOptions.api.setColumnDefs(cdefs);
        this.rowData = someArray as [];
      });
    } else if (this.tradeType === 'opsblotter') {
      this.financeService.getOpsBlotterJournals().subscribe(result => {
        this.tradesData = result;
        this.rowData = [];
        const someArray = this.agGridUtils.columizeData(result.data, this.tradesData.meta.Columns);
        const cdefs = this.agGridUtils.customizeColumns(
          [],
          this.tradesData.meta.Columns,
          [],
          false
        );
        this.gridOptions.api.setColumnDefs(cdefs);
        this.rowData = someArray as [];
      });
    }
  }

  processOrder(orderId: string, row: any) {
    this.postingEngineApiService.startPostingEngineSingleOrder(orderId).subscribe(response => {
      if (response.IsRunning) {
        // this.isLoading = true;
        this.key = response.key;
        this.postingEngineService.changeStatus(true);
        this.postingEngineService.checkProgress();
      }
      // this.key = response.key;
      // this.getLogs();
    });
  }
  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'Process',
        action: () => {
          this.processOrder(params.node.data.LPOrderId, params.node);
        }
      }
    ];
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      onGridReady: params => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        // params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'always',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(GridId.tradeId, GridName.trade, this.gridOptions);
  }

  onRowSelected(event) {
    if (event.node.selected) {
      this.dataService.onRowSelectionTrade(event.node.data.LPOrderId);
    }
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

  isExternalFilterPassed(object) {
    const { symbolFilter } = object;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (this.filterBySymbol !== '') {
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

  getExternalFilterState() {
    return {
      symbolFilter: this.filterBySymbol,
    };
  }
}
