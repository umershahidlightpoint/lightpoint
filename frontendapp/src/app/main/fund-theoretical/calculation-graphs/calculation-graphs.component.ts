import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  @Input() mode: string;
  QTDData: any[] = [];
  YTDData: any[] = [];
  ITDData: any[] = [];
  singleChartData: any[] = [];
  title: string;
  showChart = false;

  propIDQTD = 'QTDLineChart';
  propIDYTD = 'YTDLineChart';
  propIDITD = 'ITDLineChart';
  propIDSingle = 'SingleLineChart';
  divHeight = 180;
  divWidth = '95%';
  lineColors = ['#ff6960', '#00bd9a'];

  constructor(
    private toastrService: ToastrService,
    private cdRef: ChangeDetectorRef
    ) {

    }

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    const { currentValue } = change.chartData;
    if (currentValue !== undefined) {
      let cData;
      currentValue.forEach((element, index) => {
        cData = element.data;
        if(this.mode === 'single'){
            this.singleChartData = cData;
            this.title = element.label;
            // this.cdRef.detectChanges();
        } else {
          if (cData.length === 0) {
            this.showChart = false;
          } else {
            if (index === 1) {
              this.QTDData = cData;
            }
            if (index === 2) {
              this.YTDData = cData;
            }
            if (index === 3) {
              this.ITDData = cData;
            }
          }
      }
      });
      if (cData.length > 0) {
        this.showChart = true;
      } else {
        of()
          .pipe(delay(500))
          .subscribe(() => {
            this.toastrService.info('Data is not available to show Graphs!');
          });
      }
    }
  }
}
