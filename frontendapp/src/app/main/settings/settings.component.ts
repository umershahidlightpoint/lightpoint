import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { AgGridUtils } from '../../../shared/utils/ag-grid-utils';
import { Style, HeightStyle } from '../../../shared/utils/Shared';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  reportingCurrency = 'USD';
  reportingDate = '';

  private gridOptions: GridOptions;
  private allocationsGridOptions: GridOptions;
  bottomOptions = { alignedGrids: [] };
  bottomData: any;
  fund: any;
  accrualsData: any;
  allocationAccrualsData: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;
  columnDefs = [];
  rowSelection = 'single';

  style = Style;

  styleForHight = HeightStyle(180);

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
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
      });
    }
  }

  constructor(private financeService: FinancePocServiceProxy, private agGridUtils: AgGridUtils) {
    this.gridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        //this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: () => {
        //params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;

    this.allocationsGridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        //this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: () => {
        //params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;
  }

  ngOnInit() {
    // align scroll of grid and footer grid
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
      const someArray = this.agGridUtils.columizeData(result.data, this.accrualsData.meta.Columns);
      const cdefs = this.agGridUtils.customizeColumns([], this.accrualsData.meta.Columns, []);

      this.gridOptions.api.setColumnDefs(cdefs);
    });
  }
}
