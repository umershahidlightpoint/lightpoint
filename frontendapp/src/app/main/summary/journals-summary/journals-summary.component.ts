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
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { GridId } from '../../../../shared/utils/AppEnums';
import { AgGridUtils } from '../../../../shared/utils/AgGridUtils';
import {
  cellClassRulesDebit,
  cellClassRulesCredit,
  cellClassRules,
  DataDictionary
} from 'src/shared/utils/DataDictionary';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import {
  HeightStyle,
  ExcelStyle,
  AutoSizeAllColumns,
  CalTotal,
  CommonCols,
  SetDateRange,
  IgnoreFields,
  moneyFormatter,
  commaFormater
} from 'src/shared/utils/Shared';
import { JournalApiService } from 'src/services/journal-api.service';
import { GridLayoutApiService } from 'src/services/grid-layout-api.service';

@Component({
  selector: 'app-journals-summary',
  templateUrl: './journals-summary.component.html',
  styleUrls: ['./journals-summary.component.css']
})
export class JournalsSummaryComponent implements OnInit {
  private rowData: any[] = [];

  gridOptions: GridOptions;
  colDefs: Array<ColDef | ColGroupDef>;
  pinnedBottomRowData: any;
  fieldsSum: Array<{ name: string; total: number }>;
  gridLayout = 'Select a Layout';
  gridLayouts: string;
  currentLayout: any;
  filters: any;
  internalFilters: {};
  externalFilters: {};
  pageNumber = 0;
  pageSize = 100;
  toggleGridBool = false;
  ignoreFields = IgnoreFields;
  dataRequestCount = 0;
  infiniteCount = null;

  styleForHeight = HeightStyle(228);

  excelParams = {
    fileName: 'Journals Summary',
    sheetName: 'First Sheet'
  };

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: true
  };

  datasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      this.pageNumber = params.request.endRow / this.pageSize;
      const payload = {
        ...params.request,
        externalFilterModel: this.externalFilters,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };

      // console.log('PARAMS :: ', JSON.stringify(params.request, null, 1));
      // console.log('PAYLOAD :: ', JSON.stringify(payload, null, 1));
      // console.log('GET ROWS :: ');

      this.journalApiService.getServerSideJournals(payload).subscribe(
        result => {
          if (result.isSuccessful) {
            this.dataRequestCount++;
            result.payload.forEach(item => {
              item.when = moment(item.when).format('MM-DD-YYYY');
            });
            if (this.pageNumber === 1) {
              this.rowData = result.payload;
            } else {
              this.rowData = result.payload;
            }

            params.successCallback(this.rowData, result.meta.LastRow);
            if (result.meta.LastRow === 0) {
              this.gridOptions.api.showNoRowsOverlay();
            }

            if (result.meta.FooterSum) {
              if (result.meta.LastRow < 0) {
                this.infiniteCount = 'Showing ' + payload.endRow + ' of more';
              } else {
                this.infiniteCount =
                  'Showing ' + result.meta.LastRow + ' of ' + result.meta.LastRow;
              }
              if (this.pinnedBottomRowData != null) {
                this.pinnedBottomRowData[0].source = this.infiniteCount;
                this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
              }
            }

            // if (result.meta.FooterSum && this.pageNumber === 1) {
            //   console.log('FIELDS SUM :: ', this.fieldsSum);
            //   this.resetFieldsSum();
            //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
            // } else if (result.meta.FooterSum) {
            //   console.log('FIELDS SUM :: ', this.fieldsSum);
            //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
            // }

            // this.pinnedBottomRowData = [
            //   {
            //     source: 'Total Records: ' + this.totalRecords,
            //     AccountType: '',
            //     accountName: '',
            //     when: '',
            //     SecurityId: 0,
            //     debit: Math.abs(this.fieldsSum[0].total),
            //     credit: Math.abs(this.fieldsSum[1].total),
            //     balance: Math.abs(this.fieldsSum[0].total) - Math.abs(this.fieldsSum[1].total),
            //     Commission: Math.abs(this.fieldsSum[2].total),
            //     Fees: Math.abs(this.fieldsSum[3].total),
            //     TradePrice: this.fieldsSum[4].total,
            //     NetPrice: Math.abs(this.fieldsSum[5].total),
            //     SettleNetPrice: Math.abs(this.fieldsSum[6].total),
            //     NetMoney: Math.abs(this.fieldsSum[7].total),
            //     LocalNetNotional: Math.abs(this.fieldsSum[8].total),
            //     value: Math.abs(this.fieldsSum[9].total)
            //   }
            // ];
            // this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);

            if (this.dataRequestCount <= 4) {
              AutoSizeAllColumns(this.gridOptions);
            }
            this.gridOptions.api.refreshCells();
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
    private journalApiService: JournalApiService,
    private gridLayoutApiService: GridLayoutApiService,
    private toastrService: ToastrService,
    private dataDictionary: DataDictionary,
    private agGridUtls: AgGridUtils
  ) {
    this.getGridLayouts();
    this.initGird();
    this.initColDefs();
  }

  ngOnInit(): void {}

  getJournalsTotal(payload) {
    this.journalApiService.getServerSideJournalsTotal(payload).subscribe(
      response => {
        if (response.isSuccessful) {
          this.pinnedBottomRowData = [
            {
              source: this.infiniteCount,
              // AccountType: '',
              // accountName: '',
              // when: '',
              // security_id: 0,
              debit: Math.abs(response.payload[0].debit),
              credit: Math.abs(response.payload[0].credit),
              balance: Math.abs(response.payload[0].balance),
              // Commission: Math.abs(this.fieldsSum[2].total),
              // Fees: Math.abs(this.fieldsSum[3].total),
              // TradePrice: this.fieldsSum[4].total,
              // NetPrice: Math.abs(this.fieldsSum[5].total),
              // SettleNetPrice: Math.abs(this.fieldsSum[6].total),
              // NetMoney: Math.abs(this.fieldsSum[7].total),
              // LocalNetNotional: Math.abs(this.fieldsSum[8].total),
              // value: Math.abs(this.fieldsSum[9].total),
              start_price: 0,
              end_price: 0
            }
          ];
          this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        }
      },
      error => {}
    );
  }

  initColDefs() {
    const payload = {
      tableName: 'vwJournal',
      filters: ['fund', 'symbol', 'AccountCategory', 'AccountType', 'AccountName', 'fx_currency']
    };
    this.journalApiService.getServerSideJournalsMeta(payload).subscribe(result => {
      // let commonColDefs = result.payload.Columns;
      // commonColDefs = CommonCols(true, result.payload.Filters);

      // this.colDefs = [
      //   ...commonColDefs,
      //   this.dataDictionary.column('TradePrice', true),
      //   this.dataDictionary.column('NetPrice', true),
      //   this.dataDictionary.column('SettleNetPrice', true),
      //   this.dataDictionary.column('start_price', true),
      //   this.dataDictionary.column('end_price', true),
      //   this.dataDictionary.column('fxrate', true)
      // ];

      // this.gridOptions.api.setColumnDefs(this.colDefs);

      const metaColumns = result.payload.Columns;
      const commonColDefs = CommonCols(true, result.payload.Filters);
      const colDefs = [...commonColDefs, this.dataDictionary.column('fxrate', true)];

      const cdefs = this.agGridUtls.customizeColumns(
        colDefs,
        metaColumns,
        this.ignoreFields,
        true,
        false
      );

      this.gridOptions.api.setColumnDefs(cdefs);
      // console.log('COL DEFS :: ', cdefs);
    });
  }

  initGird() {
    this.gridOptions = {
      rowData: [],
      rowModelType: 'serverSide',
      onFilterChanged: this.onFilterChanged.bind(this),
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

  onFilterChanged(event) {
    this.internalFilters = event.api.serverSideRowModel.cacheParams.filterModel;
    const payload = {
      filterModel: this.internalFilters,
      externalFilterModel: this.externalFilters
    };

    this.getJournalsTotal(payload);
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

  getGridLayouts(): void {
    this.gridLayoutApiService.getGridLayouts(GridId.journalsLedgersId, 1).subscribe(
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

    this.dataRequestCount = 0;
    this.currentLayout = selectedLayout;
    this.restoreLayout(selectedLayout);
    this.gridOptions.api.setServerSideDatasource(this.datasource);
  }

  restoreLayout(layout) {
    // if (layout && layout.Id === 0) {
    //   this.resetState();
    //   return;
    // }

    this.gridLayoutApiService.GetAGridLayout(layout.Id).subscribe(response => {
      this.externalFilters = this.getServerSideExternalFilter(
        JSON.parse(response.payload.ExternalFilterState)
      );
      this.internalFilters = response.payload.FilterState;
      this.gridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState));
      this.gridOptions.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState));
      this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.gridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState));

      const payload = {
        filterModel: this.internalFilters,
        externalFilterModel: this.externalFilters
      };

      this.getJournalsTotal(payload);
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

  resetFieldsSum() {
    return (this.fieldsSum = [
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
  }

  getJournalsSummary(gridLayout: any) {
    this.journalApiService.getJournalSummary(gridLayout.ColumnState).subscribe(
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
            return element.field === 'balance' ? commaFormater(params) : moneyFormatter(params);
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
