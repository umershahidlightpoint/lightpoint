import {  Component,ElementRef, OnInit, Injector, Input, ViewChild, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import {GridOptions} from "ag-grid-community";
 
import * as moment from 'moment';

@Component({
  selector: 'app-ag-grid-example',
  templateUrl: './ag-grid-example.component.html',
  styleUrls: ['./ag-grid-example.component.css'],
})

export class AgGridExampleComponent implements OnInit {
  constructor(injector: Injector,
    private _fundsService: FinancePocServiceProxy) {
    (injector);
    this.gridOptions = <GridOptions>{
      rowData: null,
      columnDefs: this.columnDefs,
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      onGridReady: () => { this.gridOptions.api.sizeColumnsToFit(); },
      onFirstDataRendered: (params) => {params.api.sizeColumnsToFit();},
      enableFilter: true,
      animateRows: true
                         };
  
  };
  private gridOptions: GridOptions;

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'This Year': [moment().startOf('year'), moment()]
  }
  
 
 // selected: {startDate: moment().startOf('month'), endDate: moment()};

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  totalRecords: number;
  topOptions = {alignedGrids: [], suppressHorizontalScroll: true};
  bottomOptions = {alignedGrids: []};
    

  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
   
  totalCredit:number;
  totalDebit:number;
  bottomData  :any;
  startDate:any;
  endDate:any;

  symbal :string;
  pageSize:any;
  accountSearch = { id: undefined };
  valueFilter: number;
  
  sortColum:any;
  sortDirection:any;
  page: any;
   
  title = 'app';
  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
};

  columnDefs = [
      
    { field: 'source', headerName: 'Source', sortable: true, filter: true},
    { field: 'AccountType', headerName: 'Account Type',sortable: true, filter: true },
    { field: 'accountName', headerName: 'Account Name',sortable: true, filter: true },
    { field: 'when', headerName: 'when' ,sortable: true,  
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
  
  
   
    { field: 'debit', headerName: 'Debit' , valueFormatter: currencyFormatter, cellStyle: {'text-align': 'right' } ,cellClass: "number-cell" } ,
    { field: 'credit', headerName: 'Credit',  valueFormatter: currencyFormatter,cellStyle: {'text-align': 'right' }, cellClass: "number-cell"} 

       
  ];

    

 
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

ngOnInit() {  
  this.defaultColDef = {
    sortable: true,
    resizable: true
  };
   
 this.symbal= "ALL";
  
 
 this.page=0;
 this.pageSize=0;
 this.accountSearch.id=0;
 this.valueFilter=0;
 this.sortColum="";
 this.sortDirection="";

 this._fundsService.getJournals(this.symbal,this.page, this.pageSize , this.accountSearch.id,
 this.valueFilter,this.sortColum,this.sortDirection ).subscribe(result => {
  this.totalRecords = result.meta.total;//result.meta.total;
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
     when: moment(item.when).format("MMM-DD-YYYY"),
      
   })); 
      
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
 
 
  /*onGridReady(params) {
     
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;

  params.api.sizeColumnsToFit();
}*/
   public isExternalFilterPresent()
   {
     
      return true;
   }
   public ngModelChange(e)
   {
     
     this.startDate=e.startDate;
     this.endDate=e.endDate
     this.topGrid.api.onFilterChanged();
   }

 public doesExternalFilterPass(node)
 {
   debugger
   if(this.startDate)
    if (asDate(node.data.when) < this.startDate )
    {return false;}
    return true;

 }

}

function asDate (dateAsString){
  var splitFields = dateAsString.split("/");
  return new Date(splitFields[2], splitFields[1], splitFields[0]);
}
function currencyFormatter(params) {
  return     formatNumber(params.value);
}
function formatNumber(number) {
  return number == 0 ? '': Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")  ;
}
