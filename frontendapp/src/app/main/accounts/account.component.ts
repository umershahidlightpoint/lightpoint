import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { TemplateRendererComponent } from '../../template-renderer/template-renderer.component';
import { ToastrService } from 'ngx-toastr';
import { GridRowData, AccountCategory } from '../../../shared/Models/account';
import { takeWhile } from 'rxjs/operators';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { SideBar, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';

@Component({
  selector: 'app-ledger-form',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {
  rowData: Array<GridRowData>;
  gridOptions: GridOptions;
  accountCategories: AccountCategory;
  selectedAccountCategory: AccountCategory;
  hideGrid: boolean;
  // For unsubscribing all subscriptions
  isSubscriptionAlive: boolean;

  @ViewChild('createModal') createAccount: CreateAccountComponent;
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForHight = HeightStyle(224);

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
    private financePocServiceProxy: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.isSubscriptionAlive = true;
    this.hideGrid = false;
  }

  ngAfterViewInit(): void {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getAccountsRecord();
      }
    });
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.accountId, gridName: GridName.account });
    this.gridOptions.api.setColumnDefs([
      {
        headerName: 'Account Id',
        field: 'accountId',
        resizable: true,
        hide: true
      },
      {
        headerName: 'Name',
        field: 'accountName',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Description',
        field: 'description',
        resizable: true,
        sortable: true,
        filter: true
      },
      { headerName: 'Category Id', field: 'categoryId', hide: true },
      {
        headerName: 'Category',
        field: 'category',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Has Journal',
        field: 'hasJournal',
        resizable: true,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Account Type',
        field: 'type',
        resizable: true,
        sortable: true,
        filter: true
      },
      { headerName: 'CanDeleted', field: 'canDeleted', hide: true },
      { headerName: 'CanEdited', field: 'canEdited', hide: true },
      {
        headerName: 'Actions',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
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
      sideBar: SideBar,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);

        params.api.sizeColumnsToFit();
      }
    };
  }

  getAccountCategories() {
    this.financePocServiceProxy
      .accountCategories()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.accountCategories = response.payload;
        } else {
          this.toastrService.error('Failed to fetch account categories!');
        }
      });
  }

  getAccountsRecord() {
    setTimeout(() => {
      this.financePocServiceProxy
        .getAllAccounts()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(result => {
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

  deleteRow(row) {
    this.financePocServiceProxy.deleteAccount(row.accountId).subscribe(
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

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
