import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  Injector,
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
import { Observable } from 'rxjs';
import { PostingEngineStatus } from '../../../shared/Models/posting-engine';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy {
  isSubscriptionAlive: boolean;
  isLoading: boolean = false;
  key: any;
  postingEngineMsg: boolean = false;
  clearJournalForm: FormGroup;

  @Output() showPostingEngineMsg: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _fundsService: FinancePocServiceProxy,
    private toastrService: ToastrService,
    private messageService: PostingEngineService
  ) {
    injector;
    this.gridOptions = <GridOptions>{
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
    };
    //this.selected = {startDate: moment().subtract(6, 'days'), endDate: moment().subtract(1, 'days')};
  }

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.defaultColDef = {
      sortable: true,
      resizable: true
    };
    //align scroll of grid and footer grid
    this.gridOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.gridOptions);

    this.symbal = 'ALL';

    this.page = 0;
    this.pageSize = 0;
    this.accountSearch.id = 0;
    this.valueFilter = 0;
    this.sortColum = '';
    this.sortDirection = '';

    this._fundsService
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

    this.buildForm();
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
    this._fundsService
      .startPostingEngine()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.IsRunning) {
          this.key = response.key;
          this.isLoading = true;
          this.key = response.key;
          this.messageService.changeStatus(true);
          this.messageService.checkStatus(this.key);
        }
        this.key = response.key;
        this.check();
      });
  }

  periods = [
    { name: 'YTD' },
    { name: 'ITD' },
    { name: 'MTD' },
    { name: 'Today' },
    { name: 'Latest' }
  ];

  selectedPeriod: any;
  messages: any;
  private gridOptions: GridOptions;
  Progress: any;
  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private rowData: [];
  private selectedValue;

  totalRecords: number;
  bottomOptions = { alignedGrids: [] };

  selected: { startDate: moment.Moment; endDate: moment.Moment };

  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;
  @ViewChild('dateRangPicker') dateRangPicker;
  @ViewChild('greetCell') greetCell: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;
  @ViewChild('confirm') confirmModal: ModalDirective;

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

  title = 'app';
  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };
  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 180px)',
    boxSizing: 'border-box'
  };
  messagesDiv = {
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
      width: width,
      height: height,
      boxSizing: 'border-box'
    };
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  check() {
    setTimeout(() => {
      debugger;

      this._fundsService
        .runningEngineStatus(this.key)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          console.log('Running status Response', response);
          this.isLoading = response.Status;
          this.Progress = response.progress;
          this.messages = response.message == '' ? this.messages : response.message;
          if (response.Status) {
            this.check();
          } else {
          }
        });
    }, 1000);
  }
  IsPostingEngineRunning(e) {
    if (e.index == 1) {
      this._fundsService
        .IsPostingEngineRunning()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.IsRunning) {
            console.log('is successful', response);
            this.isLoading = true;
            this.key = response.key;
            this.check();
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
    this._fundsService
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

  callParent(msg) {
    console.log('status :: ', msg);
    this.messageService.changeStatus(msg);
    // this.showPostingEngineMsg.emit("testing");
  }

  getStatus() {
    if (this.postingEngineMsg) {
      return this.postingEngineMsg;
    }
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
