import { Component, ViewChild, OnInit } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { GridLayoutMenuComponent, CustomGridOptions } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { ReportsApiService } from 'src/services/reports-api.service';
import { AssetServicesService } from 'src/services/asset-services.service';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import {
  HeightStyle,
  SideBar,
  ExcelStyle,
  commaFormater,
  moneyFormatter,
  dateFormatter
} from 'src/shared/utils/Shared';

@Component({
  selector: 'app-asset-services-options',
  templateUrl: './asset-services-options.component.html',
  styleUrls: ['./asset-services-options.component.scss']
})
export class AssetServicesOptionsComponent implements OnInit {
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;

  buysOpenGridOptions: CustomGridOptions;
  sellsOpenGridOptions: GridOptions;

  selectedDate: { startDate: moment.Moment; endDate: moment.Moment };
  maxDate: moment.Moment;

  styleForHeight = HeightStyle(270);

  constructor(
    private toastrService: ToastrService,
    private reportsApiService: ReportsApiService,
    private assetServicesService: AssetServicesService
  ) {}

  ngOnInit() {
    this.maxDate = moment();
    this.initGrid();
    this.getLatestJournalDate();
  }

  initGrid() {
    this.buysOpenGridOptions = {
      /* Custom Method Binding for External Filters from Grid Layout Component */
      getExternalFilterState: this.getExternalFilterState.bind(this),
      clearExternalFilter: this.clearExternalFilter.bind(this),
      setExternalFilter: this.setExternalFilter.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      animateRows: true,
      enableFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.buysOpenGridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {},
      columnDefs: this.getColDefs('buys'),
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      }
    };
    this.buysOpenGridOptions.sideBar = SideBar(
      GridId.buysOpenOptionsId,
      GridName.buysOpenOptions,
      this.buysOpenGridOptions
    );

    this.sellsOpenGridOptions = {
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      animateRows: true,
      enableFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      getContextMenuItems: params => this.getContextMenuItems(params),
      onGridReady: params => {
        this.sellsOpenGridOptions.excelStyles = ExcelStyle;
      },
      onFirstDataRendered: params => {},
      columnDefs: this.getColDefs('sells'),
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      }
    };
    this.sellsOpenGridOptions.sideBar = SideBar(
      GridId.sellsOpenOptionsId,
      GridName.sellsOpenOptions,
      this.sellsOpenGridOptions
    );
  }

  getColDefs(type: 'buys' | 'sells'): (ColDef | ColGroupDef)[] {
    return [
      {
        field: 'EzeTicker',
        headerName: 'Option Ticker'
      },
      {
        field: 'TradeDate',
        headerName: 'Original Trade Date',
        valueFormatter: dateFormatter
      },
      {
        field: 'TradeCurrency',
        headerName: 'Currency'
      },
      {
        field: 'option_type',
        headerName: 'Option Type'
      },
      {
        field: 'option_underlier',
        headerName: 'Option Underlier'
      },
      {
        field: 'expiration_date',
        headerName: 'Expiration Date',
        valueFormatter: params => {
          if (!params) {
            return '';
          }
          dateFormatter(params);
        }
      },
      {
        field: 'strike',
        headerName: 'Strike',
        cellClass: 'rightAlign',
        valueFormatter: commaFormater
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        cellClass: 'rightAlign',
        valueFormatter: commaFormater
      },
      {
        field: 'cost_basis',
        headerName: 'Cost Basis',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'premium_paid',
        headerName: type === 'buys' ? 'Premium Paid' : 'Premium Received',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'option_last_price',
        headerName: 'Option Last Price',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'current_option_premium',
        headerName: 'Current Option Premium',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'gain_loss',
        headerName: 'Gain / Loss',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'underlying_closing_price',
        headerName: 'Underlying Closing Price',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'moniness',
        headerName: 'Moniness',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'status',
        headerName: 'Status'
      },
      {
        field: 'days_to_expire',
        headerName: 'Days to Expire',
        cellClass: 'rightAlign'
      },
      {
        field: 'option_decay',
        headerName: 'Option Decay',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'decay',
        headerName: 'Decay',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'daily_decay',
        headerName: 'Daily Decay',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'underlying_exercise_price',
        headerName: type === 'buys' ? 'Underlying Exercise Price' : 'Underlying Assigned Price',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'underlying_quantity',
        headerName: 'Underlying Quantity',
        cellClass: 'rightAlign',
        valueFormatter: commaFormater
      },
      {
        field: 'underlying_exposure',
        headerName: 'Underlying Exposure',
        cellClass: 'rightAlign',
        valueFormatter: moneyFormatter
      },
      {
        field: 'CustodianCode',
        headerName: 'PB / Custodian'
      }
    ];
  }

  getExternalFilterState() {
    return {
      dateFilter: {
        startDate: !this.selectedDate.startDate ? this.selectedDate.startDate : '',
        endDate: !this.selectedDate.endDate ? this.selectedDate.endDate : ''
      }
    };
  }

  setExternalFilter(object) {
    const { dateFilter } = object;
    this.selectedDate = {
      startDate: moment(dateFilter.startDate, 'YYYY-MM-DD'),
      endDate: moment(dateFilter.startDate, 'YYYY-MM-DD')
    };
  }

  clearExternalFilter() {}

  getContextMenuItems(params): Array<ContextMenu> {
    const defaultItems = [
      {
        name: 'Exercise',
        action: () => {}
      },
      {
        name: 'Assign',
        action: () => {}
      },
      {
        name: 'Expire',
        action: () => {}
      }
    ];

    return GetContextMenu(false, defaultItems, true, null, params);
  }

  getLatestJournalDate() {
    this.reportsApiService.getLatestJournalDate().subscribe(
      response => {
        if (response.isSuccessful && response.statusCode === 200) {
          this.selectedDate = {
            startDate: moment(response.payload[0].when, 'YYYY-MM-DD'),
            endDate: moment(response.payload[0].when, 'YYYY-MM-DD')
          };
        }
      },
      error => {
        this.toastrService.error(
          `The server is not responding, Please check your internet connection or contact support.`
        );
      }
    );
  }

  getOptions(): void {
    if (this.buysOpenGridOptions && this.sellsOpenGridOptions) {
      this.buysOpenGridOptions.api.showLoadingOverlay();
      this.sellsOpenGridOptions.api.showLoadingOverlay();
    }
    this.assetServicesService
      .getOptions(moment(this.selectedDate.startDate).format('YYYY-MM-DD'))
      .subscribe(
        response => {
          const [buysOpen, sellsOpen] = response.payload;
          this.buysOpenGridOptions.api.setRowData(buysOpen);
          this.sellsOpenGridOptions.api.setRowData(sellsOpen);
        },
        error => {
          this.buysOpenGridOptions.api.hideOverlay();
          this.sellsOpenGridOptions.api.hideOverlay();
        }
      );
  }

  onDateChange(selectedDate) {
    if (!selectedDate.startDate) {
      return;
    }

    this.getOptions();
  }

  onRefreshOptions(): void {
    this.getOptions();
  }
}
