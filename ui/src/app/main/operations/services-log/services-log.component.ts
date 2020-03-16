import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit {
  // tslint:disable-next-line: no-string-literal
  baseUrl = window['config']
    ? // tslint:disable-next-line: no-string-literal
      window['config'].remoteServerUrl
    : environment.testCaseRemoteServerUrl;

  getLogsUrl = `${this.baseUrl}/log/files`;
  downloadFileUrl = `${this.baseUrl}/log/download?fileName=`;
  viewFileUrl = `${this.baseUrl}/log/view?numberOfLines=100&fileName=`;

  styleForHeight = HeightStyle(200);

  constructor() {}

  ngOnInit() {}
}
