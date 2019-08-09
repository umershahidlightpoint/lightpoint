import {
  Component, TemplateRef, ElementRef, OnInit, Injector, Input, ViewChild,
   EventEmitter, Output, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions, IToolPanel } from "ag-grid-community";
import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component';
import { ToastrService } from "ngx-toastr";
import "ag-grid-enterprise";
import * as moment from 'moment';
import { GridName } from   "../../../shared/utils/AppEnums"
import { debug } from 'util';
import { $ } from 'protractor';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { JournalModalComponent } from './journal-modal/journal-modal.component';

import { GridLayoutComponent } from  "../../grid-layout/grid-layout.component"  ;
import { GridLayoutMenuComponent } from '../../grid-layout-menu/grid-layout-menu.component'
import { DataService } from "../../../shared/common/data.service";
class GridConfiguration {
  private gridApi;
}


@Component({
  selector: 'app-ag-grid-example',
  templateUrl: './ag-grid-example.component.html',
  styleUrls: ['./ag-grid-example.component.css'],
})
export class AgGridExampleComponent implements OnInit {

  private gridConfiguration:GridConfiguration = new GridConfiguration();
  
    gridLayoutComponent :GridLayoutComponent;
  private gridApi;
  private ledgerGridApi;
   
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private ledgerRowData: [];
  private selectedValue;
  private columns: any;

  layoutName:any;
  totalRecords: number;
  rowGroupPanelShow: any;
  sideBar: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  DateRangeLable: any;
  pinnedBottomRowData;
  gridOptions: GridOptions;
  ledgerGridOptions: GridOptions;
  filterChange: any;
  oDataGridStatusDto:any;
  gridLayouts:any;
  gridLayoutID :any= 0;
  rowSelection:string = "single";

  //topOptions = {alignedGrids: [], suppressHorizontalScroll: true};

  // bottomOptions = { alignedGrids: [] };

  selected: { startDate: moment.Moment, endDate: moment.Moment };

  @ViewChild('journalGrid') journalGrid;
  // @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasureJournal') divToMeasureElement: ElementRef;
  @ViewChild('divToMeasureLedger') divToMeasureElementLedger: ElementRef;
  @ViewChild("modal") modal: ModalDirective;
  @ViewChild('journalModal') jounalModal: JournalModalComponent;
  @ViewChild('AppGridLayout') AppGridLayout: GridLayoutComponent;

   

  oGridLayoutMenuComponent:GridLayoutMenuComponent;

  frameworkComponents:any;
  columnDefs: any;
  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund: any;
  endDate: any;

  symbol: string;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;

  title = 'app';
  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 300px)',
    boxSizing: 'border-box'
  };
 
   
  ranges: any = {
    'ITD': [moment("01-01-1901", "MM-DD-YYYY"), moment()],
    'YTD': [moment().startOf('year'), moment()],
    'MTD': [moment().startOf('month'), moment()],
    'Today': [moment(), moment()]
  }
  
  constructor(injector: Injector,
    private cdRef: ChangeDetectorRef,
    private _fundsService: FinancePocServiceProxy, private toastrService: ToastrService ,
    private dataService: DataService) {
    (injector);
    
    
    // Setup of the SideBar
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },

        {
          id: 'custom filters',
          labelDefault: 'Layout',
          labelKey: 'Grid Layout',
          iconKey: 'filter',
          toolPanel: 'customToolPanel',
          }
      ],
      defaultToolPanel: ''
    };
    
    
    this.gridOptions = <GridOptions>{
      rowData: null,
      onCellDoubleClicked: this.openEditModal,

      /*      onFilterChanged: function() {  
      
              this.gridOptions.api.forEachNodeAfterFilter( function(rowNode, index) {
                console.log('node ' + rowNode.data.debit + ' passes the filter');
            } )},
      
      */


      //columnDefs: this.columnDefs,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),

      // onGridReady: (params) => {
      //   this.gridApi = params.api;

      //   this.gridColumnApi = params.columnApi;
         
      //   //this.gridOptions.api.sizeColumnsToFit();
        

      //   this.gridOptions.excelStyles = [
      //     {

      //       id: "twoDecimalPlaces",
      //       numberFormat: { format: "#,##0" }

      //     },
      //     {

      //       id: "footerRow",
      //       font: {
      //         bold: true,
      //       }
      //     },
      //     {
      //       id: "greenBackground",
      //       interior: {

      //       //  color: "#b5e6b5",
      //        // pattern: "Solid"
      //       }

      //     },
      //     {
      //       id: "redFont",
      //       font: {
      //        // fontName: "Calibri Light",

      //       //  italic: true,
      //        // color: "#ff0000"
      //       }
      //     },

      //     {
      //       id: "header",
      //       interior: {
      //         color: "#CCCCCC",
      //         pattern: "Solid"
      //       },
      //       borders: {
      //         borderBottom: {
      //           color: "#5687f5",
      //           lineStyle: "Continuous",
      //           weight: 1
      //         },
      //         borderLeft: {
      //           color: "#5687f5",
      //           lineStyle: "Continuous",
      //           weight: 1
      //         },
      //         borderRight: {
      //           color: "#5687f5",
      //           lineStyle: "Continuous",
      //           weight: 1
      //         },
      //         borderTop: {
      //           color: "#5687f5",
      //           lineStyle: "Continuous",
      //           weight: 1
      //         }
      //       }
      //     },


      //   ];
      // },
      onFirstDataRendered: (params) => { 
        //params.api.sizeColumnsToFit(); 

        params.api.forEachNode(function(node) {
              node.expanded = true;
          }
        );

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
 
     
    //this.frameworkComponents.gridOptions =this.gridOptions;
    this.ledgerGridOptions = <GridOptions>{
      rowData: null,

      /*      onFilterChanged: function() {  
      
              this.gridOptions.api.forEachNodeAfterFilter( function(rowNode, index) {
                console.log('node ' + rowNode.data.debit + ' passes the filter');
            } )},
      
      */


  
  // selected: {startDate: moment().startOf('month'), endDate: moment()};
      //columnDefs: this.columnDefs,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      onGridReady: (params) => {
        this.ledgerGridApi = params.api;
        
        //this.gridColumnApi = params.columnApi;
  

        this.gridOptions.excelStyles = [
          {

            id: "twoDecimalPlaces",
            numberFormat: { format: "#,##0" }

          },
          {

            id: "footerRow",
            font: {
              bold: true,
            }
          },
          {
            id: "greenBackground",
            interior: {

            //  color: "#b5e6b5",
             // pattern: "Solid"
            }

          },
          {
            id: "redFont",
            font: {
             // fontName: "Calibri Light",

            //  italic: true,
             // color: "#ff0000"
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
          },


        ];

        this.ledgerGridApi.api.sizeColumnsToFit();

        this.ledgerGridOptions.excelStyles = [
          {

            id: "twoDecimalPlaces",
            numberFormat: { format: "#,##0" }

          },
          {

            id: "footerRow",
            font: {
              bold: true,
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
          },


        ];
      },
      onFirstDataRendered: (params) => { 
        //params.api.sizeColumnsToFit(); 
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    };

    this.ledgerGridOptions.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };
    this.frameworkComponents = { customToolPanel : GridLayoutMenuComponent  };
  //  this.frameworkComponents.customToolPanel.ngBaseDef.inputs.gridOptions = this.gridOptions;
    //this.frameworkComponents[0].gridOptions = this.gridOptions;
  };


  public onBtForEachNodeAfterFilter() {
    this.gridOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
      console.log('node ' + rowNode.data.debit + ' passes the filter');
    });
  }


  /*
  Drives the columns that will be defined on the UI, and what can be done with those fields
  */
  ignoreFields = ["id", "totalDebit", "totalCredit", "overall_count", "account_id", "value", "LpOrderId"];

  customizeColumns(columns:any) {
    let colDefs =     [
      {
        field: 'source', minWidth: 300, headerName: 'Source', colId: 'greet',
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
        field: 'fund', headerName: 'Fund', enableRowGroup: true, enablePivot: true, filter: true,
        width:120,
      },
      {
        field: 'AccountCategory', headerName: 'Category', enableRowGroup:true,
        //rowGroup:true,
        width:100,
        enablePivot: true, filter: true
      },

      {
        field: 'AccountType', headerName: 'Type', enableRowGroup: true,
        //rowGroup:true,
        width:200,
        enablePivot: true, filter: true
      },
      { field: 'accountName', headerName: 'Account Name', sortable: true, enableRowGroup: true,filter: true },
      {
        field: 'when', headerName: 'when', sortable: true, enableRowGroup: true,
        width:100,
        enablePivot: true,
        filter: 'agDateColumnFilter', filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
              return 0
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
        field: 'debit', aggFunc: "sum", headerName: '$Debit',
        valueFormatter: currencyFormatter, 
        width:100,
        cellStyle: { 'text-align': 'right' },
        cellClass: "twoDecimalPlaces",
        cellClassRules: {
          //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value < -300; },
          greenFont: function (params) { if (params.node.rowPinned) return false; else return params.value > 0; },
          redFont: function (params) { if (params.node.rowPinned) return false; else return params.value < 0; },
          footerRow: function (params) { if (params.node.rowPinned) return true; else return false; }
        },

      },
      {
        field: 'credit', aggFunc: "sum", headerName: '$Credit', valueFormatter: currencyFormatter,
        width:100,
        cellStyle: { 'text-align': 'right' },
        cellClass: "twoDecimalPlaces",
        cellClassRules: {
          //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
          greenFont: function (params) { if (params.node.rowPinned) return false; else return params.value > 0; },
          redFont: function (params) { if (params.node.rowPinned) return false; else return params.value < 0 ; },
          footerRow: function (params) { if (params.node.rowPinned) return true; else return false; }
        }
      },

      { field: 'TradeCurrency', 
      width:100,
      headerName: 'Trade Ccy', sortable: true, enableRowGroup: true,filter: true },
      { field: 'SettleCurrency', headerName: 'Settle Ccy', sortable: true, enableRowGroup: true,filter: true, width:100    },
      { field: 'Symbol', headerName: 'Symbol', sortable: true, enableRowGroup: true,filter: true },
      { field: 'Side', headerName: 'Side', sortable: true, enableRowGroup: true,filter: true, width:100 },
    ];

    let cdefs = Object.assign([], colDefs);

    for ( var i in this.columns) {
      let column = this.columns[i];

      // Check to see if it's an ignored field
      if ( this.ignoreFields.filter(i=>i == column.field).length== 0) {

      // Check to see if we have not already defined it
      if ( cdefs.filter(i=>i.field == column.field).length == 0)
      {
        let clone = {... colDefs[0]};
        clone.field = column.field;
        clone.headerName = column.headerName;
        clone.filter = column.filter;
        clone.colId = undefined;
        if ( column.Type == "System.Int32" || column.Type == "System.Decimal" || column.Type == "System.Double") {
          clone.cellStyle =  { 'text-align': 'right' };
          clone.cellClass =  "twoDecimalPlaces";
          clone.valueFormatter = currencyFormatter;
          clone.cellClassRules = {
            //greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
            greenFont: function (params) { if (params.node.rowPinned) return false; else return params.value > 0; },
            redFont: function (params) { if (params.node.rowPinned) return false; else return params.value < 0 ; },
            footerRow: function (params) { if (params.node.rowPinned) return true; else return false; }
          }
        } 
        else if ( column.Type == "System.DateTime")
        {
          clone.enableRowGroup =  true;
          clone.cellStyle =  { 'text-align': 'right' };
          clone.cellClass =  "twoDecimalPlaces";
          clone.minWidth = 50;
        } else {
          clone.enableRowGroup =  true;
        }

        cdefs.push( clone );
      }

        
      }
    }
  

    this.gridOptions.api.setColumnDefs(cdefs);
  }

  // selected: {startDate: moment().startOf('month'), endDate: moment()};

  ngAfterViewInit(){
    this.getAllData();
     
 this.AppGridLayout.gridOptions=this.gridOptions ;

 this.dataService.gridColumnApi.subscribe(obj => obj = this.gridOptions)
      this.dataService.changeMessage(this.gridOptions );
      //let dsf= this.DataService.gridColumnApi ;

 //this.dataService.gridColumnApi =this.gridColumnApi;
 //this.dataService.gridColumnApi.subscribe(obj => this.gridColumnApi = this.gridColumnApi)
 //this.dataService.gridColumnApi =this.gridColumnApi ;
  }

  getAllData() {

    this.gridOptions.onFilterChanged = function () {

      let tTotal = 0;
      let tCredit = 0;
      let tDebit = 0;
      this.api.forEachNodeAfterFilter(function (rowNode, index) {

        tTotal += 1;
        tCredit += rowNode.data.credit;
        tDebit += rowNode.data.debit;
        // console.log('node ' + rowNode.data.debit + ' passes the filter');
      });

      this.pinnedBottomRowData = [
        {
          source: 'Total Records: ' + tTotal,
          AccountType: '',
          accountName: '',
          when: '',
          debit: tDebit,
          credit: tCredit,
        }
      ];
      //this.api.setPinnedBottomRowData(this.pinnedBottomRowData);

    };

    this.rowGroupPanelShow = "after";
    this.pivotPanelShow = "always";
    this.pivotColumnGroupTotals = "after";
    this.pivotRowTotals = "before";
    
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
        FundCode: item.FundCode,
      }));
      localThis.funds = localfunds;
      localThis.cdRef.detectChanges();
    });
    

  //  this.getLayout();
    this._fundsService.getJournals(this.symbol, this.page, this.pageSize, this.accountSearch.id,
      this.valueFilter, this.sortColum, this.sortDirection).subscribe(result => {

        this.columns = result.meta.Columns;

        this.totalRecords = result.meta.Total;
        this.totalCredit = result.stats.totalCredit;
        this.totalDebit = result.stats.totalDebit;

        this.rowData = [];
        this.ledgerRowData = [];


        let someArray = [];


        for ( var item in result.data ) {
          let someObject = {};
          for ( var i in this.columns) {
            let field = this.columns[i].field;
            if ( this.columns[i].Type == "System.DateTime") {
              someObject[field] = moment(result.data[item][field]).format("MM-DD-YYYY");
            } else {
              someObject[field] = result.data[item][field];
            }
          }
          someArray.push(someObject);
        }

        this.customizeColumns(this.columns);

        this.rowData = someArray as [];

        /*
        this.rowData = result.data.map(item => (
          {
          id: item.id,
          source: item.source,
          Fund: item.fund,
          AccountCategory: item.AccountCategory,
          AccountType: item.AccountType,
          accountName: item.accountName,
          accountId: item.account_id,
          debit: item.debit,
          credit: item.credit,
          TradeCurrency: item.TradeCurrency,
          SettleCurrency: item.SettleCurrency,
          Side: item.Side,
          Symbol: item.Symbol,
          when: moment(item.when).format("MM-DD-YYYY")
        }
        ));
       */

        /*
        this.rowData = result.data.map(item => ({
          id: item.id,
          source: item.source,
          Fund: item.fund,
          AccountCategory: item.AccountCategory,
          AccountType: item.AccountType,
          accountName: item.accountName,
          accountId: item.account_id,
          debit: item.debit,
          credit: item.credit,
          TradeCurrency: item.TradeCurrency,
          SettleCurrency: item.SettleCurrency,
          Side: item.Side,
          Symbol: item.Symbol,
          when: moment(item.when).format("MM-DD-YYYY")
        }));
        */

        this.ledgerRowData = result.data.map(item => ({
          id: item.id,
          source: item.source,
          Fund: item.fund,
          AccountCategory: item.AccountCategory,
          AccountType: item.AccountType,
          accountName: item.accountName,
          accountId: item.account_id,
          debit: item.debit,
          credit: item.credit,
          TradeCurrency: item.TradeCurrency,
          SettleCurrency: item.SettleCurrency,
          Side: item.Side,
          Symbol: item.Symbol,
          when: moment(item.when).format("MM-DD-YYYY")
        }));


        this.ledgerGridOptions.rowData = this.ledgerRowData;

        this.pinnedBottomRowData = [
          {
            source: 'Total Records:' + this.totalRecords,
            AccountType: '',
            accountName: '',
            when: '',
            debit: this.totalCredit,
            credit: this.totalDebit,
          }
        ];
        //this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
        this.bottomData = [
          {
            source: 'Total Records:' + this.totalRecords,
            AccountType: '',
            accountName: '',
            when: '',
            debit: this.totalCredit,
            credit: this.totalDebit,
          }
        ];

      });


  }

//   getLayout()
// {
//   this._fundsService.getGridLayouts(1,1).subscribe(result => {
//     debugger;
//     let gridLayout = result.payload.map(item => ({
//       FundCode: item.oDataGridStatusDto,
//     }));
    
//     this.gridLayouts = result.payload;
//     this.cdRef.detectChanges();
//   });
// }

  public getRangeLable() {
    this.DateRangeLable = '';

    if (moment("01-01-1901", "MM-DD-YYYY").diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0) {
    this.DateRangeLable = 'ITD';
      return;
    }
    if (moment().startOf('year').diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0) {
    this.DateRangeLable = 'YTD';
      return;
    }
    if (moment().startOf('month').diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0) {
    this.DateRangeLable = 'MTD';
      return;
    }
    if (moment().diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0) {
    this.DateRangeLable = 'Today';

      return;
    }
  }
  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width: width,
      height: height,
      boxSizing: 'border-box'
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
  
    


  ngOnInit() {
  
  }


  public isExternalFilterPresent() {
     return true;
  }

  public ngModelChange(e) {
   

    this.startDate = e.startDate;
    this.endDate = e.endDate
    this.journalGrid.api.onFilterChanged();
    this.getRangeLable();
  }

  public ngModelChangeFund(e) {
    this.fund = e;
    this.journalGrid.api.onFilterChanged();
  }

  public doesExternalFilterPass(node:any) {

    let result = true;

    if (this.startDate) {
      let cellDate = new Date(node.data.when);
      let td = this.startDate.toDate();
      if (this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate) { result = true; } else { result = false; }
    }

    if (result === true) {
      if (this.fund) {
        let cellFund = node.data.Fund;
        result = this.fund === cellFund;
      }
    }

    return result;
  }

  public restoreLayout(id)
  {

    this.AppGridLayout.RestoreLayout(id);

  }

  public clearFilters() {
 
    let dafsdf =this.journalGrid.frameworkComponents.customToolPanel.ngBaseDef;
    this.gridOptions.api.redrawRows();
    this.DateRangeLable = "";
    this.selected = null;
    this.startDate.value = '';
    this.endDate = null;
    this.fund = null;

    this.journalGrid.api.setFilterModel(null);
    this.journalGrid.api.onFilterChanged();
    this.startDate = null;
    this.dateRangPicker.value = '';

    this.startDate = "";
    this.endDate = "";
  }

  greet(row: any) {
    //alert(`${ row.country } says "${ row.greeting }!`);
    alert("For show popup");
  }

  openJournalModal(){
    this.jounalModal.openModal({})
  }

   closeJournalModal(){
    this.getAllData()
  }

  openEditModal = (row) => {
    this.jounalModal.openModal(row.data)
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
  return number == 0 ? '' : Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

