import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lp-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  @Input() imgPath: string;
  @Input() route: string;
  @Input() btnText: 'GO TO HOMEPAGE';

  constructor(private router: Router) {}

  ngOnInit() {}

  redirect() {
    this.router.navigateByUrl(this.route);
  }
}
