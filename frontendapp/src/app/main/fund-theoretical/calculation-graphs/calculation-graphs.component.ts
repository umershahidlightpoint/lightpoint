import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  QTDData: any[] = [];
  YTDData: any[] = [];
  ITDData: any[] = [];
  showChart = false;

  styleForHeight = HeightStyle(264);

  propIDQTD = 'QTDLineChart';
  propIDYTD = 'YTDLineChart';
  propIDITD = 'ITDLineChart';
  divHeight = 180;
  divWidth = '95%';
  lineColors = ['#ff6960', '#00bd9a'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    const { currentValue } = change.chartData;
    if (currentValue !== undefined) {
      currentValue.forEach((element, index) => {
        if (index === 1) {
          this.QTDData = element.data;
        }
        if (index === 2) {
          this.YTDData = element.data;
        }
        if (index === 3) {
          this.ITDData = element.data;
        }
      });
      if (this.QTDData.length > 0) {
        this.showChart = true;
      }
    }
  }
}
