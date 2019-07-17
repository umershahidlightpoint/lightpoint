import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ledger-form',
  templateUrl: './ledger-form.component.html',
  styleUrls: ['./ledger-form.component.css'],
  animations: []
})
export class LedgerFormComponent implements OnInit {

  constructor(@Inject(Router) private router: Router ) { }

  ngOnInit() {
  }

  addAccount(){
    this.router.navigateByUrl('/accounts/create-account')
  }

  deleteAccount(){
    this.router.navigateByUrl('/accounts/delete-account')
  }

  viewAccount(){
    this.router.navigateByUrl('/accounts/view-account')
  }
}
