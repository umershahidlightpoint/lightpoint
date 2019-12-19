import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { IToolPanel, IToolPanelParams } from "ag-grid-community";
import { FinanceServiceProxy } from "../../../services/service-proxies";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from "src/shared/Component/confirmation-modal/confirmation-modal.component";
import { GridLayout } from "src/shared/Models/funds-theoretical";
import { AutoSizeAllColumns } from "src/shared/utils/Shared";

@Component({
  selector: "app-grid-layout-menu",
  templateUrl: "./grid-layout-menu.component.html",
  styleUrls: ["./grid-layout-menu.component.css"]
})
export class GridLayoutMenuComponent implements IToolPanel {
  @ViewChild("confirmModal", { static: false })
  confirmationModal: ConfirmationModalComponent;

  gridOptions: any;
  gridObject: { gridId: number; gridName: string };
  setGridFilterObject: any;
  params: IToolPanelParams;

  initialLayout: GridLayout = {
    ColumnState: null,
    ExternalFilterState: null,
    FilterState: null,
    GridId: 0,
    GridLayoutName: "",
    GridName: "",
    GroupState: null,
    Id: 0,
    IsPublic: false,
    PivotMode: null,
    SortState: null,
    UserId: 0
  };

  gridLayout: GridLayout;

  layoutName: string;
  gridLayouts: Array<GridLayout>;
  public: boolean;
  isPublic = false;
  isPublicSelected = false;
  isNewLayout = false;

  constructor(
    private financeService: FinanceServiceProxy,
    private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {
    this.gridLayout = this.initialLayout;
  }

  agInit(params): void {
    this.params = params;
    this.gridObject = { gridId: params.gridId, gridName: params.gridName };
    this.gridOptions = params.gridOptions;
    this.getLayout();
  }

  getLayout(): void {
    this.financeService
      .getGridLayouts(this.gridObject.gridId, 1)
      .subscribe(result => {
        this.gridLayouts = result.payload;
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
    this.financeService.GetAGridLayout(layout.Id).subscribe(response => {
      this.gridOptions.columnApi.setColumnState(
        JSON.parse(response.payload.ColumnState)
      );
      this.gridOptions.columnApi.setPivotMode(
        JSON.parse(response.payload.PivotMode)
      );
      this.gridOptions.columnApi.setColumnGroupState(
        JSON.parse(response.payload.GroupState)
      );
      this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState));
      this.gridOptions.api.setFilterModel(
        JSON.parse(response.payload.FilterState)
      );
      this.gridOptions.isExternalFilterPassed(
        JSON.parse(response.payload.ExternalFilterState)
      );
    });
  }

  onCreateNew() {
    this.isNewLayout = !this.isNewLayout;
    this.layoutName = "";
    return;
  }

  onNewSave() {
    if (this.layoutName === "") {
      return this.toastrService.error("Please enter name");
    }
    this.onSaveState(0);
  }

  onEditSave() {
    if (this.isPublicSelected) {
      this.toastrService.error("Public Grid layouts are not editable!");
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
      GroupState: JSON.stringify(
        this.gridOptions.columnApi.getColumnGroupState()
      ),
      SortState: JSON.stringify(this.gridOptions.api.getSortModel()),
      FilterState: JSON.stringify(this.gridOptions.api.getFilterModel()),
      ExternalFilterState: JSON.stringify(
        this.gridOptions.getExternalFilterState()
      )
    };
    this.financeService.saveDataGridState(dataGridStatusObj).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success("Status saved successfully!");
          this.isNewLayout = false;
          this.getLayout();
        } else {
          this.toastrService.error("Failed to save status!");
        }
      },
      error => {
        this.toastrService.error("Something went wrong. Try again later!");
      }
    );
  }

  onDelete() {
    this.financeService.deleteGridLayout(this.gridLayout.Id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success("Layout deleted successfully!");
          this.resetState();
          this.getLayout();
        } else {
          this.toastrService.error("Failed to delete layout!");
        }
      },
      error => {
        this.toastrService.error("Something went wrong. Try again later!");
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

  openModal() {
    this.confirmationModal.showModal();
  }

  refresh() {}
}
