/* Core/Library Imports */
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import * as moment from "moment";
/* Services/Components Imports */
import {
  SideBar,
  Ranges,
  Style,
  IgnoreFields,
  ExcelStyle,
  CalTotalRecords,
  GetDateRangeLabel,
  SetDateRange,
  HeightStyle,
  AutoSizeAllColumns,
  CommonCols,
  CalTotal
} from "src/shared/utils/Shared";
import { GetContextMenu, ViewChart } from "src/shared/utils/ContextMenu";
import { FinancePocServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { PostingEngineService } from "src/shared/common/posting-engine.service";
import { DataService } from "../../../shared/common/data.service";
import { AgGridUtils } from "../../../shared/utils/ag-grid-utils";
import { JournalModalComponent } from "./journal-modal/journal-modal.component";
import { DataModalComponent } from "../../../shared/Component/data-modal/data-modal.component";
import { GridLayoutMenuComponent } from "../../../shared/Component/grid-layout-menu/grid-layout-menu.component";
import { GridId, GridName } from "../../../shared/utils/AppEnums";
import { DataDictionary } from "../../../shared/utils/DataDictionary";
import { ReportModalComponent } from "src/shared/Component/report-modal/report-modal.component";

@Component({
  selector: "app-journals-ledgers",
  templateUrl: "./journals-ledgers.component.html",
  styleUrls: ["./journals-ledgers.component.css"]
})
export class JournalsLedgersComponent implements OnInit, AfterViewInit {
  @ViewChild("journalModal", { static: false })
  journalModal: JournalModalComponent;
  @ViewChild("dataModal", { static: false }) dataModal: DataModalComponent;
  @ViewChild("reportModal", { static: false })
  reportModal: ReportModalComponent;

  private columns: any;

  public rowData: any[] = [];

  isEngineRunning = false;
  hideGrid = false;
  gridOptions: GridOptions;
  gridLayouts: any;
  pinnedBottomRowData;
  totalRecords: number = 0;
  totalDebit: number = 0;
  totalCredit: number = 0;
  fund: any = "All Funds";
  filterBySymbol = "";
  symbol = "";
  DateRangeLabel: string;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  funds: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  page: any;
  pageSize: any;
  tableHeader: string;

  ranges: any = Ranges;

  ignoreFields = IgnoreFields;

  style = Style;

  styleForHeight = HeightStyle(220);

  excelParams = {
    fileName: "Journals",
    sheetName: "First Sheet"
  };

  containerDiv = {
    border: "1px solid #eee",
    padding: "4px",
    marginTop: "20px",
    width: "100%",
    height: "calc(100vh - 125px)",
    boxSizing: "border-box"
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private postingEngineService: PostingEngineService,
    private agGridUtls: AgGridUtils,
    private dataDictionary: DataDictionary
  ) {
    this.hideGrid = false;
    this.DateRangeLabel = "";
    this.initGird();
  }

  ngOnInit() {
    this.isEngineRunning = this.postingEngineService.getStatus();
  }

  initGird() {
    this.gridOptions = {
      rowData: null,
      onCellDoubleClicked: this.openDataModal.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),

      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowSelection: "single",
      rowGroupPanelShow: "after",
      pivotPanelShow: "after",
      pivotColumnGroupTotals: "after",
      pivotRowTotals: "after",
      suppressColumnVirtualisation: true,
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },

      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
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
      GridId.journalsLedgersId,
      GridName.journalsLedgers,
      this.gridOptions
    );
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  customizeColumns(columns: any) {
    const colDefs = [
      ...CommonCols(),
      {
        field: "Quantity",
        aggFunc: "sum",
        width: 100,
        colId: "Quantity",
        headerName: "Quantity",
        sortable: true,
        enableRowGroup: true,
        filter: true,
        type: "numericColumn"
      },
      this.dataDictionary.column("TradePrice"),
      this.dataDictionary.column("NetPrice"),
      this.dataDictionary.column("SettleNetPrice"),
      this.dataDictionary.column("start_price"),
      this.dataDictionary.column("end_price"),
      this.dataDictionary.column("fxrate")
    ];
    const cdefs = this.agGridUtls.customizeColumns(
      colDefs,
      columns,
      this.ignoreFields
    );
    this.gridOptions.api.setColumnDefs(cdefs);
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAllData(true);
      }
    });
  }

  getAllData(initialLoad) {
    this.symbol = "ALL";
    const localThis = this;
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = "";
    this.sortDirection = "";
    this.financeService.getFunds().subscribe(result => {
      const localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      localThis.funds = localfunds;
      localThis.cdRef.detectChanges();
    });

    this.getJournalData(1, 10000, initialLoad);
  }

  getJournalData(pageNumber, pageSize, initialLoad){
    this.financeService
    .getJournals(
      this.symbol,
      pageNumber,
      pageSize,
      this.accountSearch.id,
      this.valueFilter,
      this.sortColum,
      this.sortDirection
    )
    .subscribe(result => {
      if(result.meta.Total > 0){
        pageNumber += 1;
        this.getJournalData(pageNumber, 10000, false);
  
        this.columns = result.meta.Columns;
        this.totalRecords += result.meta.Total;
        //this.rowData = [];
        const someArray = [];
        // tslint:disable-next-line: forin
        for (const item in result.payload) {
          const someObject = {};
          // tslint:disable-next-line: forin
          for (const i in this.columns) {
            const field = this.columns[i].field;
            if (this.columns[i].Type == "System.DateTime") {
              someObject[field] = moment(result.payload[item][field]).format(
                "MM-DD-YYYY"
              );
            } else {
              someObject[field] = result.payload[item][field];
            }
          }
          someArray.push(someObject);
        }
        this.customizeColumns(this.columns);
        this.rowData = this.rowData.concat(someArray as []);
        if(!initialLoad){
          this.gridOptions.api.updateRowData({ add: someArray});
        } else{
          this.gridOptions.api.setRowData(this.rowData);
        }

        this.totalCredit = CalTotal(this.rowData, "credit");
        this.totalDebit = CalTotal(this.rowData, "debit"),
        this.pinnedBottomRowData = [
          {
            source: "Total Records:" + this.totalRecords,
            AccountType: "",
            accountName: "",
            when: "",
            debit: this.totalDebit,
            credit: this.totalCredit,
            balance: Math.abs(this.totalDebit) - Math.abs(this.totalCredit),
            Commission: CalTotal(this.rowData, "Commission"),
            Fees: CalTotal(this.rowData, "Fees"),
            TradePrice: CalTotal(this.rowData, "TradePrice"),
            NetPrice: CalTotal(this.rowData, "NetPrice"),
            SettleNetPrice: CalTotal(this.rowData, "SettleNetPrice"),
            NetMoney: CalTotal(this.rowData, "NetMoney"),
            LocalNetNotional: CalTotal(this.rowData, "LocalNetNotional")
          }
        ];
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        this.gridOptions.api.refreshCells();
        AutoSizeAllColumns(this.gridOptions);
      }
    });
  
  }

  onFilterChanged() {
    this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  getRangeLabel() {
    this.DateRangeLabel = "";
    this.DateRangeLabel = GetDateRangeLabel(this.startDate, this.endDate);
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: "20px",
      width,
      height,
      boxSizing: "border-box"
    };
  }

  ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.getRangeLabel();
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeFund(e) {
    this.fund = e;
    this.gridOptions.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === "Enter" || e.code === "Tab") {
    }
  }

  isExternalFilterPassed(object) {
    const { fundFilter } = object;
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.fund = fundFilter !== undefined ? fundFilter : this.fund;
    this.filterBySymbol =
      symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPresent() {
    if (
      this.fund !== "All Funds" ||
      this.startDate ||
      this.filterBySymbol !== ""
    ) {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (
      this.fund !== "All Funds" &&
      this.filterBySymbol !== "" &&
      this.startDate
    ) {
      const cellFund = node.data.fund;
      const cellSymbol = node.data.Symbol === null ? "" : node.data.Symbol;
      const cellDate = new Date(node.data.when);
      return (
        cellFund === this.fund &&
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }
    if (this.fund !== "All Funds" && this.filterBySymbol !== "") {
      const cellFund = node.data.fund;
      const cellSymbol = node.data.Symbol === null ? "" : node.data.Symbol;
      return cellFund === this.fund && cellSymbol.includes(this.filterBySymbol);
    }
    if (this.fund !== "All Funds" && this.startDate) {
      const cellFund = node.data.fund;
      const cellDate = new Date(node.data.when);
      return (
        cellFund === this.fund &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }
    if (this.filterBySymbol !== "" && this.startDate) {
      const cellSymbol = node.data.Symbol === null ? "" : node.data.Symbol;
      const cellDate = new Date(node.data.when);
      return (
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }
    if (this.fund !== "All Funds") {
      const cellFund = node.data.fund;
      return cellFund === this.fund;
    }
    if (this.startDate) {
      const cellDate = new Date(node.data.when);
      return (
        this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate
      );
    }
    if (this.filterBySymbol !== "") {
      const cellSymbol = node.data.Symbol === null ? "" : node.data.Symbol;
      return cellSymbol
        .toLowerCase()
        .includes(this.filterBySymbol.toLowerCase());
    }
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== ""
        ? { startDate: this.startDate, endDate: this.endDate }
        : null;
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      {
        name: "Edit",
        action: () => {
          this.openEditModal(params.node.data);
        }
      }
    ];
    const addCustomItems = [
      {
        name: "View Chart",
        action: () => {
          const record = ViewChart(params);
          this.tableHeader = record[0];
          this.openChartModal(record[1]);
        }
      }
    ];
    //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(
      false,
      addDefaultItems,
      false,
      addCustomItems,
      params
    );
  }

  clearFilters() {
    this.gridOptions.api.redrawRows();
    this.fund = "All Funds";
    this.filterBySymbol = "";
    this.DateRangeLabel = "";
    this.selected = null;
    this.startDate = moment("01-01-1901", "MM-DD-YYYY");
    this.endDate = moment();
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.api.onFilterChanged();
  }

  getExternalFilterState() {
    return {
      fundFilter: this.fund,
      symbolFilter: this.filterBySymbol,
      dateFilter:
        this.DateRangeLabel !== ""
          ? this.DateRangeLabel
          : {
              startDate:
                this.startDate !== null
                  ? this.startDate.format("YYYY-MM-DD")
                  : "",
              endDate:
                this.endDate !== null ? this.endDate.format("YYYY-MM-DD") : ""
            }
    };
  }

  openJournalModal() {
    this.journalModal.openModal({});
  }

  closeJournalModal() {
    this.getAllData(true);
  }

  closeOrderModal() {
    // this.getAllData();
  }

  openDataModal(row) {
    // We can drive the screen that we wish to display from here
    if (row.colDef.headerName === "Group") {
      return;
    }
    const cols = this.gridOptions.columnApi.getColumnState();
    this.dataModal.openModal(row, cols);
  }

  openEditModal(data) {
    this.journalModal.openModal(data);
  }

  openChartModal(data) {
    this.reportModal.openModal(data);
  }

  refreshGrid() {
    this.totalRecords = 0;
    this.rowData = [];
    this.gridOptions.api.showLoadingOverlay();
    this.getAllData(true);
  }

  setGroupingState(value: boolean) {
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }
}
