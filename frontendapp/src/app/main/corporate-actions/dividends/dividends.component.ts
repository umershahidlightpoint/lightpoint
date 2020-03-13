import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {
  Style,
  SideBar,
  SetDateRange,
  ExcelStyle,
  FormatNumber4,
  MoneyFormat,
  CommaSeparatedFormat,
  HeightStyle,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { GridId, GridName, LayoutConfig } from 'src/shared/utils/AppEnums';
import { ContextMenu } from 'src/shared/Models/common';
import * as moment from 'moment';
import { CacheService } from 'src/services/common/cache.service';
import { ToastrService } from 'ngx-toastr';
import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { finalize } from 'rxjs/operators';
import { SecurityApiService } from 'src/services/security-api.service';
import { CreateDividendComponent } from 'src/shared/Modal/create-dividend/create-dividend.component';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-dividends',
  templateUrl: './dividends.component.html',
  styleUrls: ['./dividends.component.scss']
})
export class DividendsComponent implements OnInit, AfterViewInit {
  @ViewChild('dividendModal', { static: false }) dividendModal: CreateDividendComponent;
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ConfirmationModalComponent;


  pinnedBottomRowData;
  gridOptions: GridOptions;
  dividendDetailsGrid: GridOptions;
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

  toBeDeletedDividend : number = null;

  dividendConfig: {
    dividendSize: number;
    detailsSize: number;
    dividendView: boolean;
    detailsView: boolean;
    useTransition: boolean;
  } = {
    dividendSize: 50,
    detailsSize: 50,
    dividendView: true,
    detailsView: false,
    useTransition: true
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private cacheService: CacheService,
    private corporateActionsApiService: CorporateActionsApiService,
    private toastrService: ToastrService,
    private securityApiService: SecurityApiService,
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.initGrid();
    this.getDividends();
  }

  ngAfterViewInit(): void {
    this.initPageLayout();
  }

  initPageLayout() {
    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.dividendConfigKey);
    if (config) {
      this.dividendConfig = JSON.parse(config.value);
    }

    this.cdRef.detectChanges();
  }

  applyPageLayout(event) {
    if (event.sizes) {
      this.dividendConfig.dividendSize = event.sizes[0];
      this.dividendConfig.detailsSize = event.sizes[1];
    }

    const persistUIState = this.cacheService.getConfigByKey(LayoutConfig.persistUIState);
    if (!persistUIState || !JSON.parse(persistUIState.value)) {
      return;
    }

    const config = this.cacheService.getConfigByKey(LayoutConfig.dividendConfigKey);
    const payload = {
      id: !config ? 0 : config.id,
      project: LayoutConfig.projectName,
      uom: 'JSON',
      key: LayoutConfig.dividendConfigKey,
      value: JSON.stringify(this.dividendConfig),
      description: LayoutConfig.dividendConfigKey
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

  initGrid() {
    this.gridOptions = {
      rowData: null,
      pinnedBottomRowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onFilterChanged: this.onFilterChanged.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      /* Custom Method Binding for External Filters from Grid Layout Component */
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
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        // AutoSizeAllColumns(params);
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
          field: 'symbol',
          width: 120,
          headerName: 'Symbol',
          rowGroup: true,
          enableRowGroup: true,
          sortable: true,
          filter: true
        },
        {
          field: 'notice_date',
          headerName: 'Notice Date',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: dateFormatter
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
          field: 'record_date',
          headerName: 'Record Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'pay_date',
          headerName: 'Pay Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'rate',
          headerName: 'Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'currency',
          headerName: 'Currency',
          width: 100,
          filter: true,
          sortable: true
        },
        {
          field: 'withholding_rate',
          headerName: 'Holding Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'fx_rate',
          headerName: 'Fx Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'active_flag',
          headerName: 'Active Flag',
          width: 100,
          filter: true,
          sortable: true,
          hide: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;

    this.dividendDetailsGrid = {
      rowData: [],
      pinnedBottomRowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      rowSelection: 'multiple',
      rowGroupPanelShow: 'after',
      suppressColumnVirtualisation: true,
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.dividendDetailsGrid.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {
        params.api.forEachNode(node => {
          node.expanded = true;
        });
        params.api.onGroupExpandedOrCollapsed();

        // AutoSizeAllColumns(params);
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
          field: 'fund',
          headerName: 'Fund',
          width: 100,
          enableRowGroup: true,
          filter: true,
          sortable: true
        },
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol',
          enableRowGroup: true,
          sortable: true,
          filter: true,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'quantity',
          width: 120,
          headerName: 'Quantity',
          sortable: true,
          filter: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'execution_date',
          headerName: 'Execution Date',
          sortable: true,
          sort: 'asc',
          filter: true,
          width: 100,
          valueFormatter: dateFormatter
        },
        {
          field: 'fx_rate',
          headerName: 'Fx Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'currency',
          headerName: 'Currency',
          width: 100,
          filter: true,
          sortable: true
        },
        {
          field: 'base_gross_dividend',
          headerName: 'Base Gross Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'base_withholding_amount',
          headerName: 'Base Withholding Amount',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'base_net_dividend',
          headerName: 'Base Net Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'settlement_gross_dividend',
          headerName: 'Settlement Gross Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'settlement_withholdings_amount',
          headerName: 'Settlement Withholding Amount',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'settlement_local_net_dividend',
          headerName: 'Settlement Local Net Dividend',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter,
          cellClassRules: {
            footerRow(params) {
              if (params.node.rowPinned) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          field: 'active_flag',
          headerName: 'Active Flag',
          width: 100,
          filter: true,
          sortable: true,
          hide: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;

    this.gridOptions.sideBar = SideBar(GridId.dividendsId, GridName.dividends, this.gridOptions);
  }

  getDividends() {
    this.corporateActionsApiService.getDividends().subscribe(response => {
      if(response.statusCode === 200){
        this.data = response.payload;
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.api.setRowData(this.data);
        this.gridOptions.api.expandAll();
      } else{
        this.toastrService.error(response.Message);
      }
    }, err => {
      this.toastrService.error("The request failed");
      this.gridOptions.api.hideOverlay();
    });
  }

  getDividendDetails(id, executionDate) {
    this.dividendConfig.detailsView = true;
    this.dividendDetailsGrid.api.showLoadingOverlay();
    this.corporateActionsApiService.getDividendDetails(executionDate, id).subscribe(response => {
      if(response.statusCode === 200){
        let dividendDetail = response.payload;
        this.dividendDetailsGrid.api.sizeColumnsToFit();
        this.setPinnedBottomRowData(dividendDetail);
        this.dividendDetailsGrid.api.setRowData(dividendDetail);
        this.dividendDetailsGrid.api.expandAll();
      } else {
        this.toastrService.error(response.Message);
      }
    }, err=> {
      this.dividendDetailsGrid.api.hideOverlay();
      this.toastrService.error("The request failed");
    });
  }

  openEditModal(data) {
    this.dividendModal.openModal(data);
  }

  openDividendModal() {
    this.dividendModal.openModal(null);
  }

  closeDividendModal() {
    this.gridOptions.api.showLoadingOverlay();
    this.dividendDetailsGrid.api.setRowData([]);
    this.getDividends();
  }

  rowSelected(row) {
     const { id } = row.data;
     const { execution_date} = row.data;
    // let node;
    // this.dividendDetailsGrid.api.forEachLeafNode(rowNode => {
    //   if (rowNode.data.id === id) {
    //     rowNode.setSelected(true);
    //     node = rowNode;
    //   } else {
    //     rowNode.setSelected(false);
    //   }
    // });
    // if (node) {
    //   this.dividendConfig.detailsView = true;
    //   this.dividendDetailsGrid.api.ensureIndexVisible(node.rowIndex);
    // }
    this.getDividendDetails(id, execution_date);
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
    // this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
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
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      const cellDate = new Date(node.data.execution_date);
      return (
        cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        this.startDate.toDate() <= cellDate &&
        this.endDate.toDate() >= cellDate
      );
    }

    if (this.filterBySymbol !== '') {
      const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
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
    this.dividendConfig.detailsView = false;
    this.dividendDetailsGrid.api.setRowData([]);
    this.dividendDetailsGrid.api.showLoadingOverlay();
    this.getDividends();
  }

  setPinnedBottomRowData(data){
    this.pinnedBottomRowData = [
      {
        fund: '',
        symbol: 'Total: ',
        quantity: undefined,
        execution_date: undefined,
        fx_rate: undefined,
        currency: '',
        base_gross_dividend: this.sum(data,"base_gross_dividend"),
        base_withholding_amount: this.sum(data, "base_withholding_amount"),
        base_net_dividend: this.sum(data, "base_net_dividend"),
        settlement_gross_dividend: this.sum(data, "settlement_gross_dividend"),
        settlement_withholdings_amount: this.sum(data, "settlement_withholdings_amount"),
        settlement_local_net_dividend: this.sum(data, "settlement_local_net_dividend"),
      }
    ];
    this.dividendDetailsGrid.api.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  sum(items, prop){
      return items.reduce( function(a, b){
          return Math.abs(a + b[prop]);
      }, 0);
  }

  clearFilters() {
    this.selected = null;
    this.filterBySymbol = '';
    this.dividendConfig.detailsView = false;
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.gridOptions.api.setRowData([]);
    this.dividendDetailsGrid.api.setRowData([]);
  }

  /////////// End External Filters Code //////////////

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
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

              this.securityApiService.getDataForSecurityModal(params.node.data.symbol).subscribe(
                ([config, securityDetails]: [any, any]) => {

                  this.isLoading = false;
                  if (!config.isSuccessful) {
                  this.toastrService.error('No security type found against the selected symbol!');
                  return;
                }
                  if (securityDetails.payload.length === 0) {
                  this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
                    config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                } else {
                  this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
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
      }
    ];
    const addCustomItems = [];
    return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
  }

  openDeleteDividendModal(id){
    this.toBeDeletedDividend = id;
    this.confirmationModal.showModal();
  }

  deleteDividend() {
    this.corporateActionsApiService.deleteDividend(this.toBeDeletedDividend).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Dividend deleted successfully!');
          this.closeDividendModal();
        } else {
          this.toastrService.error('Failed to delete Dividend!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.corporateActionsApiService.getDividendDetail(id).subscribe(response => {
      if(response.statusCode === 200){
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Dividend Audit Trail';
      this.dataGridModal.openModal(modifiedCols, payload);
      }
    }, err => {

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
        field: 'symbol',
        width: 120,
        headerName: 'Symbol',
        rowGroup: true,
        enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'notice_date',
        headerName: 'Notice Date',
        sortable: true,
        filter: true,
        width: 120
      },
      {
        field: 'execution_date',
        headerName: 'Execution Date',
        sortable: true,
        filter: true,
        width: 100
      },
      {
        field: 'record_date',
        headerName: 'Record Date',
        width: 100,
        filter: true,
        sortable: true
      },
      {
        field: 'pay_date',
        headerName: 'Pay Date',
        width: 100,
        filter: true,
        sortable: true
      },
      {
        field: 'maturity_date',
        headerName: 'Maturity Date',
        width: 100,
        filter: true,
        sortable: true
      },
      {
        field: 'rate',
        headerName: 'Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'currency',
        headerName: 'Currency',
        width: 100,
        filter: true,
        sortable: true
      },
      {
        field: 'withholding_rate',
        headerName: 'Holding Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'fx_rate',
        headerName: 'Fx Rate',
        width: 100,
        filter: true,
        sortable: true,
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
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
