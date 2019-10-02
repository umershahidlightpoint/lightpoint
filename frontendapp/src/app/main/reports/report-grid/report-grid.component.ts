import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CommaSeparatedFormat } from 'src/shared/utils/Shared';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';

@Component({
  selector: 'app-report-grid',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.css']
})
export class ReportGridComponent implements OnInit, OnChanges {
  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() isLoading = false;
  @Input() isTrialBalance = false;
  @Input() hideGrid: boolean;
  @Input() tableHeader: string;

  gridOptions: GridOptions;

  constructor() {}

  async ngOnInit() {
    this.initGrid();
    console.log('ngOnInit');
  }

  async ngOnChanges(changes: SimpleChanges) {
    const { tableHeader, trialBalanceReport, trialBalanceReportStats, isTrialBalance } = changes;
    console.log('changes', changes);
    if (isTrialBalance) {
      await this.initGrid();
    }
    if (trialBalanceReport.currentValue !== undefined) {
      console.log('inside', changes);
      this.gridOptions.api.setColumnDefs(this.initColDefs(tableHeader.currentValue));
      this.gridOptions.api.setRowData(trialBalanceReport.currentValue);
      const pinnedBottomRowData = [
        {
          accountName: 'Total ',
          debit: Math.abs(trialBalanceReportStats.currentValue.totalDebit),
          credit: Math.abs(trialBalanceReportStats.currentValue.totalCredit),
          balance:
            Math.abs(trialBalanceReportStats.currentValue.totalDebit) -
            Math.abs(trialBalanceReportStats.currentValue.totalCredit)
        }
      ];
      this.gridOptions.api.setPinnedBottomRowData(pinnedBottomRowData);
    }
  }

  async initGrid() {
    this.gridOptions = {
      rowData: null,
      // sideBar: SideBar,
      pinnedBottomRowData: null,
      // frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      // onFilterChanged: this.onFilterChanged.bind(this),
      // isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      // isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      // doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      // clearExternalFilter: this.clearFilters.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      // getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        // this.gridColumnApi = params.columnApi;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
        // AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
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
    console.log('initGrid', this.gridOptions);
  }

  initColDefs(headerName) {
    return [
      {
        field: 'accountName',
        width: 120,
        headerName,
        enableRowGroup: true
      },
      {
        field: 'debit',
        width: 120,
        headerName: 'Debit',
        cellStyle: params => {
          if (params.data.debitPercentage > 0) {
            return {
              backgroundSize: !params.data.debitPercentage ? 0 : params.data.debitPercentage + '%',
              backgroundRepeat: 'no-repeat'
            };
          }
          return { textAlign: 'end' };
        },
        cellClass: params => {
          if (params.data.debitPercentage > 0) {
            return 'debit';
          }
        },
        valueFormatter: currencyFormatter
      },
      {
        field: 'credit',
        headerName: 'Credit',
        filter: true,
        width: 120,
        cellStyle: params => {
          if (params.data.creditPercentage > 0) {
            return {
              backgroundSize: !params.data.creditPercentage
                ? 0
                : params.data.creditPercentage + '%',
              backgroundRepeat: 'no-repeat',
              color: 'red'
            };
          }
          return { textAlign: 'end', color: 'red' };
        },
        cellClass: params => {
          if (params.data.creditPercentage > 0) {
            return 'credit';
          }
        },
        valueFormatter: currencyFormatter
      },
      {
        field: 'balance',
        headerName: 'Balance',
        width: 100,
        filter: true,
        cellClass: 'rightAlign',
        sortable: true,
        cellStyle: params => {
          if (params.data.accountName === 'Total' && params.data.balance !== 0) {
            return { backgroundColor: 'red' };
          }
          if (params.data.accountName !== 'Total' && params.data.balance > 0) {
            return { textAlign: 'end', color: 'green' };
          } else if (params.data.accountName !== 'Total' && params.data.balance < 0) {
            return { textAlign: 'end', color: 'red' };
          }
        },
        valueFormatter: absCurrencyFormatter
      }
    ];
  }
}

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function absCurrencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(Math.abs(params.value));
}