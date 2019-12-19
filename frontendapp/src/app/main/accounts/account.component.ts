import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AccountApiService } from '../../../services/account-api.service';
import { GridOptions } from 'ag-grid-community';
import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component';
import { ToastrService } from 'ngx-toastr';
import { Account, AccountCategory } from '../../../shared/Models/account';
import { DataService } from 'src/services/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { SideBar, AutoSizeAllColumns, HeightStyle, Style } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-ledger-form',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit {
  rowData: Array<Account>;
  gridOptions: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  account: Account;
  hideGrid: boolean;

  @ViewChild('createModal', { static: false })
  createAccount: CreateAccountComponent;
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;
  @ViewChild('divToMeasure', { static: false }) divToMeasureElement: ElementRef;
  @ViewChild('confirmationModal', { static: false })
  confirmationModal: ConfirmationModalComponent;

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

  activeAccountMap: boolean = false;

  constructor(
    private router: Router,
    private accountApiService: AccountApiService,
    private toastrService: ToastrService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
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
        filter: true
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
        headerName: 'Has Journal',
        field: 'hasJournal',
        filter: true
      },
      {
        headerName: 'Account Type',
        field: 'type',
        filter: true
      },
      { headerName: 'CanDeleted', field: 'canDeleted', hide: true },
      { headerName: 'CanEdited', field: 'canEdited', hide: true },
      {
        headerName: 'Actions',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        },
        filter: false
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
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      clearExternalFilter: () => {},
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(GridId.accountId, GridName.account, this.gridOptions);
  }

  activeAccountMapping() {
    this.activeAccountMap = true;
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

  getAccountsRecord() {
    setTimeout(() => {
      this.accountApiService.getAllAccounts().subscribe(result => {
        if (result.payload) {
          this.rowData = result.payload.map(result => ({
            accountId: result.AccountId,
            accountName: result.AccountName,
            description: result.Description,
            categoryId: result.CategoryId,
            category: result.Category,
            typeId: result.TypeId,
            type: result.Type,
            hasJournal: result.HasJournal,
            canDeleted: result.CanDeleted,
            canEdited: result.CanEdited
          }));
          this.gridOptions.api.setRowData(this.rowData);
        }
      });
    }, 100);
  }

  editRow(row) {
    this.router.navigateByUrl('/accounts/create-account');
    this.createAccount.show(row);
  }

  openConfirmationModal(row) {
    this.account = row;
    this.confirmationModal.showModal();
  }

  deleteAccount() {
    const selectedAccount = this.account;
    this.accountApiService.deleteAccount(selectedAccount.accountId).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Account deleted successfully!');
          this.getAccountsRecord();
        } else {
          this.toastrService.error('Account deleted failed!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  addAccount() {
    this.router.navigateByUrl('/accounts/create-account');
    this.createAccount.show({});
  }

  onBtExport() {
    const params = {
      fileName: 'Accounts',
      sheetName: 'First Sheet',
      columnKeys: ['accountName', 'description', 'category', 'hasJournal', 'type']
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
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
    this.router.navigateByUrl('/accounts/create-account');
    this.createAccount.show({});
  }
}
