import {  Component,ElementRef, OnInit, Injector, Input, ViewChild, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';

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
  };

 


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
    { field: 'when', headerName: 'when' ,sortable: true, filter: true },
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
     debit:item.value < 0 ? item.value :'' ,
     credit: item.value >0 ? item.value : '',
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
this.topOptions.alignedGrids.push(this.bottomOptions);
this.bottomOptions.alignedGrids.push(this.topOptions);

this.topGrid.setWidthAndHeight('60%', '60%');
this.bottomGrid.setWidthAndHeight('60%', '60%');
}
 
 
  onGridReady(params) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;

  params.api.sizeColumnsToFit();
}
   
 
}

function currencyFormatter(params) {
  return     formatNumber(params.value);
}
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
