import { Injectable, Output, EventEmitter } from "@angular/core";
import { FinancePocServiceProxy } from "../service-proxies/service-proxies";
import { takeWhile } from "rxjs/operators";

@Injectable()
export class PostingEngineService {
  isRunning = false;
  progress: number = 0;
  isSubscriptionAlive: boolean;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private _fundsService: FinancePocServiceProxy) {
    this.isSubscriptionAlive = true;
  }

  changeStatus(status) {
    this.isRunning = status;
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

  isPostingEngineRunning() {
    if (!this.isRunning) {
    }
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
