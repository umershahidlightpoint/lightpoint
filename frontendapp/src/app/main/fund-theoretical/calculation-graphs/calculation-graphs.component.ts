import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartData: any;

  selectedChartOption: any = 'ITD';
  selectedChartTitle: any = 'ITD';
  chartOptions: any;

  styleForHeight = HeightStyle(264);

  propIDPerformance = 'performanceLineChart';
  divHeight = 180;
  divWidth = '95%';
  lineColors = ['#ff6960', '#00bd9a'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    console.log('Chnages', change);
    this.chartOptions = this.chartData.map(item => {});
  }

  changeChart(selectedChart) {
    this.selectedChartOption = selectedChart;
    this.selectedChartTitle = this.chartOptions.find(({ key }) => selectedChart === key).value;
    if (this.chartData) {
      this.mapCostBasisData(this.chartData, this.selectedChartOption);
    }
  }
}
