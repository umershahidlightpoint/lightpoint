import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Style } from 'src/shared/utils/Shared';
import { DataService } from 'src/services/common/data.service';

@Component({
  selector: 'app-journals-layout',
  templateUrl: './journals-layout.component.html',
  styleUrls: ['./journals-layout.component.scss']
})
export class JournalsLayoutComponent implements OnInit, AfterViewInit {
  hideGrid = false;
  isBalanceSheetActive = false;
  isIncomeStatementActive = false;
  isTrialBalanceActive = false;
  isServerSideJournalActive = false;
  isClientSideJournalActive = false;

  style = Style;

  containerDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }

  activateTab(tab: string) {
    switch (tab) {
      case 'BalanceSheet':
        this.isBalanceSheetActive = true;
        break;
      case 'IncomeStatement':
        this.isIncomeStatementActive = true;
        break;
      case 'TrialBalance':
        this.isTrialBalanceActive = true;
        break;
      case 'ServerSideJournal':
        this.isServerSideJournalActive = true;
        break;
      case 'ClientSideJournal':
        this.isClientSideJournalActive = true;
        break;
      default:
        break;
    }
  }
}
