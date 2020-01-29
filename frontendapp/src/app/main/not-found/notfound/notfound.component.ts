import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  imgPath = './assets/images/logo.png';
  route = '/reports';
  btnText = 'GO TO REPORTS';

  constructor() {}

  ngOnInit() {}
}
