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
import { ToastrService } from 'ngx-toastr';
import { UtilsConfig } from 'src/shared/Models/utils-config';

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
  totalGridRows: number;

  styleForHeight = HeightStyle(224);

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: false
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe
  ) {}

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
    const colDefs = [
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      },
      {
        headerName: 'Business Date',
        field: 'businessDate',
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Portfolio*',
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
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', ...this.funds]
        }
      },
      {
        headerName: 'Trade P/L',
        field: 'tradePL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.tradingMTDPnL, false)
      },
      {
        headerName: 'Day',
        field: 'day',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.calcTradingMTDPnL, false)
      },
      {
        headerName: 'Daily % Return',
        field: 'dailyPercent',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.tradingYTDPnL, false)
      },
      {
        headerName: 'Long P/L',
        field: 'mtdFinPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.mtdFinPnL, true)
      },
      {
        headerName: 'Long % Change',
        field: 'ytdFinPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Short P/L',
        field: 'mtdIPOPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.mtdIPOPnL, true)
      },
      {
        headerName: 'Short % Change',
        field: 'ytdIPOPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.ytdIPOPnL, true)
      },
      {
        headerName: 'Long Exposure',
        field: 'mtdTotalPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.mtdTotalPnL, true)
      },
      {
        headerName: 'Short Exposure',
        field: 'calcMTDTotal',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.calcMTDTotal, true)
      },
      {
        headerName: 'Gross Exposure',
        field: 'ytdTotalPnL',
        editable: true,
        valueFormatter: params => this.numberFormatter(params.node.data.ytdTotalPnL, true)
      },
      {
        headerName: 'Net Exposure',
        field: 'createdBy',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: '6md Beta Net Exposure',
        field: 'lastUpdatedBy ',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: '2Yw Beta Net Exposure',
        field: 'createdDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: '6md Beta Short Exposure',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Nav Market',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Dividend USD',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Comm USD',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Fee/Taxes USD',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Financing USD',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'Other USD',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'P/L %',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'MTD % Return',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'QTD % Return',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'YTD % Return',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'ITD % Return',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'MTD PnL',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'QTD PnL',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'YTD PnL',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      },
      {
        headerName: 'ITD PnL',
        field: 'lastUpdatedDate',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdFinPnL, true)
      }
    ];
    colDefs.forEach(colDef => {
      if (
        !(
          colDef.field === 'modified' ||
          colDef.field === 'businessDate' ||
          colDef.field === 'portfolio' ||
          colDef.field === 'fund'
        )
      ) {
        colDef['type'] = 'numericColumn';
        colDef['cellStyle'] = TextAlignRight;
      }
    });
    return colDefs;
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

  uploadDailyUnofficialPnl() {
    let rowNodeId = 1;
    this.financeService.uploadDailyUnofficialPnl(this.fileToUpload).subscribe(response => {
      console.log('Response', response);

      if (response.isSuccessful) {
        // const modifiedData = response.payload.map(data => {
        //   return { ...data, RowId: rowNodeId++, Estimated: true };
        // });
        // this.totalGridRows = rowNodeId;
        // // this.dailyPnLData = this.formatPerformanceData(modifiedData);
        // this.dailyPnlGrid.api.setRowData(this.dailyPnLData);
        // AutoSizeAllColumns(this.dailyPnlGrid);
        // this.disableCommit = false;
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  changeDate(date) {
    const { startDate } = date;
  }

  refreshGrid() {
    this.dailyPnlGrid.api.showLoadingOverlay();
    this.getDailyPnL();
  }

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
}
