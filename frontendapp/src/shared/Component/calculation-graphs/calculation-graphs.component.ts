import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GraphObject } from 'src/shared/Models/graph-object';
import * as moment from 'moment';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartObject: GraphObject;
  @Input() mode: string;
  showChart = false;
  filteredChartData: any = {};
  vRanges = [
    {
      Description: 'Last 30 days',
      Days: 30
    },
    {
      Description: 'Last Quarter',
      Days: 90
    },
    {
      Description: 'Last 6 months',
      Days: 180
    },
    {
      Description: 'Last year',
      Days: 365
    },
    {
      Description: 'ITD',
      Days: 0
    }
  ];

  vRange = this.vRanges[0].Days;

  constructor(private toastrService: ToastrService) {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    const { currentValue } = change.chartObject;
    if (currentValue !== undefined) {
      if (currentValue.graphData) {
        this.reset();
        this.filterChartData(currentValue.graphData, currentValue.referenceDate);
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

  private reset() {
    this.filteredChartData = {};
    this.vRange = this.vRanges[0].Days;
  }

  vChange($event) {
    this.filteredChartData = {};
    this.filterChartData(this.chartObject.graphData, this.chartObject.referenceDate);
  }

  filterChartData(allData, toDate) {
    if (toDate && this.vRange !== 0) {
      const fromDate = moment(toDate).subtract(this.vRange, 'days');
      Object.keys(allData).forEach(key => {
        const filteredList = allData[key].filter(
          x => moment(x.date).isSameOrAfter(fromDate) && moment(x.date).isSameOrBefore(toDate)
        );
        this.filteredChartData[key] = filteredList;
      });
    } else {
      this.filteredChartData = allData;
      this.vRange = this.vRanges.find(x => x.Days === 0).Days;
    }
  }
}
