import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { File } from 'src/shared/models/files';
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

  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

  styleForLogsHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 210px)',
    boxSizing: 'border-box'
  };

  constructor(private financeService: FinancePocServiceProxy) {}

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
      onGridReady: () => {
        this.filesGridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        this.onFirstDataRendered(params);
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true
    } as GridOptions;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

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
          actionEndDate: item.action_end_date
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
      columnKeys: ['name', 'action', 'source', 'statistics', 'actionStartDate', 'actionEndDate']
    };
    this.filesGridOptions.api.exportDataAsExcel(params);
  }

  loadFilesGrid() {
    this.getFiles();
  }

  getContextMenuItems(params) {
    const defaultItems = ['copy', 'paste', 'export'];
    const items = [
      {
        name: 'Expand',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(true);
            }
          });
        }
      },
      {
        name: 'Collapse',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(false);
            }
          });
        }
      },
      ,
      {
        name: 'Expand All',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(true);
              for (const key in node.childrenAfterFilter) {
                if (!node.childrenAfterFilter[key].expanded) {
                  node.childrenAfterFilter[key].setExpanded(true);
                }
              }
            }
          });
        }
      },
      {
        name: 'Collapse All',
        action() {
          params.api.forEachNode((node, index) => {
            if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
              node.setExpanded(false);
              for (const key in node.childrenAfterFilter) {
                if (node.childrenAfterFilter[key].expanded) {
                  node.childrenAfterFilter[key].setExpanded(false);
                }
              }
            }
          });
        }
      },
      ...defaultItems
    ];
    if (params.node.group) {
      return items;
    }
    return defaultItems;
  }

  setGroupingStateForFiles(value: boolean) {
    this.filesGridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }

  downloadFile(file) {}

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
