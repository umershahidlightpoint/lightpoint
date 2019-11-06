import {
  Component,
  ElementRef,
  OnInit,
  AfterViewChecked,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('confirmModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('logScroll') private logContainer: ElementRef;

  public gridOptions: GridOptions;
  public rowData: any[];
  private bottomOptions: any = { alignedGrids: [] };

  isSubscriptionAlive: boolean;
  isLoading = false;
  postingEngineStatus = false;
  fileManagementActive = false;
  exportExceptionActive = false;
  selectedPeriod: any;
  clearJournalForm: FormGroup;
  key: any;
  messages: any;
  progress: any;
  symbol: string;
  page: any;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: any;
  sortDirection: any;
  businessDate: any;
  generateFilesLoader = false;

  excelParams = {
    fileName: 'Journal Logs',
    sheetName: 'First Sheet',
    columnKeys: ['rundate', 'action_on', 'action']
  };

  periods = [
    { name: 'Latest' },
    { name: 'Today' },
    { name: 'MTD' },
    { name: 'YTD' },
    { name: 'ITD' }
  ];

  style = Style;

  styleForLogsHeight = HeightStyle(220);

  styleForTasksHeight = HeightStyle(180);

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
    private postingEngineService: PostingEngineService
  ) {
    this.initGrid();
  }

  ngOnInit() {
    this.isSubscriptionAlive = true;
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
      getContextMenuItems: params => this.getContextMenuItems(params),
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
      suppressHorizontalScroll: true,
      defaultColDef: {
        sortable: true,
        resizable: true
      }
    } as GridOptions;
    this.gridOptions.sideBar = SideBar(GridId.logsId, GridName.logs, this.gridOptions);
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
        this.rowData = result.payload.map(item => ({
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
    const obj = {
      businessDate: this.businessDate != null ? this.businessDate.startDate : null
    };
    this.generateFilesLoader = true;
    this.financeService
      .generateFiles(obj)
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        this.generateFilesLoader = false;
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
    if (e.index === 3) {
      this.exportExceptionActive = true;
    }
  }

  openModal() {
    this.confirmationModal.showModal();
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
  }

  clearForm() {
    this.clearJournalForm.reset();
  }

  getContextMenuItems(params) {
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(true, null, true, null, params);
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
