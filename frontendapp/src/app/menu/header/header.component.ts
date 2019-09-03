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
  postingEngineMsg: boolean;
  progressBar: any;
  baseCurrency: string = 'USD'; // Driven by a system setting

  date: string = moment().format('MM-DD-YYYY');
  isSubscriptionAlive: boolean;

  constructor(
    private messageService: PostingEngineService,
    private fundsService: FinancePocServiceProxy
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.IsPostingEngineRunning();
  }

  IsPostingEngineRunning() {
    this.fundsService
      .isPostingEngineRunning()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(response => {
        if (response.IsRunning) {
          this.messageService.changeStatus(true);
          this.messageService.checkProgress();
          this.postingEngineMsg = this.messageService.getStatus();
        }
      });
  }

  ngDoCheck() {
    const isEngineRunning = this.messageService.getStatus();
    const progress = this.messageService.getProgress();
    if (isEngineRunning || progress) {
      this.postingEngineMsg = isEngineRunning;
      this.progressBar = progress;
    } else {
      this.postingEngineMsg = false;
    }
  }

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
