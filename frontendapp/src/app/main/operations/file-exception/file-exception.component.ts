import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { SideBar, HeightStyle, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { DataService } from 'src/services/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { TemplateRendererComponent } from 'src/app/template-renderer/template-renderer.component';
import * as moment from 'moment';
import { FileManagementApiService } from 'src/services/file-management-api.service';

@Component({
  selector: 'app-file-exception',
  templateUrl: './file-exception.component.html',
  styleUrls: ['./file-exception.component.scss']
})
export class FileExceptionComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  isEngineRunning = false;
  hideGrid = false;
  gridOptions: GridOptions;
  detailCellRendererParams;
  gridLayouts: any;
  rowData: any;
  invalidRecordJson = null;

  styleForHeight = HeightStyle(180);

  constructor(
    private fileManagementApiService: FileManagementApiService,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {}

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
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      pinnedBottomRowData: null,
      rowGroupPanelShow: 'after',
      pivotPanelShow: 'after',
      pivotColumnGroupTotals: 'after',
      pivotRowTotals: 'after',
      suppressColumnVirtualisation: true,
      masterDetail: true,
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { field: 'referenceNumber' },
            { field: 'rowNumber', type: 'numericColumn' },
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
        getDetailRowData: params => {
          params.successCallback(params.data.exceptionList);
        },
        getExternalFilterState: () => {
          return {};
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
      }
    } as GridOptions;

    this.gridOptions.sideBar = SideBar(
      GridId.fileExceptionId,
      GridName.fileException,
      this.gridOptions
    );
  }

  customizeColumns() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'id',
        headerName: 'File Exception Id',
        hide: true
      },
      {
        field: 'fileName',
        headerName: 'File Name',
        cellRenderer: 'agGroupCellRenderer'
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
        headerName: 'Count',
        type: 'numericColumn'
      }
    ];
    this.gridOptions.api.setColumnDefs(colDefs);
  }

  getFileExceptionData() {
    this.fileManagementApiService
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
                referenceNumber: d.Reference,
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
