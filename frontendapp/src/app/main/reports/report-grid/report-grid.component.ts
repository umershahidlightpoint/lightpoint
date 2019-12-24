import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ComponentRef,
  Output,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  SimpleChange
} from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import {
  AutoSizeAllColumns,
  SideBar,
  noColorCategories,
  BracketFormatter
} from 'src/shared/utils/Shared';
import { TrialBalanceReport, TrialBalanceReportStats } from 'src/shared/Models/trial-balance';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ContextMenu } from 'src/shared/Models/common';

@Component({
  selector: 'app-report-grid',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.css']
})
export class ReportGridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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

  initGridData(
    tableHeader: SimpleChange,
    trialBalanceReport: Array<TrialBalanceReport>,
    trialBalanceReportStats: TrialBalanceReportStats
  ) {
    const colDefs = [];
    if (tableHeader === undefined) {
      colDefs.push({
        colId: 'AccountCategory',
        field: 'AccountCategory',
        width: 120
      });
    }
    colDefs.push(...this.initColDefs(tableHeader));

    this.gridOptions.api.setColumnDefs(colDefs);
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
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
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

  initColDefs(headerName): Array<ColDef | ColGroupDef> {
    return [
      {
        colId: 'AccountTyoe',
        field: 'AccountType',
        width: 120,
        headerName
      },
      {
        colId: 'AccountName',
        field: 'AccountName',
        width: 120,
        headerName: 'Account Namne',
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
        valueFormatter: BracketFormatter,
        cellClassRules: {
          // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value < -300; },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
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
              // color: 'red',
              fontStyle: 'italic'
            };
          }
          return { textAlign: 'end' };
        },
        cellClass: params => {
          if (params.data.creditPercentage > 0) {
            return 'credit';
          }
        },
        valueFormatter: BracketFormatter,
        cellClassRules: {
          // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
          redFont(params) {
            if (noColorCategories(params) || params.node.rowPinned) {
              return false;
            } else {
              return params.value !== 0;
            }
          },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
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
            return {}; // { backgroundColor: 'red' };
          }
          if (params.data.accountName !== 'Total' && params.data.balance > 0) {
            return { textAlign: 'end', fontStyle: 'italic' };
          } else if (params.data.accountName !== 'Total' && params.data.balance < 0) {
            return { textAlign: 'end', fontStyle: 'italic' };
          }
        },
        valueFormatter: BracketFormatter,
        cellClassRules: {
          greenFont(params) {
            if (
              params.data !== undefined &&
              (noColorCategories(params) ||
                params.data.AccountCategory === 'Asset' ||
                params.data.AccountCategory === 'Liability' ||
                params.node.rowPinned)
            ) {
              return false;
            } else {
              return params.value > 0;
            }
          },
          redFont(params) {
            if (
              params.data !== undefined &&
              (noColorCategories(params) ||
                params.data.AccountCategory === 'Asset' ||
                params.node.rowPinned)
            ) {
              return false;
            } else if (params.data !== undefined && params.data.AccountCategory === 'Liability') {
              return true;
            } else {
              return params.value < 0;
            }
          },
          footerRow(params) {
            if (params.node.rowPinned) {
              return true;
            } else {
              return false;
            }
          }
        }
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

  getContextMenuItems(params): Array<ContextMenu> {
    return GetContextMenu(true, null, true, null, params);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
