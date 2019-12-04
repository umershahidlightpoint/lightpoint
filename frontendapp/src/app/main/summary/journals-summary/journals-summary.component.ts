import { Component, OnInit } from '@angular/core';
import {
  GridOptions,
  ColGroupDef,
  ColDef,
  IServerSideDatasource,
  IServerSideGetRowsParams
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ContextMenu } from 'src/shared/Models/common';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId } from '../../../../shared/utils/AppEnums';
import {
  HeightStyle,
  ExcelStyle,
  AutoSizeAllColumns,
  CalTotal,
  CommonCols,
  SetDateRange
} from 'src/shared/utils/Shared';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import {
  valueFormatter,
  moneyFormatter,
  cellClassRulesDebit,
  cellClassRulesCredit,
  cellClassRules,
  DataDictionary
} from 'src/shared/utils/DataDictionary';

@Component({
  selector: 'app-journals-summary',
  templateUrl: './journals-summary.component.html',
  styleUrls: ['./journals-summary.component.css']
})
export class JournalsSummaryComponent implements OnInit {
  private columns: any;
  private rowData: any[] = [];

  gridOptions: GridOptions;
  pinnedBottomRowData: any;
  colDefs: Array<ColDef | ColGroupDef>;
  gridLayout = 'Select a Layout';
  gridLayouts: string;
  currentLayout: any;
  filters: any;
  externalFilters: {};
  pageNumber = 0;
  pageSize = 100;
  toggleGridBool = false;

  styleForHeight = HeightStyle(228);

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: true
  };

  excelParams = {
    fileName: 'Journals Summary',
    sheetName: 'First Sheet'
  };

  datasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log('GET ROWS :: ');
      this.pageNumber = params.request.endRow / this.pageSize;
      const payload = {
        ...params.request,
        externalFilterModel: this.externalFilters,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };

      console.log('PARAMS :: ', JSON.stringify(params.request, null, 1));
      console.log('PAYLOAD :: ', JSON.stringify(payload, null, 1));

      this.financeService.getServerSideJournals(payload).subscribe(
        result => {
          if (result.isSuccessful) {
            result.payload.forEach(item => {
              item.when = moment(item.when).format('MM-DD-YYYY');
            });
            if (this.pageNumber === 1) {
              this.rowData = result.payload;
            } else {
              this.rowData = result.payload;
            }

            params.successCallback(this.rowData, result.meta.LastRow);
            this.gridOptions.api.refreshCells();

            const fieldsSum: Array<{ name: string; total: number }> = CalTotal(this.rowData, [
              { name: 'debit', total: 0 },
              { name: 'credit', total: 0 },
              { name: 'Commission', total: 0 },
              { name: 'Fees', total: 0 },
              { name: 'TradePrice', total: 0 },
              { name: 'NetPrice', total: 0 },
              { name: 'SettleNetPrice', total: 0 },
              { name: 'NetMoney', total: 0 },
              { name: 'LocalNetNotional', total: 0 },
              { name: 'value', total: 0 }
            ]);

            console.log('FIELDS SUM :: ', fieldsSum);

            this.pinnedBottomRowData = [
              {
                // source: 'Total Records: ' + this.totalRecords,
                AccountType: '',
                accountName: '',
                when: '',
                SecurityId: 0,
                debit: Math.abs(fieldsSum[0].total),
                credit: Math.abs(fieldsSum[1].total),
                balance: Math.abs(fieldsSum[0].total) - Math.abs(fieldsSum[1].total),
                Commission: Math.abs(fieldsSum[2].total),
                Fees: Math.abs(fieldsSum[3].total),
                TradePrice: fieldsSum[4].total,
                NetPrice: Math.abs(fieldsSum[5].total),
                SettleNetPrice: Math.abs(fieldsSum[6].total),
                NetMoney: Math.abs(fieldsSum[7].total),
                LocalNetNotional: Math.abs(fieldsSum[8].total),
                value: Math.abs(fieldsSum[9].total)
              }
            ];
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
            this.gridOptions.api.refreshCells();

            AutoSizeAllColumns(this.gridOptions);
          } else {
            params.failCallback();
          }
        },
        error => {
          params.failCallback();
        }
      );
    }
  };

  constructor(
    private financeService: FinanceServiceProxy,
    private toastrService: ToastrService,
    private dataDictionary: DataDictionary
  ) {
    this.getGridLayouts();
    this.initGird();
    this.initColDefs();
  }

  ngOnInit(): void {}

  getGridLayouts(): void {
    this.financeService.getGridLayouts(GridId.journalsLedgersId, 1).subscribe(
      response => {
        if (response.isSuccessful) {
          this.gridLayouts = response.payload;
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  changeGridLayout(selectedLayout: any): void {
    // this.gridOptions.api.showLoadingOverlay();
    // this.getJournalsSummary(selectedLayout);

    this.currentLayout = selectedLayout;
    this.restoreLayout(selectedLayout);
    this.gridOptions.api.setServerSideDatasource(this.datasource);
  }

  restoreLayout(layout) {
    // if (layout && layout.Id === 0) {
    //   this.resetState();
    //   return;
    // }
    console.log('LAYOUT :: ', this.gridLayout);
    this.financeService.GetAGridLayout(layout.Id).subscribe(response => {
      this.externalFilters = this.getServerSideExternalFilter(
        JSON.parse(response.payload.ExternalFilterState)
      );
      this.gridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState));
      this.gridOptions.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState));
      this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.gridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState));
    });
  }

  getServerSideExternalFilter(externalFilterState: any) {
    return {
      ...(externalFilterState.fundFilter !== 'All Funds' && {
        fund: { values: externalFilterState.fundFilter, filterType: 'set' }
      }),
      ...(externalFilterState.symbolFilter !== '' && {
        symbol: { values: externalFilterState.symbolFilter, filterType: 'text' }
      }),
      when: this.getDateRange(externalFilterState.dateFilter)
    };
  }

  getDateRange(dateFilter: any) {
    if (typeof dateFilter === 'object' && dateFilter.startDate === '') {
      return undefined;
    }

    const dates = SetDateRange(dateFilter, null, null);
    return {
      dateFrom: dates[0].format('YYYY-MM-DD'),
      dateTo: dates[1].format('YYYY-MM-DD'),
      filterType: 'date'
    };
  }

  refreshGrid() {
    // this.gridOptions.api.showLoadingOverlay();
    // this.getJournalsSummary(this.currentLayout);

    this.gridOptions.api.setServerSideDatasource(this.datasource);
    this.restoreLayout(this.currentLayout);
  }

  toggleGrid() {
    this.toggleGridBool = !this.toggleGridBool;
  }

  initColDefs() {
    const payload = {
      tableName: 'vwJournal',
      filters: ['fund', 'symbol', 'AccountCategory', 'AccountType', 'AccountName', 'fx_currency']
    };
    this.financeService.getServerSideJournalsMeta(payload).subscribe(result => {
      let commonColDefs = result.payload.Columns;
      commonColDefs = CommonCols(true, result.payload.Filters);

      this.colDefs = [
        ...commonColDefs,
        this.dataDictionary.column('TradePrice', true),
        this.dataDictionary.column('NetPrice', true),
        this.dataDictionary.column('SettleNetPrice', true),
        this.dataDictionary.column('start_price', true),
        this.dataDictionary.column('end_price', true),
        this.dataDictionary.column('fxrate', true)
      ];

      this.gridOptions.api.setColumnDefs(this.colDefs);

      console.log('COL DEFS :: ', this.colDefs);
    });
  }

  initGird() {
    this.gridOptions = {
      rowData: [],
      rowModelType: 'serverSide',
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {},
      getChildCount: data => {
        // Data Contains a Group that is returned from the API
        return data ? data.groupCount : 0;
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [];
    // if (!params.node.group) {
    //   addDefaultItems.push({
    //     name: 'Details',
    //     action: () => {
    //       this.getJournalDetails(params);
    //       this.toggleGridBool = true;
    //     }
    //   });
    // }

    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  getJournalsSummary(gridLayout: any) {
    this.financeService.getJournalSummary(gridLayout.ColumnState).subscribe(
      response => {
        if (response.isSuccessful) {
          this.setGridState(response);
        } else {
          this.toastrService.error(response.message);
          this.gridOptions.api.hideOverlay();
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
        this.gridOptions.api.hideOverlay();
      }
    );
  }

  getJournalDetails(params) {
    const filteredColDef = params.columnApi.columnController.columnDefs.filter(
      i => i.rowGroupIndex != null
    );
    const filterList = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < filteredColDef.length; i++) {
      const colData = [];
      colData.push(params.node.data[filteredColDef[i].colId]);
      filterList.push({
        column: filteredColDef[i].colId,
        data: colData
      });
    }
    this.filters = filterList;
  }

  setGridState(response: any) {
    const colDefs: Array<ColDef | ColGroupDef> = response.meta.Columns.map(element => {
      if (element.aggFunc) {
        element = {
          ...element,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: params => {
            return element.field === 'balance' ? valueFormatter(params) : moneyFormatter(params);
          }
        };
        if (element.field === 'balance') {
          cellClassRules(element);
        } else if (element.field === 'debitSum') {
          cellClassRulesDebit(element);
        } else if (element.field === 'creditSum') {
          cellClassRulesCredit(element);
        }
      }

      return element;
    });

    const pinnedBottomRowData = this.getBottomRowData(response);
    this.gridOptions.api.setRowData(response.payload);
    this.gridOptions.api.setPinnedBottomRowData(pinnedBottomRowData);
    this.gridOptions.api.setColumnDefs(colDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  getBottomRowData(response: any) {
    let totalDebits = 0;
    let totalCredits = 0;
    response.payload.forEach(data => {
      totalDebits += data.debitSum;
      totalCredits += data.creditSum;
    });
    const pinnedBottomRowData = [
      {
        debitSum: totalDebits,
        creditSum: totalCredits,
        balance: totalDebits - totalCredits
      }
    ];
    return pinnedBottomRowData;
  }
}
