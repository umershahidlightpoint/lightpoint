import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  Injector,
  ViewChild
} from "@angular/core";
import { FinancePocServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { GridOptions } from "ag-grid-community";
import { takeWhile, delay } from "rxjs/operators";
import { interval } from "rxjs";
import * as moment from "moment";

@Component({
  selector: "app-operations",
  templateUrl: "./operations.component.html",
  styleUrls: ["./operations.component.css"]
})
export class OperationsComponent implements OnInit {
  isSubscriptionAlive: boolean;
  isLoading: boolean = false;

  constructor(
    injector: Injector,
    private _fundsService: FinancePocServiceProxy
  ) {
    injector;
    this.gridOptions = <GridOptions>{
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true
    };
    //this.selected = {startDate: moment().subtract(6, 'days'), endDate: moment().subtract(1, 'days')};
  }

  async runEngine() {
    console.log("In run engine");
    let is = false;
    this._fundsService
      .startPostingEngine()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        debugger;
        console.log("response ", response);
        if (response.IsRunning) {
          console.log("is successful", response);
          is = response.IsRunning;
          this.isLoading = true;

          //  while (this.isLoading) {
          this.check();
          //  }
        }
      });
    // if (is) {
    //   this.isLoading = true;
    //   while (this.isLoading) {
    //     console.log("in while");
    //     setTimeout(
    //       () =>
    //         this._fundsService
    //           .runningEngineStatus()
    //           .pipe(takeWhile(() => this.isSubscriptionAlive))
    //           .subscribe(response => {
    //             console.log("Running status Response", response);
    //             this.isLoading = response.status;
    //             if (!response.status) {
    //               return;
    //             }
    //           }),
    //       10000
    //     );
    //   }
    // }
    // alert(this.selectedPeriod.name);

    /* This needs to call out to the Posting Engine and invoke the process,
     this is a fire and forget as the process may take a little while to complete
    */
  }

  periods = [
    { name: "YTD" },
    { name: "ITD" },
    { name: "MTD" },
    { name: "Today" },
    { name: "Latest" }
  ];

  selectedPeriod: any;

  private gridOptions: GridOptions;

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private selectedValue;

  totalRecords: number;
  bottomOptions = { alignedGrids: [] };

  selected: { startDate: moment.Moment; endDate: moment.Moment };

  @ViewChild("topGrid") topGrid;
  @ViewChild("bottomGrid") bottomGrid;
  @ViewChild("dateRangPicker") dateRangPicker;
  @ViewChild("greetCell") greetCell: TemplateRef<any>;
  @ViewChild("divToMeasure") divToMeasureElement: ElementRef;

  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund: any;
  endDate: any;

  symbal: string;
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
    height: "calc(100vh - 180px)",
    boxSizing: "border-box"
  };

  /*
  We can define how we need to show the data here, as this is a log file we should group by the rundate
  */
  columnDefs = [
    {
      field: "rundate",
      headerName: "Run Date",
      sortable: true,
      filter: true,
      enableRowGroup: true,
      resizable: true
    },
    {
      field: "action_on",
      headerName: "Action On",
      sortable: true,
      filter: true,
      resizable: true
    },
    { field: "action", headerName: "Action", sortable: true, filter: true }
  ];

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

  check() {
    setTimeout(() => {
      debugger;
      console.log("in while");

      this._fundsService
        .runningEngineStatus()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          console.log("Running status Response", response);
          this.isLoading = response.Status;
          if (response.Status) {
            this.check();
            console.log("status false");
            return;
          } else {
          }
        });
    }, 10000);
  }
  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    //align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);

    this.symbal = "ALL";

    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = "";
    this.sortDirection = "";

    this._fundsService
      .getJournalLogs(
        this.symbal,
        this.page,
        this.pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(result => {
        this.rowData = [];

        this.rowData = result.data.map(item => ({
          rundate: moment(item.rundate).format("MMM-DD-YYYY"),
          action_on: moment(item.action_on).format("MMM-DD-YYYY hh:mm:ss"),
          action: item.action
        }));
      });
  }
}
