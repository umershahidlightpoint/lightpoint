import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Style } from 'src/shared/utils/Shared';
import { DataService } from 'src/shared/common/data.service';

@Component({
  selector: 'app-journals-layout',
  templateUrl: './journals-layout.component.html',
  styleUrls: ['./journals-layout.component.css']
})
export class JournalsLayoutComponent implements OnInit, AfterViewInit {
  hideGrid = false;
  isClientJournalActive: boolean;

  style = Style;

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(private dataService: DataService) {
    this.hideGrid = false;
    this.isClientJournalActive = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }

  onTabChange(e) {
    if (e.index === 1) {
      this.isClientJournalActive = true;
    }
  }

  onSelect(event) {}

  activeClientJournal() {
    this.isClientJournalActive = true;
  }
}
