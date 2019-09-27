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
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataService } from 'src/shared/common/data.service';
import { SideBar, Style } from 'src/shared/utils/Shared';
import { Expand, Collapse, ExpandAll, CollapseAll } from 'src/shared/utils/ContextMenu';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @ViewChild('confirm') confirmModal: ModalDirective;
  @ViewChild('logScroll') private logContainer: ElementRef;
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;
  @Output() showPostingEngineMsg: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshFiles: EventEmitter<any> = new EventEmitter<any>();

  public gridOptions: GridOptions;
  private defaultColDef: any;
  public rowData: any[];
  private bottomOptions: any = { alignedGrids: [] };

  isSubscriptionAlive: boolean;
  isLoading = false;
  postingEngineStatus = false;
  fileManagementActive = false;
  selectedPeriod: any;
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
  backdrop: any;

  periods = [
    { name: 'Latest' },
    { name: 'Today' },
    { name: 'MTD' },
    { name: 'YTD' },
    { name: 'ITD' },
  ];

  style = Style;

  styleForLogsHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
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

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private dataService: DataService,
    private postingEngineService: PostingEngineService,
    private downloadExcelUtils: DownloadExcelUtils
  ) {
    this.initGrid();
  }

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    // /*
    // Align Scroll of Grid and Footer Grid
    // */
    // this.gridOptions.alignedGrids.push(this.bottomOptions);
    // this.bottomOptions.alignedGrids.push(this.gridOptions);
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
      sideBar: SideBar,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
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
    this.dataService.changeMessage(this.gridOptions);
    this.dataService.changeGrid({ gridId: GridId.logsId, gridName: GridName.logs });
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
        this.gridOptions.api.setRowData(this.rowData);
      });
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getJournalLogs();
  }

  onBtExport() {
    const params = {
      fileName: 'Journal Logs',
      sheetName: 'First Sheet',
      columnKeys: ['rundate', 'action_on', 'action']
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.downloadExcelUtils.ToastrMessage();
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
      .startPostingEngine(this.selectedPeriod.name)
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

  generateFiles() {
    this.financeService
      .generateFiles()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastrService.success('Files are Generated for Processing');
        } else {
          this.toastrService.error('Something went wrong, Please try again later.');
        }
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
      this.fileManagementActive = true;
    }
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
    const defaultItems = ['copy', 'paste', 'copyWithHeaders', 'export'];
    const items = [
      {
        name: 'Expand',
        action() {
          Expand(params);
        }
      },
      {
        name: 'Collapse',
        action() {
          Collapse(params);
        }
      },
      {
        name: 'Expand All',
        action: () => {
          ExpandAll(params);
        }
      },
      {
        name: 'Collapse All',
        action: () => {
          CollapseAll(params);
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

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
