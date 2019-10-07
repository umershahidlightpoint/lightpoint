import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid-community';
import { SideBar, HeightStyle, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import * as moment from 'moment';

@Component({
  selector: 'app-file-exception',
  templateUrl: './file-exception.component.html',
  styleUrls: ['./file-exception.component.css']
})
export class FileExceptionComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;

  isEngineRunning = false;
  hideGrid = false;
  gridOptions: GridOptions;
  detailCellRendererParams;
  gridLayouts: any;
  rowData: any;
  selectedLayout = null;
  invalidRecordJson = null;
  styleForHeight = HeightStyle(180);

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService
  ) { 
  }

  ngOnInit() {
    // this.isEngineRunning = this.postingEngineService.getStatus();
    this.initGrid();
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
      if (!this.hideGrid) {
        this.getFileExceptionData();
      }
    });
    this.dataService.gridColumnApi$.subscribe(obj => (obj = this.gridOptions));
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.gridViewsId, gridName: GridName.gridViews });
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      sideBar: SideBar,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,
      masterDetail : true,
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { field: "referenceNumber" },
            { field: "rowNumber"},
            {
              headerName: 'Actions',
              cellRendererFramework: TemplateRendererComponent,
              cellRendererParams: {
                ngTemplate: this.actionButtons
              }
            }
          ],
          onFirstDataRendered(params) {
            params.api.sizeColumnsToFit();
          }
        },
        getDetailRowData: function(params) {
          params.successCallback(params.data.exceptionList);
        }
      },
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      }
    } as GridOptions;
  }

  

  customizeColumns() {
    const colDefs = [
      {
        field: 'id',
        headerName: 'File Exception Id',
        hide: true
      },
      {
        field: 'fileName',
        headerName: 'File Name',
        cellRenderer: "agGroupCellRenderer"
      },
      {
        field: 'businessDate',
        headerName: 'Business Date'
      },
      {
        field: 'source',
        headerName: 'Source'
      },
      {
        field: 'exceptionCount',
        headerName: 'Count'
      }
    ];
    this.gridOptions.api.setColumnDefs(colDefs);
  }

  getFileExceptionData() {
    this.financeService
      .getInvalidExportRecords()
      .pipe(take(1))
      .subscribe(
        resp => {
          if (resp.isSuccessful) {
            this.gridLayouts = resp.payload;
            this.rowData = resp.payload.map(data => ({
              fileId: data.FileId,
              fileExceptionId: data.FileExceptionId,
              fileName: data.FileName,
              source: data.Source,
              businessDate: moment(data.BusinessDate).format('YYYY-MM-DD'),
              exceptionCount: data.Exceptions,
              exceptionList: data.ExceptionList.map(d => ({
                referenceNumber : d.Reference,
                rowNumber: JSON.parse(d.Record).RowNumber,
                record: d.Record
              }))
            }));
          }
          this.gridOptions.api.setRowData(this.rowData);

          AutoSizeAllColumns(this.gridOptions);

          this.gridOptions.api.sizeColumnsToFit();
        },
        error => {
          this.toastrService.error('Something went wrong. Try again later!');
        }
      );
    this.customizeColumns();
  }

  viewLayout(row) {
    this.invalidRecordJson = JSON.parse(row.record);
  }
}
