import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-journals-layout',
  templateUrl: './journals-layout.component.html',
  styleUrls: ['./journals-layout.component.css']
})
export class JournalsLayoutComponent implements OnInit {
  isServerJournalActive: boolean;
  constructor() {
    this.isServerJournalActive = false;
  }

  ngOnInit() {}

  onTabChange(e) {
    if (e.index === 1) {
      this.isServerJournalActive = true;
    }
  }
}
