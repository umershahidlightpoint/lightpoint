import { Component, ElementRef, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostingEngineService } from 'src/services/common/posting-engine.service';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';
import { ContextMenu } from 'src/shared/Models/common';
import { JournalApiService } from 'src/services/journal-api.service';
import { PostingEngineApiService } from 'src/services/posting-engine-api.service';
import { FileManagementApiService } from 'src/services/file-management-api.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewChecked {
  @ViewChild('confirmModal', { static: false })
  confirmationModal: ConfirmationModalComponent;
  @ViewChild('logScroll', { static: false }) private logContainer: ElementRef;

  public gridOptions: GridOptions;
  public rowData: any[];
  private bottomOptions: any = { alignedGrids: [] };

  isLoading = false;

  postingEngineStatus = false;
  fileManagementActive = false;
  exportExceptionActive = false;
  servicesStatus = false;
  servicesLog = false;

  periodPlaceholder: { name: 'Select a Period' };
  selectedPeriod: { name: string };
  clearJournalForm: FormGroup;
  key: any;
  messages: string;
  progress: number;
  symbol: string;
  page: number;
  pageSize: number;
  accountSearch = { id: undefined };
  valueFilter: number;
  sortColum: string;
  sortDirection: string;
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
    private fileManagementApiService: FileManagementApiService,
    private postingEngineApiService: PostingEngineApiService,
    private journalApiService: JournalApiService,
    private toastrService: ToastrService,
    private postingEngineService: PostingEngineService
  ) {
    this.initGrid();
  }

  ngOnInit() {
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
    this.journalApiService
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
    this.postingEngineApiService
      .startPostingEngine(this.selectedPeriod.name)
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
    this.fileManagementApiService.generateFiles(obj).subscribe(response => {
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
      this.postingEngineApiService.runningEngineStatus(this.key).subscribe(response => {
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

  activeLogs() {
    this.postingEngineApiService.isPostingEngineRunning().subscribe(response => {
      if (response.IsRunning) {
        this.isLoading = true;
        this.key = response.key;
        this.getLogs();
      }
    });
  }

  activeFileManagement() {
    this.fileManagementActive = true;
  }

  activeExportException() {
    this.exportExceptionActive = true;
  }

  activeServicesStatus() {
    this.servicesStatus = true;
  }

  activeServicesLog() {
    this.servicesLog = true;
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
    this.postingEngineApiService.clearJournals(type).subscribe(response => {
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

  getContextMenuItems(params): Array<ContextMenu> {
    // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
    return GetContextMenu(true, null, true, null, params);
  }
}
