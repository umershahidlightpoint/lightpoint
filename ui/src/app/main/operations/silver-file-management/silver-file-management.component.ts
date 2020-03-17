import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import * as moment from 'moment';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { FileManagementApiService } from 'src/services/file-management-api.service';
import { SilverFile } from 'src/shared/Models/silver-file';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import { SideBar, Style, AutoSizeAllColumns } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-silver-file-management',
  templateUrl: './silver-file-management.component.html',
  styleUrls: ['./silver-file-management.component.scss']
})
export class SilverFileManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  filesGridOptions: GridOptions;
  files: SilverFile[];

  excelParams = {
    fileName: 'Silver File',
    sheetName: 'First Sheet',
    columnKeys: ['name', 'uploadDate', 'size']
  };

  style = Style;

  styleForLogsHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  constructor(private fileManagementApiService: FileManagementApiService) {
    this.initGrid();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getSilverFiles();
  }

  initGrid() {
    this.filesGridOptions = {
      rowData: null,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      alignedGrids: [],
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      }
    } as GridOptions;
    this.filesGridOptions.sideBar = SideBar(
      GridId.silverFilesId,
      GridName.silverFiles,
      this.filesGridOptions
    );
  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        field: 'uploadDate',
        headerName: 'Upload Date',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        resizable: true
      },
      {
        field: 'size',
        headerName: 'Size',
        resizable: true,
        type: 'numericColumn'
      },
      {
        headerName: 'View',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ];
    this.filesGridOptions.api.setColumnDefs(colDefs);
  }

  getSilverFiles() {
    this.fileManagementApiService.getSilverFiles().subscribe(result => {
      this.files = result.payload.map(item => ({
        name: item.Name,
        uploadDate: moment(item.UploadDate).format('MMM-DD-YYYY hh:mm:ss'),
        size: item.Size
      }));
      this.filesGridOptions.api.setRowData(this.files);
    });
    this.setColDefs();
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getSilverFiles();
  }

  getContextMenuItems = (params: Array<ContextMenu>) => {
    return GetContextMenu(true, null, true, null, params);
  };

  downloadFile(file) {}
}