import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('loadingText') showLoadingText = true;

  constructor() {}

  ngOnInit() {}
}
