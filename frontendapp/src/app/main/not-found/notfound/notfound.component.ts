import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  backgroundColor = '#0275d8';
  imgPath = './assets/images/logo.png';
  route = '/reports';
  btnText = 'GO TO REPORTS';
  btnTextColor = '#dbd8d0';
  btnBgColor = '#007bff';

  constructor() { }

  ngOnInit() {
  }

}
