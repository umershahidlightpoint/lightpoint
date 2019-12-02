import { Component, OnInit } from '@angular/core';
import { FinanceServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
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

  bottomOptions = { alignedGrids: [] };
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  accountSearch = { id: undefined };
  symbol: string;
  sortColum: string;
  sortDirection: string;
  valueFilter: number;
  pageSize: number;
  page: number;

  style = Style;

  styleForHeight = HeightStyle(180);

  /*
  We can define how we need to show the data here, as this is a log file we should group by the rundate
  */
  columnDefs: Array<ColDef | ColGroupDef> = [
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

  constructor(private financeService: FinanceServiceProxy) {
    this.gridOptions = {
      rowData: [],
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
      suppressHorizontalScroll: true,
      defaultColDef: {
        sortable: true,
        resizable: true
      }
    } as GridOptions;
  }

  ngOnInit() {
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
