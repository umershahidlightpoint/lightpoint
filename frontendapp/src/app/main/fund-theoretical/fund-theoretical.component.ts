import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../shared/Models/account';
import { takeWhile } from 'rxjs/operators';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { SideBar, AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import * as moment from 'moment';

@Component({
  selector: 'app-fund-theoretical',
  templateUrl: './fund-theoretical.component.html',
  styleUrls: ['./fund-theoretical.component.css']
})
export class FundTheoreticalComponent implements OnInit, AfterViewInit {
  rowData: Array<Account>;
  fundTheoreticalGrid: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;
  monthlyPerformanceData;
  currentMonth: string;
  currentYear;
  components;
  funds;
  selectedDate = null;
  showDatePicker = false;
  generateFundsDate;
  // For unsubscribing all subscriptions
  isSubscriptionAlive: boolean;

  momentMonths = [
    { id: 0, month: 'January' },
    { id: 1, month: 'February' },
    { id: 2, month: 'March' },
    { id: 3, month: 'April' },
    { id: 4, month: 'May' },
    { id: 5, month: 'June' },
    { id: 6, month: 'July' },
    { id: 7, month: 'August' },
    { id: 8, month: 'September' },
    { id: 9, month: 'October' },
    { id: 10, month: 'November' },
    { id: 11, month: 'December' }
  ];

  style = Style;

  styleForHeight = HeightStyle(224);

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.isSubscriptionAlive = true;
    this.hideGrid = false;
    this.currentYear = moment().get('year');
    const currentMonthObj = this.momentMonths.find(obj => obj.id === moment().get('month'));
    this.currentMonth = currentMonthObj.month;
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
      }
    });
  }

  ngOnInit() {
    this.GetFunds();
    this.GetMonthlyPerformance();
    this.initGrid();
  }

  GetFunds() {
    this.financeService.getFunds().subscribe(response => {
      this.funds = response.payload.map(item => item.FundCode);
      this.initCols();
    });
  }

  GetMonthlyPerformance() {
    const mockData = [];
    // [
    //   {
    //     id: 1,
    //     estimated: false,
    //     entry_date: '2019-08-01T00:00:00',
    //     fund: 'BPM',
    //     portfolio: 'ASIA_FOCUS',
    //     monthly_end_nav: -3000000,
    //     startMonthEstimateNav: 0
    //     performance: 6000000,
    //     mtd: 6,
    //     ytd_net_performance: 9000000,
    //     qtd_net_perc: 3,
    //     ytd_net_perc: 9.27,
    //     itd_net_perc: 9.27
    //   },
    //   {
    //     id: 2,
    //     estimated: true,
    //     entry_date: '2019-09-01T00:00:00',
    //     fund: 'BPM',
    //     portfolio: 'ASIA_FOCUS',
    //     monthly_end_nav: 6000000,
    //     startMonthEstimateNav: 0
    //     performance: 8000000,
    //     mtd: 7.14,
    //     ytd_net_performance: 17000000,
    //     qtd_net_perc: 10.36,
    //     ytd_net_perc: 17.07,
    //     itd_net_perc: 17.07
    //   }
    // ];
    // this.financePocServiceProxy.getMonthlyPerformance().subscribe(response => {
    //   this.monthlyPerformanceData = response.data.map(data => ({
    //     id: data.id,
    //     year: this.DateFormatter(data.entry_date, 1),
    //     month: this.DateFormatter(data.entry_date, 2),
    //     fund: data.fund,
    //     portfolio: data.portfolio,
    //     monthEndNav: data.monthly_end_nav,
    //     performance: data.performance,
    //     mtd: data.mtd,
    //     ytdNetPerformance: data.ytd_net_performance,
    //     qtdNetPercentage: data.qtd_net_perc,
    //     ytdNetPercentage: data.ytd_net_perc,
    //     itdNetPercentage: data.itd_net_perc
    //   }));

    //   const isCurrentMonthAdded = this.monthlyPerformanceData.find(
    //     data => data.month === this.currentMonth && data.year === this.currentYear
    //   );
    //   if (!isCurrentMonthAdded) {
    //     this.monthlyPerformanceData.push({
    //       id: 12,
    //       year: this.currentYear,
    //       month: this.currentMonth,
    //       fund: '',
    //       portfolio: '',
    //       monthEndNav: 0,
    //       performance: 0,
    //       mtd: 0,
    //       ytdNetPerformance: 0,
    //       qtdNetPercentage: 0,
    //       ytdNetPercentage: 0,
    //       itdNetPercentage: 0
    //     });
    //   }

    //   this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
    // });
    this.monthlyPerformanceData = mockData.map(data => ({
      id: data.id,
      estimated: data.estimated,
      year: this.DateFormatter(data.entry_date, 1, true),
      month: this.DateFormatter(data.entry_date, 2, true),
      fund: data.fund,
      portfolio: data.portfolio,
      monthEndNav: data.monthly_end_nav,
      performance: data.performance,
      mtd: data.mtd,
      ytdNetPerformance: data.ytd_net_performance,
      qtdNetPercentage: data.qtd_net_perc,
      ytdNetPercentage: data.ytd_net_perc,
      itdNetPercentage: data.itd_net_perc
    }));

    if (mockData.length === 0) {
      this.showDatePicker = true;
    } else {
      const isCurrentMonthAdded = this.monthlyPerformanceData.find(
        data => data.month === this.currentMonth && data.year === this.currentYear
      );
      if (!isCurrentMonthAdded) {
        this.monthlyPerformanceData.push({
          id: 12,
          estimated: false,
          year: this.currentYear,
          month: this.currentMonth,
          fund: '',
          portfolio: '',
          monthEndNav: 0,
          performance: 0,
          mtd: 0,
          ytdNetPerformance: 0,
          qtdNetPercentage: 0,
          ytdNetPercentage: 0,
          itdNetPercentage: 0
        });
      }
    }
  }

  initGrid() {
    this.fundTheoreticalGrid = {
      columnDefs: null,
      rowData: this.monthlyPerformanceData,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      clearExternalFilter: () => {},
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      onFirstDataRendered: params => {
        // AutoSizeAllColumns(params);
      }
    } as GridOptions;
    this.fundTheoreticalGrid.sideBar = SideBar(
      GridId.fundTheoreticalId,
      GridName.fundTheoretical,
      this.fundTheoreticalGrid
    );
    this.components = { singleClickEditRenderer: getRenderer() };
  }

  initCols() {
    const colDefs = [
      {
        headerName: 'Estimated',
        field: 'estimated',
        resizable: true,
        sortable: true,
        cellRenderer: params => {
          return `<input type='checkbox' ${params.node.data.estimated ? 'checked' : ''} />`;
        }
      },
      {
        headerName: 'Year',
        field: 'year',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Month',
        field: 'month',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Fund*',
        field: 'fund',
        resizable: true,
        sortable: true,
        filter: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['None', ...this.funds]
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'Portfolio*',
        field: 'portfolio',
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Portfolio A', 'Asia_Focus']
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'Admin Month End NAV',
        field: 'monthEndNav',
        resizable: true,
        sortable: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'Start of Month Estimate NAV*',
        field: 'startMonthEstimateNav',
        resizable: true,
        sortable: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'Performance*',
        field: 'performance',
        resizable: true,
        sortable: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'MTD*',
        field: 'mtd',
        resizable: true,
        sortable: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        },
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'YTD Net Perf',
        field: 'ytdNetPerformance',
        resizable: true,
        sortable: true,
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'QTD Net %',
        field: 'qtdNetPercentage',
        resizable: true,
        sortable: true,
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'YTD Net %',
        field: 'ytdNetPercentage',
        resizable: true,
        sortable: true,
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      },
      {
        headerName: 'ITD Net %',
        field: 'itdNetPercentage',
        resizable: true,
        sortable: true,
        cellStyle: params => {
          return { textAlign: 'end' };
        }
      }
    ];
    this.fundTheoreticalGrid.api.setColumnDefs(colDefs);
    AutoSizeAllColumns(this.fundTheoreticalGrid);
    this.fundTheoreticalGrid.api.sizeColumnsToFit();
  }

  DateFormatter(date, option, isStringFormat) {
    let dateObject;
    if (isStringFormat) {
      dateObject = moment(date);
    } else {
      dateObject = date;
    }
    let formattedValue;
    switch (option) {
      case 1:
        formattedValue = moment(dateObject).get('year');
        break;
      case 2:
        const monthId = moment(dateObject).get('month');
        formattedValue = this.momentMonths.find(obj => obj.id === monthId);
        formattedValue = formattedValue.month;
        break;
    }
    return formattedValue;
  }

  changeDate(date) {
    const { startDate } = date;
    this.generateFundsDate = startDate;
  }

  generateRows() {
    const today = moment();
    const totalMonths = today.diff(this.generateFundsDate, 'months');
    let count = 0;
    const generateFundsDate = this.generateFundsDate;

    while (count <= totalMonths) {
      this.monthlyPerformanceData.push({
        id: 12,
        estimated: true,
        year: this.DateFormatter(generateFundsDate, 1, false),
        month: this.DateFormatter(generateFundsDate, 2, false),
        fund: '',
        portfolio: '',
        monthEndNav: 0,
        startMonthEstimateNav: 0,
        performance: 0,
        mtd: 0,
        ytdNetPerformance: 0,
        qtdNetPercentage: 0,
        ytdNetPercentage: 0,
        itdNetPercentage: 0
      });
      generateFundsDate.add(1, 'month');
      count++;
    }
    this.showDatePicker = false;
    this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
  }

  onBtExport() {
    const params = {
      fileName: 'Accounts',
      sheetName: 'First Sheet',
      columnKeys: ['accountName', 'description', 'category', 'hasJournal', 'type']
    };
    this.fundTheoreticalGrid.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
  }

  refreshGrid() {
    this.fundTheoreticalGrid.api.showLoadingOverlay();
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}

function CustomHeaderName(headerName) {
  return `<span class="text-danger" style="height:30px; font: bold"> ${headerName} </span>`;
}

function getRenderer() {
  function CellRenderer() {}
  CellRenderer.prototype.createGui = function() {
    var template =
      '<span><button id="theButton" style="background: none; border: none"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button><span id="theValue" style="padding-left: 4px;"></span></span>';
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    this.eGui = tempDiv.firstElementChild;
  };
  CellRenderer.prototype.init = function(params) {
    this.createGui();
    this.params = params;
    var eValue = this.eGui.querySelector('#theValue');
    eValue.innerHTML = params.value;
    this.eButton = this.eGui.querySelector('#theButton');
    this.buttonClickListener = this.onButtonClicked.bind(this);
    this.eButton.addEventListener('click', this.buttonClickListener);
  };
  CellRenderer.prototype.onButtonClicked = function() {
    var startEditingParams = {
      rowIndex: this.params.rowIndex,
      colKey: this.params.column.getId()
    };
    this.params.api.startEditingCell(startEditingParams);
  };
  CellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  CellRenderer.prototype.destroy = function() {
    this.eButton.removeEventListener('click', this.buttonClickListener);
  };
  return CellRenderer;
}
