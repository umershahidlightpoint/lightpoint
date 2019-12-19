import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../.././create-account/create-account.component';
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../../../shared/Models/account';
import { DataService } from 'src/services/common/data.service';
import { SideBar, AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { AccountApiService } from 'src/services/account-api.service';

@Component({
  selector: 'app-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.css']
})
export class ChartOfAccountComponent implements OnInit, AfterViewInit {
  rowData: Array<Account>;
  gridOptions: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;

  createAccount: CreateAccountComponent;
  public selectAccounts: any = [];

  style = Style;

  styleForHeight = HeightStyle(224);

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private router: Router,
    private financePocServiceProxy: FinanceServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private accountmappingApiService: AccountmappingApiService,
    private accountApiService: AccountApiService
  ) {
    this.hideGrid = false;
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAccountsRecord();
      }
    });
    this.gridOptions.api.setColumnDefs([
      {
        headerName: 'Account Id',
        field: 'accountId',
        hide: true
      },
      {
        headerName: 'Name',
        field: 'accountName',
        filter: true,
        checkboxSelection: true
      },
      {
        headerName: 'Description',
        field: 'description',
        filter: true
      },
      { headerName: 'Category Id', field: 'categoryId', hide: true },
      {
        headerName: 'Category',
        field: 'category',
        filter: true
      },
      {
        headerName: 'Account Type',
        field: 'type',
        filter: true
      }
    ]);
  }

  ngOnInit() {
    this.initGrid();
    this.getAccountsRecord();
    this.getAccountCategories();
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      },
      groupSelectsChildren: true,
      pinnedBottomRowData: null,
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      getExternalFilterState: () => {
        return {};
      },
      clearExternalFilter: () => {},
      isRowSelectable: rowNode => {
        return !rowNode.data.hasMapping;
      },
      getRowStyle: params => {
        if (params.data.hasMapping) {
          return { background: '#eeeeee' };
        }
      }
    } as GridOptions;
  }

  getAccountCategories() {
    this.accountApiService.accountCategories().subscribe(response => {
      if (response.isSuccessful) {
        this.accountCategories = response.payload;
      } else {
        this.toastrService.error('Failed to fetch account categories!');
      }
    });
  }

  onSelectionChanged(event: any) {
    let getSelectedAccounts = [{}];
    getSelectedAccounts = event.api.getSelectedRows();
    this.accountmappingApiService.storeAccountList(getSelectedAccounts);
  }

  getAccountsRecord() {
    setTimeout(() => {
      this.accountmappingApiService.getMappedAccounts().subscribe(response => {
        if (response.payload) {
          this.rowData = response.payload.map(result => ({
            accountId: result.AccountId,
            accountName: result.AccountName,
            description: result.Description,
            categoryId: result.CategoryId,
            category: result.Category,
            typeId: result.TypeId,
            type: result.Type,
            hasMapping: result.HasMapping,
            hasJournal: result.HasJournal,
            canDeleted: result.CanDeleted,
            canEdited: result.CanEdited
          }));

          this.gridOptions.api.setRowData(this.rowData);
        }
      });
    }, 100);
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getAccountsRecord();
  }

  accountCategorySelected(category) {
    this.selectedAccountCategory = {
      id: category.Id,
      name: category.Name
    };
  }
}
