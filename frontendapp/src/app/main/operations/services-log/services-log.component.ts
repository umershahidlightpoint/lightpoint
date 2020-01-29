import { Component, OnInit } from '@angular/core';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit {

  getLogsUrl = 'http://localhost:9092/api/log/files';
  downloadFileUrl = 'http://localhost:9092/api/log/download?fileName=';
  styleForHeight = HeightStyle(156);

  constructor() {}

  ngOnInit() {}

}
