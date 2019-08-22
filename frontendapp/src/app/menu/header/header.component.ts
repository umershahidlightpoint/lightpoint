import { Component, OnInit, Input, DoCheck } from "@angular/core";
import { MatSidenav } from "@angular/material";
import * as moment from "moment";
import { PostingEngineService } from "src/shared/common/posting-engine.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, DoCheck {
  @Input() sidenav: MatSidenav;
  postingEngineMsg: boolean;
  progressBar: any;
  date: string = moment().format("MM-DD-YYYY");

  constructor(private messageService: PostingEngineService) {}

  ngOnInit() {}

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
}
