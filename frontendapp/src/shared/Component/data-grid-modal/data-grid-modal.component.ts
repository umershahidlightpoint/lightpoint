import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from "src/shared/Component/grid-layout-menu/grid-layout-menu.component";
import { Style, AutoSizeAllColumns } from "src/shared/utils/Shared";
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: "app-data-grid-modal",
  templateUrl: "./data-grid-modal.component.html",
  styleUrls: ["./data-grid-modal.component.css"]
})
export class DataGridModalComponent implements OnInit {
  @ViewChild("modal", { static: false }) modal: ModalDirective;
  @Input("gridTitle") title: string;

  public gridOptions: GridOptions;

  style = Style;

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: "20px",
      width,
      height,
      boxSizing: "border-box"
    };
  }

  constructor() {
    this.initGrid();
  }

  ngOnInit() {}

  initGrid() {
    this.gridOptions = {
      rowData: null,
      columnDefs: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      getExternalFilterState: () => {
        return {};
      },
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      rowSelection: "single",
      rowGroupPanelShow: "after",
      pivotPanelShow: "always",
      pivotColumnGroupTotals: "after",
      pivotRowTotals: "after",
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true
    } as GridOptions;
  }

  openModal(colDefs, rowData) {
    this.gridOptions.api.setColumnDefs(colDefs);
    this.gridOptions.api.setRowData(rowData);
    this.modal.show();
    // this.gridOptions.api.sizeColumnsToFit();
    AutoSizeAllColumns(this.gridOptions);
  }

  closeModal() {
    this.modal.hide();
  }

  isExternalFilterPresent() {}
}
