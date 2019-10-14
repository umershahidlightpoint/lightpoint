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
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.isSubscriptionAlive = true;
    this.hideGrid = false;
    this.currentYear = moment().get('year');
    const currentMonthObj = this.momentMonths.find(obj => obj.id === moment().get('month'));
    this.currentMonth = currentMonthObj.month;
    console.log('==> Current Month', this.currentMonth);
    console.log('==> Current Year', this.currentYear);
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
      }
    });
  }

  ngOnInit() {
    this.GetMonthlyPerformance();
    this.initGrid();
  }

  GetMonthlyPerformance() {
    const mockData = [
      {
        id: 1,
        entry_date: '2019-08-01T00:00:00',
        fund: 'BPM',
        portfolio: 'ASIA_FOCUS',
        monthly_end_nav: -3000000,
        performance: 6000000,
        mtd: 6,
        ytd_net_performance: 9000000,
        qtd_net_perc: 3,
        ytd_net_perc: 9.27,
        itd_net_perc: 9.27
      },
      {
        id: 2,
        entry_date: '2019-09-01T00:00:00',
        fund: 'BPM',
        portfolio: 'ASIA_FOCUS',
        monthly_end_nav: 6000000,
        performance: 8000000,
        mtd: 7.14,
        ytd_net_performance: 17000000,
        qtd_net_perc: 10.36,
        ytd_net_perc: 17.07,
        itd_net_perc: 17.07
      }
    ];
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
      year: this.DateFormatter(data.entry_date, 1),
      month: this.DateFormatter(data.entry_date, 2),
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

    const isCurrentMonthAdded = this.monthlyPerformanceData.find(
      data => data.month === this.currentMonth && data.year === this.currentYear
    );
    if (!isCurrentMonthAdded) {
      this.monthlyPerformanceData.push({
        id: 12,
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

  initGrid() {
    this.fundTheoreticalGrid = {
      columnDefs: this.initCols(),
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
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      }
      // components: { singleClickEditRenderer }
      // this.components = { singleClickEditRenderer: getRenderer() };
    } as GridOptions;
    this.fundTheoreticalGrid.sideBar = SideBar(
      GridId.fundTheoreticalId,
      GridName.fundTheoretical,
      this.fundTheoreticalGrid
    );
    this.components = { singleClickEditRenderer: getRenderer() };
  }

  initCols() {
    return [
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
        headerName: 'Fund',
        field: 'fund',
        resizable: true,
        sortable: true,
        filter: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        }
        // cellRenderer: params => {
        //   if (params.node.data.month === this.currentMonth) {
        //     return 'singleClickEditRenderer';
        //   }
        // }
        // cellRenderer: 'genderCellRenderer',
        // cellEditor: 'agRichSelectCellEditor',
        // cellEditorParams: {
        //   values: ['Male', 'Female'],
        //   cellRenderer: 'genderCellRenderer'
        // }
      },
      {
        headerName: 'Portfolio',
        field: 'portfolio',
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        }
      },
      {
        headerName: 'Admin Month End NAV',
        field: 'monthEndNav',
        resizable: true,
        sortable: true,
        filter: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        }
      },
      {
        headerName: 'Performance',
        field: 'performance',
        resizable: true,
        sortable: true,
        filter: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        }
      },
      {
        headerName: 'MTD',
        field: 'mtd',
        resizable: true,
        sortable: true,
        filter: true,
        editable: params => {
          if (params.node.data.month === this.currentMonth) {
            return true;
          }
        }
      },
      {
        headerName: 'YTD Net Perf',
        field: 'ytdNetPerformance',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'QTF Net %',
        field: 'qtdNetPercentage',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'YTD Net %',
        field: 'ytdNetPercentage',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'ITD Net %',
        field: 'itdNetPercentage',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Start of Month Estimate NAV',
        field: 'canEdited',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Monthly Estimate PnL',
        field: 'canEdited',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Month end Estimate NAV',
        field: 'canEdited',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Estimate  Monthly %',
        field: 'canEdited',
        resizable: true,
        sortable: true,
        filter: true
      }
    ];
  }

  DateFormatter(date, option) {
    const dateObject = moment(date);
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

function getRenderer() {
  function CellRenderer() {}
  CellRenderer.prototype.createGui = function() {
    var template =
      '<span><button id="theButton"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button><span id="theValue" style="padding-left: 4px;"></span></span>';
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
