import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component'
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from "ag-grid-community";
import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component'
import { ToastrService } from 'ngx-toastr';
import { GridRowData, AccountCategory } from '../../../shared/Models/account';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-ledger-form',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit, OnDestroy {
  rowData: Array<GridRowData>
  gridOptions = <GridOptions>{
    onFirstDataRendered: (params) => { params.api.sizeColumnsToFit() }
  }
  accountCategories: AccountCategory
  selectedAccountCategory: AccountCategory
  //For unsubscribing all subscriptions
  isSubscriptionAlive: boolean

  @ViewChild('createModal') createAccount: CreateAccountComponent
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef

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
      this.isSubscriptionAlive = true
   }
   
  ngAfterViewInit(): void {
    this.gridOptions.api.setColumnDefs([
      { headerName: 'Account Id', field: 'accountId', hide: true },
      { headerName: 'Name', field: 'accountName', sortable: true, filter: true },
      { headerName: 'Description_Id', field: 'descriptionId', hide: true },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Category', field: 'category', sortable: true, filter: true },
      { headerName: 'Category Id', field: 'categoryId', hide: true },
      { headerName: 'Has Journal', field: 'hasJournal', sortable: true, filter: true },
      { headerName: 'CanDeleted', field: 'canDeleted', hide: true },
      { headerName: 'CanEdited', field: 'canEdited', hide: true },
      {
        headerName: "Actions",
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ])
  }

  ngOnInit() {
    this.getAccountsRecord()
    this.getAccountCategories()
  }

  getAccountCategories(){
    this.financePocServiceProxy.accountCategories().pipe(takeWhile(() => this.isSubscriptionAlive))
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
    this.financePocServiceProxy.getAllAccounts().pipe(takeWhile(() => this.isSubscriptionAlive))
    .subscribe(result => {
        this.rowData = result.payload.map(result => ({
          accountId: result.AccountId,
          accountName: result.AccountName,
          description: result.Description,
          category: result.Category,
          typeId: result.TypeId,
          type: result.Type,
          categoryId: result.CategoryId,
          hasJournal: result.HasJournal,
          canDeleted: result.CanDeleted,
          canEdited: result.CanEdited
        }))
        this.gridOptions.api.setRowData(this.rowData)
      })
    },100)
  }

  editRow(row){
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show(row)
  }

  deleteRow(row){
    this.financePocServiceProxy.deleteAccount(row.accountId).subscribe(response => {
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
    params.api.sizeColumnsToFit()
  }

  onBtExport() {
    var params = {
      fileName: "Test File",
      sheetName: "First Sheet",
      columnKeys: ['Name','Description','Category','has_journal']
    }
    this.gridOptions.api.exportDataAsExcel(params)
  }

  accountCategorySelected(category){
    this.selectedAccountCategory =  {
      id: category.Id,
      name: category.Name
    } 
    this.router.navigateByUrl('/accounts/create-account')
    this.createAccount.show({})
  }

  ngOnDestroy(){
    this.isSubscriptionAlive = false
  } 
}
