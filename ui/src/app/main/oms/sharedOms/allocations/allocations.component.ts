import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataService } from 'src/services/common/data.service';
import { CreateSecurityComponent } from 'src/shared/Modal/create-security/create-security.component';
import { FinanceServiceProxy } from '../../../../../services/service-proxies';
import { SecurityApiService } from 'src/services/security-api.service';
import { ToastrService } from 'ngx-toastr';
import { AgGridUtils } from '../../../../../shared/utils/AgGridUtils';
import { SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit, AfterViewInit {
  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;
  public allocationsGridOptions: GridOptions;
  public allocationsData: [];
  allocationTradesData: any;
  columnDefs = [];
  isLoading = false;

  constructor(
    private financeService: FinanceServiceProxy,
    private securityApiService: SecurityApiService,
    private dataService: DataService,
    private agGridUtils: AgGridUtils,
    private toasterService: ToastrService,
  ) {
    this.initGrid();
  }

  ngOnInit() {
    this.dataService.allocationId.subscribe(data => {
      if (data != null) {
        this.getTradeAllocations(data);
      }
    });
  }

  ngAfterViewInit(): void {}

  // openModal = row => {
  //   // We can drive the screen that we wish to display from here
  //   if (row.colDef.headerName === 'Group') {
  //     return;
  //   }
  //   const cols = this.gridOptions.columnApi.getColumnState();
  //   const modifiedCols = cols.map(i => ({ colId: this.splitColId(i.colId), hide: i.hide }));
  //   if (row.colDef.headerName === 'LPOrderId') {
  //     this.title = 'Allocation Details';
  //     this.dataModal.openModal(row, modifiedCols);
  //     return;
  //   }

  //   if (row.colDef.headerName === 'AccrualId') {
  //     this.title = 'Accrual Details';
  //     this.dataModal.openModal(row, modifiedCols);
  //     return;
  //   }
  // };

  initGrid() {
    this.allocationsGridOptions = {
      rowData: [],
      columnDefs: this.columnDefs,
      // onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      enableFilter: true,
      animateRows: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      getContextMenuItems: this.getContextMenuItems.bind(this),
      alignedGrids: [],
      onGridReady: () => {
        // this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      getExternalFilterState: () => {
        return {};
      }
    } as GridOptions;
    this.allocationsGridOptions.sideBar = SideBar(
      GridId.allocationsId,
      GridName.allocations,
      this.allocationsGridOptions
    );
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'Security Details',
        subMenu: [
          {
            name: 'Extend',
            action: () => {
              this.isLoading = true;
              let displayFields = {};

              this.securityApiService.getDataForSecurityModal(params.node.data.symbol).subscribe(
                ([config, securityDetails]: [any, any]) => {

                  if (!config.isSuccessful) {
                  this.isLoading = false;
                  this.toasterService.error('No security type found against the selected symbol!');
                  return;
                  }

                  if (securityDetails.payload.length === 0) {
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
                    config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                  } else {
                    this.securityApiService.getSecurityType(securityDetails.payload[0].security_type).subscribe( data => {
                    displayFields = data.payload[0].Fields;
                    this.isLoading = false;
                    this.securityModal.openSecurityModalFromOutside(params.node.data.symbol,
                    securityDetails.payload[0].security_type, displayFields, securityDetails.payload[0], 'extend');
                    displayFields = {};
                  });
                }

                },
                error => {
                  this.isLoading = false;
                }
              );
            }
          }
        ]
      },
    ];
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  getTradeAllocations(lpOrderId) {
    this.financeService.getTradeAllocations(lpOrderId).subscribe(result => {
      this.allocationTradesData = result;
      const someArray = this.agGridUtils.columizeData(
        result.data,
        this.allocationTradesData.meta.Columns
      );
      const cdefs = this.agGridUtils.customizeColumns(
        [],
        this.allocationTradesData.meta.Columns,
        ['Id', 'AllocationId', 'EMSOrderId'],
        false
      );
      this.allocationsGridOptions.api.setColumnDefs(cdefs);
      this.allocationsData = someArray as [];
    });
  }
}
