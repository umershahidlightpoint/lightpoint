import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  Output
} from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { File } from 'src/shared/models/files';
import { SideBar, Style } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit, OnDestroy {
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  filesGridOptions: GridOptions;
  files: File[];
  isSubscriptionAlive: boolean;

  style = Style;

  styleForLogsHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils,
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
        resizable: true
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
      sideBar: SideBar,
      columnDefs: columnDefsForFiles,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onGridReady: () => {
        // let allColumnIds = [];
        // this.filesGridOptions.columnApi.getAllColumns().forEach(function(column) {
        //   allColumnIds.push(column.colId);
        // });
        // this.filesGridOptions.columnApi.autoSizeColumns(allColumnIds); 
      },
      onFirstDataRendered: params => {
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true,
      suppressColumnVirtualisation: true
    } as GridOptions;
    this.dataService.changeMessage(this.filesGridOptions);
    this.dataService.changeGrid({ gridId: GridId.filesId, gridName: GridName.files });
  }

  // autoSizeAll(){
  //   let allColumnIds = [];
  //   this.filesGridOptions.columnApi.getAllColumns().forEach(function(column) {
  //     allColumnIds.push(column.colId);
  //   });
  //   this.filesGridOptions.columnApi.autoSizeColumns(allColumnIds);
  // }

  private getFiles() {
    this.financeService
      .getFiles()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(result => {
        this.files = result.data.map(item => ({
          id: item.id,
          name: item.name,
          path: item.path,
          source: item.source,
          statistics: item.statistics,
          fileActionId: item.file_action_id,
          action: item.action,
          actionStartDate: item.action_start_date,
          actionEndDate: item.action_end_date,
          businessDate : item.business_date
        }));
        this.filesGridOptions.api.setRowData(this.files);
      });
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getFiles();
  }

  onBtExportFiles() {
    const params = {
      fileName: 'File Management',
      sheetName: 'First Sheet',
      columnKeys: ['name', 'action', 'source', 'statistics','businessDate', 'actionStartDate', 'actionEndDate']
    };
    this.filesGridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
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
    let local = this;
    this.toastrService.success('File Processing is Started');
    let obj = {
      fileId: params.node.data.id,
      action: "Processing"
    }
    this.financeService.updateAction(obj).subscribe(resp => {
      if(resp.isSuccessful){
        local.getFiles();
      }
    });
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
