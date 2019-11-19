import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  HeightStyle,
  SideBar,
  AutoSizeAllColumns,
  PercentageFormatter,
  DateFormatter
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DecimalPipe } from '@angular/common';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import * as moment from 'moment';

@Component({
  selector: 'app-market-prices',
  templateUrl: './market-prices.component.html',
  styleUrls: ['./market-prices.component.css']
})
export class MarketPricesComponent implements OnInit {
  dataGridOptions: GridOptions;
  selectedDate = null;
  gridData: any;
  fileToUpload: File = null;
  totalGridRows: number;
  isExpanded = false;
  graphObject: any = null;
  disableCharts = true;
  sliderValue = 0;
  uploadLoader = false;
  disableFileUpload = true;
  disableCommit = true;
  @ViewChild('fileInput') fileInput: ElementRef;

  styleForHeight = HeightStyle(224);

  utilsConfig: UtilsConfig = {
    expandGrid: false,
    collapseGrid: false,
    refreshGrid: true,
    resetGrid: false,
    exportExcel: false
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    public decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.getData();
    this.initGrid();
  }

  getData() {
    this.financeService.getMarketPriceData().subscribe(response => {
      if(response.isSuccessful){
        this.gridData = response.payload.map(data => ({
          id: data.Id,
          securityId: data.SecurityId,
          businessDate: DateFormatter(data.BusinessDate),
          symbol: data.Symbol,
          event: data.Event,
          price: data.Price,
          modified: false,
        }));
        this.dataGridOptions.api.setRowData(this.gridData);
      }
    });
  }

  initGrid() {
    this.dataGridOptions = {
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
      onGridReady: params => {
        //this.dataGridOptions.api = params.api;
        AutoSizeAllColumns(params);
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      onCellValueChanged: params => {
        this.onCellValueChanged(params);
      },
      defaultColDef: {
        resizable: true
      }
    } as GridOptions;
    this.dataGridOptions.sideBar = SideBar(GridId.dailyPnlId, GridName.dailyPnl, this.dataGridOptions);
  }

  initCols() {
    const colDefs = this.getColDefs();
    this.dataGridOptions.api.setColumnDefs(colDefs);
    this.dataGridOptions.api.sizeColumnsToFit();
  }

  onCellValueChanged(params) {
    if (params.colDef.field === 'price') {
      this.disableCommit = false;
      const row = this.dataGridOptions.api.getRowNode(params.data.id);
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
        headerName: 'Symbol',
        field: 'symbol',
      },
      {
        headerName: 'Event',
        field: 'event',
      },
      {
        headerName: 'Price',
        field: 'price',
        editable: true,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: params => this.numberFormatter(params.node.data.price, false)
      },
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
      }
    ];
    return GetContextMenu(false, addDefaultItems, true, null, params);
  }

  expandedClicked() {
    this.isExpanded = !this.isExpanded;
  }

  visualizeData() {
    const focusedCell = this.dataGridOptions.api.getFocusedCell();
    const selectedRow = this.dataGridOptions.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
    const column = focusedCell.column.getColDef().field;
    const columnLabel = focusedCell.column.getUserProvidedColDef().headerName;
    this.graphObject = [{ label: columnLabel, data: [] }];
    const toDate = moment(selectedRow.businessDate);
    const fromDate = moment(selectedRow.businessDate).subtract(30, 'days');
    const selectedPortfolio = selectedRow.portFolio;
    this.dataGridOptions.api.forEachNodeAfterFilter((rowNode, index) => {
      let currentDate = moment(rowNode.data.businessDate);
      if(rowNode.data.portFolio === selectedPortfolio && currentDate.isSameOrAfter(fromDate) && currentDate.isSameOrBefore(toDate)){
        this.graphObject.forEach(element => {
          element.data.push({
            date: rowNode.data.businessDate,
            value: rowNode.data[column]
          })
        });
      }
    });
    this.isExpanded = true;
    this.disableCharts = false;
  }

  uploadData() {
    debugger
    let rowNodeId = 1;
    this.uploadLoader = true;
    this.financeService.uploadMarketPriceData(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      console.log('Response', response);
      if (response.isSuccessful) {
        this.fileInput.nativeElement.value = '';
        this.disableFileUpload = true;
        this.gridData = response.payload
        this.dataGridOptions.api.setRowData(this.gridData);
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  changeDate(date) {
    const { startDate } = date;
  }

  refreshGrid() {
    this.dataGridOptions.api.showLoadingOverlay();
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
