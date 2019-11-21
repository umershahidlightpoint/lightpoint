import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GraphObject } from 'src/shared/Models/graph-object';

@Component({
  selector: 'app-calculation-graphs',
  templateUrl: './calculation-graphs.component.html',
  styleUrls: ['./calculation-graphs.component.css']
})
export class CalculationGraphsComponent implements OnInit, OnChanges {
  @Input() chartObject: GraphObject;
  @Input() mode: string;
  showChart = false;

  constructor(private toastrService: ToastrService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    debugger;
    const { currentValue } = change.chartObject;
    if (currentValue !== undefined) {
      if (currentValue.graphData) {
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
