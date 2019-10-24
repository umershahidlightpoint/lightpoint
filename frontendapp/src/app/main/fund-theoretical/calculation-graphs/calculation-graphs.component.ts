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
      console.log('Curent Value', currentValue);
      let cData;
      currentValue.forEach((element, index) => {
        cData = element.data;
        if (index === 1 && cData.length > 0) {
          this.QTDData = cData;
        }
        if (index === 2 && cData.length > 0) {
          this.YTDData = cData;
        }
        if (index === 3 && cData.length > 0) {
          this.ITDData = cData;
        }
      });
      if (this.QTDData.length > 0) {
        this.showChart = true;
      }
      console.log('QTDData', this.QTDData, 'YTDData', this.YTDData, 'ITDData', this.ITDData);
    }
  }
}
