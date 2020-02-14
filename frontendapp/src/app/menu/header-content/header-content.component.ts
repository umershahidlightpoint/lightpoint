import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import * as moment from 'moment';
import { WindowRef } from 'src/services/window-ref.service';
import { PostingEngineService } from 'src/services/common/posting-engine.service';
import { PostingEngineApiService } from 'src/services/posting-engine-api.service';
import { ServicesStatusApiService } from '../../../services/services-status-api.service';
import { JournalApiService } from 'src/services/journal-api.service';

@Component({
  selector: 'app-header-content',
  templateUrl: './header-content.component.html',
  styleUrls: ['./header-content.component.scss']
})
export class HeaderContentComponent implements OnInit, AfterViewInit, DoCheck {
  postingEngineStatus: boolean;
  progressBar: any;
  isDevMode = false;
  environment = '';
  baseCurrency = ''; // Driven by a System Setting
  date: string = moment().format('MM-DD-YYYY');
  effectiveDate: string;
  toDateHasJournals: boolean;
  servicesStatus = true;

  constructor(
    private windowRef: WindowRef,
    private postingEngineApiService: PostingEngineApiService,
    private postingEngineService: PostingEngineService,
    private servicesStatusApiService: ServicesStatusApiService,
    private journalApiService: JournalApiService
  ) {}

  ngOnInit() {
    this.date = moment().format('MM-DD-YYYY');
    this.effectiveDate = this.getPreviousWorkday(moment()).format('MM-DD-YYYY');
    this.isPostingEngineRunning();
    this.getServicesStatus(); // Return T/F If Finance/RefData Service is Running
    this.doDatesHaveJournals();
  }

  ngAfterViewInit() {}

  ngDoCheck() {
    const isEngineRunning = this.postingEngineService.getStatus();
    const progress = this.postingEngineService.getProgress();
    if (isEngineRunning || progress) {
      this.postingEngineStatus = isEngineRunning;
      this.progressBar = progress;
    } else {
      this.postingEngineStatus = false;
    }
  }

  getPreviousWorkday(day: any) {
    switch (moment().day()) {
      // If it is Monday (1), Saturday(6), or Sunday (0), Get the Previous Friday (5)
      // and Ensure We are on the Previous Week
      case 0:
      case 1:
      case 6:
        return moment()
          .subtract(6, 'days')
          .day(5);
      // If any other Day, Just return the Previous Day
      default:
        return moment().subtract(1, 'days');
    }
  }

  isPostingEngineRunning() {
    this.postingEngineApiService.isPostingEngineRunning().subscribe(response => {
      if (response.IsRunning) {
        this.postingEngineService.changeStatus(true);
        this.postingEngineService.checkProgress();
        this.postingEngineStatus = this.postingEngineService.getStatus();
      }
    });
  }

  getServicesStatus(): void {
    this.servicesStatusApiService.servicesStatusBool$.subscribe(status => {
      this.servicesStatus = status;
    });
  }

  doDatesHaveJournals() {
    this.journalApiService.getAppMetaData(this.effectiveDate, this.date).subscribe(response => {
      const { environment, baseCurrency, hasJournalsForPreviousDay } = response.payload;
      if (this.windowRef.nativeWindow.location.hostname === 'localhost') {
        this.isDevMode = true;
        this.environment = environment;
      }
      this.baseCurrency = baseCurrency;
      this.toDateHasJournals = hasJournalsForPreviousDay;
    });
  }
}
