import { Component, TemplateRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FinanceServiceProxy } from '../../../../services/service-proxies';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { File } from 'src/shared/models/files';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { ToastrService } from 'ngx-toastr';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ContextMenu } from 'src/shared/Models/common';
import * as moment from 'moment';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  filesGridOptions: GridOptions;
  files: File[];

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

  constructor(private financeService: FinanceServiceProxy, private toastrService: ToastrService) {
    this.initGrid();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getFiles();
  }

  initGrid() {
    this.filesGridOptions = {
      rowData: null,
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

    this.filesGridOptions.getRowStyle = params => {
      if (params.data.exceptions) {
        return { backgroundColor: '#ffcfcf' };
      }
    };
    this.filesGridOptions.sideBar = SideBar(GridId.filesId, GridName.files, this.filesGridOptions);
  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
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
      {
        field: 'actionStartDate',
        headerName: 'Start Date',
        sortable: true,
        filter: true
      },
      {
        field: 'actionEndDate',
        headerName: 'End Date',
        sortable: true,
        filter: true
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

  getFiles() {
    this.financeService.getFiles().subscribe(result => {
      this.files = result.payload.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        source: item.source,
        statistics: item.statistics,
        fileActionId: item.file_action_id,
        action: item.action,
        actionStartDate: moment(item.action_start_date).format('MMM-DD-YYYY hh:mm:ss'),
        actionEndDate: moment(item.action_end_date).format('MMM-DD-YYYY hh:mm:ss'),
        businessDate: moment(item.business_date).format('MMM-DD-YYYY hh:mm:ss'),
        exceptions: item.exceptions
      }));
      this.filesGridOptions.api.setRowData(this.files);
    });
    this.setColDefs();
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getFiles();
  }

  getContextMenuItems = (params: Array<ContextMenu>) => {
    const process = [
      {
        name: 'Process',
        action: () => {
          this.processFile(params);
        }
      }
    ];
    return GetContextMenu(false, process, true, null, params);
  };

  setGroupingStateForFiles(value: boolean) {
    this.filesGridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }

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

  downloadFile(file) {}
}
