import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FinanceServiceProxy } from 'src/services/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import {
  SideBar,
  HeightStyle,
  AutoSizeAllColumns
} from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css']
})
export class LayoutsComponent implements OnInit, AfterViewInit {
  @ViewChild('confirmationModal', { static: false })
  confirmModal: ConfirmationModalComponent;
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<
    any
  >;

  isEngineRunning = false;
  hideGrid = false;
  gridOptions: GridOptions;
  gridLayouts: any;
  rowData: any;
  selectedLayout = null;
  gridLayoutJson = null;

  styleForHeight = HeightStyle(180);

  constructor(
    private financeService: FinanceServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.initGrid();
  }

  ngOnInit() {
    // this.isEngineRunning = this.postingEngineService.getStatus();
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getGridLayouts();
      }
    });
  }

  initGrid() {
    this.gridOptions = {
      rowData: [],
      sideBar: SideBar,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,
      getExternalFilterState: () => {
        return {};
      },
      clearExternalFilter: () => {},
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
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
    this.gridOptions.sideBar = SideBar(
      GridId.gridViewsId,
      GridName.gridViews,
      this.gridOptions
    );
  }

  customizeColumns() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'id',
        headerName: 'gridId',
        hide: true
      },
      {
        field: 'userId',
        headerName: 'User Id'
      },
      {
        field: 'gridName',
        headerName: 'Grid Name'
      },
      {
        field: 'gridLayoutName',
        headerName: 'Grid Layout Name'
      },
      {
        field: 'isPublic',
        headerName: 'Is Public'
      },
      {
        field: 'gridState',
        headerName: 'Grid State',
        hide: true
      },
      {
        headerName: 'Actions',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ];
    this.gridOptions.api.setColumnDefs(colDefs);
  }

  getGridLayouts() {
    this.financeService.getAllGridLayouts().subscribe(
      response => {
        if (response.isSuccessful) {
          this.gridLayouts = response.payload;
          this.rowData = response.payload.map(layout => ({
            gridId: layout.Id,
            userId: layout.UserId,
            gridName: layout.GridName,
            gridLayoutName: layout.GridLayoutName,
            isPublic: layout.IsPublic,
            gridState: `[{
                "ColumnState":  ${layout.ColumnState},
                "GroupState":  ${layout.GroupState},
                "SortState":  ${layout.SortState},
                "FilterState":  ${layout.FilterState},
                "ExternalFilterState":  ${layout.ExternalFilterState},
                "PivotMode":  ${layout.PivotMode}
              }]`
          }));
        }
        this.gridOptions.api.setRowData(this.rowData);

        AutoSizeAllColumns(this.gridOptions);

        this.gridOptions.api.sizeColumnsToFit();
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
    this.customizeColumns();
  }

  viewLayout(row) {
    this.gridLayoutJson = JSON.parse(row.gridState);
  }

  showConfirmation(row) {
    this.selectedLayout = row;
    this.confirmModal.showModal();
  }

  deleteLayout() {
    this.financeService.deleteGridLayout(this.selectedLayout.gridId).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Grid layout is successfully deleted!');
          this.getGridLayouts();
          this.gridLayoutJson = null;
        } else {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }
}
