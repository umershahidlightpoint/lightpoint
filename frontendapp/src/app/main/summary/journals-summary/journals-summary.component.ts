import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { GetContextMenu, ViewChart } from 'src/shared/utils/ContextMenu';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GridId } from '../../../../shared/utils/AppEnums';
import { HeightStyle, ExcelStyle } from 'src/shared/utils/Shared';
import { UtilsConfig } from 'src/shared/Models/utils-config';

@Component({
  selector: 'app-journals-summary',
  templateUrl: './journals-summary.component.html',
  styleUrls: ['./journals-summary.component.css']
})
export class JournalsSummaryComponent implements OnInit, OnDestroy {
  gridLayout = 'Select a Layout';
  gridLayouts: string;
  isSubscriptionAlive: boolean;
  gridOptions: GridOptions;
  toggleGridBool: Boolean = false;

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
    private toastrService: ToastrService
  ) {
    this.isSubscriptionAlive = true;
    this.initGird();
    this.getGridLayouts();
  }

  ngOnInit(): void {}

  toggleGrid() {
    this.toggleGridBool = !this.toggleGridBool;
  }

  getGridLayouts(): void {
    this.financeService
      .getGridLayouts(GridId.journalsLedgersId, 1)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(
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
    this.getJournalsSummary(selectedLayout);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
  }

  initGird() {
    this.gridOptions = {
      rowData: [],
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      // isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      // isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      // doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      // clearExternalFilter: this.clearFilters.bind(this),
      // onFilterChanged: this.onFilterChanged.bind(this),
      // getExternalFilterState: this.getExternalFilterState.bind(this),
      // frameworkComponents: { customToolPanel: GridLayoutMenuComponent },

      // onCellDoubleClicked: this.openDataModal.bind(this),
      // getContextMenuItems: this.getContextMenuItems.bind(this),
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

  getJournalsSummary(gridLayout: any) {
    this.financeService
      .getJournalSummary(gridLayout.ColumnState)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(
        response => {
          if (response.isSuccessful) {
            this.setGridState(response);
          } else {
            this.toastrService.error(response.message);
          }
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
  }

  private setGridState(response: any) {
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

  ngOnDestroy(): void {
    this.isSubscriptionAlive = false;
  }
}
