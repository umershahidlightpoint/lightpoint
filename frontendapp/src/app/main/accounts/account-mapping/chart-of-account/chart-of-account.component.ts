import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ChartOfAccountDetailComponent } from '../chart-of-account-detail/chart-of-account-detail.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { AccountmappingApiService } from '../../../../../services/accountmapping-api.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { OrganizationAccount } from '../../../../../shared/Models/account';
import { DataService } from 'src/services/common/data.service';
import { AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { ContextMenu } from 'src/shared/Models/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss'],
  providers: [AccountmappingApiService]
})
export class ChartOfAccountComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapAccountModal', { static: false }) mapAccountModal: ChartOfAccountDetailComponent;

  gridOptions: GridOptions;
  colDefs: ColDef[];
  autoGroupColumnDef: ColDef;
  accountRecords: any = [];
  cloneList: OrganizationAccount[];
  organizationList: any = [];
  organization = '';
  accountsList: any = [];
  payload: any = [];
  selectedAccounts = [];
  isLoading = true;
  commitLoader = false;
  disableCommit = true;
  hideGrid: boolean;
  modificationsSubscription: Subscription;

  style = Style;

  styleForHeight = HeightStyle(220);

  constructor(
    private toastrService: ToastrService,
    private dataService: DataService,
    private accountmappingApiService: AccountmappingApiService,
    private elementRef: ElementRef
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initColDefs();
    this.initGrid();
    this.getOrganizations();
  }

  ngOnDestroy() {
    this.modificationsSubscription.unsubscribe();
    this.elementRef.nativeElement.remove();
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAccountsRecord();
      }
    });

    this.modificationsSubscription = this.accountmappingApiService.dispatchModifications$.subscribe(
      obj => {
        if (obj) {
          this.disableCommit = false;
          this.gridOptions.api.deselectAll();

          const rowNodes = this.setOrganizationAccounts(obj.rowNodes);
          this.payload = obj.payload;

          rowNodes.forEach(element => {
            this.accountRecords[
              this.accountRecords.findIndex(item => item.accountId === element.accountId)
            ] = element;

            const row = this.gridOptions.api.getRowNode(element.accountId).setData(element);
          });

          const columnGroupState = this.gridOptions.columnApi.getColumnState();
          this.gridOptions.columnApi.resetColumnState();
          this.gridOptions.columnApi.setColumnState(columnGroupState);
        }
      }
    );
  }

  initColDefs() {
    this.colDefs = [
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
        filter: true,
        enableRowGroup: true
      }
    ];
    this.autoGroupColumnDef = {
      headerName: 'Third Party Account',
      field: 'thirdPartyAccount',
      width: 200,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: { checkbox: true }
    };
  }

  initGrid() {
    this.gridOptions = {
      rowData: [],
      columnDefs: this.colDefs,
      pinnedBottomRowData: null,
      rowSelection: 'multiple',
      groupSelectsChildren: true,
      onRowSelected: this.onRowSelected.bind(this),
      autoGroupColumnDef: this.autoGroupColumnDef,
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
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      getRowNodeId: data => {
        return data.accountId;
      },
      getRowStyle: params => {
        if (!params.node.group && params.data.thirdPartyOrganizationName === this.organization) {
          const accountWithOrgName = params.data.thirdPartyMappedAccounts.find(
            account => account.OrganizationName === params.data.thirdPartyOrganizationName
          );

          if (accountWithOrgName.isCommitted && !accountWithOrgName.isModifed) {
            return { background: '#eeeeee' };
          } else {
            return { background: '#f9a89f' };
          }
        }

        // For deleted third party mapped account ( Only modified and committed properties present )
        const specialCase = params.data.thirdPartyMappedAccounts.find(
          account =>
            'isModified' &&
            'isCommitted' in account &&
            account.OrganizationName === this.organization &&
            !account.hasOwnProperty('thirdPartyOrganizationName')
        );

        if (specialCase !== undefined && specialCase.isModified) {
          return { background: '#f9a89f' };
        }

        return { background: '#ffffff' };
      },
      getExternalFilterState: () => {
        return {};
      },
      clearExternalFilter: () => {}
    } as GridOptions;
  }

  selectOrganization(event: any): void {
    this.selectedAccounts = [];

    this.organization = event.target.value;

    this.setGridData();
  }

  setGridData() {
    this.accountsList = this.organizationList.find(
      element => element.OrganizationName === this.organization
    ).Accounts;

    const cloneList = JSON.parse(JSON.stringify(this.accountRecords));

    this.gridOptions.api.setRowData(this.setOrganizationAccounts(cloneList));
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

  onRowSelected(params: any) {
    let status = false;

    if (params.data === undefined) {
      return;
    }

    if (params.node.selected) {
      status = this.addSelectedAccount(params.data);
    } else {
      status = this.removeUnselectedAccount(params.data);
    }

    params.node.setSelected(status);
  }

  addSelectedAccount(rowData: any) {
    let selectionStatus = false;
    const accountIndex = this.selectedAccounts.length - 1;
    const account = {
      accountId: rowData.accountId,
      thirdPartyAccountName: rowData.thirdPartyAccountName
    };

    if (this.selectedAccounts.length === 0) {
      this.selectedAccounts.push(account);
      selectionStatus = true;
    } else if (
      this.selectedAccounts[accountIndex].thirdPartyAccountName === account.thirdPartyAccountName
    ) {
      this.selectedAccounts.push(account);
      selectionStatus = true;
    } else {
      this.toastrService.clear();
      this.toastrService.error(
        'Please Select a Homogeneous Collection, Either rows which are not Mapped or rows with the same Mapping'
      );
    }

    return selectionStatus;
  }

  removeUnselectedAccount(rowData: any) {
    this.selectedAccounts = this.selectedAccounts.filter(
      element => element.accountId !== rowData.accountId
    );

    return false;
  }

  getOrganizations() {
    this.accountmappingApiService.getOrganisation().subscribe(
      response => {
        if (response.isSuccessful) {
          this.organizationList = response.payload;
          this.organization = response.payload[0].OrganizationName;

          this.getAccountsRecord();
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
          thirdPartyMappedAccounts:
            result.ThirdPartyMappedAccounts.length > 0
              ? result.ThirdPartyMappedAccounts.map(account => ({
                  ...account,
                  isCommitted: true,
                  isModified: false
                }))
              : result.ThirdPartyMappedAccounts.map(account => ({
                  ...account,
                  isCommitted: false,
                  isModified: false
                }))
        }));
      }

      this.setGridData();
      this.cloneList = JSON.parse(JSON.stringify(this.accountRecords));
    });
  }

  resetGrid() {
    this.gridOptions.api.showLoadingOverlay();

    this.selectedAccounts = [];
    this.gridOptions.api.setRowData(this.setOrganizationAccounts(this.cloneList));
  }

  commitAccountMapping() {
    this.commitLoader = true;
    this.accountmappingApiService.postAccountMapping(this.payload).subscribe(response => {
      this.commitLoader = false;
      if (response.isSuccessful) {
        this.payload = [];
        this.toastrService.success('Sucessfully Commited.');

        this.getAccountsRecord();
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });

    this.disableCommit = true;
  }
}
