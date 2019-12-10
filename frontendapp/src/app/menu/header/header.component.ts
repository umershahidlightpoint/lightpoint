import { Component, OnInit, Input, DoCheck, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import * as moment from 'moment';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { FinanceServiceProxy } from '../../../shared/service-proxies/service-proxies';

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

  constructor(
    private postingEngineService: PostingEngineService,
    private financeService: FinanceServiceProxy
  ) {}

  ngOnInit() {
    this.date = moment().format('MM-DD-YYYY');
    this.effectiveDate = this.getPreviousWorkday(moment()).format('MM-DD-YYYY');
    this.isPostingEngineRunning();
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
}
