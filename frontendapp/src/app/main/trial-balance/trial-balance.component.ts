import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  Injector,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { FinancePocServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { GridOptions } from "ag-grid-community";
import "ag-grid-enterprise";
import * as moment from "moment";

@Component({
  selector: "trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["./trial-balance.component.css"]
})
export class TrialGridExampleComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private selectedValue;
  private columns: any;

  totalRecords: number;
  rowGroupPanelShow: any;
  sideBar: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  DateRangeLable: any;
  pinnedBottomRowData;
  gridOptions: GridOptions;
  filterChange: any;
  rowSelection: string = "single";
  //topOptions = {alignedGrids: [], suppressHorizontalScroll: true};
  // bottomOptions = { alignedGrids: [] };

  selected: { startDate: moment.Moment; endDate: moment.Moment };

  @ViewChild("journalGrid") journalGrid;
  // @ViewChild('bottomGrid') bottomGrid;
  @ViewChild("dateRangPicker") dateRangPicker;
  @ViewChild("greetCell") greetCell: TemplateRef<any>;
  @ViewChild("divToMeasureJournal") divToMeasureElement: ElementRef;
  @ViewChild("divToMeasureLedger") divToMeasureElementLedger: ElementRef;
  columnDefs: any;
  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund: any = "All Funds";
  endDate: any;

  symbol: string;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;

  title = "app";
  style = {
    marginTop: "20px",
    width: "100%",
    height: "100%",
    boxSizing: "border-box"
  };

  styleForHight = {
    marginTop: "20px",
    width: "100%",
    height: "calc(100vh - 220px)",
    boxSizing: "border-box"
  };

  ranges: any = {
    ITD: [moment("01-01-1901", "MM-DD-YYYY"), moment()],
    YTD: [moment().startOf("year"), moment()],
    MTD: [moment().startOf("month"), moment()],
    Today: [moment(), moment()]
  };

  constructor(
    injector: Injector,
    private cdRef: ChangeDetectorRef,
    private _fundsService: FinancePocServiceProxy
  ) {
    injector;
    // Setup of the SideBar
    this.sideBar = {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel"
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel"
        }
      ],
      defaultToolPanel: ""
    };

    this.gridOptions = <GridOptions>{
      rowData: null,
      /*      onFilterChanged: function() {  
      
              this.gridOptions.api.forEachNodeAfterFilter( function(rowNode, index) {
                console.log('node ' + rowNode.data.debit + ' passes the filter');
            } )},
      
      */
      //columnDefs: this.columnDefs,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),

      onGridReady: params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        //this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.excelStyles = [
          {
            id: "twoDecimalPlaces",
            numberFormat: { format: "#,##0" }
          },
          {
            id: "footerRow",
            font: {
              bold: true
            }
          },
          {
            id: "greenBackground",
            interior: {
              color: "#b5e6b5",
              pattern: "Solid"
            }
          },
          {
            id: "redFont",
            font: {
              fontName: "Calibri Light",

              italic: true,
              color: "#ff0000"
            }
          },

          {
            id: "header",
            interior: {
              color: "#CCCCCC",
              pattern: "Solid"
            },
            borders: {
              borderBottom: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderLeft: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderRight: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              },
              borderTop: {
                color: "#5687f5",
                lineStyle: "Continuous",
                weight: 1
              }
            }
          }
        ];
      },
      onFirstDataRendered: params => {
        //params.api.sizeColumnsToFit();
        params.api.forEachNode(function(node) {
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
    };
  }

  ngOnInit() {}

  public onBtForEachNodeAfterFilter() {
    this.gridOptions.api.forEachNodeAfterFilter(function(rowNode, index) {
    });
  }

  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  ignoreFields = [
    "id",
    "totalDebit",
    "totalCredit",
    "overall_count",
    "account_id",
    "value",
    "LpOrderId"
  ];

  customizeColumns(columns: any) {
    let colDefs = [
      {
        field: "source",
        minWidth: 300,
        headerName: "Source",
        colId: "greet"
        /*
        cellRendererFramework: TemplateRendererComponent, cellRendererParams: {
          ngTemplate: this.greetCell
        },
        cellClassRules: {
          footerRow: function (params) { if (params.node.rowPinned) return true; else return false; }
        },
        */
      },
      {
        field: "fund",
        headerName: "Fund",
        enableRowGroup: true,
        filter: true,
        width: 120
      },
      {
        field: "AccountCategory",
        headerName: "Category",
        enableRowGroup: true,
        rowGroup: true,
        width: 100,
        filter: true
      },

      {
        field: "AccountType",
        headerName: "Type",
        enableRowGroup: true,
        rowGroup: true,
        width: 200,
        filter: true
      },
      {
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: "when",
        headerName: "when",
        sortable: true,
        enableRowGroup: true,
        width: 100,
        filter: "agDateColumnFilter",
        filterParams: {
          comparator: function(filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(
              Number(dateParts[2]),
              Number(dateParts[1]) - 1,
              Number(dateParts[0])
            );

            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
              return 0;
            }

            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }

            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        }
      },
      {
        field: "debit",
        aggFunc: "sum",
        headerName: "$Debit",
        valueFormatter: currencyFormatter,
        width: 100,
        cellStyle: { "text-align": "right" },
        cellClass: "twoDecimalPlaces",
        cellClassRules: {
          //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value < -300; },
          greenFont: function(params) {
            if (params.node.rowPinned) return false;
            else return params.value > 0;
          },
          redFont: function(params) {
            if (params.node.rowPinned) return false;
            else return params.value < 0;
          },
          footerRow: function(params) {
            if (params.node.rowPinned) return true;
            else return false;
          }
        }
      },
      {
        field: "credit",
        aggFunc: "sum",
        headerName: "$Credit",
        valueFormatter: currencyFormatter,
        width: 100,
        cellStyle: { "text-align": "right" },
        cellClass: "twoDecimalPlaces",
        cellClassRules: {
          //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
          greenFont: function(params) {
            if (params.node.rowPinned) return false;
            else return params.value > 0;
          },
          redFont: function(params) {
            if (params.node.rowPinned) return false;
            else return params.value < 0;
          },
          footerRow: function(params) {
            if (params.node.rowPinned) return true;
            else return false;
          }
        }
      },

      {
        field: "TradeCurrency",
        width: 100,
        headerName: "Trade Ccy",
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: "SettleCurrency",
        headerName: "Settle Ccy",
        sortable: true,
        enableRowGroup: true,
        filter: true,
        width: 100
      },
      {
        field: "Symbol",
        headerName: "Symbol",
        sortable: true,
        enableRowGroup: true,
        filter: true
      },
      {
        field: "Side",
        headerName: "Side",
        sortable: true,
        enableRowGroup: true,
        filter: true,
        width: 100
      }
    ];

    let cdefs = Object.assign([], colDefs);

    for (var i in this.columns) {
      let column = this.columns[i];

      // Check to see if it's an ignored field
      if (this.ignoreFields.filter(i => i == column.field).length == 0) {
        // Check to see if we have not already defined it
        if (cdefs.filter(i => i.field == column.field).length == 0) {
          let clone = { ...colDefs[0] };
          clone.field = column.field;
          clone.headerName = column.headerName;
          clone.filter = column.filter;
          clone.colId = undefined;
          if (
            column.Type == "System.Int32" ||
            column.Type == "System.Decimal" ||
            column.Type == "System.Double"
          ) {
            clone.cellStyle = { "text-align": "right" };
            clone.cellClass = "twoDecimalPlaces";
            clone.valueFormatter = currencyFormatter;
            clone.cellClassRules = {
              //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
              greenFont: function(params) {
                if (params.node.rowPinned) return false;
                else return params.value > 0;
              },
              redFont: function(params) {
                if (params.node.rowPinned) return false;
                else return params.value < 0;
              },
              footerRow: function(params) {
                if (params.node.rowPinned) return true;
                else return false;
              }
            };
          } else if (column.Type == "System.DateTime") {
            clone.enableRowGroup = true;
            clone.cellStyle = { "text-align": "right" };
            clone.cellClass = "twoDecimalPlaces";
            clone.minWidth = 50;
          } else {
            clone.enableRowGroup = true;
          }

          cdefs.push(clone);
        }
      }
    }

    this.gridOptions.api.setColumnDefs(cdefs);
  }

  // selected: {startDate: moment().startOf('month'), endDate: moment()};

  ngAfterViewInit() {
    this.getTrialBalance();
  }

  getTrialBalance() {
    this.gridOptions.onFilterChanged = function() {
      let tTotal = 0;
      let tCredit = 0;
      let tDebit = 0;
      this.api.forEachNodeAfterFilter(function(rowNode, index) {
        tTotal += 1;
        tCredit += rowNode.data.credit;
        tDebit += rowNode.data.debit;
      });

      this.pinnedBottomRowData = [
        {
          source: "Total Records: " + tTotal,
          AccountType: "",
          accountName: "",
          when: "",
          debit: tDebit,
          credit: tCredit
        }
      ];
      //this.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };

    this.rowGroupPanelShow = "after";
    //this.pivotPanelShow = "always";
    //this.pivotColumnGroupTotals = "after";
    //this.pivotRowTotals = "before";

    //align scroll of grid and footer grid
    // this.gridOptions.alignedGrids.push(this.bottomOptions);
    // this.bottomOptions.alignedGrids.push(this.gridOptions);

    this.symbol = "ALL";

    let localThis = this;

    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = "";
    this.sortDirection = "";
    this._fundsService.getFunds().subscribe(result => {
      let localfunds = result.payload.map(item => ({
        FundCode: item.FundCode
      }));
      localThis.funds = localfunds;
      localThis.cdRef.detectChanges();
    });
    this._fundsService
      .getJournals(
        this.symbol,
        this.page,
        this.pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(result => {
        this.columns = result.meta.Columns;
        this.totalRecords = result.meta.Total;
        this.totalCredit = result.stats.totalCredit;
        this.totalDebit = result.stats.totalDebit;

        this.rowData = [];
        let someArray = [];

        for (var item in result.data) {
          let someObject = {};
          for (var i in this.columns) {
            let field = this.columns[i].field;
            if (this.columns[i].Type == "System.DateTime") {
              someObject[field] = moment(result.data[item][field]).format(
                "MM-DD-YYYY"
              );
            } else {
              someObject[field] = result.data[item][field];
            }
          }
          someArray.push(someObject);
        }
        this.customizeColumns(this.columns);
        this.rowData = someArray as [];
        this.pinnedBottomRowData = [
          {
            source: "Total Records:" + this.totalRecords,
            AccountType: "",
            accountName: "",
            when: "",
            debit: this.totalCredit,
            credit: this.totalDebit
          }
        ];
        //this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        this.bottomData = [
          {
            source: "Total Records:" + this.totalRecords,
            AccountType: "",
            accountName: "",
            when: "",
            debit: this.totalCredit,
            credit: this.totalDebit
          }
        ];
      });
  }

  public getRangeLable() {
    this.DateRangeLable = "";
    if (
      moment("01-01-1901", "MM-DD-YYYY").diff(this.startDate, "days") == 0 &&
      moment().diff(this.endDate, "days") == 0
    ) {
      this.DateRangeLable = "ITD";
      return;
    }
    if (
      moment()
        .startOf("year")
        .diff(this.startDate, "days") == 0 &&
      moment().diff(this.endDate, "days") == 0
    ) {
      this.DateRangeLable = "YTD";
      return;
    }
    if (
      moment()
        .startOf("month")
        .diff(this.startDate, "days") == 0 &&
      moment().diff(this.endDate, "days") == 0
    ) {
      this.DateRangeLable = "MTD";
      return;
    }
    if (
      moment().diff(this.startDate, "days") == 0 &&
      moment().diff(this.endDate, "days") == 0
    ) {
      this.DateRangeLable = "Today";
      return;
    }
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: "20px",
      width: width,
      height: height,
      boxSizing: "border-box"
    };
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onBtExport() {
    var params = {
      fileName: "Test File",
      sheetName: "First Sheet"
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  public isExternalFilterPresent() {
    return true;
  }

  public ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.journalGrid.api.onFilterChanged();
    this.getRangeLable();
  }

  public ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  public doesExternalFilterPass(node: any) {
    let result = true;
    if (this.startDate) {
      let cellDate = new Date(node.data.when);
      let td = this.startDate.toDate();
      if (
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      ) {
        result = true;
      } else {
        result = false;
      }
    }
    if (result === true) {
      if (this.fund) {
        let cellFund = node.data.Fund;
        result = this.fund === cellFund;
      }
    }
    return result;
  }

  public clearFilters() {
    this.gridOptions.api.redrawRows();
    this.DateRangeLable = "";
    this.selected = null;
    this.startDate.value = "";
    this.endDate = null;
    this.fund = null;
    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
    this.startDate = null;
    this.dateRangPicker.value = "";
    this.startDate = "";
    this.endDate = "";
  }

  greet(row: any) {
    //alert(`${ row.country } says "${ row.greeting }!`);
    alert("For show popup");
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getTrialBalance();
  }
}

function asDate(dateAsString) {
  var splitFields = dateAsString.split("-");
  //var m= this.MONTHS[splitFields[0]];

  return new Date(splitFields[1], splitFields[0], splitFields[2]);
}

function currencyFormatter(params) {
  return formatNumber(params.value);
}

function formatNumber(number) {
  return number == 0
    ? ""
    : Math.floor(number)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
