import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  AfterViewChecked,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { File } from 'src/shared/models/files';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit, OnDestroy {
  @ViewChild('topGrid') topGrid;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @Output() showPostingEngineMsg: EventEmitter<any> = new EventEmitter<any>();

  public filesGridOptions: GridOptions;
  public rowData: any[];
  public files: File[];

  isSubscriptionAlive: boolean;
  isLoading = false;
  postingEngineStatus = false;
  clearJournalForm: FormGroup;
  key: any;
  messages: any;
  progress: any;
  startDate: any;
  endDate: any;
  symbol: string;
  page: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;

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

  styleForTasksHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 180px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 326px)',
    boxSizing: 'border-box',
    overflow: 'scroll'
  };

  columnDefsForFiles = [
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
    { field: 'actionEndDate', headerName: 'End Date', sortable: true, filter: true }
  ];

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private postingEngineService: PostingEngineService
  ) {
    this.initGrid();
  }

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.loadFilesGrid();
  }

  initGrid() {
    this.filesGridOptions = {
      rowData: null,
      columnDefs: this.columnDefsForFiles,
      onGridReady: () => {
        this.filesGridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
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
    this.financeService.getFiles().subscribe(result => {
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

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
