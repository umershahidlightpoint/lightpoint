import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PostingEngineService } from 'src/services/common/posting-engine.service';
import { DataService } from 'src/services/common/data.service';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, AfterViewInit {
  isEngineRunning = false;
  hideGrid = false;

  style = Style;

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(
    private postingEngineService: PostingEngineService,
    private dataService: DataService
  ) {
    this.hideGrid = false;
  }

  ngOnInit() {
    this.isEngineRunning = this.postingEngineService.getStatus();
  }

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }
}
