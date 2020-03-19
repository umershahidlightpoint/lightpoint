
import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName, LayoutConfig } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { CreateSymbolRenameComponent } from 'src/shared/Modal/create-symbol-rename/create-symbol-rename.component';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { AgGridUtils } from '../../../../shared/utils/AgGridUtils';
import * as moment from 'moment';
import { CacheService } from 'src/services/common/cache.service';
import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import {
  SideBar,
  SetDateRange,
  ExcelStyle,
  FormatNumber4,
  MoneyFormat,
  CommaSeparatedFormat,
  DateFormatter
} from 'src/shared/utils/Shared';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';

import { SecurityApiService } from 'src/services/security-api.service';

@Component({
  selector: 'app-symbol-rename',
  templateUrl: './symbol-rename.component.html',
  styleUrls: ['./symbol-rename.component.scss']
})
export class SymbolRenameComponent implements OnInit, AfterViewInit {
  @ViewChild('symbolRenameModal', { static: false }) symbolRenameModal: CreateSymbolRenameComponent;
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ConfirmationModalComponent;


  pinnedBottomRowData;
  gridOptions: GridOptions;
  changeSymbolDetailsGrid: GridOptions;
  rowData: [];
  data: any;

  isLoading = false;
  hideGrid: boolean;
  journalDate: any;
  title: string;

  filterBySymbol = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;
  createDividend = false;

  toBeDeletedStockSplit: number = null;

  symbolChangeConfig: {
    symbolChangeSize: number;
    detailsSize: number;
    symbolChangeView: boolean;
    detailsView: boolean;
    useTransition: boolean;
  } = {
    symbolChangeSize: 50,
    detailsSize: 50,
    symbolChangeView: true,
    detailsView: false,
    useTransition: true
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private cacheService: CacheService,
    private corporateActionsApiService: CorporateActionsApiService,
    private securityApiService: SecurityApiService,
    private toastrService: ToastrService,
    private agGridUtils: AgGridUtils
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getSymbolsChange();
  }

  ngAfterViewInit(): void {
    this.initPageLayout();
  }

  initPageLayout() {
    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.stockSplitsConfigKey);
    if (config) {
      this.symbolChangeConfig = JSON.parse(config.value);
    }

    this.cdRef.detectChanges();
  }

  applyPageLayout(event) {
    if (event.sizes) {
      this.symbolChangeConfig.symbolChangeSize = event.sizes[0];
      this.symbolChangeConfig.detailsSize = event.sizes[1];
    }

    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.stockSplitsConfigKey);
    const payload = {
      id: !config ? 0 : config.id,
      project: LayoutConfig.projectName,
      uom: 'JSON',
      key: LayoutConfig.stockSplitsConfigKey,
      value: JSON.stringify(this.symbolChangeConfig),
      description: LayoutConfig.stockSplitsConfigKey
    };

    if (!config) {
      this.cacheService.addUserConfig(payload).subscribe(response => {
        console.log('User Config Added');
      });
    } else {
      this.cacheService.updateUserConfig(payload).subscribe(response => {
        console.log('User Config Updated');
      });
    }
  }

  getSymbolsChange() {
    this.corporateActionsApiService.getSymbolsChange().subscribe(response => {
      this.gridOptions.api.hideOverlay();
      if (response.statusCode === 200){
        this.data = response.payload;
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.api.setRowData(this.data);
        this.gridOptions.api.expandAll();
      } else {
        this.toastrService.error(response.Message);
      }
    }, err => {
      this.gridOptions.api.hideOverlay();
    });
  }

  getSymbolChangeDetails(symbol) {
    this.symbolChangeConfig.detailsView = true;
    this.changeSymbolDetailsGrid.api.showLoadingOverlay();
    this.corporateActionsApiService.getSymbolTradeDetails(symbol).subscribe(result => {
      console.log(result);
      if (result.stats === 200){
        let stockSplitDetail;
        stockSplitDetail = null;
        stockSplitDetail = result;
        this.changeSymbolDetailsGrid.api.hideOverlay();
        this.rowData = [];
        const someArray = this.agGridUtils.columizeData(
          stockSplitDetail.data,
          stockSplitDetail.meta.Columns
        );
        const cdefs = this.agGridUtils.customizeColumns(
          [],
          stockSplitDetail.meta.Columns,
          [],
          false
        );
        this.changeSymbolDetailsGrid.api.setColumnDefs(cdefs);
        this.rowData = someArray as [];

        console.log(this.gridOptions.api)
      } else {
        this.toastrService.error(result.Message);
      }
    }, err => {
      this.toastrService.error("The request failed");
      this.changeSymbolDetailsGrid.api.hideOverlay();
    });
  }

  getStockSplitDetails(id) {
    this.symbolChangeConfig.detailsView = true;
    this.changeSymbolDetailsGrid.api.showLoadingOverlay();
    this.corporateActionsApiService.getStockSplitDetails(id).subscribe(response => {
      if (response.statusCode === 200){
        let stockSplitDetail = response.payload;
        this.changeSymbolDetailsGrid.api.setRowData(stockSplitDetail);
        this.changeSymbolDetailsGrid.api.sizeColumnsToFit();
        this.changeSymbolDetailsGrid.api.expandAll();
      } else {
        this.toastrService.error(response.Message);
      }
    }, err => {
      this.toastrService.error("The request failed");
      this.changeSymbolDetailsGrid.api.hideOverlay();
    });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      /* Custom Method Binding to Clear External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      onCellClicked: this.rowSelected.bind(this),
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.gridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      columnDefs: [
        {
          field: 'id',
          width: 120,
          headerName: 'Id',
          sortable: true,
          filter: true,
          hide: true
        },
        {
          field: 'old_symbol',
          width: 120,
          headerName: 'Old Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'new_symbol',
          width: 120,
          headerName: 'New Symbol',
          sortable: true,
          filter: true
        },
        {
          field: 'execution_date',
          headerName: 'Execution Date',
          sortable: true,
          filter: true,
          width: 100,
          valueFormatter: dateFormatter
        },
        {
          field: 'notice_date',
          headerName: 'Notice Date',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: dateFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;

    this.changeSymbolDetailsGrid = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.changeSymbolDetailsGrid.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
    } as GridOptions;
  }

  openEditModal(data) {
    this.symbolRenameModal.openModal(data);
  }

  openStockSplitModal() {
    this.symbolRenameModal.openModal(null);
  }

  closeSymbolChangeModal() {
    this.gridOptions.api.showLoadingOverlay();
    this.getSymbolsChange();
    this.changeSymbolDetailsGrid.api.setRowData([]);
  }

  deleteStockSplit() {
    this.corporateActionsApiService.deleteSymbolChange(this.toBeDeletedStockSplit).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Symbol deleted successfully!');
          this.closeSymbolChangeModal();
        } else {
          this.toastrService.error('Failed to delete Symbol!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  rowSelected(row) {
    const { old_symbol } = row.data;
    this.getSymbolChangeDetails(old_symbol);
  }

  /////////// External Filters Code //////////////

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.gridOptions.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  onFilterChanged() {
    this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.gridOptions.api.onFilterChanged();
  }

  ngModelChangeDates(e) {
    if (!this.selected.startDate) {
      return;
    }
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.gridOptions.api.onFilterChanged();
  }

  isExternalFilterPassed(object) {
    const { symbolFilter } = object;
    const { dateFilter } = object;
    this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
    this.setDateRange(dateFilter);
    this.gridOptions.api.onFilterChanged();
  }

  setDateRange(dateFilter: any) {
    const dates = SetDateRange(dateFilter, this.startDate, this.endDate);
    this.startDate = dates[0];
    this.endDate = dates[1];

    this.selected =
      dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
  }

  isExternalFilterPresent() {
    if (this.filterBySymbol !== '' || this.startDate) {
      return true;
    }
  }

  doesExternalFilterPass(node: any) {
    if (this.filterBySymbol !== '' && this.startDate) {
      const cellSymbol = node.data.old_symbol === null ? '' : node.data.old_symbol;
      const cellDate = new Date(node.data.execution_date);
      return (
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.old_symbol === null ? '' : node.data.old_symbol;
      return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }

    if (this.startDate !== '') {
      const cellDate = new Date(node.data.execution_date);
      return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
    }

    return true;
  }

  getExternalFilterState() {
    return {
      symbolFilter: this.filterBySymbol,
      dateFilter: {
        startDate: this.startDate !== undefined ? this.startDate : '',
        endDate: this.endDate !== undefined ? this.endDate : ''
      }
    };
  }

  refreshReport() {
    this.gridOptions.api.showLoadingOverlay();
    this.changeSymbolDetailsGrid.api.showLoadingOverlay();
    this.getSymbolsChange();
    this.changeSymbolDetailsGrid.api.setRowData([]);
    this.symbolChangeConfig.detailsView = false;
  }

  clearFilters() {
    this.selected = null;
    this.filterBySymbol = '';
    this.symbolChangeConfig.detailsView = false;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.gridOptions.api.setRowData([]);
    this.changeSymbolDetailsGrid.api.setRowData([]);
  }

  /////////// End External Filters Code //////////////

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [{
      name: 'Edit',
      action: () => {
        this.openEditModal(params.node.data);
      }
    },
    {
      name: 'Delete',
      action: () => {
        this.openDeleteDividendModal(params.node.data.id);
      }
    },
    {
      name: 'Audit Trail',
      action: () => {
        this.openDataGridModal(params);
      }
    },
    {
      name: 'Security Details',
      subMenu: [
        {
          name: 'Extend',
          action: () => {
            this.isLoading = true;

            this.securityApiService.getDataForSecurityModal(params.node.data.old_symbol).subscribe(
              ([config, securityDetails]: [any, any]) => {

                this.isLoading = false;
                if (!config.isSuccessful) {
                this.toastrService.error('No security type found against the selected symbol!');
                return;
              }
                if (securityDetails.payload.length === 0) {
                this.securityModal.openSecurityModalFromOutside(params.node.data.old_symbol,
                  config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
              } else {
                this.securityModal.openSecurityModalFromOutside(params.node.data.old_symbol,
                  config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
              }

              },
              error => {
                this.isLoading = false;
              }
            );
          },
        }
      ]
      },
    ];
    const addCustomItems = [];
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
  }

  openDeleteDividendModal(id){
    this.toBeDeletedStockSplit = id;
    this.confirmationModal.showModal();
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.corporateActionsApiService.getSymbolChangeAudit(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Symbol Change Audit Trail';
      this.dataGridModal.openModal(modifiedCols, payload);
    });
  }

  getAuditColDefs(): Array<ColDef | ColGroupDef> {
    return [
      {
        field: 'id',
        width: 120,
        headerName: 'Id',
        sortable: true,
        filter: true,
        hide: true
      },
      {
        field: 'old_symbol',
        width: 120,
        headerName: 'Old Symbol',
        // rowGroup: true,
        // enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'new_symbol',
        width: 120,
        headerName: 'New Symbol',
        // rowGroup: true,
        // enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'execution_date',
        headerName: 'Execution Date',
        sortable: true,
        filter: true,
        width: 100
      },
      {
        field: 'notice_date',
        headerName: 'Notice Date',
        sortable: true,
        filter: true,
        width: 120
      },
      {
        field: 'active_flag',
        headerName: 'Active Flag',
        width: 100,
        filter: true,
        sortable: true,
        hide: true
      }
    ];
  }
}

function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

function dateFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return DateFormatter(params.value);
}

function priceFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}
