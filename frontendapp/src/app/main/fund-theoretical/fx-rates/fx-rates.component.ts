import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter,
  Ranges
} from 'src/shared/utils/Shared';

import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { FxratesApiService } from '../../../../services/fxrates-api.service';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { GraphObject } from 'src/shared/Models/graph-object';

@Component({
  selector: 'app-fx-rates',
  templateUrl: './fx-rates.component.html',
  styleUrls: ['./fx-rates.component.css']
})
export class FxRatesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('dataGridModal', { static: false })
  dataGridModal: DataGridModalComponent;
  title: string;
  gridData: any;
  totalGridRows: number;
  fxRate: GridOptions;

  isExpanded = false;
  graphObject: GraphObject = null;
  disableCharts = true;

  fileToUpload: File = null;
  uploadLoader = false;
  disableFileUpload = true;
  disableCommit = true;

  filterByCurrency = '';

  selectedDate = null;
  selected: { startDate: moment.Moment; endDate: moment.Moment };
  startDate: any;
  endDate: any;

  selectedYAxis: any = null;
  selectedXAxis: any = null;
  ranges: any = Ranges;

  styleForHeight = HeightStyle(224);
  overlappingStyle = { backgroundColor: '#f9a89f' };

  vRanges = [
    {
      Description: 'Last 30 days',
      Days: 30
    },
    {
      Description: 'Last 2 months',
      Days: 60
    },
    {
      Description: 'Last 6 months',
      Days: 180
    },
    {
      Description: 'Last year',
      Days: 360
    },
    {
      Description: 'Custom',
      Days: 0
    }
  ];

  vRange = this.vRanges[0].Days;

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: false
  };
  commitLoader = false;

  constructor(
    private fxratesApiService: FxratesApiService,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.getData();
    this.initGrid();
  }

  getData() {
    this.disableCommit = true;
    this.fxratesApiService.getFxRatesData().subscribe(response => {
      if (response.isSuccessful) {
        const data = response.payload.sort((x, y) => {
          return (
            new Date(y.BusinessDate).getTime() -
            new Date(x.BusinessDate).getTime()
          );
        });
        this.gridData = data.map(data => ({
          id: data.Id,
          securityId: data.SecurityId,
          businessDate: DateFormatter(data.BusinessDate),
          event: data.Event,
          price: data.Price,
          currency: data.Currency,
          modified: false
        }));
        this.fxRate.api.setRowData(this.gridData);
        this.fxRate.api.sizeColumnsToFit();
      }
    });
  }

  initGrid() {
    this.fxRate = {
      columnDefs: this.getColDefs(),
      rowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      pinnedBottomRowData: null,
      onRowSelected: params => {},
      clearExternalFilter: () => {},
      doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
      isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
      getContextMenuItems: this.getContextMenuItems.bind(this),
      rowSelection: 'single',
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      singleClickEdit: true,
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      animateRows: true,
      onGridReady: params => {
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {
        this.onCellValueChanged(params);
      },
      getRowStyle: params => {
        if (params.data.modified) {
          return this.overlappingStyle;
        }
      },
      getRowNodeId: data => {
        return data.id;
      },
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.fxRate.sideBar = SideBar(
      GridId.fxRateId,
      GridName.fxRate,
      this.fxRate
    );
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.fxRate.api.setColumnDefs(colDefs);
  }

  doesExternalFilterPass(node) {
    const businessDate = new Date(node.data.businessDate);

    if ((this.filterByCurrency !== '' && this.startDate) || this.endDate) {
      return (
        node.data.currency
          .toLowerCase()
          .includes(this.filterByCurrency.toLowerCase()) &&
        businessDate >= this.startDate.toDate() &&
        businessDate <= this.endDate.toDate()
      );
    }

    if (this.filterByCurrency !== '') {
      return node.data.currency
        .toLowerCase()
        .includes(this.filterByCurrency.toLowerCase());
    }

    if (this.startDate || this.endDate) {
      return (
        businessDate >= this.startDate.toDate() &&
        businessDate <= this.endDate.toDate()
      );
    }
  }

  isExternalFilterPresent() {
    if (this.startDate || this.endDate || this.filterByCurrency !== '') {
      return true;
    }
  }

  clearFilters() {
    this.fxRate.api.redrawRows();
    (this.filterByCurrency = ''), (this.selected = null);
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.fxRate.api.setFilterModel(null);
    this.fxRate.api.onFilterChanged();
  }

  onCellValueChanged(params) {
    if (params.colDef.field === 'price' && params.oldValue != params.newValue) {
      this.disableCommit = false;
      const row = this.fxRate.api.getRowNode(params.data.id);
      row.setDataValue('modified', true);
    }
  }

  getColDefs() {
    const colDefs = [
      {
        headerName: 'Business Date',
        field: 'businessDate',
        sortable: true,
        filter: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Event',
        field: 'event'
      },
      {
        headerName: 'Price',
        field: 'price',
        editable: true,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          this.numberFormatter(params.node.data.price, false)
      },
      {
        headerName: 'Currency',
        field: 'currency'
      },
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      }
    ];

    return colDefs;
  }

  getContextMenuItems(params) {
    const addDefaultItems = [
      {
        name: 'Visualize',
        action: () => {
          this.visualizeData();
        }
      },
      {
        name: 'FxRate Audit Trail',
        action: () => {
          this.openDataGridModal(params);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.fxratesApiService.GetAuditTrail(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Fx Rate';
      this.dataGridModal.openModal(modifiedCols, payload);
    });
  }

  getAuditColDefs() {
    return [
      {
        headerName: 'Business Date',
        field: 'BusinessDate',
        sortable: true
      },
      {
        headerName: 'Event',
        field: 'Event'
      },
      {
        headerName: 'LastUpdatedBy',
        field: 'LastUpdatedBy'
      },
      {
        headerName: 'LastUpdatedOn',
        field: 'LastUpdatedOn'
      },
      {
        headerName: 'Price',
        field: 'Price'
      }
    ];
  }

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
  }

  vChange($event) {
    if (this.selectedXAxis != null && this.selectedYAxis != null) {
      this.refreshGraph();
    }
  }

  private refreshGraph() {
    const data = {};
    let toDate;
    let fromDate;
    const column = 'price';
    data[this.selectedYAxis] = [];
    if (this.vRange != 0) {
      toDate = moment(this.selectedXAxis);
      fromDate = moment(this.selectedXAxis).subtract(this.vRange, 'days');
    }
    this.fxRate.api.forEachNodeAfterFilter((rowNode, index) => {
      const currentDate = moment(rowNode.data.businessDate);
      if (this.vRange != 0) {
        if (
          rowNode.data.currency === this.selectedYAxis &&
          currentDate.isSameOrAfter(fromDate) &&
          currentDate.isSameOrBefore(toDate)
        ) {
          data[this.selectedYAxis].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      } else {
        if (rowNode.data.currency === this.selectedYAxis) {
          data[this.selectedYAxis].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      }
    });

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: 'currency',
      lineColors: ['#ff6960', '#00bd9a'],
      height: 410,
      width: '95%',
      chartTitle: this.selectedYAxis,
      propId: 'lineFxPrice',
      graphData: data,
      dateTimeFormat: 'YYYY-MM-DD'
    };
  }

  visualizeData() {
    const data = {};
    let toDate;
    let fromDate;
    const focusedCell = this.fxRate.api.getFocusedCell();
    const selectedRow = this.fxRate.api.getDisplayedRowAtIndex(
      focusedCell.rowIndex
    ).data;
    const column = 'price';
    const selectedCurrency = selectedRow.currency;
    data[selectedCurrency] = [];
    if (this.vRange != 0) {
      toDate = moment(selectedRow.businessDate);
      fromDate = moment(selectedRow.businessDate).subtract(this.vRange, 'days');
    }

    this.selectedXAxis = toDate;
    this.selectedYAxis = selectedCurrency;
    this.fxRate.api.forEachNodeAfterFilter((rowNode, index) => {
      const currentDate = moment(rowNode.data.businessDate);
      if (this.vRange != 0) {
        if (
          rowNode.data.currency === selectedCurrency &&
          currentDate.isSameOrAfter(fromDate) &&
          currentDate.isSameOrBefore(toDate)
        ) {
          data[selectedCurrency].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      } else {
        if (rowNode.data.currency === selectedCurrency) {
          data[selectedCurrency].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      }
    });

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: 'Price',
      lineColors: ['#ff6960', '#00bd9a'],
      height: 410,
      width: '95%',
      chartTitle: selectedCurrency,
      propId: 'lineFxPrice',
      graphData: data,
      dateTimeFormat: 'YYYY-MM-DD'
    };

    this.isExpanded = true;
    this.disableCharts = false;
  }

  commitMarketPriceData() {
    const recordsToCommit = [];
    this.fxRate.api.forEachNode((node, index) => {
      if (node.data.modified) {
        recordsToCommit.push({
          Id: node.data.id,
          Price: node.data.price
        });
      }
    });
    this.commitLoader = true;
    this.fxratesApiService
      .editFxRatePriceData(recordsToCommit)
      .subscribe(response => {
        this.commitLoader = false;
        this.disableCommit = true;
        if (response.isSuccessful) {
          this.toastrService.success('Sucessfully Commited.');
          this.getData();
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
  }

  uploadData() {
    this.uploadLoader = true;
    this.fxratesApiService
      .uploadFxData(this.fileToUpload)
      .subscribe(response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          this.fileInput.nativeElement.value = '';
          this.disableFileUpload = true;
          this.gridData = response.payload;
          this.fxRate.api.setRowData(this.gridData);
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
  }

  ngModelChange(date) {
    this.startDate = date.startDate;
    this.endDate = date.endDate;
    this.fxRate.api.onFilterChanged();
    this.refreshGraph();
  }

  onSymbolKey(e) {
    this.filterByCurrency = e.srcElement.value;
    this.fxRate.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  ngModelChangeSymbol(e) {
    this.filterByCurrency = e;
    this.fxRate.api.onFilterChanged();
  }

  refreshGrid() {
    this.fxRate.api.showLoadingOverlay();
    this.getData();
  }

  numberFormatter(numberToFormat, isInPercentage) {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }
}