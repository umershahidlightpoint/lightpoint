import { Injectable, Output, EventEmitter } from "@angular/core";
import { FinancePocServiceProxy } from "../service-proxies/service-proxies";
import { takeWhile } from "rxjs/operators";

@Injectable()
export class PostingEngineService {
  isOpen = false;
  isRunning = false;
  isSubscriptionAlive: boolean;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private _fundsService: FinancePocServiceProxy) {
    this.isSubscriptionAlive = true;
  }

  changeStatus(status) {
    this.isRunning = status;
    if (!status) {
      this.isSubscriptionAlive = false;
    }
  }

  checkStatus(key) {
    setTimeout(() => {
      this._fundsService
        .runningEngineStatus(key)
        .pipe(takeWhile(() => this.isSubscriptionAlive))
        .subscribe(response => {
          if (response.Status) {
            this.changeStatus(true);
            this.checkStatus(key);
          } else {
            this.changeStatus(false);
          }
        });
    }, 10000);
  }

  getStatus() {
    return this.isRunning;
  }
}
