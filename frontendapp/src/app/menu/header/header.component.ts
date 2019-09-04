import { Component, OnInit, Input, DoCheck, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import * as moment from 'moment';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
  @Input() sidenav: MatSidenav;

  postingEngineStatus: boolean;
  baseCurrency: string = 'USD'; // Driven by a System Setting
  progressBar: any;
  date: string = moment().format('MM-DD-YYYY');
  isSubscriptionAlive: boolean;

  constructor(
    private postingEngineService: PostingEngineService,
    private financeService: FinancePocServiceProxy
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isPostingEngineRunning();
  }

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

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }

  isPostingEngineRunning() {
    this.financeService
      .isPostingEngineRunning()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.IsRunning) {
          this.postingEngineService.changeStatus(true);
          this.postingEngineService.checkProgress();
          this.postingEngineStatus = this.postingEngineService.getStatus();
        }
      });
  }
}
