import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../ledger-form/create-account/create-account.component'
import { FinancePocServiceProxy } from '../../shared/service-proxies/service-proxies';
import { GridOptions } from "ag-grid-community";
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component'
import { ToastrService } from 'ngx-toastr';

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

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
   };

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height:'calc(100vh - 235px)',
    boxSizing: 'border-box'
  };

  constructor(
    @Inject(Router) private router: Router, 
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService:  ToastrService
    ) {
   }
   

  ngAfterViewInit(): void {
    this.gridOptions.api.setColumnDefs([
      {headerName: 'Id', field: 'Id', hide: true },
      {headerName: 'Name', field: 'Name', sortable: true, filter: true },
      {headerName: 'Description_Id', field: 'Description_Id', hide: true, sortable: true, filter: true },
      {headerName: 'Description', field: 'Description', sortable: true, filter: true },
      {headerName: 'Category', field: 'Category', sortable: true, filter: true},
      {headerName: 'Has Journal', field: 'has_journal', sortable: true, filter: true},
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
    this.getData();
  }

  getData(){
    setTimeout(()=> {
      this.data = this.financePocServiceProxy.getAllAccounts().subscribe(result => {
        this.data =  result.payload;
        this.rowData = this.data.map(result => ({
          Id: result.id,
          Name: result.name,
          Description: result.description,
          Category: result.category,
          Category_Id: result.category_id,
          has_journal: result.has_journal
        }))
        this.gridOptions.api.setRowData(this.rowData);
      })
    },100)
  }

  editRow(row){
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show(row)
  }

  deleteRow(row){
    this.financePocServiceProxy.deleteAccount(row.Id).subscribe(response => {
    if(response.isSuccessful){
      this.toastrService.success('Account deleted successfully!')
      this.getData()
    }
    else {
      this.toastrService.error('Account deleted failed!')
    }}, error => {
    this.toastrService.error('Something went wrong. Try again later!')  
  })    
  }

  addAccount(){
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show({})
  }
}