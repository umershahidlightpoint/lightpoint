import { Component, OnInit } from '@angular/core';
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  TextAlignRight,
  PercentageFormatter
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DecimalPipe } from '@angular/common';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-daily-pnl',
  templateUrl: './daily-pnl.component.html',
  styleUrls: ['./daily-pnl.component.css']
})
export class DailyPnlComponent implements OnInit {
  dailyPnlGrid: GridOptions;
  selectedDate = null;
  dailyPnLData: Array<object>;
  funds: Array<string>;
  fileToUpload: File = null;

  styleForHeight = HeightStyle(224);

  constructor(private financeService: FinancePocServiceProxy, public decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.getFunds();
    this.getDailyPnL();
    this.initGrid();
  }

  getFunds() {
    this.financeService.getFunds().subscribe(response => {
      this.funds = response.payload.map(item => item.FundCode);
      this.initCols();
    });
  }

  getDailyPnL() {
    this.financeService.getMonthlyPerformance().subscribe(response => {
      this.dailyPnLData = response.data;
    });
  }

  initGrid() {
    this.dailyPnlGrid = {
      columnDefs: this.getColDefs(),
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableCellChangeFlash: true,
      animateRows: true,
      deltaRowDataMode: true,
      getRowNodeId: data => {
        return data.rowId;
      },
      onGridReady: params => {},
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {},
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.dailyPnlGrid.sideBar = SideBar(GridId.dailyPnlId, GridName.dailyPnl, this.dailyPnlGrid);
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.dailyPnlGrid.api.setColumnDefs(colDefs);
    this.dailyPnlGrid.api.sizeColumnsToFit();
  }

  getColDefs() {
    return [
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      },
      {
        headerName: 'Business Date',
        field: 'businessDate',
        sortable: true,
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Portfolio Group*',
        field: 'portfolio',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', 'PORTFOLIO A', 'ASIA_FOCUS']
        }
      },
      {
        headerName: 'Fund*',
        field: 'fund',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', ...this.funds]
        }
      },
      {
        headerName: 'Trading MTD PnL',
        field: 'tradingMTDPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.tradingMTDPnL, false)
      },
      {
        headerName: 'Calc Trading MTD PnL',
        field: 'calcTradingMTDPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.calcTradingMTDPnL, false)
      },
      {
        headerName: 'Trading YTD PnL',
        field: 'tradingYTDPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.tradingYTDPnL, false)
      },
      {
        headerName: 'MTD Fin PnL',
        field: 'mtdFinPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.mtdFinPnL, true)
      },
      {
        headerName: 'YTD Fin PnL',
        field: 'ytdFinPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'MTD IPO PnL',
        field: 'mtdIPOPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.mtdIPOPnL, true)
      },
      {
        headerName: 'YTD IPO PnL',
        field: 'ytdIPOPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdIPOPnL, true)
      },
      {
        headerName: 'MTD Total PnL',
        field: 'mtdTotalPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.mtdTotalPnL, true)
      },
      {
        headerName: 'Calc MTD Total',
        field: 'calcMTDTotal',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.calcMTDTotal, true)
      },
      {
        headerName: 'YTD Total PnL',
        field: 'ytdTotalPnL',
        sortable: true,
        editable: true,
        cellStyle: TextAlignRight,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdTotalPnL, true)
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        hide: true
      },
      {
        headerName: 'Last Updated By ',
        field: 'lastUpdatedBy ',
        hide: true
      },
      {
        headerName: 'Created Date',
        field: 'createdDate',
        hide: true
      },
      {
        headerName: 'Last Updated Date',
        field: 'lastUpdatedDate',
        hide: true
      }
    ];
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      // {
      //   name: 'Add Row',
      //   action: () => {
      //   }
      // },
      // {
      //   name: 'Delete Row',
      //   action: () => {
      //   }
      // },
      // {
      //   name: 'View Audit Trail',
      //   action: () => {
      //   }
      // }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  changeDate(date) {
    const { startDate } = date;
  }

  doRefresh() {}

  numberFormatter(numberToFormat, isInPercentage) {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }

  onFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDailyUnofficialPnl() {}
}
