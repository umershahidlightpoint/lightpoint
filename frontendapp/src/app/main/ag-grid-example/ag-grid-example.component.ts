import { Component, TemplateRef, ElementRef, OnInit, Injector, Input, ViewChild, 
  EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from "ag-grid-community";
import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component';

import "ag-grid-enterprise";
import * as moment from 'moment';
import { debug } from 'util';
import { $ } from 'protractor';

@Component({
  selector: 'app-ag-grid-example',
  templateUrl: './ag-grid-example.component.html',
  styleUrls: ['./ag-grid-example.component.css'],
})

export class AgGridExampleComponent implements OnInit {
 
  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private selectedValue;
  totalRecords: number;
  rowGroupPanelShow: any ; 
  sideBar:any;
  pivotPanelShow:any;
  pivotColumnGroupTotals: any ; 
  pivotRowTotals : any ; 
  DateRangeLable: any;
  pinnedBottomRowData;
   gridOptions: GridOptions;
  filterChange :any;
   getRowStyle;
  //topOptions = {alignedGrids: [], suppressHorizontalScroll: true};

 // bottomOptions = { alignedGrids: [] };
 
  selected: { startDate: moment.Moment, endDate: moment.Moment };

  @ViewChild('topGrid') topGrid;
 // @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  columnDefs :any;
  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund:any;
  endDate: any;
     
  symbal: string;
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
    height: 'calc(100vh - 260px)',
    boxSizing: 'border-box'
  };

 

  ranges: any = {
    //'Today': [moment(), moment()],
    //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    // 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    // 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'ITD': [moment("01-01-1901", "MM-DD-YYYY"), moment()],
    // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'YTD': [moment().startOf('year'), moment()],
    'MTD': [moment().startOf('month'), moment()],
  }

  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
    this.sideBar =  {
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
          }
      ],
      defaultToolPanel: ''
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
      onGridReady: (params) => { 
        this.gridApi = params.api;
    
        this.gridColumnApi = params.columnApi;
        this.gridOptions.api.sizeColumnsToFit();
         
        this.gridOptions.excelStyles= [
          {
           
              id: "twoDecimalPlaces",
              numberFormat: { format: "#,##0" }
             
          },
          {

            id:"footerRow",
            font: {
              bold:true,
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
      onFirstDataRendered: (params) => {params.api.sizeColumnsToFit();},
      enableFilter: true,
      animateRows: true,
      alignedGrids: [], 
      suppressHorizontalScroll: true
                         };
                        
                         this.gridOptions.defaultColDef = {
                          sortable: true,
                          resizable: true,
                          filter: true
                        };
                       
    //this.selected = {startDate: moment().subtract(6, 'days'), endDate: moment().subtract(1, 'days')};

  };

  
  public onBtForEachNodeAfterFilter ()
  { this.gridOptions.api.forEachNodeAfterFilter( function(rowNode, index) {
    console.log('node ' + rowNode.data.debit + ' passes the filter');
});
}

 


  // selected: {startDate: moment().startOf('month'), endDate: moment()};

  ngAfterViewInit()
  {
    
    this.gridOptions.onFilterChanged =function(){
     
     let tTotal= 0;
     let tCredit=0;
     let tDebit=0;
this.api.forEachNodeAfterFilter( function(rowNode, index) {
   
  tTotal+=1;
  tCredit += rowNode.data.credit ;
  tDebit += rowNode.data.debit ;
 // console.log('node ' + rowNode.data.debit + ' passes the filter');
});
      
this.pinnedBottomRowData = [
  {
    source: 'Total Records: ' + tTotal,
    AccountType: '',
    accountName: '',
      when: '',
      debit: tDebit ,
      credit:tCredit ,
  }
];
this.api.setPinnedBottomRowData(this.pinnedBottomRowData );

    };
       


    this.gridOptions.api.setColumnDefs( [
        
        
      { field: 'source', headerName: 'Source',   colId: 'greet',  sortable: true ,
      cellRendererFramework: TemplateRendererComponent, cellRendererParams: {
        ngTemplate: this.greetCell  } ,
        cellClassRules: {
         
          footerRow:function(params) {  if (params.node.rowPinned) return true; else return false; }
        },
    },
      { field: 'AccountType', headerName: 'Account Type',sortable: true, enableRowGroup: true, 
      enablePivot: true,filter: true },
      { field: 'accountName', headerName: 'Account Name',sortable: true,  enableRowGroup: true,
       filter: true  },
      { field: 'when', headerName: 'when' ,sortable: true,      enableRowGroup: true,
      enablePivot: true,  
      filter:'agDateColumnFilter', filterParams:{
        comparator:function (filterLocalDateAtMidnight, cellValue){
            var dateAsString = cellValue;
            var dateParts  = dateAsString.split("/");
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
    }},
    
    
     
      { field: 'debit',aggFunc: "sum", headerName: 'Debit' , 
      valueFormatter: currencyFormatter, cellStyle: {'text-align': 'right' } ,
      cellClass: "twoDecimalPlaces" ,
      cellClassRules: {
        greenBackground: function(params) {  if (params.node.rowPinned) return false; else return params.value < -300; },
        redFont: function(params) {  if (params.node.rowPinned) return false; else return params.value > -300; },
        footerRow:function(params) {  if (params.node.rowPinned) return true; else return false; }
      },

    } ,
      { field: 'credit', aggFunc: "sum", headerName: 'Credit' , valueFormatter: currencyFormatter,
      cellClass: "twoDecimalPlaces" ,
    cellClassRules: { greenBackground: function(params) { if (params.node.rowPinned) return false; else return params.value > 300; },
      redFont: function(params) {if (params.node.rowPinned)return false; else return params.value < 300; } ,
        footerRow:function(params) {  if (params.node.rowPinned) return true; else return false; }
    }  
  } 
  
    ]
    
    );
     

    this.columnDefs =(
      [
        { field: 'source', headerName: 'Source'  },
     
        { field: 'AccountType',maxWidth: 150 , headerName: 'Account Type' },
        { field: 'accountName', headerName: 'Account Name' },
        { field: 'when', maxWidth: 120 ,headerName: 'when' ,sortable: true },
       
        { field: 'debit', headerName: 'Debit' , valueFormatter: currencyFormatter, cellStyle: {'text-align': 'right' } ,cellClass: "twoDecimalPlaces" } ,
        { field: 'credit', headerName: 'Credit',  valueFormatter: currencyFormatter,cellStyle: {'text-align': 'right' }, cellClass: "twoDecimalPlaces"} 
    
           
      ]
    
    );
    this.getRowStyle = function(params) {
      debugger;
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
      this.rowGroupPanelShow ="after";
      this.pivotPanelShow = "always";
      this.pivotColumnGroupTotals = "after";
      this.pivotRowTotals = "before";
    //align scroll of grid and footer grid
   // this.gridOptions.alignedGrids.push(this.bottomOptions);
   // this.bottomOptions.alignedGrids.push(this.gridOptions);
  
   this.symbal= "ALL";
    
   
   this.page=0;
   this.pageSize=0;
   this.accountSearch.id=0;
   this.valueFilter=0;
   this.sortColum="";
   this.sortDirection="";
   this._fundsService.getFunds().subscribe ( result => {
   
    this.funds = result.payload.map( item => ({
      FundCode:item.FundCode,
    }));
  });
   this._fundsService.getJournals(this.symbal,this.page, this.pageSize , this.accountSearch.id,
   this.valueFilter,this.sortColum,this.sortDirection ).subscribe(result => {
    this.totalRecords = result.meta.Total;//result.meta.Total;
    this.totalCredit= result.stats.totalCredit;
    this.totalDebit= result.stats.totalDebit;
  
     this.rowData = [];
      
     this.rowData = result.data.map(item => ({
       id: item.id,
       source:item.source,
       AccountType:item.AccountType,
       accountName: item.accountName ,
       accountId: item.account_id,
       debit:  item.debit   ,
       credit:   item.credit,
       //when: moment(item.when).format('MMM-DD-YYYY hh:mm:ss A Z')
      //when: moment(item.when).format("MMM-DD-YYYY"),
      when: moment(item.when).format("MM-DD-YYYY")
        
     })); 
       
     this.pinnedBottomRowData = [
      {
        source: 'Total Records:' + this.totalRecords,
        AccountType: '',
        accountName: '',
          when: '',
          debit: this.totalCredit ,
          credit:this.totalDebit ,
      }
    ];
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData );
      this.bottomData = [
        {
          source: 'Total Records:' + this.totalRecords,
          AccountType: '',
          accountName: '',
            when: '',
            debit: this.totalCredit ,
            credit:this.totalDebit ,
        }
      ];
      
  });  
   
 
  }
  public getRangeLable() {
    this.DateRangeLable = '';

    if (moment("01-01-1901", "MM-DD-YYYY").diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0)
      this.DateRangeLable = 'ITB';

    if (moment().startOf('year').diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0)
      this.DateRangeLable = 'YTB';
    if (moment().startOf('month').diff(this.startDate, 'days') == 0 && moment().diff(this.endDate, 'days') == 0)
      this.DateRangeLable = 'MTB';


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
      sheetName: "First Sheet" ,
       
    };
     
    
 


    this.gridOptions.api.exportDataAsExcel(params);
  }
 
ngOnInit() {  
}


  /*onGridReady(params) {
     
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;

  params.api.sizeColumnsToFit();
}*/
  public isExternalFilterPresent() {

    return true;
  }

  public ngModelChange(e) {
    this.startDate = e.startDate;
    this.endDate = e.endDate
    this.topGrid.api.onFilterChanged();
    this.getRangeLable();
  }

  public ngModelChangeFund(e) {
    this.fund = e;
    this.topGrid.api.onFilterChanged();
  }

  public doesExternalFilterPass(node) {
    
    if (this.startDate) {
      var cellDate = new Date(node.data.when);
      var td = this.startDate.toDate();
      if (this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate) { return true; } else { return false; }
    }

    if ( this.fund ) {
      var cellFund = node.data.fund;
      if (this.fund === cellFund ) { return true;} else { return false;}
    }

    return true;
  }
   
  public clearFilters() {

    this.gridOptions.api.redrawRows();
    this.DateRangeLable = "";
    this.selected = null;
    this.startDate.value = '';
    this.endDate = null;

    this.topGrid.api.setFilterModel(null);
    this.topGrid.api.onFilterChanged();
    this.startDate = null;
    this.dateRangPicker.value = '';

    this.startDate = "";
    this.endDate = "";
  }

  greet(row: any) {
    //alert(`${ row.country } says "${ row.greeting }!`);
    alert("For show popup");
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
