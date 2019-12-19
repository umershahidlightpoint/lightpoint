import { Component, OnInit, Input, DoCheck, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import * as moment from 'moment';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { FinanceServiceProxy } from '../../../services/service-proxies';
import { ServicesStatusApiService } from '../../../services/services-status-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck, AfterViewInit {
  @Input() sidenav: MatSidenav;

  postingEngineStatus: boolean;
  baseCurrency = 'USD'; // Driven by a System Setting
  progressBar: any;
  date: string = moment().format('MM-DD-YYYY');
  effectiveDate: string;
  toDateHasJournals: boolean;
  fromDateHasJournals: boolean;
  servicesStatus = true;

  constructor(
    private servicesStatusApiService: ServicesStatusApiService,
    private postingEngineService: PostingEngineService,
    private financeService: FinanceServiceProxy
  ) {}

  ngOnInit() {
    this.getServicesStatus(); // Return T/F if finance/BookMon service is running or not
    this.date = moment().format('MM-DD-YYYY');
    this.effectiveDate = this.getPreviousWorkday(moment()).format('MM-DD-YYYY');
    this.isPostingEngineRunning();
    this.doDatesHaveJournals();
  }

  getServicesStatus(): void {
    this.servicesStatusApiService.servicesStatusBool$.subscribe(status => {
      this.servicesStatus = status;
    });
  }

  getPreviousWorkday(day: any) {
    // const prevDay = moment(day).add('days', -1);

    // return [1, 2, 3, 4, 5].indexOf(prevDay.day()) > -1
    //   ? prevDay
    //   : prevDay.add('days', -1);

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

  isPostingEngineRunning() {
    this.financeService.isPostingEngineRunning().subscribe(response => {
      if (response.IsRunning) {
        this.postingEngineService.changeStatus(true);
        this.postingEngineService.checkProgress();
        this.postingEngineStatus = this.postingEngineService.getStatus();
      }
    });
  }

  doDatesHaveJournals() {
    this.financeService.checkForJournals(this.effectiveDate, this.date).subscribe(response => {
      const { payload } = response;
      this.toDateHasJournals = payload[0].previous === 0 ? false : true;
      this.fromDateHasJournals = payload[1].previous === 0 ? false : true;
    });
  }
}
