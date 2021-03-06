import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { AgGridUtils } from '../../../../../shared/utils/AgGridUtils';
import { DataService } from 'src/services/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit, AfterViewInit {
  public allocationsGridOptions: GridOptions;
  public allocationsData: [];
  allocationTradesData: any;
  columnDefs = [];

  constructor(
    private financeService: FinanceServiceProxy,
    private dataService: DataService,
    private agGridUtils: AgGridUtils
  ) {
    this.initGrid();
  }

  ngOnInit() {
    this.dataService.allocationId.subscribe(data => {
      if (data != null) {
        this.getTradeAllocations(data);
      }
    });
  }

  ngAfterViewInit(): void {}

  // openModal = row => {
  //   // We can drive the screen that we wish to display from here
  //   if (row.colDef.headerName === 'Group') {
  //     return;
  //   }
  //   const cols = this.gridOptions.columnApi.getColumnState();
  //   const modifiedCols = cols.map(i => ({ colId: this.splitColId(i.colId), hide: i.hide }));
  //   if (row.colDef.headerName === 'LPOrderId') {
  //     this.title = 'Allocation Details';
  //     this.dataModal.openModal(row, modifiedCols);
  //     return;
  //   }

  //   if (row.colDef.headerName === 'AccrualId') {
  //     this.title = 'Accrual Details';
  //     this.dataModal.openModal(row, modifiedCols);
  //     return;
  //   }
  // };

  initGrid() {
    this.allocationsGridOptions = {
      rowData: [],
      columnDefs: this.columnDefs,
      //onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onGridReady: () => {
        // this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      getExternalFilterState: () => {
        return {};
      },
      suppressColumnVirtualisation: true,
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;
    this.allocationsGridOptions.sideBar = SideBar(
      GridId.accrualsId,
      GridName.accruals,
      this.allocationsGridOptions
    );
  }

  getTradeAllocations(lpOrderId) {
    this.financeService.getTradeAllocations(lpOrderId).subscribe(result => {
      this.allocationTradesData = result;
      const someArray = this.agGridUtils.columizeData(
        result.data,
        this.allocationTradesData.meta.Columns
      );
      const cdefs = this.agGridUtils.customizeColumns(
        [],
        this.allocationTradesData.meta.Columns,
        ['Id', 'AllocationId', 'EMSOrderId'],
        false
      );
      this.allocationsGridOptions.api.setColumnDefs(cdefs);
      this.allocationsData = someArray as [];
    });
  }
}
