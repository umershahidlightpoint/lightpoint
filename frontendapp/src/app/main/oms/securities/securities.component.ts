
import { Component, OnInit } from '@angular/core';
import { Style, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-securities',
  templateUrl: './securities.component.html',
  styleUrls: ['./securities.component.scss']
})
export class SecuritiesComponent implements OnInit {

  corporateActions = true;
  stockSplits = false;

  style = Style;
  styleForHeight = HeightStyle(206);

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
