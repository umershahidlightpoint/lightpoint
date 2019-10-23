import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  cData: [];
  labels: string[] = [];

  styleForHeight = HeightStyle(264);

  propIDPerformance = 'performanceLineChart';
  divHeight = 180;
  divWidth = '95%';
  lineColors = ['#ff6960', '#00bd9a'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    const { currentValue } = change.chartData;
    currentValue.forEach((element, index) => {
      if (index !== 0) {
        this.cData.push(element.data);
      }
    });
    console.log('DATA :: ', this.cData);
  }
}
