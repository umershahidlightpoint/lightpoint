import { Injectable, Output, EventEmitter } from '@angular/core';
import { FinancePocServiceProxy } from '../service-proxies/service-proxies';
import { takeWhile } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable()
export class PostingEngineService {
  isRunning = false;
  progress: number = 0;
  isSubscriptionAlive: boolean;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private _fundsService: FinancePocServiceProxy, private dataService: DataService) {
    this.isSubscriptionAlive = true;

    this.dataService.gridColumnApi.subscribe(obj => (obj = this.isRunning));
  }

  changeStatus(status) {
    this.isRunning = status;
    this.dataService.changeEngineStatus(this.isRunning);
    if (!status) {
      this.progress = 0;
      this.isSubscriptionAlive = false;
    } else {
      this.isSubscriptionAlive = true;
    }
  }

  changeProgress(progress) {
    this.progress = progress;
  }

  checkProgress() {
    setTimeout(() => {
      this._fundsService
        .isPostingEngineRunning()
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.IsRunning) {
            this.progress = response.progress;
            this.changeStatus(true);
            this.checkProgress();
          } else {
            this.changeStatus(false);
          }
        });
    }, 1000);
  }

  getStatus() {
    return this.isRunning;
  }

  getProgress() {
    return this.progress;
  }
}
