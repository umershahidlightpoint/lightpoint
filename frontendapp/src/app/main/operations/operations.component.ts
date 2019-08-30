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

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  isSubscriptionAlive: boolean;
  isLoading = false;
  key: any;
  postingEngineMsg = false;
  clearJournalForm: FormGroup;
  selectedPeriod: any;
  messages: any;
  Progress: any;
  totalRecords: number;
  bottomOptions = { alignedGrids: [] };
  selected: { startDate: moment.Moment; endDate: moment.Moment };

  private gridOptions: GridOptions;
  private defaultColDef;
  private rowData: [];

  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @ViewChild('confirm') confirmModal: ModalDirective;
  @Output() showPostingEngineMsg: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('logScroll') private logContainer: ElementRef;

  totalCredit: number;
  totalDebit: number;
  bottomData: any;
  startDate: any;
  fund: any;
  endDate: any;
  symbal: string;
  pageSize: any;
  accountSearch = { id: undefined };
  valueFilter: number;
  funds: any;
  sortColum: any;
  sortDirection: any;
  page: any;

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

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 300px)',
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

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width,
      height,
      boxSizing: 'border-box'
    };
  }

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private postingEngineService: PostingEngineService
  ) {
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
    // this.selected = {startDate: moment().subtract(6, 'days'), endDate: moment().subtract(1, 'days')};
  }

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    // align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);

    this.symbal = 'ALL';

    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    this.getJournalLogs();

    this.buildForm();
  }

  private getJournalLogs() {
    this.financeService
      .getJournalLogs(
        this.symbal,
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  refreshGrid() {
    this.gridOptions.api.showLoadingOverlay();
    this.getJournalLogs();
  }

  scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) {}
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
    this.postingEngineMsg = true;
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

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  getLogs() {
    setTimeout(() => {
      this.financeService
        .runningEngineStatus(this.key)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          this.isLoading = response.Status;
          this.Progress = response.progress;
          this.messages = response.message == '' ? this.messages : response.message;
          if (response.Status) {
            this.getLogs();
          } else {
            this.messages = '';
          }
        });
    }, 3000);
  }

  IsPostingEngineRunning(e) {
    if (e.index == 1) {
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
