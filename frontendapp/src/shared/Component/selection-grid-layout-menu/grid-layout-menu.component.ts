import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { FinancePocServiceProxy } from '../../service-proxies/service-proxies';
import { DataService } from '../../common/data.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-allocation-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.css']
})
export class AllocationGridLayoutMenuComponent implements IToolPanel {
  @ViewChild('confirmModal') confirmationModal: ConfirmationModalComponent;

  setGridFilterObject: any;

  allocationGridOptions: any;
  allocationGridObject: { gridId: number; gridName: string };

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
    this.dataService.allocationGridColApi$.subscribe(obj => (this.allocationGridOptions = obj));
    this.dataService.allocationGridObject$.subscribe(obj => (this.allocationGridObject = obj));
    this.dataService.setGridFilterObject$.subscribe(obj => (this.setGridFilterObject = obj));
  }

  getLayout(): void {
    this.financeService.getGridLayouts(this.allocationGridObject.gridId, 1).subscribe(result => {
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
      this.allocationGridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState));
      this.allocationGridOptions.columnApi.setPivotMode(JSON.parse(response.payload.PivotMode));
      this.allocationGridOptions.columnApi.setColumnGroupState(
        JSON.parse(response.payload.GroupState)
      );
      this.allocationGridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.allocationGridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState));
      this.allocationGridOptions.isExternalFilterPassed(
        JSON.parse(response.payload.ExternalFilterState)
      );
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
      GridId: this.allocationGridObject.gridId,
      GridLayoutName: this.layoutName,
      IsPublic: this.isPublic,
      UserId: 1,
      GridName: this.allocationGridObject.gridName,
      PivotMode: JSON.stringify(this.allocationGridOptions.columnApi.isPivotMode()),
      ColumnState: JSON.stringify(this.allocationGridOptions.columnApi.getColumnState()),
      GroupState: JSON.stringify(this.allocationGridOptions.columnApi.getColumnGroupState()),
      SortState: JSON.stringify(this.allocationGridOptions.api.getSortModel()),
      FilterState: JSON.stringify(this.allocationGridOptions.api.getFilterModel()),
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
          this.allocationGridOptions.clearExternalFilter();
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
    this.allocationGridOptions.columnApi.resetColumnState();
    this.allocationGridOptions.columnApi.resetColumnGroupState();
    this.allocationGridOptions.api.setSortModel(null);
    this.allocationGridOptions.api.setFilterModel(null);
    this.allocationGridOptions.clearExternalFilter();
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
