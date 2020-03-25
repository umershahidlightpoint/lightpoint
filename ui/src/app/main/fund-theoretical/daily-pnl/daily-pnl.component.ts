import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {
  GridLayoutMenuComponent,
  CustomGridOptions
} from '@lightpointfinancialtechnology/lp-toolkit';
import { GridId, GridName, LayoutConfig } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { CacheService } from 'src/services/common/cache.service';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { DailyUnofficialPnLData } from 'src/shared/Models/funds-theoretical';
import { GraphObject } from 'src/shared/Models/graph-object';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';
import {
  SideBar,
  getRange,
  SetDateRange,
  GetDateRangeLabel,
  HeightStyle,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter
} from 'src/shared/utils/Shared';

@Component({
  selector: 'app-daily-pnl',
  templateUrl: './daily-pnl.component.html',
  styleUrls: ['./daily-pnl.component.scss']
})
export class DailyPnlComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  dailyPnlGrid: CustomGridOptions;
  dailyPnLConfig: {
    dailyPnLSize: number;
    chartsSize: number;
    dailyPnLView: boolean;
    chartsView: boolean;
    useTransition: boolean;
  } = {
    dailyPnLSize: 50,
    chartsSize: 50,
    dailyPnLView: true,
    chartsView: false,
    useTransition: true
  };
  selectedDate = null;
  dailyPnLData: Array<DailyUnofficialPnLData>;
  funds: Array<string>;
  portfolios: Array<string>;
  fileToUpload: File = null;
  totalGridRows: number;
  graphObject: GraphObject = null;
  disableCharts = true;
  sliderValue = 0;
  uploadLoader = false;
  disableFileUpload = true;

  DateRangeLabel: string;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: moment.Moment;
  endDate: moment.Moment;
  journalMinDate: moment.Moment;
  ranges: any;
  fundsRange: any;

  returnsFormatString = '1.2-2';

  styleForHeight = HeightStyle(224);

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: false
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private financeService: FinanceServiceProxy,
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.getFunds();
    // this.getDailyPnL();
    this.initGrid();
    this.getPreDefinedRanges();
  }

  ngAfterViewInit(): void {
    this.initPageLayout();
  }

  initPageLayout() {
    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.dailyPnLConfigKey);
    if (config) {
      this.dailyPnLConfig = JSON.parse(config.value);
    }

    this.cdRef.detectChanges();
  }

  applyPageLayout(event) {
    if (event.sizes) {
      this.dailyPnLConfig.dailyPnLSize = event.sizes[0];
      this.dailyPnLConfig.chartsSize = event.sizes[1];
    }

    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.dailyPnLConfigKey);
    const payload = {
      id: !config ? 0 : config.id,
      project: LayoutConfig.projectName,
      uom: 'JSON',
      key: LayoutConfig.dailyPnLConfigKey,
      value: JSON.stringify(this.dailyPnLConfig),
      description: LayoutConfig.dailyPnLConfigKey
    };

    if (!config) {
      this.cacheService.addUserConfig(payload).subscribe(response => {
        console.log('User Config Added');
      });
    } else {
      this.cacheService.updateUserConfig(payload).subscribe(response => {
        console.log('User Config Updated');
      });
    }
  }

  getPreDefinedRanges() {
    const payload = {
      GridName: GridName.journalsLedgers
    };
    this.cacheService.getServerSideJournalsMeta(payload).subscribe(
      result => {
        this.fundsRange = result.payload.FundsRange;
        this.journalMinDate = result.payload.JournalMinDate;
        this.ranges = getRange(this.getCustomFundRange());
      },
      err => {}
    );
  }

  onFilterChanged(event) {
    try {
      this.getDailyPnL();
    } catch (ex) {}
  }

  getCustomFundRange(fund = 'All Funds') {
    const customRange: any = {};

    this.fundsRange.forEach(element => {
      if (fund === 'All Funds' && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      } else if (fund === element.fund && moment().year() !== element.Year) {
        [customRange[element.Year]] = [
          [
            moment(`${element.Year}-01-01`).startOf('year'),
            moment(`${element.Year}-01-01`).endOf('year')
          ]
        ];
      }
    });

    customRange.ITD = [moment(this.journalMinDate, 'YYYY-MM-DD'), moment()];

    return customRange;
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
    const dateDiff = new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
    if (dateDiff != 0) {
      return dateDiff;
    } else {
      return y.Id - x.Id;
    }
  }

  getDailyPnL() {
    this.dailyPnlGrid.api.showLoadingOverlay();
    const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD') : null;
    const to = this.endDate ? moment(this.endDate).format('YYYY-MM-DD') : null;
    this.fundTheoreticalApiService.getDailyUnofficialPnL(from, to).subscribe(
      response => {
        this.dailyPnlGrid.api.hideOverlay();
        if (response.statusCode === 200) {
          const sortedData = response.payload.sort((x, y) => this.sortDailyPnl(x, y));
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
        }
      },
      err => {
        this.dailyPnlGrid.api.hideOverlay();
      }
    );
  }

  initGrid() {
    this.dailyPnlGrid = {
      columnDefs: this.getColDefs(),
      rowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: this.getExternalFilterState.bind(this),
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: this.clearExternalFilter.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      setExternalFilter: this.isExternalFilterPassed.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableCellChangeFlash: true,
      animateRows: true,
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
    };
    this.dailyPnlGrid.sideBar = SideBar(GridId.dailyPnlId, GridName.dailyPnl, this.dailyPnlGrid);
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.dailyPnlGrid.api.setColumnDefs(colDefs);
    this.dailyPnlGrid.api.sizeColumnsToFit();
  }

  clearExternalFilter() {
    this.selected = null;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.dailyPnlGrid.api.onFilterChanged();
  }

  isExternalFilterPassed(object) {
    const { dateFilter } = object;
    this.setDateRange(dateFilter);
    this.dailyPnlGrid.api.onFilterChanged();
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  getExternalFilterState() {
    return {
      dateFilter:
        this.DateRangeLabel !== '' || 'ITD'
          ? this.DateRangeLabel
          : {
              startDate: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
              endDate: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
            }
    };
  }

  isExternalFilterPresent() {
    if (this.startDate) {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    return true;
  }

  getColDefs(): Array<ColDef | ColGroupDef> {
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
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', ...this.portfolios]
        }
      },
      {
        headerName: 'Fund*',
        field: 'fund',
        filter: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', ...this.funds]
        }
      },
      {
        headerName: 'Trade P/L',
        field: 'tradePnL',
        valueFormatter: params => this.numberFormatter(params.node.data.tradePnL, false)
      },
      {
        headerName: 'Day',
        field: 'day',
        valueFormatter: params => this.numberFormatter(params.node.data.day, false)
      },
      {
        headerName: 'Daily % Return',
        field: 'dailyPercentageReturn',
        valueFormatter: params => this.numberFormatter(params.node.data.dailyPercentageReturn, true)
      },
      {
        headerName: 'Long P/L',
        field: 'longPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.longPnL, false)
      },
      {
        headerName: 'Long % Change',
        field: 'longPercentageChange',
        valueFormatter: params => this.numberFormatter(params.node.data.longPercentageChange, false)
      },
      {
        headerName: 'Short P/L',
        field: 'shortPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.shortPnL, false)
      },
      {
        headerName: 'Short % Change',
        field: 'shortPercentageChange',
        valueFormatter: params =>
          this.numberFormatter(params.node.data.shortPercentageChange, false)
      },
      {
        headerName: 'Long Exposure',
        field: 'longExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.longExposure, false)
      },
      {
        headerName: 'Short Exposure',
        field: 'shortExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.shortExposure, false)
      },
      {
        headerName: 'Gross Exposure',
        field: 'grossExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.grossExposure, false)
      },
      {
        headerName: 'Net Exposure',
        field: 'netExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.netExposure, false)
      },
      {
        headerName: '6md Beta Net Exposure',
        field: 'sixMdBetaNetExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.sixMdBetaNetExposure, false)
      },
      {
        headerName: '2Yw Beta Net Exposure',
        field: 'twoYwBetaNetExposure',
        valueFormatter: params => this.numberFormatter(params.node.data.twoYwBetaNetExposure, false)
      },
      {
        headerName: '6md Beta Short Exposure',
        field: 'sixMdBetaShortExposure',
        valueFormatter: params =>
          this.numberFormatter(params.node.data.sixMdBetaShortExposure, false)
      },
      {
        headerName: 'Nav Market',
        field: 'navMarket',
        valueFormatter: params => this.numberFormatter(params.node.data.navMarket, false)
      },
      {
        headerName: 'Dividend USD',
        field: 'dividendUSD',
        valueFormatter: params => this.numberFormatter(params.node.data.dividendUSD, false)
      },
      {
        headerName: 'Comm USD',
        field: 'commUSD',
        valueFormatter: params => this.numberFormatter(params.node.data.commUSD, false)
      },
      {
        headerName: 'Fee/Taxes USD',
        field: 'feeTaxesUSD',
        valueFormatter: params => this.numberFormatter(params.node.data.feeTaxesUSD, false)
      },
      {
        headerName: 'Financing USD',
        field: 'financingUSD',
        valueFormatter: params => this.numberFormatter(params.node.data.financingUSD, false)
      },
      {
        headerName: 'Other USD',
        field: 'otherUSD',
        valueFormatter: params => this.numberFormatter(params.node.data.otherUSD, false)
      },
      {
        headerName: 'P/L %',
        field: 'pnLPercentage',
        valueFormatter: params =>
          this.returnsFormatter(params.node.data.pnLPercentage, true, this.returnsFormatString)
      },
      {
        headerName: 'MTD % Return',
        field: 'mtdPercentageReturn',
        valueFormatter: params =>
          this.returnsFormatter(
            params.node.data.mtdPercentageReturn,
            true,
            this.returnsFormatString
          )
      },
      {
        headerName: 'QTD % Return',
        field: 'qtdPercentageReturn',
        valueFormatter: params =>
          this.returnsFormatter(
            params.node.data.qtdPercentageReturn,
            true,
            this.returnsFormatString
          )
      },
      {
        headerName: 'YTD % Return',
        field: 'ytdPercentageReturn',
        valueFormatter: params =>
          this.returnsFormatter(
            params.node.data.ytdPercentageReturn,
            true,
            this.returnsFormatString
          )
      },
      {
        headerName: 'ITD % Return',
        field: 'itdPercentageReturn',
        valueFormatter: params =>
          this.returnsFormatter(
            params.node.data.itdPercentageReturn,
            true,
            this.returnsFormatString
          )
      },
      {
        headerName: 'MTD PnL',
        field: 'mtdPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.mtdPnL, false)
      },
      {
        headerName: 'QTD PnL',
        field: 'qtdPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.qtdPnL, false)
      },
      {
        headerName: 'YTD PnL',
        field: 'ytdPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.ytdPnL, false)
      },
      {
        headerName: 'ITD PnL',
        field: 'itdPnL',
        valueFormatter: params => this.numberFormatter(params.node.data.itdPnL, false)
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
      {
        name: 'Visualize',
        action: () => {
          this.visualizeData();
        }
      },
      {
        name: 'Decimal Places 2',
        action: () => {
          this.returnsFormatString = '1.2-2';
          this.refreshGrid();
        }
      },
      {
        name: 'Decimal Places 16',
        action: () => {
          this.returnsFormatString = '1.16-16';
          this.refreshGrid();
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;

    this.getRangeLabel();
    this.dailyPnlGrid.api.onFilterChanged();
  }

  getRangeLabel() {
    this.DateRangeLabel = '';
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  visualizeData() {
    const data = {};
    const focusedCell = this.dailyPnlGrid.api.getFocusedCell();
    const selectedRow = this.dailyPnlGrid.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
    const column = focusedCell.column.getColDef().field;
    const columnLabel = focusedCell.column.getUserProvidedColDef().headerName;
    data[columnLabel] = [];
    const toDate = moment(selectedRow.businessDate);
    const fromDate = moment(selectedRow.businessDate).subtract(30, 'days');
    const selectedPortfolio = selectedRow.portFolio;
    this.dailyPnlGrid.api.forEachNodeAfterFilter((rowNode, index) => {
      const currentDate = moment(rowNode.data.businessDate);
      if (
        rowNode.data.portFolio === selectedPortfolio
        // &&
        // currentDate.isSameOrAfter(fromDate) &&
        // currentDate.isSameOrBefore(toDate)
      ) {
        data[columnLabel].push({
          date: rowNode.data.businessDate,
          value: rowNode.data[column]
        });
      }
    });

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: columnLabel,
      lineColors: ['#ff6960', '#00bd9a'],
      height: 410,
      width: '95%',
      chartTitle: selectedPortfolio,
      propId: 'lineDailyPnL',
      graphData: data,
      dateTimeFormat: 'YYYY-MM-DD',
      referenceDate: toDate
    };
    this.dailyPnLConfig.chartsView = true;
    this.disableCharts = false;
  }

  uploadDailyUnofficialPnl() {
    this.uploadLoader = true;
    this.fundTheoreticalApiService
      .uploadDailyUnofficialPnl(this.fileToUpload)
      .subscribe(response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          this.fileInput.nativeElement.value = '';
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
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
  }

  refreshGrid() {
    this.dailyPnlGrid.api.showLoadingOverlay();
    this.getDailyPnL();
  }

  numberFormatter(numberToFormat, isInPercentage): string {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }

  returnsFormatter(numberToFormat, isInPercentage, format): string {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, format);
    return formattedValue.toString();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }
}
