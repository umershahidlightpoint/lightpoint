import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter,
  Ranges
} from "src/shared/utils/Shared";
import { GridOptions } from "ag-grid-community";
import { GridLayoutMenuComponent } from "src/shared/Component/grid-layout-menu/grid-layout-menu.component";
import { GridId, GridName } from "src/shared/utils/AppEnums";
import { GetContextMenu } from "src/shared/utils/ContextMenu";
import { DecimalPipe } from "@angular/common";
import { FinancePocServiceProxy } from "src/shared/service-proxies/service-proxies";
import { ToastrService } from "ngx-toastr";
import { UtilsConfig } from "src/shared/Models/utils-config";
import * as moment from "moment";
import { DataGridModalComponent } from "src/shared/Component/data-grid-modal/data-grid-modal.component";

@Component({
  selector: "app-market-prices",
  templateUrl: "./market-prices.component.html",
  styleUrls: ["./market-prices.component.css"]
})
export class MarketPricesComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("dataGridModal") dataGridModal: DataGridModalComponent;

  marketPriceGrid: GridOptions;
  selectedDate = null;
  gridData: any;
  fileToUpload: File = null;
  totalGridRows: number;
  isExpanded = false;
  graphObject: any = null;
  disableCharts = true;
  sliderValue = 0;
  uploadLoader = false;
  disableFileUpload = true;
  disableCommit = true;
  title: string;
  filterBySymbol = "";
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;

  ranges: any = Ranges;

  styleForHeight = HeightStyle(224);
  overlappingStyle = { backgroundColor: "#f9a89f" };

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: false
  };
  commitLoader = false;

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.getData();
    this.initGrid();
  }

  getData() {
    this.disableCommit = true;
    this.financeService.getMarketPriceData().subscribe(response => {
      if (response.isSuccessful) {
        this.gridData = response.payload.map(data => ({
          id: data.Id,
          securityId: data.SecurityId,
          businessDate: DateFormatter(data.BusinessDate),
          symbol: data.Symbol,
          event: data.Event,
          price: data.Price,
          modified: false
        }));
        this.marketPriceGrid.api.setRowData(this.gridData);
      }
    });
  }

  initGrid() {
    this.marketPriceGrid = {
      columnDefs: this.getColDefs(),
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: "single",
      rowGroupPanelShow: "after",
      pivotPanelShow: "after",
      singleClickEdit: true,
      pivotColumnGroupTotals: "after",
      pivotRowTotals: "after",
      // enableCellChangeFlash: true,
      // deltaRowDataMode: true,
      animateRows: true,
      onGridReady: params => {
        //this.marketPriceGrid.api = params.api;
        AutoSizeAllColumns(params);
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      onCellValueChanged: params => {
        this.onCellValueChanged(params);
      },
      getRowStyle: params => {
        if (params.data.modified) {
          return this.overlappingStyle;
        }
      },
      getRowNodeId: data => {
        return data.id;
      },
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.marketPriceGrid.sideBar = SideBar(
      GridId.dailyPnlId,
      GridName.dailyPnl,
      this.marketPriceGrid
    );
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.marketPriceGrid.api.setColumnDefs(colDefs);
    this.marketPriceGrid.api.sizeColumnsToFit();
  }

  doesExternalFilterPass(node) {
    const businessDate = new Date(node.data.businessDate);

    if ((this.filterBySymbol !== "" && this.startDate) || this.endDate) {
      return (
        node.data.symbol
          .toLowerCase()
          .includes(this.filterBySymbol.toLowerCase()) &&
        businessDate >= this.startDate.toDate() &&
        businessDate <= this.endDate.toDate()
      );
    }

    if (this.filterBySymbol !== "") {
      return node.data.symbol
        .toLowerCase()
        .includes(this.filterBySymbol.toLowerCase());
    }

    if (this.startDate || this.endDate) {
      return (
        businessDate >= this.startDate.toDate() &&
        businessDate <= this.endDate.toDate()
      );
    }
  }

  isExternalFilterPresent() {
    if (this.startDate || this.endDate || this.filterBySymbol !== "") {
      return true;
    }
  }

  clearFilters() {
    this.marketPriceGrid.api.redrawRows();
    (this.filterBySymbol = ""), (this.selected = null);
    this.startDate = moment("01-01-1901", "MM-DD-YYYY");
    this.endDate = moment();
    this.marketPriceGrid.api.setFilterModel(null);
    this.marketPriceGrid.api.onFilterChanged();
  }

  onCellValueChanged(params) {
    if (params.colDef.field === "price" && params.oldValue != params.newValue) {
      this.disableCommit = false;
      const row = this.marketPriceGrid.api.getRowNode(params.data.id);
      row.setDataValue("modified", true);
    }
  }

  getColDefs() {
    const colDefs = [
      {
        headerName: "Business Date",
        field: "businessDate",
        sortable: true,
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: "Symbol",
        field: "symbol"
      },
      {
        headerName: "Event",
        field: "event"
      },
      {
        headerName: "Price",
        field: "price",
        editable: true,
        sortable: true,
        type: "numericColumn",
        valueFormatter: params =>
          this.numberFormatter(params.node.data.price, false)
      },
      {
        headerName: "Is Modified",
        field: "modified",
        hide: true
      }
    ];

    return colDefs;
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      {
        name: "Visualize",
        action: () => {
          this.visualizeData();
        }
      },
      {
        name: "View",
        action: () => {
          this.openDataGridModal(params);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.financeService.getMarketPriceAudit(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = "Market Price";
      this.dataGridModal.openModal(modifiedCols, payload);
    });
  }

  getAuditColDefs() {
    return [
      {
        headerName: "Business Date",
        field: "BusinessDate",
        sortable: true
      },
      {
        headerName: "Symbol",
        field: "Symbol"
      },
      {
        headerName: "Event",
        field: "Event"
      },
      {
        headerName: "LastUpdatedBy",
        field: "LastUpdatedBy"
      },
      {
        headerName: "LastUpdatedOn",
        field: "LastUpdatedOn"
      },
      {
        headerName: "Price",
        field: "Price"
      },
      {
        headerName: "SecurityId",
        field: "SecurityId"
      }
    ];
  }
  //   BusinessDate: "2018-12-31T00:00:00"
  // Event: "upload"
  // Id: 1
  // LastUpdatedBy: "webservice"
  // LastUpdatedOn: "2019-11-19T15:05:13.397"
  // Price: 16.37
  // SecurityId: 0
  // Symbol: "ACBI"

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
  }

  visualizeData() {
    const focusedCell = this.marketPriceGrid.api.getFocusedCell();
    const selectedRow = this.marketPriceGrid.api.getDisplayedRowAtIndex(
      focusedCell.rowIndex
    ).data;
    const column = focusedCell.column.getColDef().field;
    const columnLabel = focusedCell.column.getUserProvidedColDef().headerName;
    this.graphObject = [{ label: columnLabel, data: [] }];
    const toDate = moment(selectedRow.businessDate);
    const fromDate = moment(selectedRow.businessDate).subtract(30, "days");
    const selectedPortfolio = selectedRow.portFolio;
    this.marketPriceGrid.api.forEachNodeAfterFilter((rowNode, index) => {
      let currentDate = moment(rowNode.data.businessDate);
      if (
        rowNode.data.portFolio === selectedPortfolio &&
        currentDate.isSameOrAfter(fromDate) &&
        currentDate.isSameOrBefore(toDate)
      ) {
        this.graphObject.forEach(element => {
          element.data.push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        });
      }
    });
    this.isExpanded = true;
    this.disableCharts = false;
  }

  commitMarketPriceData() {
    const recordsToCommit = [];
    this.marketPriceGrid.api.forEachNode((node, index) => {
      if (node.data.modified) {
        recordsToCommit.push({
          Id: node.data.id,
          Price: node.data.price
        });
      }
    });
    this.commitLoader = true;
    this.financeService
      .editMarketPriceData(recordsToCommit)
      .subscribe(response => {
        this.commitLoader = false;
        this.disableCommit = true;
        if (response.isSuccessful) {
          this.toastrService.success("Sucessfully Commited.");
          this.getData();
        } else {
          this.toastrService.error("Something went wrong! Try Again.");
        }
      });
  }

  uploadData() {
    let rowNodeId = 1;
    this.uploadLoader = true;
    this.financeService
      .uploadMarketPriceData(this.fileToUpload)
      .subscribe(response => {
        this.uploadLoader = false;
        console.log("Response", response);
        if (response.isSuccessful) {
          this.fileInput.nativeElement.value = "";
          this.disableFileUpload = true;
          this.gridData = response.payload;
          this.marketPriceGrid.api.setRowData(this.gridData);
        } else {
          this.toastrService.error("Something went wrong! Try Again.");
        }
      });
  }

  ngModelChange(date) {
    this.startDate = date.startDate;
    this.endDate = date.endDate;
    this.marketPriceGrid.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.marketPriceGrid.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === "Enter" || e.code === "Tab") {
    }
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.marketPriceGrid.api.onFilterChanged();
  }

  refreshGrid() {
    this.marketPriceGrid.api.showLoadingOverlay();
    this.getData();
  }

  numberFormatter(numberToFormat, isInPercentage) {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, "1.2-2");
    return formattedValue.toString();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }
}
