import { Component, OnInit } from '@angular/core';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit {

  title = 'Portfolio Accounting Services Log';
  getLogsUrl = 'http://localhost:9092/api/log/files';
  downloadFileUrl = 'http://localhost:9092/api/log/download?path=&fileName=';
  styleForHeight = HeightStyle(156);

  constructor() {}

  ngOnInit() {}

}
