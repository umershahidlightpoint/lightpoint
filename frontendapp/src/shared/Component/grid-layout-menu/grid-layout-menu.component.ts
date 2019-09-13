import { Component, ChangeDetectorRef } from '@angular/core';
import { IToolPanel, IToolPanelParams, GridOptions } from 'ag-grid-community';
import { FinancePocServiceProxy } from '../../service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../common/data.service';

@Component({
  selector: 'app-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.css']
})
export class GridLayoutMenuComponent implements IToolPanel {
  gridOptions: any;
  gridObject: { gridId: number; gridName: string };
  setGridFilterObject: any;

  private params: IToolPanelParams;
  gridLayoutID: any = 0;
  public: boolean;
  isPublic = false;
  isPublicSelected = false;
  layoutName: any;
  isNewLayout = false;
  canUpdateLayout: any;
  gridLayouts: any;

  compareFn = (a, b) => this._compareFn(a, b);

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  agInit(params: IToolPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('modelUpdated', this.getLayout.bind(this));
    this.dataService.gridColumnApi.subscribe(obj => (this.gridOptions = obj));
    this.dataService.gridObject.subscribe(obj => (this.gridObject = obj));
    this.dataService.setGridFilterObject.subscribe(obj => (this.setGridFilterObject = obj));
  }

  getLayout(): void {
    this.financeService.getGridLayouts(this.gridObject.gridId, 1).subscribe(result => {
      this.gridLayouts = result.payload;
      this.cdRef.detectChanges();
    });
  }

  resetState() {
    this.gridLayoutID = '{ Id: 0 }';
    this.gridOptions.columnApi.resetColumnState();
    this.gridOptions.columnApi.resetColumnGroupState();
    this.gridOptions.api.setSortModel(null);
    this.gridOptions.api.setFilterModel(null);
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

  onEditSave() {
    if (this.canUpdateLayout) {
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

  onNewSave() {
    if (this.layoutName === '') {
      this.toastrService.error('Please enter name');
    }
    this.onSaveState(0);
  }

  onCreateNew() {
    this.isNewLayout = !this.isNewLayout;
    this.layoutName = '';
    return;
  }

  _compareFn(a, b) {
    if (a.Id === 0 || a.Id === null || b.Id === null) {
      return a.Id;
    }
    return a.Id === b.Id;
  }

  refresh() {}
}
