/* Core/Library Imports */
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
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
export class JournalsSummayDetailComponent implements OnInit, AfterViewInit {
  private columns: any;

  public rowData: any[] = [];

  hideGrid = false;
  gridOptions: GridOptions;
  pinnedBottomRowData;
  totalRecords = 0;
  symbol = '';
  funds: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  page: any;
  pageSize: any;
  isDataStreaming = false;

  ignoreFields = IgnoreFields;

  style = Style;

  styleForHeight = HeightStyle(220);

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private financeService: FinanceServiceProxy,
    private dataService: DataService,
    private agGridUtls: AgGridUtils,
    private dataDictionary: DataDictionary
  ) {
    this.hideGrid = false;
    this.initGird();
  }

  ngOnInit() {}

  initGird() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,

      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
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
    const cdefs = this.agGridUtls.customizeColumns(
      colDefs,
      columns,
      this.ignoreFields
    );
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAllData(true);
      }
    });
  }

  getAllData(initialLoad) {
    this.isDataStreaming = true;
    this.symbol = 'ALL';
    const localThis = this;
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';
    this.financeService.getFunds().subscribe(result => {
      const localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      localThis.funds = localfunds;
      localThis.cdRef.detectChanges();
    });

    this.getJournalData(1, 10000, initialLoad);
  }

  getJournalData(pageNumber, pageSize, initialLoad) {
    this.financeService
      .getJournals(
        this.symbol,
        pageNumber,
        pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(
        result => {
          if (result.meta.Total > 0) {
            pageNumber += 1;
            this.getJournalData(pageNumber, 10000, false);

            this.columns = result.meta.Columns;
            this.totalRecords += result.meta.Total;
            //this.rowData = [];
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
            this.rowData = this.rowData.concat(someArray as []);
            if (!initialLoad) {
              this.gridOptions.api.updateRowData({ add: someArray });
            } else {
              this.gridOptions.api.setRowData(this.rowData);
            }

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
                source: 'Total Records:' + this.totalRecords,
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
            this.gridOptions.api.setPinnedBottomRowData(
              this.pinnedBottomRowData
            );
            this.gridOptions.api.refreshCells();
            AutoSizeAllColumns(this.gridOptions);
          } else {
            this.isDataStreaming = false;
          }
        },
        error => {
          this.isDataStreaming = false;
        }
      );
  }
}
