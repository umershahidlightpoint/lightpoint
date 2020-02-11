import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IToolPanel } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { GridLayoutAPIService } from '../../services/grid-layout-api.service';
import {
  GridLayout,
  CustomToolPanelParams,
  CustomGridOptions
} from '../../models/grid-layout.model';
import { GridUtils } from '../../utils/index';

@Component({
  selector: 'lp-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.scss']
})
export class GridLayoutMenuComponent implements IToolPanel {
  @ViewChild('layoutForm', { static: false }) layoutForm: NgForm;
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ConfirmationModalComponent;

  private params: CustomToolPanelParams;
  public dataProperty: string;

  public gridLayouts: GridLayout[];
  public initialLayout: GridLayout = {
    UserId: 0,
    Id: 0,
    GridId: 0,
    GridName: '',
    GridLayoutName: '',
    ColumnState: [],
    GroupState: [],
    PivotMode: false,
    SortState: [],
    FilterState: {},
    ExternalFilterState: {},
    IsPublic: false,
    IsDefault: false
  };
  public activeGridLayout: GridLayout;
  public selectedLayoutIsPublic = false;
  public isLayoutFormMode = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService,
    private gridLayoutAPIService: GridLayoutAPIService
  ) {
    this.activeGridLayout = this.initialLayout;
  }

  agInit(params: CustomToolPanelParams): void {
    this.params = params;
    this.dataProperty = this.params.layoutServices.dataProperty;

    this.getGridLayouts();
  }

  getGridLayouts(): void {
    this.gridLayoutAPIService
      .getGridLayouts(
        this.params.layoutServices.getGridLayouts,
        this.params.userId,
        this.params.gridId
      )
      .subscribe(response => {
        this.gridLayouts = response[this.dataProperty];
        this.activeGridLayout =
          this.gridLayouts.find(
            element => element.GridLayoutName === this.activeGridLayout.GridLayoutName
          ) || this.initialLayout;

        if (this.params.defaultView) {
          this.onSelectLayout(
            this.gridLayouts.find(element => element.GridLayoutName === this.params.defaultView)
          );
        }

        this.cdRef.detectChanges();
      });
  }

  onSelectLayout(layout: GridLayout) {
    if (layout && layout.Id === 0) {
      this.onResetLayout();

      return;
    }

    this.activeGridLayout = layout;
    this.selectedLayoutIsPublic = layout.IsPublic;

    this.gridLayoutAPIService
      .getGridLayout(this.params.layoutServices.getLayoutDetail, layout.Id)
      .subscribe(response => {
        if (this.params.dataSource) {
          this.params.gridOptions.api.setServerSideDatasource(null);
        }

        this.params.gridOptions.columnApi.setColumnState(
          JSON.parse(response[this.dataProperty].ColumnState)
        );
        this.params.gridOptions.columnApi.setPivotMode(
          JSON.parse(response[this.dataProperty].PivotMode)
        );
        this.params.gridOptions.api.setSortModel(JSON.parse(response[this.dataProperty].SortState));
        this.params.gridOptions.api.setFilterModel(
          JSON.parse(response[this.dataProperty].FilterState)
        );
        if ((this.params.gridOptions as CustomGridOptions).setExternalFilter) {
          (this.params.gridOptions as CustomGridOptions).setExternalFilter(
            JSON.parse(response[this.dataProperty].ExternalFilterState)
          );
        }

        const leftPinnedColumns = JSON.parse(response[this.dataProperty].ColumnState)
          .filter(element => element.pinned === 'left')
          .map(element => element.colId);
        const rightPinnedColumns = JSON.parse(response[this.dataProperty].ColumnState)
          .filter(element => element.pinned === 'right')
          .map(element => element.colId);
        if (leftPinnedColumns.length > 0) {
          this.params.gridOptions.columnApi.setColumnsPinned(leftPinnedColumns, 'left');
        }
        if (rightPinnedColumns.length > 0) {
          this.params.gridOptions.columnApi.setColumnsPinned(rightPinnedColumns, 'right');
        }

        if (this.params.dataSource) {
          this.params.gridOptions.api.setServerSideDatasource(this.params.dataSource);
        }
      });
  }

  onSaveLayout() {
    this.saveLayout(0);
  }

  onUpdateLayout() {
    if (this.selectedLayoutIsPublic) {
      this.toastrService.error('Public Grid layouts are not editable!');
    } else {
      this.saveLayout(this.activeGridLayout.Id);
    }
  }

  saveLayout(layoutId: number | string) {
    const gridLayoutPayload: GridLayout = {
      UserId: this.params.userId,
      Id: layoutId,
      GridId: this.params.gridId,
      GridName: this.params.gridName,
      GridLayoutName: this.isLayoutFormMode
        ? this.layoutForm.value.layoutName
        : this.activeGridLayout.GridLayoutName,
      ColumnState: JSON.stringify(this.params.gridOptions.columnApi.getColumnState()),
      PivotMode: JSON.stringify(this.params.gridOptions.columnApi.isPivotMode()),
      GroupState: JSON.stringify(this.params.gridOptions.columnApi.getColumnGroupState()),
      SortState: JSON.stringify(this.params.gridOptions.api.getSortModel()),
      FilterState: JSON.stringify(this.params.gridOptions.api.getFilterModel()),
      ExternalFilterState: (this.params.gridOptions as CustomGridOptions).getExternalFilterState
        ? JSON.stringify((this.params.gridOptions as CustomGridOptions).getExternalFilterState())
        : {},
      IsPublic: this.isLayoutFormMode
        ? this.layoutForm.value.publicLayout
          ? true
          : false
        : this.activeGridLayout.IsPublic
    };

    this.gridLayoutAPIService
      .saveGridLayout(this.params.layoutServices.saveGridLayout, gridLayoutPayload)
      .subscribe(response => {
        if (this.isLayoutFormMode) {
          this.isLayoutFormMode = false;
          this.layoutForm.resetForm();
        }

        this.getGridLayouts();
      });
  }

  onConfirmDeleteLayout() {
    this.gridLayoutAPIService
      .deleteGridLayout(this.params.layoutServices.deleteGridLayout, this.activeGridLayout.Id)
      .subscribe(response => {
        this.onResetLayout();
        this.getGridLayouts();
      });
  }

  trackByFn(index, item) {
    return item.IsDefault;
  }

  onResetLayout() {
    this.activeGridLayout = this.initialLayout;

    this.params.gridOptions.columnApi.resetColumnState();
    this.params.gridOptions.columnApi.resetColumnGroupState();
    this.params.gridOptions.api.setSortModel([]);
    this.params.gridOptions.api.setFilterModel({});
    if ((this.params.gridOptions as CustomGridOptions).clearExternalFilters) {
      (this.params.gridOptions as CustomGridOptions).clearExternalFilters();
    }

    GridUtils.autoSizeAllColumns(this.params.gridOptions);
  }

  onDeleteLayout() {
    this.confirmationModal.showModal();
  }

  refresh() {}
}
