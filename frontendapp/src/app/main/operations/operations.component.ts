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
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { File } from 'src/shared/models/files';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @ViewChild('confirm') confirmModal: ModalDirective;
  @ViewChild('logScroll') private logContainer: ElementRef;
  @Output() showPostingEngineMsg: EventEmitter<any> = new EventEmitter<any>();

  public gridOptions: GridOptions;
  public filesGridOptions: GridOptions;
  private defaultColDef: any;
  public rowData: any[];
  public files: File[];
  private bottomOptions: any = { alignedGrids: [] };

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

  periods = [
    { name: 'YTD' },
    { name: 'ITD' },
    { name: 'MTD' },
    { name: 'Today' },
    { name: 'Latest' }
  ];

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

  /*
  We can define how we need to show the data here, as this is a log file we should group by the rundate
  */
  columnDefs = [
    {
      field: 'rundate',
      headerName: 'Run Date',
      sortable: true,
      filter: true,
      enableRowGroup: true,
      resizable: true
    },
    {
      field: 'action_on',
      headerName: 'Action On',
      sortable: true,
      filter: true,
      resizable: true
    },
    { field: 'action', headerName: 'Action', sortable: true, filter: true }
  ];

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
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    /*
    Align Scroll of Grid and Footer Grid
    */
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);
    /*
    Params for API Request
    */
    this.symbol = 'ALL';
    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    this.getJournalLogs();
    this.buildForm();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true
    } as GridOptions;

    this.filesGridOptions = {
      rowData: null,
      columnDefs: this.columnDefsForFiles,
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
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

  private getJournalLogs() {
    this.financeService
      .getJournalLogs(
        this.symbol,
        this.page,
        this.pageSize,
        this.accountSearch.id,
        this.valueFilter,
        this.sortColum,
        this.sortDirection
      )
      .subscribe(result => {
        this.rowData = [];
        this.rowData = result.data.map(item => ({
          rundate: moment(item.rundate).format('MMM-DD-YYYY'),
          action_on: moment(item.action_on).format('MMM-DD-YYYY hh:mm:ss'),
          action: item.action
        }));
      });
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

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getJournalLogs();
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getFiles();
  }

  onBtExport() {
    const params = {
      fileName: 'Journal Logs',
      sheetName: 'First Sheet',
      columnKeys: ['rundate', 'action_on', 'action']
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  onBtExportFiles() {
    const params = {
      fileName: 'File Management',
      sheetName: 'First Sheet',
      columnKeys: ['name', 'action', 'source', 'statistics', 'actionStartDate', 'actionEndDate']
    };
    this.filesGridOptions.api.exportDataAsExcel(params);
  }

  buildForm() {
    this.clearJournalForm = new FormGroup({
      user: new FormControl(false),
      system: new FormControl(false)
    });
  }

  validateClearForm() {
    return !this.clearJournalForm.value.system && !this.clearJournalForm.value.user ? true : false;
  }

  /* This needs to call out to the Posting Engine and invoke the process,
     this is a fire and forget as the process may take a little while to complete
  */
  runEngine() {
    this.postingEngineStatus = true;
    this.financeService
      .startPostingEngine()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.IsRunning) {
          this.isLoading = true;
          this.key = response.key;
          this.postingEngineService.changeStatus(true);
          this.postingEngineService.checkProgress();
        }
        this.key = response.key;
        this.getLogs();
      });
  }

  getLogs() {
    setTimeout(() => {
      this.financeService
        .runningEngineStatus(this.key)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          this.isLoading = response.Status;
          this.progress = response.progress;
          this.messages = response.message === '' ? this.messages : response.message;
          if (response.Status) {
            this.getLogs();
          } else {
            this.messages = '';
          }
        });
    }, 3000);
  }

  isPostingEngineRunning(e) {
    if (e.index === 1) {
      this.financeService
        .isPostingEngineRunning()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.IsRunning) {
            this.isLoading = true;
            this.key = response.key;
            this.getLogs();
          }
        });
    }
    if (e.index === 2) {
      this.loadFilesGrid();
    }
  }

  loadFilesGrid() {
    this.getFiles();
    this.filesGridOptions.api.sizeColumnsToFit();
  }

  openModal() {
    this.confirmModal.show();
  }

  closeModal() {
    this.confirmModal.hide();
  }

  clearJournal() {
    const type: string =
      this.clearJournalForm.value.system && this.clearJournalForm.value.user
        ? 'both'
        : this.clearJournalForm.value.system
        ? 'system'
        : 'user';
    this.financeService
      .clearJournals(type)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Journals are cleared successfully!');
        } else {
          this.toastrService.error('Failed to clear Journals!');
        }
      });
    this.clearForm();
    this.closeModal();
  }

  clearForm() {
    this.clearJournalForm.reset();
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

  setGroupingState(value: boolean) {
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
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
