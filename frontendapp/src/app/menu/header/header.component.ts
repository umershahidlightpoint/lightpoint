import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import * as moment from "moment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  date: string = moment().format("MM-DD-YYYY");

  constructor() {}

  ngOnInit() {}
}
