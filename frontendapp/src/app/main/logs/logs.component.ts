import { Component, OnInit } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { Style, HeightStyle } from 'src/shared/utils/Shared';
import * as moment from 'moment';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  public gridOptions: GridOptions;
  public rowData: [];
  private defaultColDef;

  bottomOptions = { alignedGrids: [] };
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  symbol: string;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  page: any;

  style = Style;

  styleForHeight = HeightStyle(180);

  /*
  We can define how we need to show the data here, as this is a log file we should group by the rundate
  */
  columnDefs = [
    {
      field: 'rundate',
      headerName: 'Run Date',
      sortable: true,
      filter: true,
      enableRowGroup: true,
      width: 25
    },
    {
      field: 'action_on',
      headerName: 'Action On',
      sortable: true,
      filter: true,
      width: 25
    },
    { field: 'action', headerName: 'Action', sortable: true, filter: true }
  ];

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(private financeService: FinancePocServiceProxy) {
    this.gridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true
    } as GridOptions;
  }

  ngOnInit() {
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    // align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);
    this.symbol = 'ALL';
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    this.financeService
      .getJournalLogs(
        this.symbol,
        this.page,
        this.pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(result => {
        this.rowData = [];

        this.rowData = result.payload.map(item => ({
          rundate: moment(item.rundate).format('MMM-DD-YYYY'),
          action_on: moment(item.action_on).format('MMM-DD-YYYY hh:mm:ss'),
          action: item.action
        }));
      });
  }
}
