import { Component, ViewChild, OnInit } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import * as moment from 'moment';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { AssetServicesService } from 'src/services/asset-services.service';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import {
  HeightStyle,
  SideBar,
  ExcelStyle,
  commaFormater,
  moneyFormatter,
  dateFormatter
} from 'src/shared/utils/Shared';
import { GridId, GridName } from 'src/shared/utils/AppEnums';

@Component({
  selector: 'app-asset-services-options',
  templateUrl: './asset-services-options.component.html',
  styleUrls: ['./asset-services-options.component.scss']
})
export class AssetServicesOptionsComponent implements OnInit {
  @ViewChild('dataGridModal', { static: false }) dataGridModal: DataGridModalComponent;

  buysOpenGridOptions: GridOptions;
  sellsOpenGridOptions: GridOptions;

  selectedDate: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment('2020-03-14'),
    endDate: moment('2020-03-14')
  };

  styleForHeight = HeightStyle(260);

  constructor(private assetServicesService: AssetServicesService) {}

  ngOnInit() {
    this.initGrid();
    this.getOptions();
  }

  initGrid() {
    this.buysOpenGridOptions = {
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      animateRows: true,
      enableFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
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
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      animateRows: true,
      enableFilter: true,
      suppressColumnVirtualisation: true,
      suppressHorizontalScroll: false,
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
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

  getOptions(): void {
    this.assetServicesService
      .getOptions(moment(this.selectedDate.startDate).format('YYYY-MM-DD'))
      .subscribe(
        response => {
          this.buysOpenGridOptions.api.setRowData(response.payload[0]);

          this.sellsOpenGridOptions.api.setRowData(response.payload[1]);
        },
        error => {}
      );
  }

  onRefreshOptions(): void {
    this.buysOpenGridOptions.api.showLoadingOverlay();
    this.sellsOpenGridOptions.api.showLoadingOverlay();
    this.getOptions();
  }
}
