import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChartOfAccountDetailComponent } from '../chart-of-account-detail/chart-of-account-detail.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../../../shared/Models/account';
import { DataService } from 'src/services/common/data.service';
import { AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { ContextMenu } from 'src/shared/Models/common';

@Component({
  selector: 'app-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.css']
})
export class ChartOfAccountComponent implements OnInit, AfterViewInit {
  @ViewChild('mapAccountModal', { static: false }) mapAccountModal: ChartOfAccountDetailComponent;

  rowData: Array<Account>;
  gridOptions: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;

  style = Style;

  styleForHeight = HeightStyle(221);

  organizationList: any = [];
  accountRecords: any = [];
  organization = '';
  accountsList: any = [];
  payload: any = [];

  constructor(
    private toastrService: ToastrService,
    private dataService: DataService,
    private accountmappingApiService: AccountmappingApiService
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

    this.accountmappingApiService.dispatchModifications$.subscribe(obj => {
      if(obj){
        console.log(obj.payload, "modified payload from modal");
        console.log(obj.rowNodes, "modified row nodes from modal");
      }
    })
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
      },
      {
        headerName: 'Has Mapping',
        field: 'hasMapping',
        hide: true
      },
      {
        headerName: 'Third Party Account Name',
        field: 'thirdPartyAccountName',
        filter: true
      }
    ]);
  }

  ngOnInit() {
    this.initGrid();
    this.getAccountsRecord();
    this.getAccountCategories();
    this.getOrganizations();
  }

  initGrid() {
    this.gridOptions = {
      rowData: [],
      rowSelection: 'multiple',
      getContextMenuItems: this.getContextMenuItems.bind(this),
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
      clearExternalFilter: () => {}
    } as GridOptions;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'Map',
        action: () => {
          this.mappedAccountId(params.node.data);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, false, [], params);
  }

  getOrganizations() {
    this.accountmappingApiService.getOrganisation().subscribe(data => {
      this.organizationList = data.payload;
    });
  }

  selectOrganization(event: any): void {
    this.organization = event.target.value;

    let cloneList = JSON.parse(JSON.stringify(this.accountRecords));

    cloneList = cloneList.map(item => {
      let accountName = '';
      let organizationName = '';
      if (item.thirdPartyMappedAccounts.length !== 0) {
        const { ThirdPartyAccountName = '', OrganizationName = '' } =
          item.thirdPartyMappedAccounts.find(
            element => element.OrganizationName === this.organization
          ) || {};
        accountName = ThirdPartyAccountName;
        organizationName = OrganizationName;
      }
      return {
        ...item,
        thirdPartyAccountName: accountName,
        thirdPartyOrganizationName: organizationName
      };
    });

    this.accountsList = this.organizationList.find(
      element => element.OrganizationName === this.organization
    ).Accounts;

    this.gridOptions.getRowStyle = params => {
      if (params.data.thirdPartyOrganizationName === this.organization) {
        return { background: '#eeeeee' };
      }
    };

    this.gridOptions.api.setRowData(cloneList);
  }

  mappedAccountId(params) {
    const getSelectedAccounts = this.gridOptions.api.getSelectedRows();
    const dispatchObject = {
      payload: this.payload,
      rowNodes: getSelectedAccounts,
      organization: this.organization,
      accounts: this.accountsList
    };

    this.accountmappingApiService.storeAccountList(dispatchObject);

    this.mapAccountModal.show();
  }

  getAccountCategories() {
    this.accountmappingApiService.getOrganisation().subscribe(response => {
      if (response.isSuccessful) {
        this.accountCategories = response.payload;
      } else {
        this.toastrService.error('Failed to fetch account categories!');
      }
    });
  }

  onSelectionChanged(event: any) {}

  getAccountsRecord() {
      this.accountmappingApiService.getMappedAccounts().subscribe(response => {
        this.accountRecords = response.payload;
        if (response.payload) {
          this.accountRecords = response.payload.map(result => ({
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
            canEdited: result.CanEdited,
            thirdPartyMappedAccounts: result.ThirdPartyMappedAccounts
          }));
        }
      });
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
