import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { TaxRateModalComponent } from './tax-rate-modal/tax-rate-modal.component';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { HeightStyle, SideBar, AutoSizeAllColumns, DateFormatter } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { Moment } from 'moment';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import { ToastrService } from 'ngx-toastr';
import { TaxRateData } from 'src/shared/Models/funds-theoretical';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { ContextMenu } from 'src/shared/Models/common';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.scss']
})
export class TaxRatesComponent implements OnInit, AfterViewInit {
  @ViewChild('taxRateModal', { static: false })
  taxRateModal: TaxRateModalComponent;
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;
  @ViewChild('confirmationModal', { static: false })
  confirmationModal: ConfirmationModalComponent;

  taxRatesGrid: GridOptions;
  effectiveFromToDate: { startDate: Moment; endDate: Moment };
  taxRatesData: TaxRateData[];
  taxRateRow: any;
  showOverlappingBtn = false;
  showGapBtn = false;

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: true,
    exportExcel: false
  };

  styleForHeight = HeightStyle(224);

  gapStyle = { backgroundColor: '#ffcfcf' };
  overlappingStyle = { backgroundColor: '#f9a89f' };

  constructor(
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    private dataDictionary: DataDictionary
  ) {
    this.initGrid();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getTaxRates();
  }

  getTaxRates() {
    this.showGapBtn = false;
    this.showOverlappingBtn = false;
    this.fundTheoreticalApiService.getTaxRates().subscribe(result => {
      if (result.payload) {
        this.taxRatesData = result.payload.map(item => ({
          id: item.Id,
          effectiveFrom: DateFormatter(item.EffectiveFrom),
          effectiveTo: DateFormatter(item.EffectiveTo),
          longTermTaxRate: item.LongTermTaxRate,
          shortTermTaxRate: item.ShortTermTaxRate,
          shortTermPeriod: item.ShortTermPeriod,
          createdBy: item.CreatedBy,
          lastUpdatedBy: item.LastUpdatedBy,
          createdDate: item.CreatedDate,
          lastUpdatedDate: item.LastUpdatedDate,
          isOverLapped: item.IsOverLapped,
          isGapPresent: item.IsGapPresent
        }));
      }

      this.taxRatesData.find(taxRate => {
        if (taxRate.isOverLapped) {
          this.showOverlappingBtn = true;
          return true;
        }
      });

      this.taxRatesData.find(taxRate => {
        if (taxRate.isGapPresent) {
          this.showGapBtn = true;
          return true;
        }
      });

      this.taxRatesGrid.api.setRowData(this.taxRatesData);
    });
    this.setColDefs();
  }

  initGrid() {
    this.taxRatesGrid = {
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
      },
      getRowStyle: params => {
        if (params.data.isOverLapped) {
          return this.overlappingStyle;
        }
        if (params.data.isGapPresent) {
          return this.gapStyle;
        }
      }
    } as GridOptions;
    this.taxRatesGrid.sideBar = SideBar(GridId.taxRatesId, GridName.taxRates, this.taxRatesGrid);
  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
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
        headerName: 'Long Term Tax Rate %',
        field: 'longTermTaxRate',
        sortable: true,
        filter: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.longTermTaxRate, true)
      },
      {
        headerName: 'Short Term Tax Rate %',
        field: 'shortTermTaxRate',
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.dataDictionary.numberFormatter(params.node.data.shortTermTaxRate, true)
      },
      {
        headerName: 'Short Term Period',
        field: 'shortTermPeriod',
        sortable: true,
        type: 'numericColumn'
      },
      {
        headerName: 'Actions',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        },
        minWidth: 200
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
        headerName: 'Is Over Lapped',
        field: 'isOverLapped',
        hide: true
      },
      {
        headerName: 'Is Gap Present',
        field: 'isGapPresent',
        hide: true
      }
    ];
    this.taxRatesGrid.api.setColumnDefs(colDefs);
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  refreshGrid() {
    this.taxRatesGrid.api.showLoadingOverlay();
    this.getTaxRates();
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
    this.fundTheoreticalApiService.deleteTaxRate(this.taxRateRow.id).subscribe(
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
}
