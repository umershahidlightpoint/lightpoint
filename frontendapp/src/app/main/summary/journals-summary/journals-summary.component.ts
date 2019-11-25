import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { GridId } from '../../../../shared/utils/AppEnums';
import { HeightStyle, ExcelStyle } from 'src/shared/utils/Shared';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';

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

  constructor(private financeService: FinanceServiceProxy, private toastrService: ToastrService) {
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
      // pinnedBottomRowData: null,
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

  setGridState(response: any) {
    const colDefs = response.meta.Columns.map(element => {
      if (element.aggFunc) {
        element = {
          ...element,
          type: 'numericColumn',
          cellClass: 'twoDecimalPlaces',
          cellClassRules: {
            greenFont(params) {
              return params.value > 0;
            },
            redFont(params) {
              return params.value < 0;
            }
          }
        };
      }

      return element;
    });
    this.gridOptions.api.setRowData(response.payload);
    this.gridOptions.api.setColumnDefs(colDefs);
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(true);
      }
    });
  }

  getJournalDetails(params) {
    const filteredColDef = params.columnApi.columnController.columnDefs.filter(
      i => i.rowGroupIndex != null
    );
    const filterList = [];
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
}
