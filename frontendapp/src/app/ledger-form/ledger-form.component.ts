import { Component, OnInit, Inject, ViewChild, ElementRef,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../ledger-form/create-account/create-account.component'
import { FinancePocServiceProxy } from '../../shared/service-proxies/service-proxies';
import { GridOptions } from "ag-grid-community";
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component'

@Component({
  selector: 'app-ledger-form',
  templateUrl: './ledger-form.component.html',
  styleUrls: ['./ledger-form.component.css']
})
export class LedgerFormComponent implements OnInit {
  @ViewChild('createModal') createAccount: CreateAccountComponent;
  rowData = [];
  data: any
  gridOptions = <GridOptions>{};

  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;  
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  constructor(@Inject(Router) private router: Router, private financePocServiceProxy: FinancePocServiceProxy ) {
    this.data = this.financePocServiceProxy.getAllAccounts().subscribe(result => {
      console.log('Result payload',result.payload) 
      this.data =  result.payload  
      this.rowData = this.data.map(result => ({
        Name: result.name,
        Description: result.description,
        Category: result.category,
        HasJournal: result.has_journal
      }))
      this.gridOptions.api.setRowData(this.rowData)
    })
   }
   

  ngAfterViewInit(): void {
    this.gridOptions.api.setColumnDefs([
      {headerName: 'Name', field: 'Name',sortable: true, filter: true },
      {headerName: 'Description', field: 'Description',sortable: true, filter: true },
      {headerName: 'Category', field: 'Category',sortable: true, filter: true},
      {headerName: 'Has Journal', field: 'HasJournal',sortable: true, filter: true},
      {
        headerName: "Actions",
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ]);
  }

  ngOnInit() {
    
  }

  editRow(row){
    console.log('===> Edit',row)
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show(row)
  }

  deleteRow(row){
    console.log('===> Delete',row)
  }

  addAccount(){
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show({})
  }

}
