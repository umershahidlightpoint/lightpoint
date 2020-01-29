import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lp-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() loadingText = true;

  constructor() {}

  ngOnInit() {}
}
