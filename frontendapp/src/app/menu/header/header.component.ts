import { Component, OnInit, Input, DoCheck, AfterViewInit } from '@angular/core';
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
export class HeaderComponent implements OnInit, DoCheck, AfterViewInit {
  @Input() sidenav: MatSidenav;
  postingEngineMsg: boolean;
  progressBar: any;
  date: string = moment().format("MM-DD-YYYY");
  isSubscriptionAlive: boolean;

  constructor(
    private messageService: PostingEngineService,
    private _fundsService: FinancePocServiceProxy
  ) {
    this.isSubscriptionAlive = true;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.IsPostingEngineRunning();
  }

  IsPostingEngineRunning() {
    this._fundsService
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
    let isEngineRunning = this.messageService.getStatus();
    let progress = this.messageService.getProgress();
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
