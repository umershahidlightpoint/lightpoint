/* Core/Library Imports */
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import 'ag-grid-enterprise';
import { GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import * as moment from 'moment';
/* Services/Components Imports */
import {
  Style,
  IgnoreFields,
  HeightStyle,
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
export class JournalsSummayDetailComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() filters: any;

  private columns: any;
  public rowData: any[] = [];

  gridOptions: GridOptions;
  pinnedBottomRowData;
  totalRecords = 0;
  payloadFilters: any;

  ignoreFields = IgnoreFields;

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
      const payload = {
        pageNumber: params.endRow / 100,
        pageSize: 100,
        filters: this.payloadFilters
      };
      this.financeService.getJournalDetails(payload).subscribe(
        result => {
          if (result.meta.Total > 0) {
            this.columns = result.meta.Columns;
            this.totalRecords += result.meta.Total;
            // this.rowData = [];
            const someArray = [];
            // tslint:disable-next-line: forin
            for (const item in result.payload) {
              const someObject = {};
              // tslint:disable-next-line: forin
              for (const i in this.columns) {
                const field = this.columns[i].field;
                if (this.columns[i].Type == 'System.DateTime') {
                  someObject[field] = moment(result.payload[item][field]).format('MM-DD-YYYY');
                } else {
                  someObject[field] = result.payload[item][field];
                }
              }
              someArray.push(someObject);
            }
            this.customizeColumns(this.columns);
            this.rowData = this.rowData.concat(someArray as []);

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
            this.pinnedBottomRowData = [
              {
                source: 'Total Records:' + this.totalRecords,
                AccountType: '',
                accountName: '',
                when: '',
                SecurityId: 0,
                debit: Math.abs(fieldsSum[0].total),
                credit: Math.abs(fieldsSum[1].total),
                balance: Math.abs(fieldsSum[0].total) - Math.abs(fieldsSum[1].total),
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
            this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
            this.gridOptions.api.refreshCells();
            params.successCallback(this.rowData, -1);
            AutoSizeAllColumns(this.gridOptions);
          } else {
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
      cacheBlockSize: 100,
      paginationPageSize: 100,
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
          } else {
            return '<img src="../images/loading.gif">';
          }
        }
      },
      onGridReady: params => {},
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
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

  customizeColumns(columns: any) {
    const colDefs = [
      ...CommonCols(),
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
      this.dataDictionary.column('TradePrice'),
      this.dataDictionary.column('NetPrice'),
      this.dataDictionary.column('SettleNetPrice'),
      this.dataDictionary.column('start_price'),
      this.dataDictionary.column('end_price'),
      this.dataDictionary.column('fxrate')
    ];
    const cdefs = this.agGridUtls.customizeColumns(colDefs, columns, this.ignoreFields);
    this.gridOptions.api.setColumnDefs(cdefs);
  }
}
