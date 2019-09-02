import { Component, TemplateRef, ElementRef, OnInit, Injector, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import {AgGridUtils} from '../../../shared/utils/ag-grid-utils'

@Component({
  selector: 'app-accruals',
  templateUrl: './accruals.component.html',
  styleUrls: ['./accruals.component.css']
})
export class AccrualsComponent implements OnInit {
  private gridOptions: GridOptions;
  private allocationsGridOptions: GridOptions;
  private defaultColDef;
  private rowData: [];
  private allocationsData: [];

  bottomOptions = { alignedGrids: [] };

  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  bottomData: any;
  fund: any;
  
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 180px)',
    boxSizing: 'border-box'
  };

  /*
  We can define how we need to show the data here, as this is a log file we should group by the rundate
  */
  columnDefs = []
  rowSelection = 'single';

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  onRowSelected(event) {
    if ( event.node.selected) {
      this.financeService
      .getAccrualAllocations(event.node.data.AccrualId)
      .subscribe(result => {
        this.allocationAccrualsData = result;

        //this.allocationsData = [];

        const someArray = this.agGridUtils.columizeData(result.data, this.allocationAccrualsData.meta.Columns);
        const cdefs = this.agGridUtils.customizeColumns([], this.allocationAccrualsData.meta.Columns, ["Id", "AllocationId", "EMSOrderId"]);

        this.allocationsGridOptions.api.setColumnDefs(cdefs);

        this.allocationsData = someArray as [];
      });
    }
  }

  constructor(
    private financeService: FinancePocServiceProxy, 
    private agGridUtils: AgGridUtils) 
    {

    this.gridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        //this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
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
      onFirstDataRendered: params => {
        //params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;

  }

  accrualsData: any;
  allocationAccrualsData:any;

  ngOnInit() {
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    // align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    this.financeService
      .getAccruals()
      .subscribe(result => {
        this.accrualsData = result;

        this.rowData = [];

        debugger

        const someArray = this.agGridUtils.columizeData(result.data, this.accrualsData.meta.Columns);
        const cdefs = this.agGridUtils.customizeColumns([], this.accrualsData.meta.Columns, []);

        this.gridOptions.api.setColumnDefs(cdefs);

        this.rowData = someArray as [];
    
      });
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}