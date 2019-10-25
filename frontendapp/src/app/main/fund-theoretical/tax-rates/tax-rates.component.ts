import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxRateModalComponent } from './tax-rate-modal/tax-rate-modal.component';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { HeightStyle, SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DecimalPipe } from '@angular/common';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.css']
})
export class TaxRatesComponent implements OnInit {
  @ViewChild('taxRateModal') taxRateModal: TaxRateModalComponent;

  taxRatesGrid: GridOptions;
  effectiveFromToDate: { startDate: Moment; endDate: Moment };
  taxRatesData: Array<object>;

  styleForHeight = HeightStyle(224);

  constructor(private financeService: FinancePocServiceProxy, public decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.getTaxRates();
    this.initGrid();
  }

  getTaxRates() {}

  initGrid() {
    this.taxRatesGrid = {
      columnDefs: this.getColDefs(),
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      enableCellChangeFlash: true,
      animateRows: true,
      deltaRowDataMode: true,
      getRowNodeId: data => {
        return data.rowId;
      },
      onGridReady: params => {
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {},
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.taxRatesGrid.sideBar = SideBar(GridId.taxRatesId, GridName.taxRates, this.taxRatesGrid);
  }

  getColDefs() {
    return [
      {
        headerName: 'Effective From',
        field: 'effectiveFrom',
        sortable: true,
        filter: true
      },
      {
        headerName: 'Effective To',
        field: 'effectiveTo',
        sortable: true,
        filter: true
      },
      {
        headerName: 'Long Term Tax Rate',
        field: 'longTermTaxRate',
        sortable: true,
        filter: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn'
      },
      {
        headerName: 'Short Term Tax Rate',
        field: 'shortTermTaxRate',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn'
      },
      {
        headerName: 'Short Term Period',
        field: 'shortTermPeriod',
        sortable: true,
        editable: true,
        cellStyle: textAlignRight(),
        type: 'numericColumn'
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        hide: true
      },
      {
        headerName: 'Last Updated By ',
        field: 'lastUpdatedBy ',
        hide: true
      },
      {
        headerName: 'Created Date',
        field: 'createdDate',
        hide: true
      },
      {
        headerName: 'Last Updated Date',
        field: 'lastUpdatedDate',
        hide: true
      }
    ];
  }

  getContextMenuItems(params) {
    const addDefaultItems = [];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  openTaxRateModal() {
    this.taxRateModal.openModal({});
  }

  closeTaxRateModal() {}

  numberFormatter(numberToFormat, isInPercentage) {
    let per = numberToFormat;
    if (isInPercentage) {
      per = percentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }
}

function textAlignRight() {
  return { textAlign: 'end' };
}

function percentageFormatter(value: number) {
  return value * 100;
}
