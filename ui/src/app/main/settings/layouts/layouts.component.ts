import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { GridLayoutMenuComponent } from '@lightpointfinancialtechnology/lp-toolkit';
import { ToastrService } from 'ngx-toastr';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, HeightStyle, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { DataService } from 'src/services/common/data.service';
import { GridLayoutApiService } from 'src/services/grid-layout-api.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit, AfterViewInit {
  @ViewChild('confirmationModal', { static: false }) confirmModal: ConfirmationModalComponent;
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  gridOptions: GridOptions;
  gridLayouts: any;
  rowData: any;
  isEngineRunning = false;
  hideGrid = false;
  selectedLayout = null;
  gridLayoutJson = null;

  styleForHeight = HeightStyle(180);

  constructor(
    private gridLayoutApiService: GridLayoutApiService,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.initGrid();
  }

  ngOnInit() {}

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
      rowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      getExternalFilterState: () => {
        return {};
      },
      clearExternalFilter: () => {},
      onGridReady: params => {
        this.customizeColumns();
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      alignedGrids: [],
      animateRows: true,
      enableFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(
      GridId.gridLayoutsId,
      GridName.gridLayouts,
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
    this.gridLayoutApiService.getAllGridLayouts().subscribe(
      response => {
        if (response.isSuccessful) {
          this.gridLayouts = response.payload;
          this.rowData = response.payload.map(layout => ({
            gridId: layout.Id,
            userId: layout.UserId,
            gridName: layout.GridName,
            gridLayoutName: layout.GridLayoutName,
            isPublic: layout.IsPublic,
            isDefault: layout.IsDefault,
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
        this.gridOptions.api.sizeColumnsToFit();
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  viewLayout(row) {
    this.gridLayoutJson = JSON.parse(row.gridState);
  }

  showConfirmation(row) {
    this.selectedLayout = row;
    this.confirmModal.showModal();
  }

  deleteLayout() {
    this.gridLayoutApiService.deleteGridLayout(this.selectedLayout.gridId).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Grid layout is successfully deleted!');

          this.gridLayoutJson = null;
          this.getGridLayouts();
        } else {
          this.toastrService.error('Failed to delete grid layout!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }
}
