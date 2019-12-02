/* Core/Library Imports */
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import 'ag-grid-enterprise';
import {
  GridOptions,
  IDatasource,
  IGetRowsParams,
  ColDef,
  ColGroupDef
} from 'ag-grid-community';
import * as moment from 'moment';
/* Services/Components Imports */
import {
  IgnoreFields,
  AutoSizeAllColumns,
  CommonCols,
  CalTotal
} from 'src/shared/utils/Shared';
import { FinanceServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { DataService } from '../../../../shared/common/data.service';
import { AgGridUtils } from '../../../../shared/utils/AgGridUtils';
import { DataDictionary } from '../../../../shared/utils/DataDictionary';

@Component({
  selector: 'app-journals-summay-detail',
  templateUrl: './journals-summay-detail.component.html',
  styleUrls: ['./journals-summay-detail.component.css']
})
export class JournalsSummayDetailComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() filters: any;

  private columns: Array<any>;
  rowData: any[] = [];

  gridOptions: GridOptions;
  payloadFilters: any;
  pinnedBottomRowData: any;
  pageSize = 100;
  totalRecords = 0;
  overallTotalRecords = 0;

  ignoreFields = IgnoreFields;
  groupSelectionChanges = false;

  excelParams = {
    fileName: 'Journals',
    sheetName: 'First Sheet'
  };

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  journalsDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      let gridPayloadFilters = [];
      if (this.groupSelectionChanges) {
        gridPayloadFilters = this.payloadFilters;
      } else {
        const customFilters = [];
        for (const key of Object.keys(params.filterModel)) {
          const filterData = [];
          filterData.push(params.filterModel[key].filter);
          customFilters.push({
            column: key,
            data: filterData
          });
        }
        for (let i = 0; i < this.payloadFilters.length; i++) {
          let found = false;
          let filterData = [];
          for (let j = 0; j < customFilters.length; j++) {
            if (customFilters[j].column == this.payloadFilters[i].column) {
              found = true;
              customFilters[j].data[0] = this.payloadFilters[i].data[0];
            }
          }
          if (!found) {
            filterData.push(this.payloadFilters[i].data[0]);
            customFilters.push({
              column: this.payloadFilters[i].column,
              data: filterData
            });
          }
        }

        // for (let i = 0; i < this.payloadFilters.length; i++) {
        //   var filterInstance = this.gridOptions.api.getFilterInstance(this.payloadFilters[i].column);
        //   var model = filterInstance.getModel();
        //   let found = false;
        //   let filterData = [];
        //   for (let j = 0; j < customFilters.length; j++) {
        //     if(customFilters[j].column == this.payloadFilters[i].column){
        //       found = true;
        //       customFilters[j].data[0] = model.filter;
        //     }
        //   }
        //   if (!found) {
        //     filterData.push(model.filter);
        //     customFilters.push({
        //       column: this.payloadFilters[i].column,
        //       data: filterData
        //     });
        //   }
        // }

        gridPayloadFilters = customFilters;
      }

      const payload = {
        pageNumber: params.endRow / this.pageSize,
        pageSize: this.pageSize,
        filters: gridPayloadFilters
      };

      if (payload.pageNumber === 1) {
        this.rowData = [];
        this.totalRecords = 0;
        this.overallTotalRecords = 0;
      }

      this.financeService.getJournalDetails(payload).subscribe(
        result => {
          if (result.meta.Total >= 0) {
            this.columns = result.meta.Columns;
            this.totalRecords += result.meta.Total;
            this.overallTotalRecords =
              params.endRow / this.pageSize === 1
                ? result.meta.TotalRecords
                : this.overallTotalRecords;

            const someArray = [];
            // tslint:disable-next-line: forin
            for (const item in result.payload) {
              const someObject = {};
              // tslint:disable-next-line: forin
              for (const i in this.columns) {
                const field = this.columns[i].field;
                if (this.columns[i].Type == 'System.DateTime') {
                  someObject[field] = moment(
                    result.payload[item][field]
                  ).format('MM-DD-YYYY');
                } else {
                  someObject[field] = result.payload[item][field];
                }
              }
              someArray.push(someObject);
            }

            this.customizeColumns(this.columns);

            if (this.groupSelectionChanges) {
              this.groupSelectionChanges = false;
              // setTimeout(() => {
              //   this.clearAllFilters();
              //   var model = {} as any;
              // for (let i = 0; i < this.payloadFilters.length; i++) {
              //   // Get Filter Model
              //   model[this.payloadFilters[i].column] = this.payloadFilters[i].data[0];

              //   var filterInstance = this.gridOptions.api.getFilterInstance(this.payloadFilters[i].column);
              //   filterInstance.setModel({
              //     type:'equals',
              //     filter: this.payloadFilters[i].data[0]
              // });

              // let modelTemp = filterInstance.getModel();
              // }
              // this.customizeColumns(this.columns);
              // }, 1);
            }

            this.rowData = this.rowData.concat(someArray as []);

            const fieldsSum: Array<{ name: string; total: number }> = CalTotal(
              this.rowData,
              [
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
              ]
            );
            this.pinnedBottomRowData = [
              {
                id: '',
                source:
                  'Displaying Records: ' +
                  this.totalRecords +
                  '/' +
                  this.overallTotalRecords,
                AccountType: '',
                accountName: '',
                when: '',
                SecurityId: 0,
                debit: Math.abs(fieldsSum[0].total),
                credit: Math.abs(fieldsSum[1].total),
                balance:
                  Math.abs(fieldsSum[0].total) - Math.abs(fieldsSum[1].total),
                Commission: fieldsSum[2].total,
                Fees: fieldsSum[3].total,
                TradePrice: fieldsSum[4].total,
                NetPrice: fieldsSum[5].total,
                SettleNetPrice: fieldsSum[6].total,
                NetMoney: fieldsSum[7].total,
                LocalNetNotional: fieldsSum[8].total,
                value: fieldsSum[9].total
              }
            ];

            const lastRow = () => {
              if (this.overallTotalRecords <= this.pageSize) {
                return this.overallTotalRecords;
              } else if (this.totalRecords !== this.overallTotalRecords) {
                return -1;
              } else {
                return this.totalRecords;
              }
            };

            params.successCallback(this.rowData, lastRow());
            this.gridOptions.api.setPinnedBottomRowData(
              this.pinnedBottomRowData
            );
            this.gridOptions.api.refreshCells();
            AutoSizeAllColumns(this.gridOptions);
          } else {
            params.failCallback();
          }
        },
        error => {
          this.groupSelectionChanges = false;
          params.failCallback();
        }
      );
    }
  };

  constructor(
    private financeService: FinanceServiceProxy,
    private agGridUtls: AgGridUtils,
    private dataDictionary: DataDictionary
  ) {
    this.initGird();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const { filters } = changes;
    if (filters.currentValue !== undefined) {
      this.groupSelectionChanges = true;
      this.payloadFilters = filters.currentValue;
      this.totalRecords = 0;
      this.rowData = [];
      this.gridOptions.api.showLoadingOverlay();
      this.gridOptions.api.setDatasource(this.journalsDataSource);
    }
  }

  initGird() {
    this.gridOptions = {
      rowData: null,
      rowModelType: 'infinite',
      cacheBlockSize: this.pageSize,
      paginationPageSize: this.pageSize,
      pinnedBottomRowData: null,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      components: {
        loadingRenderer: params => {
          if (params.value !== undefined) {
            return params.value;
          } else if (params.colDef.field === 'id') {
            return '<img src="../../../../assets/images/loader.gif">';
          }
        }
      },
      onGridReady: params => {},
      onFirstDataRendered: params => {},
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

  clearAllFilters() {
    this.gridOptions.api.setFilterModel(null);
  }

  customizeColumns(columns: any) {
    const colDefs = [
      ...CommonCols(false),
      {
        field: 'Quantity',
        aggFunc: 'sum',
        width: 100,
        colId: 'Quantity',
        headerName: 'Quantity',
        sortable: true,
        enableRowGroup: true,
        filter: true,
        type: 'numericColumn'
      },
      this.dataDictionary.column('TradePrice', false),
      this.dataDictionary.column('NetPrice', false),
      this.dataDictionary.column('SettleNetPrice', false),
      this.dataDictionary.column('start_price', false),
      this.dataDictionary.column('end_price', false),
      this.dataDictionary.column('fxrate', false)
    ];
    const cdefs = this.agGridUtls.customizeColumns(
      colDefs,
      columns,
      this.ignoreFields,
      false
    );

    cdefs.forEach(col => {
      if (col.field === 'id') {
        col.cellRenderer = 'loadingRenderer';
      }
    });

    this.gridOptions.api.setColumnDefs(cdefs);
  }
}
