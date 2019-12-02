import {
  Component,
  TemplateRef,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { FinanceServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { SilverFile } from 'src/shared/Models/silver-file';
import { SideBar, Style, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';

@Component({
  selector: 'app-silver-file-management',
  templateUrl: './silver-file-management.component.html',
  styleUrls: ['./silver-file-management.component.css']
})
export class SilverFileManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<
    any
  >;

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

  constructor(private financeService: FinanceServiceProxy) {
    this.initGrid();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getSilverFiles();
  }

  initGrid() {
    this.filesGridOptions = {
      rowData: [],
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true
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
    this.financeService.getSilverFiles().subscribe(result => {
      this.files = result.payload.map(item => ({
        name: item.Name,
        uploadDate: item.UploadDate,
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
