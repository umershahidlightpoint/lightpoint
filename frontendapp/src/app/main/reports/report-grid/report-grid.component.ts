import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ComponentRef,
  Output,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CommaSeparatedFormat, AutoSizeAllColumns, SideBar } from 'src/shared/utils/Shared';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';

@Component({
  selector: 'app-report-grid',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.css']
})
export class ReportGridComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() tableHeader: string;
  @Input() trialBalanceReport: Array<TrialBalanceReport>;
  @Input() trialBalanceReportStats: TrialBalanceReportStats;
  @Input() hideGrid: boolean;
  @Input() isDataLoaded = false;
  @Input() isTrialBalance = false;
  @Input() externalFilters: any;
  @Output() externalFilterPassed: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearFilters: EventEmitter<any> = new EventEmitter<any>();
  componentRef: ComponentRef<any>;
  gridOptions: GridOptions;
  utilsEvent: any;

  constructor() {}

  ngOnInit() {
    this.initGrid();
  }

  ngAfterViewInit(): void {
    debugger
    AutoSizeAllColumns(this.gridOptions);
    this.gridOptions.api.sizeColumnsToFit();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { tableHeader, trialBalanceReport, trialBalanceReportStats } = changes;
    if (this.isTrialBalance && this.isDataLoaded) {
      this.initGridData(tableHeader, this.trialBalanceReport, this.trialBalanceReportStats);
    } else if (
      trialBalanceReport.currentValue !== undefined &&
      tableHeader.currentValue !== undefined
    ) {
      this.initGridData(
        tableHeader.currentValue,
        trialBalanceReport.currentValue,
        trialBalanceReportStats.currentValue
      );
    }
  }

  initGridData(tableHeader: any, trialBalanceReport: any, trialBalanceReportStats: any) {
    this.gridOptions.api.setColumnDefs(this.initColDefs(tableHeader));
    this.gridOptions.api.setRowData(trialBalanceReport);
    const pinnedBottomRowData = [
      {
        accountName: 'Total ',
        debit: Math.abs(trialBalanceReportStats.totalDebit),
        credit: Math.abs(trialBalanceReportStats.totalCredit),
        balance:
          Math.abs(trialBalanceReportStats.totalDebit) -
          Math.abs(trialBalanceReportStats.totalCredit)
      }
    ];
    this.gridOptions.api.setPinnedBottomRowData(pinnedBottomRowData);
    AutoSizeAllColumns(this.gridOptions);
    this.gridOptions.api.sizeColumnsToFit();
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      // Custom made methods for Grid Menu Layout
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilter: this.clear.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {},
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
    if (this.isTrialBalance) {
      this.gridOptions.sideBar = SideBar(
        GridId.trailBalanceReportId,
        GridName.trailBalanceReport,
        this.gridOptions
      );
    }
  }

  initColDefs(headerName) {
    return [
      {
        colId: 'accountName',
        field: 'accountName',
        width: 120,
        headerName
      },
      {
        colId: 'debit',
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
        colId: 'credit',
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
        colId: 'balance',
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

  isExternalFilterPassed(object) {
    this.externalFilterPassed.emit(object);
  }

  getExternalFilterState() {
    return this.externalFilters;
  }

  clear() {
    this.clearFilters.emit();
  }

  getContextMenuItems(params) {
    return GetContextMenu(true, null, true, null, params);
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
