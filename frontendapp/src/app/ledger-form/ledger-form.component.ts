import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../ledger-form/create-account/create-account.component'
import { FinancePocServiceProxy } from '../../shared/service-proxies/service-proxies';
import { GridOptions } from "ag-grid-community";
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component'
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GridRowData, AccountCategory } from '../../shared/Models/account';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-ledger-form',
  templateUrl: './ledger-form.component.html',
  styleUrls: ['./ledger-form.component.css']
})
export class LedgerFormComponent implements OnInit, OnDestroy {
  @ViewChild('createModal') createAccount: CreateAccountComponent;
  rowData: Array<GridRowData>
  getAllAccountSub: Subscription
  gridOptions = <GridOptions>{
    onFirstDataRendered: (params) => { params.api.sizeColumnsToFit(); }
  };
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory
  //For unsubscribing all subscriptions
  isSubscriptionAlive: boolean

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
    height:'calc(100vh - 270px)',
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
      {headerName: 'Description_Id', field: 'Description_Id', hide: true },
      {headerName: 'Description', field: 'Description', sortable: true, filter: true },
      {headerName: 'Category', field: 'Category', sortable: true, filter: true },
      {headerName: 'Category Id', field: 'Category_Id', hide: true },
      {headerName: 'Category', field: 'Category', hide: true },
      {headerName: 'Has Journal', field: 'has_journal', sortable: true, filter: true },
      {headerName: 'Tags', field: 'Tags', hide: true },
      {headerName: 'CanDeleted', field: 'CanDeleted', hide: true },
      {headerName: 'CanEdited', field: 'CanEdited', hide: true },
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
    this.getAccountsRecord();
    this.getAccountCategories();
  }

  getAccountCategories(){
    this.financePocServiceProxy.accountCategories()
    .subscribe(response => {
      if(response.isSuccessful){
        this.accountCategories = response.payload
      }
      else {
        this.toastrService.error('Failed to fetch account categories!')
      }
    })
  }

  getAccountsRecord(){
    setTimeout(()=> {
    this.getAllAccountSub = this.financePocServiceProxy.getAllAccounts().subscribe(result => {
        this.rowData = result.payload.map(result => ({
          Id: result.AccountId,
          Name: result.AccountName,
          Description: result.Description,
          Category: result.Category,
          Category_Id: result.CategoryId,
          has_journal: result.HasJournal,
          Tags: result.Tags,
          CanDeleted: result.CanDeleted,
          CanEdited: result.CanEdited
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
      this.getAccountsRecord()
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

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onBtExport() {
    var params = {
      fileName: "Test File",
      sheetName: "First Sheet",
      columnKeys: ['Name','Description','Category','has_journal']
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  accountCategorySelected(instance){
    this.selectedAccountCategory = instance
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show({})
  }

  ngOnDestroy(){
    this.getAllAccountSub.unsubscribe()
  } 
}
