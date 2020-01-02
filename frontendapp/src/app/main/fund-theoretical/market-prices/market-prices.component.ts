import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HeightStyle, SideBar, DateFormatter, Ranges } from 'src/shared/utils/Shared';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ToastrService } from 'ngx-toastr';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import * as moment from 'moment';
import { DataGridModalComponent } from 'src/shared/Component/data-grid-modal/data-grid-modal.component';
import { GraphObject } from 'src/shared/Models/graph-object';
import { ContextMenu } from 'src/shared/Models/common';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { FundTheoreticalApiService } from 'src/services/fund-theoretical-api.service';

@Component({
  selector: 'app-market-prices',
  templateUrl: './market-prices.component.html',
  styleUrls: ['./market-prices.component.css']
})
export class MarketPricesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('dataGridModal', { static: false })
  dataGridModal: DataGridModalComponent;

  marketPriceGrid: GridOptions;
  selectedDate = null;
  gridData: any;
  fileToUpload: File = null;
  totalGridRows: number;
  isExpanded = false;
  graphObject: GraphObject = null;
  disableCharts = true;
  sliderValue = 0;
  uploadLoader = false;
  disableFileUpload = true;
  disableCommit = true;
  title: string;
  filterBySymbol = '';
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
    private fundTheoreticalApiService: FundTheoreticalApiService,
    private toastrService: ToastrService,
    public dataDictionary: DataDictionary
  ) {}

  ngOnInit() {
    this.getData();
    this.initGrid();
  }

  getData() {
    this.disableCommit = true;
    this.fundTheoreticalApiService.getMarketPriceData().subscribe(response => {
      if (response.isSuccessful) {
        const data = response.payload.sort((x, y) => {
          return new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
        });
        this.gridData = data.map(element => ({
          id: element.Id,
          securityId: element.SecurityId,
          businessDate: DateFormatter(element.BusinessDate),
          symbol: element.Symbol,
          event: element.Event,
          price: element.Price,
          modified: false
        }));
        this.marketPriceGrid.api.setRowData(this.gridData);
        this.marketPriceGrid.api.sizeColumnsToFit();
      }
    });
  }

  initGrid() {
    this.marketPriceGrid = {
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
        this.marketPriceGrid.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {},
      onCellValueChanged: params => {
        this.onCellValueChanged(params);
      },
      getRowStyle: params => {
        if (params.data !== undefined && params.data.modified) {
          return this.overlappingStyle;
        }
      },
      getRowNodeId: data => {
        return data.id;
      },
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      }
    } as GridOptions;
    this.marketPriceGrid.sideBar = SideBar(
      GridId.marketPriceId,
      GridName.marketPrice,
      this.marketPriceGrid
    );
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.marketPriceGrid.api.setColumnDefs(colDefs);
  }

  doesExternalFilterPass(node): boolean {
    const businessDate = new Date(node.data.businessDate);

    if ((this.filterBySymbol !== '' && this.startDate) || this.endDate) {
      return (
        node.data.symbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        businessDate >= this.startDate.toDate() &&
        businessDate <= this.endDate.toDate()
      );
    }

    if (this.filterBySymbol !== '') {
      return node.data.symbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
    }

    if (this.startDate || this.endDate) {
      return businessDate >= this.startDate.toDate() && businessDate <= this.endDate.toDate();
    }
  }

  isExternalFilterPresent(): boolean {
    if (this.startDate || this.endDate || this.filterBySymbol !== '') {
      return true;
    }
  }

  clearFilters() {
    this.marketPriceGrid.api.redrawRows();
    (this.filterBySymbol = ''), (this.selected = null);
    this.startDate = moment('01-01-1901', 'MM-DD-YYYY');
    this.endDate = moment();
    this.marketPriceGrid.api.setFilterModel(null);
    this.marketPriceGrid.api.onFilterChanged();
  }

  onCellValueChanged(params) {
    if (params.colDef.field === 'price' && params.oldValue != params.newValue) {
      this.disableCommit = false;
      const row = this.marketPriceGrid.api.getRowNode(params.data.id);
      row.setDataValue('modified', true);
    }
  }

  getColDefs(): Array<ColDef | ColGroupDef> {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        headerName: 'Business Date',
        field: 'businessDate',
        enableRowGroup: true,
        suppressCellFlash: true
      },
      {
        headerName: 'Symbol',
        field: 'symbol',
        enableRowGroup: true
      },
      {
        headerName: 'Event',
        field: 'event',
        enableRowGroup: true
      },
      {
        headerName: 'Price',
        field: 'price',
        editable: true,
        type: 'numericColumn',
        valueFormatter: params =>
          params.data !== undefined
            ? this.dataDictionary.numberFormatter(params.node.data.price, false, '1.8-8')
            : ''
      },
      {
        headerName: 'Is Modified',
        field: 'modified',
        hide: true
      }
    ];

    return colDefs;
  }

  getContextMenuItems(params): Array<ContextMenu> {
    const addDefaultItems = [
      {
        name: 'Visualize',
        action: () => {
          this.visualizeData();
        }
      },
      {
        name: 'Audit Trail',
        action: () => {
          this.openDataGridModal(params);
        }
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  openDataGridModal(rowNode) {
    const { id } = rowNode.node.data;
    this.fundTheoreticalApiService.getMarketPriceAudit(id).subscribe(response => {
      const { payload } = response;
      const columns = this.getAuditColDefs();
      const modifiedCols = columns.map(col => {
        return { ...col, editable: false };
      });
      this.title = 'Market Price';
      this.dataGridModal.openModal(modifiedCols, payload);
    });
  }

  getAuditColDefs(): Array<ColDef | ColGroupDef> {
    return [
      {
        headerName: 'Business Date',
        field: 'BusinessDate',
        sortable: true
      },
      {
        headerName: 'Symbol',
        field: 'Symbol'
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
      },
      {
        headerName: 'SecurityId',
        field: 'SecurityId'
      }
    ];
  }

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
  }

  vChange($event) {}

  visualizeData() {
    const data = {};
    let toDate;
    let fromDate;
    const focusedCell = this.marketPriceGrid.api.getFocusedCell();
    const selectedRow = this.marketPriceGrid.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
    const column = 'price';
    const selectedSymbol = selectedRow.symbol;
    data[selectedSymbol] = [];
    if (this.vRange != 0) {
      toDate = moment(selectedRow.businessDate);
      fromDate = moment(selectedRow.businessDate).subtract(this.vRange, 'days');
    }

    this.selectedXAxis = toDate;
    this.selectedYAxis = selectedSymbol;
    this.marketPriceGrid.api.forEachNodeAfterFilter((rowNode, index) => {
      if (rowNode.group) {
        return;
      }

      const currentDate = moment(rowNode.data.businessDate);
      if (this.vRange != 0) {
        if (
          rowNode.data.symbol === selectedSymbol
          // &&
          // currentDate.isSameOrAfter(fromDate) &&
          // currentDate.isSameOrBefore(toDate)
        ) {
          data[selectedSymbol].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      } else {
        if (rowNode.data.symbol === selectedSymbol) {
          data[selectedSymbol].push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          });
        }
      }
    });

    this.graphObject = {
      xAxisLabel: 'Date',
      yAxisLabel: 'Symbol',
      lineColors: ['#ff6960', '#00bd9a'],
      height: 410,
      width: '95%',
      chartTitle: selectedSymbol,
      propId: 'lineMarketPrice',
      graphData: data,
      dateTimeFormat: 'YYYY-MM-DD',
      referenceDate: toDate
    };

    this.isExpanded = true;
    this.disableCharts = false;
  }

  commitMarketPriceData() {
    const recordsToCommit = [];
    this.marketPriceGrid.api.forEachNode((node, index) => {
      if (node.data.modified) {
        recordsToCommit.push({
          Id: node.data.id,
          Price: node.data.price
        });
      }
    });
    this.commitLoader = true;
    this.fundTheoreticalApiService.editMarketPriceData(recordsToCommit).subscribe(response => {
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
    this.fundTheoreticalApiService.uploadMarketPriceData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      if (response.isSuccessful) {
        this.fileInput.nativeElement.value = '';
        this.disableFileUpload = true;
        this.gridData = response.payload;
        this.marketPriceGrid.api.setRowData(this.gridData);
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  ngModelChange(date) {
    this.startDate = date.startDate;
    this.endDate = date.endDate;
    this.marketPriceGrid.api.onFilterChanged();
  }

  onSymbolKey(e) {
    this.filterBySymbol = e.srcElement.value;
    this.marketPriceGrid.api.onFilterChanged();

    // For the moment we react to each key stroke
    if (e.code === 'Enter' || e.code === 'Tab') {
    }
  }

  ngModelChangeSymbol(e) {
    this.filterBySymbol = e;
    this.marketPriceGrid.api.onFilterChanged();
  }

  refreshGrid() {
    this.marketPriceGrid.api.showLoadingOverlay();
    this.getData();
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = false;
    this.fileToUpload = files.item(0);
  }
}
