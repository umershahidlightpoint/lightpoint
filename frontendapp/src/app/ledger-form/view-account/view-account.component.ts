import { Component, OnInit, Inject, OnDestroy, AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.css']
})
export class ViewAccountComponent implements OnInit, AfterViewInit {
  rowData = [];
  data
  columnDefs = [
    {headerName: 'Name', field: 'Name' },
    {headerName: 'Description', field: 'Description' },
    {headerName: 'Category', field: 'Category'},
    {headerName: 'AssociatedLedgers', field: 'AssociatedLedgers'}
  ];
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  constructor(
    @Inject(FinancePocServiceProxy) private financePocServiceProxy: FinancePocServiceProxy 
    ){ 
    this.data = this.financePocServiceProxy.getAllAccounts().subscribe(result => {
      console.log('Result payload',result.payload) 
      this.data =  result.payload
      this.rowData = this.data.map(result => ({
        Name: result.name,
        Description: result.description,
        Category: result.category,
        AssociatedLedgers: result.associated_ledgers
      }))
    })
  }

  ngOnInit() {    
  }

  ngAfterViewInit(){
    
  }

}
