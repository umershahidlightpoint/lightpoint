import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { FinancePocServiceProxy } from '../../service-proxies/service-proxies';
import { DataService } from '../../common/data.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.css']
})
export class GridLayoutMenuComponent implements IToolPanel {
  @ViewChild('confirmModal') confirmationModal: ConfirmationModalComponent;

  gridOptions: any;
  gridObject: { gridId: number; gridName: string };
  setGridFilterObject: any;

  private params: IToolPanelParams;
  gridLayoutID: any = 0;
  layoutName: any;
  gridLayouts: any;
  public: boolean;
  isPublic = false;
  isPublicSelected = false;
  isNewLayout = false;

  compareFn = (a, b) => this._compareFn(a, b);

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  agInit(params: IToolPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('modelUpdated', this.getLayout.bind(this));
    this.dataService.gridColumnApi$.subscribe(obj => (this.gridOptions = obj));
    this.dataService.gridObject$.subscribe(obj => (this.gridObject = obj));
    this.dataService.setGridFilterObject$.subscribe(obj => (this.setGridFilterObject = obj));
  }

  getLayout(): void {
    this.financeService.getGridLayouts(this.gridObject.gridId, 1).subscribe(result => {
      this.gridLayouts = result.payload;
      this.cdRef.detectChanges();
    });
  }

  restoreLayout(layout) {
    if (layout && layout.Id === 0) {
      this.resetState();
      return;
    }
    this.gridLayoutID = layout;
    this.isPublicSelected = layout.IsPublic;
    this.financeService.GetAGridLayout(layout.Id).subscribe(response => {
      this.gridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState));
      this.gridOptions.columnApi.setPivotMode(JSON.parse(response.payload.PivotMode));
      this.gridOptions.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState));
      this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.gridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState));
      this.gridOptions.isExternalFilterPassed(JSON.parse(response.payload.ExternalFilterState));
    });
  }

  onCreateNew() {
    this.isNewLayout = !this.isNewLayout;
    this.layoutName = '';
    return;
  }

  onNewSave() {
    if (this.layoutName === '') {
      this.toastrService.error('Please enter name');
    }
    this.onSaveState(0);
  }

  onEditSave() {
    if (this.isPublicSelected) {
      this.toastrService.error('Public Grid layouts are not editable!');
    } else {
      this.onSaveState(this.gridLayoutID.Id);
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
      ExternalFilterState: JSON.stringify(this.setGridFilterObject)
    };
    this.financeService.saveDataGridState(dataGridStatusObj).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Status saved successfully!');
          this.getLayout();
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
    this.financeService.deleteGridLayout(this.gridLayoutID.Id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Layout deleted successfully!');
          this.resetState();
          this.gridOptions.clearExternalFilter();
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
    this.gridLayoutID = '{ Id: 0 }';
    this.gridOptions.columnApi.resetColumnState();
    this.gridOptions.columnApi.resetColumnGroupState();
    this.gridOptions.api.setSortModel(null);
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.clearExternalFilter();
  }

  openModal() {
    this.confirmationModal.showModal();
  }

  _compareFn(a, b) {
    if (a.Id === 0 || a.Id === null || b.Id === null) {
      return a.Id;
    }
    return a.Id === b.Id;
  }

  refresh() {}
}
