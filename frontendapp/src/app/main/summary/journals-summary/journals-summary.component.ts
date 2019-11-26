import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { GridId } from '../../../../shared/utils/AppEnums';
import { HeightStyle, ExcelStyle } from 'src/shared/utils/Shared';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-journals-summary',
  templateUrl: './journals-summary.component.html',
  styleUrls: ['./journals-summary.component.css']
})
export class JournalsSummaryComponent implements OnInit {
  gridLayout = 'Select a Layout';
  gridLayouts: string;
  gridOptions: GridOptions;
  currentLayout: any;
  filters: any;
  toggleGridBool = false;

  styleForHeight = HeightStyle(228);

  utilsConfig: UtilsConfig = {
    expandGrid: true,
    collapseGrid: true,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: true
  };

  excelParams = {
    fileName: 'Journals Summary',
    sheetName: 'First Sheet'
  };

  constructor(
    private financeService: FinanceServiceProxy,
    private toastrService: ToastrService,
    private decimalPipe: DecimalPipe
  ) {
    this.initGird();
    this.getGridLayouts();
  }

  ngOnInit(): void {}

  toggleGrid() {
    this.toggleGridBool = !this.toggleGridBool;
  }

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
    this.gridOptions.api.showLoadingOverlay();
    this.currentLayout = selectedLayout;
    this.getJournalsSummary(selectedLayout);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getJournalsSummary(this.currentLayout);
  }

  initGird() {
    this.gridOptions = {
      rowData: [],
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

  getContextMenuItems(params) {
    const addDefaultItems = [];
    if (!params.node.group) {
      addDefaultItems.push({
        name: 'Details',
        action: () => {
          this.getJournalDetails(params);
          this.toggleGridBool = true;
        }
      });
    }

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
    const colDefs = response.meta.Columns.map(element => {
      if (element.aggFunc) {
        element = {
          ...element,
          type: 'numericColumn',
          valueFormatter: params => {
            return this.numberFormatter(params.value);
          },
          cellClassRules: {
            greenFont(params) {
              if (params.node.rowPinned) {
                return false;
              }
              return params.colDef.headerName === 'balance' && params.value > 0;
            },
            redFont(params) {
              if (params.node.rowPinned) {
                return false;
              }
              return (
                params.colDef.headerName === 'creditSum' ||
                (params.colDef.headerName === 'balance' && params.value < 0)
              );
            },
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        };
      }
      return element;
    });
    const pinnedBottomRowData = this.getBottomRowData(response);

    this.gridOptions.api.setRowData(response.payload);
    this.gridOptions.api.setPinnedBottomRowData(pinnedBottomRowData);
    this.gridOptions.api.setColumnDefs(colDefs);
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(true);
      }
    });
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

  numberFormatter(numberToFormat) {
    return this.decimalPipe.transform(numberToFormat, '1.2-2');
  }
}
