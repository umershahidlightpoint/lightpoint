import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter
} from "src/shared/utils/Shared";
import { GridOptions } from "ag-grid-community";
import { GridLayoutMenuComponent } from "src/shared/Component/grid-layout-menu/grid-layout-menu.component";
import { GridId, GridName } from "src/shared/utils/AppEnums";
import { GetContextMenu } from "src/shared/utils/ContextMenu";
import { DecimalPipe } from "@angular/common";
import { FinancePocServiceProxy } from "src/shared/service-proxies/service-proxies";
import { ToastrService } from "ngx-toastr";
import { UtilsConfig } from "src/shared/Models/utils-config";
import { DailyUnofficialPnLData } from "src/shared/Models/funds-theoretical";
import * as moment from "moment";
import { GraphObject } from "src/shared/Models/graph-object";

@Component({
  selector: "app-daily-pnl",
  templateUrl: "./daily-pnl.component.html",
  styleUrls: ["./daily-pnl.component.css"]
})
export class DailyPnlComponent implements OnInit {
  dailyPnlGrid: GridOptions;
  selectedDate = null;
  dailyPnLData: Array<DailyUnofficialPnLData>;
  funds: Array<string>;
  portfolios: Array<string>;
  fileToUpload: File = null;
  totalGridRows: number;
  isExpanded = false;
  graphObject: GraphObject = null;
  disableCharts = true;
  sliderValue = 0;
  uploadLoader = false;
  disableFileUpload = true;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;

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

  getPortfolios() {
    this.financeService.getPortfolios().subscribe(response => {
      this.portfolios = response.payload.map(item => item.PortfolioCode);
      this.initCols();
    });
  }

  sortDailyPnl(x, y) {
    let dateDiff =
      new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
    if (dateDiff != 0) {
      return dateDiff;
    } else {
      return y.Id - x.Id;
    }
  }

  getDailyPnL() {
    this.financeService.getDailyUnofficialPnL().subscribe(response => {
      let sortedData = response.payload.sort((x, y) => this.sortDailyPnl(x, y));

      this.dailyPnLData = sortedData.map(data => ({
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
      AutoSizeAllColumns(this.dailyPnlGrid);
    });
  }

  initGrid() {
    this.dailyPnlGrid = {
      columnDefs: this.getColDefs(),
      rowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: "single",
      rowGroupPanelShow: "after",
      pivotPanelShow: "after",
      singleClickEdit: true,
      pivotColumnGroupTotals: "after",
      pivotRowTotals: "after",
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
        // AutoSizeAllColumns(params);
      },
      onCellValueChanged: params => {},
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.dailyPnlGrid.sideBar = SideBar(
      GridId.dailyPnlId,
      GridName.dailyPnl,
      this.dailyPnlGrid
    );
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.dailyPnlGrid.api.setColumnDefs(colDefs);
    this.dailyPnlGrid.api.sizeColumnsToFit();
  }

  getColDefs() {
    const colDefs = [
      {
        headerName: "Is Modified",
        field: "modified",
        hide: true
      },
      {
        headerName: "Business Date",
        field: "businessDate",
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: "Portfolio*",
        field: "portFolio",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["None", ...this.portfolios]
        }
      },
      {
        headerName: "Fund*",
        field: "fund",
        filter: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["None", ...this.funds]
        }
      },
      {
        headerName: "Trade P/L",
        field: "tradePnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.tradePnL, false)
      },
      {
        headerName: "Day",
        field: "day",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.day, false)
      },
      {
        headerName: "Daily % Return",
        field: "dailyPercentageReturn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.dailyPercentageReturn, true)
      },
      {
        headerName: "Long P/L",
        field: "longPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.longPnL, false)
      },
      {
        headerName: "Long % Change",
        field: "longPercentageChange",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.longPercentageChange, false)
      },
      {
        headerName: "Short P/L",
        field: "shortPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.shortPnL, false)
      },
      {
        headerName: "Short % Change",
        field: "shortPercentageChange",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.shortPercentageChange, false)
      },
      {
        headerName: "Long Exposure",
        field: "longExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.longExposure, false)
      },
      {
        headerName: "Short Exposure",
        field: "shortExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.shortExposure, false)
      },
      {
        headerName: "Gross Exposure",
        field: "grossExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.grossExposure, false)
      },
      {
        headerName: "Net Exposure",
        field: "netExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.netExposure, false)
      },
      {
        headerName: "6md Beta Net Exposure",
        field: "sixMdBetaNetExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.sixMdBetaNetExposure, false)
      },
      {
        headerName: "2Yw Beta Net Exposure",
        field: "twoYwBetaNetExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.twoYwBetaNetExposure, false)
      },
      {
        headerName: "6md Beta Short Exposure",
        field: "sixMdBetaShortExposure",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.sixMdBetaShortExposure, false)
      },
      {
        headerName: "Nav Market",
        field: "navMarket",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.navMarket, false)
      },
      {
        headerName: "Dividend USD",
        field: "dividendUSD",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.dividendUSD, false)
      },
      {
        headerName: "Comm USD",
        field: "commUSD",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.commUSD, false)
      },
      {
        headerName: "Fee/Taxes USD",
        field: "feeTaxesUSD",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.feeTaxesUSD, false)
      },
      {
        headerName: "Financing USD",
        field: "financingUSD",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.financingUSD, false)
      },
      {
        headerName: "Other USD",
        field: "otherUSD",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.otherUSD, false)
      },
      {
        headerName: "P/L %",
        field: "pnLPercentage",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.pnLPercentage, true)
      },
      {
        headerName: "MTD % Return",
        field: "mtdPercentageReturn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.mtdPercentageReturn, true)
      },
      {
        headerName: "QTD % Return",
        field: "qtdPercentageReturn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.qtdPercentageReturn, true)
      },
      {
        headerName: "YTD % Return",
        field: "ytdPercentageReturn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.ytdPercentageReturn, true)
      },
      {
        headerName: "ITD % Return",
        field: "itdPercentageReturn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.itdPercentageReturn, true)
      },
      {
        headerName: "MTD PnL",
        field: "mtdPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.mtdPnL, false)
      },
      {
        headerName: "QTD PnL",
        field: "qtdPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.qtdPnL, false)
      },
      {
        headerName: "YTD PnL",
        field: "ytdPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.ytdPnL, false)
      },
      {
        headerName: "ITD PnL",
        field: "itdPnL",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.itdPnL, false)
      },
      {
        headerName: "Created By",
        field: "createdBy",
        hide: true
      },
      {
        headerName: "Last Updated By ",
        field: "lastUpdatedBy ",
        hide: true
      },
      {
        headerName: "Created Date",
        field: "createdDate",
        hide: true
      },
      {
        headerName: "Last Updated Date",
        field: "lastUpdatedDate",
        hide: true
      }
    ];
    colDefs.forEach(colDef => {
      if (
        !(
          colDef.field === "modified" ||
          colDef.field === "businessDate" ||
          colDef.field === "portfolio" ||
          colDef.field === "fund"
        )
      ) {
        colDef["type"] = "numericColumn";
      }
    });
    return colDefs;
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      {
        name: "Visualize",
        action: () => {
          this.visualizeData();
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
  }

  visualizeData() {
    let data = {};
    const focusedCell = this.dailyPnlGrid.api.getFocusedCell();
    const selectedRow = this.dailyPnlGrid.api.getDisplayedRowAtIndex(
      focusedCell.rowIndex
    ).data;
    const column = focusedCell.column.getColDef().field;
    const columnLabel = focusedCell.column.getUserProvidedColDef().headerName;
    data[columnLabel] = [];
    const toDate = moment(selectedRow.businessDate);
    const fromDate = moment(selectedRow.businessDate).subtract(30, "days");
    const selectedPortfolio = selectedRow.portFolio;
    this.dailyPnlGrid.api.forEachNodeAfterFilter((rowNode, index) => {
      let currentDate = moment(rowNode.data.businessDate);
      if (
        rowNode.data.portFolio === selectedPortfolio &&
        currentDate.isSameOrAfter(fromDate) &&
        currentDate.isSameOrBefore(toDate)
      ) {
        data[columnLabel].push({
          date: rowNode.data.businessDate,
          value: rowNode.data[column]
        });
      }
    });

    this.graphObject = {
      xAxisLabel: "Date",
      yAxisLabel: columnLabel,
      lineColors: ["#ff6960", "#00bd9a"],
      height: 410,
      width: "95%",
      chartTitle: selectedPortfolio,
      propId: "dailyPnLLineChart",
      graphData: data,
      dateTimeFormat: "YYYY-MM-DD"
    };
    this.isExpanded = true;
    this.disableCharts = false;
  }

  uploadDailyUnofficialPnl() {
    let rowNodeId = 1;
    this.uploadLoader = true;
    this.financeService
      .uploadDailyUnofficialPnl(this.fileToUpload)
      .subscribe(response => {
        this.uploadLoader = false;
        console.log("Response", response);
        if (response.isSuccessful) {
          // const modifiedData = response.payload.map(data => {
          //   return { ...data, RowId: rowNodeId++, Estimated: true };
          // });
          // this.totalGridRows = rowNodeId;
          // // this.dailyPnLData = this.formatPerformanceData(modifiedData);
          // this.dailyPnlGrid.api.setRowData(this.dailyPnLData);
          // AutoSizeAllColumns(this.dailyPnlGrid);
          // this.disableCommit = false;
          this.fileInput.nativeElement.value = "";
          this.disableFileUpload = true;
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
          this.toastrService.error("Something went wrong! Try Again.");
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
    const formattedValue = this.decimalPipe.transform(per, "1.2-2");
    return formattedValue.toString();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }
}
