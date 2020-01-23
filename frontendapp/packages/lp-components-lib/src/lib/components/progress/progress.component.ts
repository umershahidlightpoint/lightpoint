import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lp-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  @Input() color = '#f53d3d';

  constructor() {}

  ngOnInit() {}
}
