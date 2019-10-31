import { Component, OnInit } from '@angular/core';
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter
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
      // deltaRowDataMode: true,
      // getRowNodeId: data => {
      //   return data.rowId;
      // },
      onGridReady: params => {
        AutoSizeAllColumns(params);
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
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
        field: 'portFolio',
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
        field: 'tradePnL',
        editable: true
      },
      {
        headerName: 'Day',
        field: 'day',
        editable: true
      },
      {
        headerName: 'Daily % Return',
        field: 'dailyPercentageReturn',
        editable: true
      },
      {
        headerName: 'Long P/L',
        field: 'longPnL',
        editable: true
      },
      {
        headerName: 'Long % Change',
        field: 'longPercentageChange',
        editable: true
      },
      {
        headerName: 'Short P/L',
        field: 'shortPnL',
        editable: true
      },
      {
        headerName: 'Short % Change',
        field: 'shortPercentageChange',
        editable: true
      },
      {
        headerName: 'Long Exposure',
        field: 'longExposure',
        editable: true
      },
      {
        headerName: 'Short Exposure',
        field: 'shortExposure',
        editable: true
      },
      {
        headerName: 'Gross Exposure',
        field: 'grossExposure',
        editable: true
      },
      {
        headerName: 'Net Exposure',
        field: 'netExposure'
      },
      {
        headerName: '6md Beta Net Exposure',
        field: 'sixMdBetaNetExposure'
      },
      {
        headerName: '2Yw Beta Net Exposure',
        field: 'twoYwBetaNetExposure'
      },
      {
        headerName: '6md Beta Short Exposure',
        field: 'sixMdBetaShortExposure'
      },
      {
        headerName: 'Nav Market',
        field: 'navMarket'
      },
      {
        headerName: 'Dividend USD',
        field: 'dividendUSD'
      },
      {
        headerName: 'Comm USD',
        field: 'commUSD'
      },
      {
        headerName: 'Fee/Taxes USD',
        field: 'feeTaxesUSD'
      },
      {
        headerName: 'Financing USD',
        field: 'financingUSD'
      },
      {
        headerName: 'Other USD',
        field: 'otherUSD'
      },
      {
        headerName: 'P/L %',
        field: 'pnLPercentage'
      },
      {
        headerName: 'MTD % Return',
        field: 'mtdPercentageReturn'
      },
      {
        headerName: 'QTD % Return',
        field: 'qtdPercentageReturn'
      },
      {
        headerName: 'YTD % Return',
        field: 'ytdPercentageReturn'
      },
      {
        headerName: 'ITD % Return',
        field: 'itdPercentageReturn'
      },
      {
        headerName: 'MTD PnL',
        field: 'mtdPnL'
      },
      {
        headerName: 'QTD PnL',
        field: 'qtdPnL'
      },
      {
        headerName: 'YTD PnL',
        field: 'ytdPnL'
      },
      {
        headerName: 'ITD PnL',
        field: 'itdPnL'
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
        this.dailyPnLData = response.payload.map(data => ({
          businessDate: DateFormatter(data.BusinessDate),
          fund: data.Fund,
          portFolio: data.PortFolio,
          tradePnL: data.TradePnL,
          day: data.Day,
          dailyPercentageReturn: data.DailyPercentageReturn,
          longPnL: data.LongPnL,
          longPercentageChange: data.LongPercentageChange,
          shortPnL: data.ShortPnL,
          shortPercentageChange: data.ShortPercentageChange,
          longExposure: data.LongExposure,
          shortExposure: data.ShortExposure,
          grossExposure: data.GrossExposure,
          netExposure: data.NetExposure,
          sixMdBetaNetExposure: data.SixMdBetaNetExposure,
          twoYwBetaNetExposure: data.TwoYwBetaNetExposure,
          sixMdBetaShortExposure: data.SixMdBetaShortExposure,
          navMarket: data.NavMarket,
          dividendUSD: data.DividendUSD,
          commUSD: data.CommUSD,
          feeTaxesUSD: data.FeeTaxesUSD,
          financingUSD: data.FinancingUSD,
          otherUSD: data.OtherUSD,
          pnLPercentage: data.PnLPercentage,
          mtdPercentageReturn: data.MTDPercentageReturn,
          qtdPercentageReturn: data.QTDPercentageReturn,
          ytdPercentageReturn: data.YTDPercentageReturn,
          itdPercentageReturn: data.ITDPercentageReturn,
          mtdPnL: data.MTDPnL,
          qtdPnL: data.QTDPnL,
          ytdPnL: data.YTDPnL,
          itdPnL: data.ITDPnL,
          createdBy: data.CreatedBy,
          lastUpdatedBy: data.LastUpdatedBy,
          createdDate: data.CreatedDate,
          lastUpdatedDate: data.lastUpdatedDate
        }));
        this.dailyPnlGrid.api.setRowData(this.dailyPnLData);
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  changeDate(date) {
    const { startDate } = date;
  }

  refreshGrid() {
    // this.dailyPnlGrid.api.showLoadingOverlay();
    // this.getDailyPnL();
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
