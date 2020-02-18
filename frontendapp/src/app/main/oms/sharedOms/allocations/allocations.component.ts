import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataService } from 'src/services/common/data.service';
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { AgGridUtils } from '../../../../../shared/utils/AgGridUtils';
import { SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';

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
      // onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      enableFilter: true,
      animateRows: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      alignedGrids: [],
      onGridReady: () => {
        // this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      getExternalFilterState: () => {
        return {};
      }
    } as GridOptions;
    this.allocationsGridOptions.sideBar = SideBar(
      GridId.allocationsId,
      GridName.allocations,
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
