import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from '../.././create-account/create-account.component';
import { ChartOfAccountDetailComponent } from '../chart-of-account-detail/chart-of-account-detail.component';
// import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { GridOptions } from 'ag-grid-community';
import { ToastrService, ToastrComponentlessModule } from 'ngx-toastr';
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

  styleForHeight = HeightStyle(224);

  organisationList: any = [];
  accountRecords: any = [];
  organisation = '';
  payload : any = [];

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
    this.getOrganisations();
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
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
      clearExternalFilter: () => {},
      // isRowSelectable: rowNode => {
      //   return !rowNode.data.hasMapping;
      // },
      getRowStyle: params => {
        if (params.data.hasMapping) {
          return { background: '#eeeeee' };
        }
      }
    } as GridOptions;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    console.log(params, '***************************************');
    // if (params.node.data.hasMapping) {
    const addDefaultItems = [
      {
        name: 'Map',
        action: () => {
          this.mappedAccountId(params.node.data);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, false, [], params);
    // }
  }
  getOrganisations() {
    this.accountmappingApiService.getOrganisation().subscribe(data => {
      this.organisationList = data.payload;
    });
  }

  selectOrganisation(event: any): void {
    this.organisation = event.target.value;

    let cloneList = JSON.parse(JSON.stringify(this.accountRecords));

    cloneList = cloneList.filter(element => {
      return (
        element.thirdPartyOrganisationName === this.organisation ||
        element.thirdPartyOrganisationName === null
      );
    });

    console.log(cloneList);
    this.gridOptions.api.setRowData(cloneList);
  }

  mappedAccountId(params) {
    // if (params.hasMapping === true) {
    //   this.accountmappingApiService.storeAccountList(false);
    //   const obj = {
    //     params : [params],
    //     action: 'edit'
    //   };
    //   this.accountmappingApiService.storeAccountList(obj);
    // } else {
    //   return false;
    // }
    const getSelectedAccounts = this.gridOptions.api.getSelectedRows();
    const dispatchObject = {
      payload: this.payload,
      rowNodes: getSelectedAccounts
    }
    this.accountmappingApiService.storeAccountList(dispatchObject);
    this.mapAccountModal.show();
    console.log(getSelectedAccounts);
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

  onSelectionChanged(event: any) {
    // const getSelectedAccounts = event.api.getSelectedRows();
    // const obj = {
    //   params : getSelectedAccounts,
    //   action: 'post'
    // };

    // this.accountmappingApiService.storeAccountList(obj);
  }

  getAccountsRecord() {
    setTimeout(() => {
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
            thirdPartyMappedAccounts: result.ThirdPartyMappedAccounts,
            thirdPartyOrganisationName: result.ThirdPartyMappedAccounts[0]
              ? result.ThirdPartyMappedAccounts[0].OrganizationName
              : null,
            thirdPartyAccountName: result.ThirdPartyMappedAccounts[0]
              ? result.ThirdPartyMappedAccounts[0].ThirdPartyAccountName
              : null
          }));
          console.log(this.accountRecords);
          // this.gridOptions.api.setRowData(this.rowData);
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
