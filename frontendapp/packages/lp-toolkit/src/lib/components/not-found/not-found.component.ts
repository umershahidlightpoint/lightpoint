import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lp-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  @Input() imgPath: string;
  @Input() route: string;
  @Input() btnText: string;
  @Input() btnTextColor: string;
  @Input() btnBgColor: string;
  @Input() backgroundColor: string;

  constructor(private router: Router) { }

  ngOnInit() {}

  redirect() {
    this.router.navigateByUrl(this.route);
  }

}
