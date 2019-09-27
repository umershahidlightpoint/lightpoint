import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Fund } from '../../../shared/Models/account';
import { TrialBalanceReport, TrialBalanceReportStats } from '../../../shared/Models/trial-balance';
import * as moment from 'moment';
import {
  Ranges,
  Style
} from 'src/shared/utils/Shared';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent  {
  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };
}
