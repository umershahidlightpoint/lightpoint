
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SetDateRange,
  ExcelStyle,
  MoneyFormat,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ToastrService } from 'ngx-toastr';
import { ContextMenu } from 'src/shared/Models/common';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { SecurityApiService } from 'src/services/security-api.service';
import { CreateSecurityComponent } from '../../../../../shared/Modal/create-security/create-security.component';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-security-details',
  templateUrl: './security-details.component.html',
  styleUrls: ['./security-details.component.scss']
})
export class SecurityDetailsComponent implements OnInit {

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

  toBeDeletedSecurityExtended: number = null;

  filterBySymbol = '';
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;

  constructor(private securityApiService: SecurityApiService, private toastrService: ToastrService,) { }

  ngOnInit() {
    this.initGrid();
    this.getSecurities();
  }

  getSecurities() {
    this.securityApiService.getSecurityDetails().subscribe(response => {
      this.data = response.payload;
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.api.setRowData(this.data);
      this.gridOptions.api.expandAll();
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
      /* Custom Method Binding for External Filters from Grid Layout Component */
      isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
      clearExternalFilter: this.clearFilters.bind(this),
      getExternalFilterState: this.getExternalFilterState.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      // onCellClicked: this.rowSelected.bind(this),
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
          headerName: 'Id',
          hide: true
        },
        {
          field: 'security_id',
          headerName: 'SecurityId',
          hide: true
        },
        {
          field: 'symbol',
          width: 120,
          headerName: 'Symbol',
          rowGroup: true,
          enableRowGroup: true,
          sortable: true,
          filter: true,
          hide: true
        },
        {
          field: 'maturity_date',
          headerName: 'Maturity Date',
          sortable: true,
          filter: true,
          width: 120,
          valueFormatter: dateFormatter
        },
        {
          field: 'valuation_date',
          headerName: 'Valuation Date',
          sortable: true,
          filter: true,
          width: 100,
          valueFormatter: dateFormatter
        },
        {
          field: 'spread',
          headerName: 'Spread',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'security_return_description',
          headerName: 'Security Return Description',
          width: 100,
          filter: true,
          sortable: true
        },
        {
          field: 'financing_leg',
          headerName: 'Financing Leg',
          width: 100,
          filter: true,
          sortable: true,
          // cellClass: 'rightAlign',
          // valueFormatter: moneyFormatter
        },
        {
          field: 'financing_end_date',
          headerName: 'Financing End Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'financing_payment_date',
          headerName: 'Financing Payment Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'financing_reset_date_type',
          headerName: 'Financing Reset Date Type',
          width: 100,
          filter: true,
          sortable: true,
        },
        {
          field: 'financing_reset_date',
          headerName: 'Financing Reset Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'next_financing_end_date_type',
          headerName: 'Next Financing End Date Type',
          width: 100,
          filter: true,
          sortable: true,
        },
        {
          field: 'next_financing_end_date',
          headerName: 'Next Financing End Date',
          width: 100,
          filter: true,
          sortable: true,
          valueFormatter: dateFormatter
        },
        {
          field: 'fixed_rate',
          headerName: 'Fixed Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'dcc_fixed_rate',
          headerName: 'DCC Fixed Rate',
          width: 100,
          filter: true,
          sortable: true,
          // valueFormatter: dateFormatter
        },
        {
          field: 'floating_rate',
          headerName: 'Floating Rate',
          width: 100,
          filter: true,
          sortable: true,
          // valueFormatter: dateFormatter
        },
        {
          field: 'dcc_floating_rate',
          headerName: 'DCC Floating Rate',
          width: 100,
          filter: true,
          sortable: true,
          // valueFormatter: dateFormatter
        },
        {
          field: 'primary_market',
          headerName: 'Primary Market',
          width: 100,
          filter: true,
          sortable: true,
          // valueFormatter: dateFormatter
        },
        {
          field: 'reference_equity',
          headerName: 'Reference Equity',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'reference_obligation',
          headerName: 'Reference Obligation',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'upfront',
          headerName: 'Upfront',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'premium_rate',
          headerName: 'Preminum Rate',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        },
        {
          field: 'premium_frequency',
          headerName: 'Preminum Frequency',
          width: 100,
          filter: true,
          sortable: true,
          cellClass: 'rightAlign',
          valueFormatter: moneyFormatter
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

    /////////// External Filters Code //////////////

    getContextMenuItems(params): Array<ContextMenu> {
      const addDefaultItems = [
        {
          name: 'Edit',
          action: () => {
            this.isLoading = true;
            this.securityApiService
              .getSecurityConfig(params.node.data.symbol)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(
                response => {
                  this.securityModal.openEditModal(params.node.data,
                     response.payload[0].SecurityType, response.payload[0].Fields, params.node.data, 'edit');
                },
                error => {}
              );
          }
        },
        {
        name: 'Delete',
        action: () => {
          this.openDeleteSecurityModal(params.node.data.id);
        }
        }
      ];
      const addCustomItems = [];
      return GetContextMenu(false, addDefaultItems, false, addCustomItems, params);
    }

    openDeleteSecurityModal(id){
      this.toBeDeletedSecurityExtended = id;
      this.confirmationModal.showModal();
    }

    deleteSecurityExtend() {
      this.securityApiService.deleteSecurity(this.toBeDeletedSecurityExtended).subscribe(
        response => {
          if (response.isSuccessful) {
            this.toastrService.success('Extended security deleted successfully!');
            this.refreshGrid();
          } else {
            this.toastrService.error('Failed to delete extended security!');
          }
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
    }

    refreshGrid() {
      this.gridOptions.api.showLoadingOverlay();
      this.getSecurities();
    }

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
      // this.setDateRange(dateFilter);
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
      // if (this.filterBySymbol !== '' && this.startDate) {
      //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
      //   const cellDate = new Date(node.data.execution_date);
      //   return (
      //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
      //     this.startDate.toDate() <= cellDate &&
      //     this.endDate.toDate() >= cellDate
      //   );
      // }

      if (this.filterBySymbol !== '') {
        const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
        return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
      }

      // if (this.startDate !== '') {
      //   const cellDate = new Date(node.data.execution_date);
      //   return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
      // }

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
      this.getSecurities();
    }

    clearFilters() {
      this.selected = null;
      this.filterBySymbol = '';
      // this.dividendScreenRatio.detailsView = false;
      this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
      this.endDate = moment();
      this.gridOptions.api.setRowData([]);
      // this.dividendDetailsGrid.api.setRowData([]);
    }

    /////////// End External Filters Code //////////////

  openSecurityModal() {
    this.securityModal.openModal(null);
  }

  openEditModal(data) {
    this.securityModal.openModal(data);
  }

  openSecurityModalFromOutside(data) {
    this.securityModal.openModal(data);
  }

  closeSecurityModal() {
    this.getSecurities();
  }

}

function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

function dateFormatter(params) {
  if (params.value === undefined || params.value === '' || params.value === null || !isNaN(params.value)) {
    return;
  }
  return DateFormatter(params.value);
}
