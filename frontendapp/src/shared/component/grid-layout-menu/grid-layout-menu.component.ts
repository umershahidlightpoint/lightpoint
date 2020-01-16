import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridLayoutApiService } from 'src/services/grid-layout-api.service';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayout } from 'src/shared/Models/funds-theoretical';

@Component({
  selector: 'app-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.css']
})
export class GridLayoutMenuComponent implements IToolPanel {
  @ViewChild('confirmModal', { static: false })
  confirmationModal: ConfirmationModalComponent;

  params: IToolPanelParams;
  gridOptions: any;
  gridObject: { gridId: number; gridName: string; defaultView: string; dataSource: any };
  setGridFilterObject: any;

  initialLayout: GridLayout = {
    ColumnState: null,
    ExternalFilterState: null,
    FilterState: null,
    GridId: 0,
    GridLayoutName: '',
    GridName: '',
    GroupState: null,
    Id: 0,
    IsPublic: false,
    IsDefault: false,
    PivotMode: null,
    SortState: null,
    UserId: 0
  };

  gridLayouts: Array<GridLayout>;
  gridLayout: GridLayout;
  layoutName: string;
  public: boolean;
  isPublic = false;
  isPublicSelected = false;
  isNewLayout = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridLayoutApiService: GridLayoutApiService,
    private toastrService: ToastrService
  ) {
    this.gridLayout = this.initialLayout;
  }

  agInit(params): void {
    this.params = params;
    this.gridObject = {
      gridId: params.gridId,
      gridName: params.gridName,
      defaultView: params.defaultView,
      dataSource: params.dataSource
    };
    this.gridOptions = params.gridOptions;
    this.getLayout();
  }

  trackByFn(index, item) {
    return item.IsDefault;
  }

  getLayout(): void {
    this.gridLayoutApiService.getGridLayouts(this.gridObject.gridId, 1).subscribe(result => {
      this.gridLayouts = result.payload;
      if (this.gridObject.defaultView) {
        this.restoreLayout(
          this.gridLayouts.find(element => element.GridLayoutName === this.gridObject.defaultView)
        );
      }

      this.cdRef.detectChanges();
    });
  }

  restoreLayout(layout) {
    if (layout && layout.Id === 0) {
      this.resetState();
      return;
    }

    this.gridLayout = layout;
    this.isPublicSelected = layout.IsPublic;
    this.gridLayoutApiService.GetAGridLayout(layout.Id).subscribe(response => {
      if (this.gridObject.dataSource) {
        // this.gridOptions.api.setServerSideDatasource([]);
      }

      this.gridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState));
      this.gridOptions.columnApi.setPivotMode(JSON.parse(response.payload.PivotMode));
      // this.gridOptions.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState));
      this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.gridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState));
      this.gridOptions.isExternalFilterPassed(JSON.parse(response.payload.ExternalFilterState));
      const leftPinned = JSON.parse(response.payload.ColumnState)
        .filter(x => x.pinned === 'left')
        .map(x => x.colId);
      const rightPinned = JSON.parse(response.payload.ColumnState)
        .filter(x => x.pinned === 'right')
        .map(x => x.colId);
      if (leftPinned.length > 0) {
        this.gridOptions.columnApi.setColumnsPinned(leftPinned, 'left');
      }
      if (rightPinned.length > 0) {
        this.gridOptions.columnApi.setColumnsPinned(rightPinned, 'right');
      }
      if (this.gridObject.dataSource) {
        // this.gridOptions.api.setServerSideDatasource(this.gridObject.dataSource);
      }
    });
  }


  onCreateNew() {
    this.isNewLayout = !this.isNewLayout;
    this.layoutName = '';

    return;
  }

  onNewSave() {
    if (this.layoutName === '') {
      return this.toastrService.error('Please enter name');
    }

    this.onSaveState(0);
  }

  onEditSave() {
    if (this.isPublicSelected) {
      this.toastrService.error('Public Grid layouts are not editable!');
    } else {
      this.onSaveState(this.gridLayout.Id);
    }
  }

  onSaveState(layoutId) {
    const dataGridStatusObj = {
      Id: layoutId,
      GridId: this.gridObject.gridId,
      GridLayoutName: this.layoutName,
      IsPublic: this.isPublic,
      UserId: 1,
      GridName: this.gridObject.gridName,
      PivotMode: JSON.stringify(this.gridOptions.columnApi.isPivotMode()),
      ColumnState: JSON.stringify(this.gridOptions.columnApi.getColumnState()),
      GroupState: JSON.stringify(this.gridOptions.columnApi.getColumnGroupState()),
      SortState: JSON.stringify(this.gridOptions.api.getSortModel()),
      FilterState: JSON.stringify(this.gridOptions.api.getFilterModel()),
      ExternalFilterState: JSON.stringify(this.gridOptions.getExternalFilterState())
    };
    this.gridLayoutApiService.saveDataGridState(dataGridStatusObj).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Status saved successfully!');
          this.isNewLayout = false;
          this.getLayout();
        } else {
          this.toastrService.error('Failed to save status!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  onDelete() {
    this.gridLayoutApiService.deleteGridLayout(this.gridLayout.Id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Layout deleted successfully!');
          this.resetState();
          this.getLayout();
        } else {
          this.toastrService.error('Failed to delete layout!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  resetState() {
    this.gridLayout = this.initialLayout;
    this.gridOptions.columnApi.resetColumnState();
    this.gridOptions.columnApi.resetColumnGroupState();
    this.gridOptions.api.setSortModel(null);
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.clearExternalFilter();
    AutoSizeAllColumns(this.gridOptions);
  }

  refresh() {}

  openModal() {
    this.confirmationModal.showModal();
  }
}
