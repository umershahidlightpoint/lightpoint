import { Component, OnInit } from '@angular/core';
import { FinanceServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { AgGridUtils } from '../../../shared/utils/AgGridUtils';
import { Style, HeightStyle } from '../../../shared/utils/Shared';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private gridOptions: GridOptions;
  private allocationsGridOptions: GridOptions;

  private currencies = [
    { code: 'USD', description: 'USD' },
    { code: 'JPY', description: 'JPY' }
  ];
  reportingCurrency = this.currencies[0];

  reportingDate = '';

  private methods = [
    { code: 'FIFO', description: 'First In First Out' },
    { code: 'LIFO', description: 'Last In First Out' }
  ];

  methodology: any;

  bottomOptions = { alignedGrids: [] };
  accrualsData: any;
  allocationAccrualsData: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  page: any;
  columnDefs = [];

  style = Style;

  styleForHeight = HeightStyle(180);

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
      this.financeService
        .getAccrualAllocations(event.node.data.AccrualId)
        .subscribe(result => {
          this.allocationAccrualsData = result;
          const someArray = this.agGridUtils.columizeData(
            result.data,
            this.allocationAccrualsData.meta.Columns
          );
          const cdefs = this.agGridUtils.customizeColumns(
            [],
            this.allocationAccrualsData.meta.Columns,
            ['Id', 'AllocationId', 'EMSOrderId'],
            false
          );

          this.allocationsGridOptions.api.setColumnDefs(cdefs);
        });
    }
  }

  constructor(
    private financeService: FinanceServiceProxy,
    private agGridUtils: AgGridUtils
  ) {
    this.gridOptions = {
      rowData: [],
      columnDefs: this.columnDefs,
      onGridReady: () => {
        //this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: () => {
        //params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;

    this.allocationsGridOptions = {
      rowData: [],
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
    this.methodology = this.methods[0];

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
      const someArray = this.agGridUtils.columizeData(
        result.data,
        this.accrualsData.meta.Columns
      );
      const cdefs = this.agGridUtils.customizeColumns(
        [],
        this.accrualsData.meta.Columns,
        [],
        false
      );

      this.gridOptions.api.setColumnDefs(cdefs);
    });
  }
}
