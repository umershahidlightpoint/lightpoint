import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ComponentRef
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CommaSeparatedFormat } from 'src/shared/utils/Shared';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';

@Component({
  selector: 'app-report-grid',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.css']
})
export class ReportGridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() isLoading = false;
  @Input() isTrialBalance = false;
  @Input() hideGrid: boolean;
  @Input() tableHeader: string;
  componentRef: ComponentRef<any>;
  gridOptions: GridOptions;

  constructor() {}

  async ngOnInit() {
    this.initGrid();
  }

  async ngOnChanges(changes: SimpleChanges) {
    const { tableHeader, trialBalanceReport, trialBalanceReportStats, isTrialBalance } = changes;
    if (isTrialBalance) {
      await this.initGrid();
    }
    if (trialBalanceReport.currentValue !== undefined && tableHeader.currentValue !== undefined) {
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
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      onGridReady: params => {
        // this.gridColumnApi = params.columnApi;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
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

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
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
