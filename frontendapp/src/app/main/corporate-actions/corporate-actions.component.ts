import { Component, OnInit } from '@angular/core';
import { Style, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-corporate-actions',
  templateUrl: './corporate-actions.component.html',
  styleUrls: ['./corporate-actions.component.scss']
})
export class CorporateActionsComponent implements OnInit {

  corporateActions = true;
  stockSplits = false;

  style = Style;
  styleForHeight = HeightStyle(249);

  constructor() {
  }

  ngOnInit() {}

  activeCorporateActions() {
    this.corporateActions = true;
  }

  activeStockSplits() {
    this.stockSplits = true;
  }
}
