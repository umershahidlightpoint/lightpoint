import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChartOfAccountDetailComponent } from '../chart-of-account-detail/chart-of-account-detail.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import {
  Account,
  AccountCategory,
  OrganizationAccount
} from '../../../../../shared/Models/account';
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

  gridOptions: GridOptions;
  rowData: Array<Account>;
  account: Account;
  selectedAccountCategory: AccountCategory;
  accountCategories: AccountCategory;
  cloneList: Array<OrganizationAccount>;
  hideGrid: boolean;
  isLoading = true;
  commitLoader = false;
  disableCommit = true;

  style = Style;

  styleForHeight = HeightStyle(221);

  organization = '';
  organizationList: any = [];
  accountRecords: any = [];
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
      if (obj) {
        const rowNodes = this.setOrganizationAccounts(obj.rowNodes);
        this.payload = obj.payload;
        this.disableCommit = false;

        rowNodes.forEach(element => {
          this.accountRecords[
            this.accountRecords.findIndex(item => item.accountId === element.accountId)
          ] = element;

          const row = this.gridOptions.api.getRowNode(element.accountId).setData(element);
        });
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
      getRowNodeId: data => {
        return data.accountId;
      },
      getRowStyle: params => {
        if (params.data.thirdPartyOrganizationName === this.organization) {
          return { background: '#eeeeee' };
        }

        return { background: '#ffffff' };
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

    this.accountsList = this.organizationList.find(
      element => element.OrganizationName === this.organization
    ).Accounts;

    this.cloneList = JSON.parse(JSON.stringify(this.accountRecords));

    this.gridOptions.api.setRowData(this.setOrganizationAccounts(this.cloneList));
  }

  setOrganizationAccounts(list: any) {
    list = list.map(item => {
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

    return list;
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
    this.accountmappingApiService.getOrganisation().subscribe(
      response => {
        if (response.isSuccessful) {
          this.accountCategories = response.payload;
        } else {
          this.toastrService.error('Failed to fetch account Organizations!');
        }

        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.toastrService.error('Failed to fetch account Organizations!');
      }
    );
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

  commitAccountMapping() {
    this.commitLoader = true;
    this.accountmappingApiService.postAccountMapping(this.payload).subscribe(response => {
      this.commitLoader = false;
      if (response.isSuccessful) {
        this.toastrService.success('Sucessfully Commited.');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });

    this.disableCommit = true;
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getAccountsRecord();
  }

  refreshAccounts() {
    this.gridOptions.api.showLoadingOverlay();
    this.gridOptions.api.setRowData(this.setOrganizationAccounts(this.cloneList));
  }

  accountCategorySelected(category) {
    this.selectedAccountCategory = {
      id: category.Id,
      name: category.Name
    };
  }
}
