import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { AgGridUtils } from '../../../shared/utils/ag-grid-utils';
import { DataModalComponent } from '../../../shared/Component/data-modal/data-modal.component';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { AllocationGridLayoutMenuComponent } from 'src/shared/Component/selection-grid-layout-menu/grid-layout-menu.component';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, Style, AutoSizeAllColumns } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-accruals',
  templateUrl: './accruals.component.html',
  styleUrls: ['./accruals.component.css']
})
export class AccrualsComponent implements OnInit, AfterViewInit {
  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @ViewChild('dataModal') dataModal: DataModalComponent;

  public gridOptions: GridOptions;
  public allocationsGridOptions: GridOptions;
  private defaultColDef;
  public rowData: [];
  public allocationsData: [];

  bottomOptions = { alignedGrids: [] };
  bottomData: any;
  fund: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;
  orderId: number;
  columnDefs = [];
  title = '';
  accrualsData: any;
  hideGrid: boolean;
  allocationAccrualsData: any;

  style = Style;

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 156px)',
    boxSizing: 'border-box'
  };

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private agGridUtils: AgGridUtils
  ) {
    this.initGrid();
    this.hideGrid = false;
  }

  splitColId(colId: any) {
    const modifiedColId = colId.split('_');
    return modifiedColId[0];
  }

  openModal(row) {
    // We can drive the screen that we wish to display from here
    if (row.colDef.headerName === 'Group') {
      return;
    }
    const cols = this.gridOptions.columnApi.getColumnState();
    const modifiedCols = cols.map(i => ({ colId: this.splitColId(i.colId), hide: i.hide }));
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
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAccruals();
      }
    });
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.accrualsId, gridName: GridName.accruals });

    this.dataService.changeAllocation(this.allocationsGridOptions);
    this.dataService.changeAllocationGrid({
      gridId: GridId.selectedAccrualsId,
      gridName: GridName.selectedAccruals
    });
  }

  ngOnInit() {
    this.getAccruals();
  }

  getAccruals() {
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    // Align Scroll of Grid and Footer Grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';
    this.financeService.getAccruals().subscribe(result => {
      this.accrualsData = result;
      this.rowData = [];
      const someArray = this.agGridUtils.columizeData(result.data, this.accrualsData.meta.Columns);
      const cdefs = this.agGridUtils.customizeColumns([], this.accrualsData.meta.Columns, []);
      this.gridOptions.api.setColumnDefs(cdefs);
      this.rowData = someArray as [];
    });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      sideBar: SideBar,
      columnDefs: this.columnDefs,
      onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onGridReady: params => {
        AutoSizeAllColumns(params);
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'always',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true
    } as GridOptions;

    this.allocationsGridOptions = {
      rowData: null,
      sideBar: SideBar,
      columnDefs: this.columnDefs,
      onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: AllocationGridLayoutMenuComponent },
      onGridReady: params => {
        AutoSizeAllColumns(params);
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'always',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true
    } as GridOptions;
  }

  onRowSelected(event) {
    if (event.node.selected) {
      this.financeService.getAccrualAllocations(event.node.data.AccrualId).subscribe(result => {
        this.allocationAccrualsData = result;
        const someArray = this.agGridUtils.columizeData(
          result.data,
          this.allocationAccrualsData.meta.Columns
        );
        const cdefs = this.agGridUtils.customizeColumns(
          [],
          this.allocationAccrualsData.meta.Columns,
          ['Id', 'AllocationId', 'EMSOrderId']
        );
        this.allocationsGridOptions.api.setColumnDefs(cdefs);
        this.allocationsData = someArray as [];
      });
    }
  }

  isExternalFilterPresent() {}
}
