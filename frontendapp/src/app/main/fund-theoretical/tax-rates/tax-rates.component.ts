import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { TaxRateModalComponent } from './tax-rate-modal/tax-rate-modal.component';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { HeightStyle, SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DecimalPipe } from '@angular/common';
import { Moment } from 'moment';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { takeWhile } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TaxRateData } from 'src/shared/Models';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.css']
})
export class TaxRatesComponent implements OnInit, OnDestroy {
  @ViewChild('taxRateModal') taxRateModal: TaxRateModalComponent;
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;

  taxRatesGrid: GridOptions;
  effectiveFromToDate: { startDate: Moment; endDate: Moment };
  taxRatesData: Array<TaxRateData>;
  taxRateRow: any;
  isSubscriptionAlive: boolean;

  styleForHeight = HeightStyle(224);

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {
    this.getTaxRates();
    this.initGrid();
  }

  getTaxRates() {
    this.financeService
      .getTaxRates()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(result => {
        if (result.payload) {
          this.taxRatesData = result.payload.map(item => ({
            id: item.Id,
            effectiveFrom: this.dateFormatter(item.EffectiveFrom),
            effectiveTo: this.dateFormatter(item.EffectiveTo),
            longTermTaxRate: item.LongTermTaxRate,
            shortTermTaxRate: item.ShortTermTaxRate,
            shortTermPeriod: item.ShortTermPeriod,
            createdBy: item.CreatedBy,
            lastUpdatedBy: item.LastUpdatedBy,
            createdDate: item.CreatedDate,
            lastUpdatedDate: item.LastUpdatedDate
          }));
        }
        this.taxRatesGrid.api.setRowData(this.taxRatesData);
      });
  }

  initGrid() {
    this.taxRatesGrid = {
      columnDefs: this.getColDefs(),
      rowData: null,
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
      onGridReady: params => {
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      }
    } as GridOptions;
    this.taxRatesGrid.sideBar = SideBar(GridId.taxRatesId, GridName.taxRates, this.taxRatesGrid);
  }

  getColDefs() {
    return [
      {
        headerName: 'Id',
        field: 'id',
        hide: true
      },
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
        headerName: 'Actions',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
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
    let lastTaxRateData;
    if (this.taxRatesData.length !== 0) {
      lastTaxRateData = this.taxRatesData[this.taxRatesData.length - 1];
    } else {
      lastTaxRateData = null;
    }
    this.taxRateModal.openModal(null, lastTaxRateData);
  }

  closeTaxRateModal() {
    this.getTaxRates();
  }

  editTaxRate(row) {
    const lastIndex = this.taxRatesData.findIndex(taxRate => taxRate.id === row.id);
    const lastTaxRateData = this.taxRatesData[lastIndex];
    this.taxRateModal.openModal(row, lastTaxRateData);
  }

  openConfirmationModal(row) {
    this.taxRateRow = row;
    this.confirmationModal.showModal();
  }

  deleteTaxRate() {
    this.financeService.deleteTaxRate(this.taxRateRow.id).subscribe(
      response => {
        if (response.isSuccessful) {
          this.toastrService.success('Tax Rate deleted successfully!');
          this.getTaxRates();
        } else {
          this.toastrService.error('TaxRate deletion failed!');
        }
      },
      error => {
        this.toastrService.error('Something went wrong. Try again later!');
      }
    );
  }

  getDateDiff(effectiveTo, effectiveFrom) {
    return moment(effectiveFrom).diff(moment(effectiveTo), 'days');
  }

  numberFormatter(numberToFormat, isInPercentage) {
    let per = numberToFormat;
    if (isInPercentage) {
      per = percentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }

  dateFormatter(dateToFormat) {
    return moment(dateToFormat).format('YYYY-MM-DD');
  }
}

function textAlignRight() {
  return { textAlign: 'end' };
}

function percentageFormatter(value: number) {
  return value * 100;
}
