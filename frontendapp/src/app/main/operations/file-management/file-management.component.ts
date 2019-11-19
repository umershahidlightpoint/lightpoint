import { Component, TemplateRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { File } from 'src/shared/models/files';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { ToastrService } from 'ngx-toastr';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit, OnDestroy {
  @ViewChild('actionButtons',{ static: false }) actionButtons: TemplateRef<any>;

  filesGridOptions: GridOptions;
  files: File[];
  isSubscriptionAlive: boolean;

  excelParams = {
    fileName: 'File Management',
    sheetName: 'First Sheet',
    columnKeys: [
      'name',
      'action',
      'source',
      'statistics',
      'businessDate',
      'actionStartDate',
      'actionEndDate'
    ]
  };

  style = Style;

  styleForLogsHeight = HeightStyle(220);

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.initGrid();
    this.loadFilesGrid();
  }

  initGrid() {
    const columnDefsForFiles = [
      {
        field: 'id',
        headerName: 'Id',
        hide: true
      },
      {
        field: 'name',
        headerName: 'File Name',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        resizable: true
      },
      {
        field: 'path',
        headerName: 'Path',
        hide: true
      },
      {
        field: 'fileActionId',
        headerName: 'File Action Id',
        hide: true
      },
      {
        field: 'action',
        headerName: 'Action',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        field: 'source',
        headerName: 'Source',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        field: 'statistics',
        headerName: 'Statistics',
        sortable: true,
        filter: true,
        resizable: true,
        type: 'numericColumn'
      },
      {
        field: 'businessDate',
        headerName: 'Business Date',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        resizable: true
      },
      { field: 'actionStartDate', headerName: 'Start Date', sortable: true, filter: true },
      { field: 'actionEndDate', headerName: 'End Date', sortable: true, filter: true },
      {
        headerName: 'View',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ];
    this.filesGridOptions = {
      rowData: null,
      columnDefs: columnDefsForFiles,
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

    this.filesGridOptions.getRowStyle = function(params) {
      if (params.data.exceptions) {
        return { backgroundColor: '#ffcfcf' };
      }
    };
    this.filesGridOptions.sideBar = SideBar(GridId.filesId, GridName.files, this.filesGridOptions);
  }

  private getFiles() {
    this.financeService
      .getFiles()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(result => {
        this.files = result.payload.map(item => ({
          id: item.id,
          name: item.name,
          path: item.path,
          source: item.source,
          statistics: item.statistics,
          fileActionId: item.file_action_id,
          action: item.action,
          actionStartDate: item.action_start_date,
          actionEndDate: item.action_end_date,
          businessDate: item.business_date,
          exceptions: item.exceptions
        }));
        this.filesGridOptions.api.setRowData(this.files);
      });
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getFiles();
  }

  loadFilesGrid() {
    this.getFiles();
  }

  getContextMenuItems = params => {
    const process = [
      {
        name: 'Process',
        action: () => {
          this.processFile(params);
        }
      }
    ];
    //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(false, process, true, null, params);
  };

  setGroupingStateForFiles(value: boolean) {
    this.filesGridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }

  downloadFile(file) {}

  processFile(params) {
    const local = this;
    this.toastrService.success('File Processing is Started');
    const obj = {
      fileId: params.node.data.id,
      action: 'Processing'
    };
    this.financeService.updateAction(obj).subscribe(resp => {
      if (resp.isSuccessful) {
        local.getFiles();
      }
    });
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
