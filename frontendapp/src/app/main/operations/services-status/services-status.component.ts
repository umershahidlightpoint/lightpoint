import { Component, OnInit,  OnChanges,
  SimpleChanges } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ServicesStatusApiService } from '../../../../services/services-status-api.service';

@Component({
  selector: 'app-services-status',
  templateUrl: './services-status.component.html',
  styleUrls: ['./services-status.component.css']
})
export class ServicesStatusComponent implements OnInit {
  response: any;
  response2: any;

  show: Boolean = false;

  constructor(public servicesStatusApiService: ServicesStatusApiService) {}

  listOfServices: any[] = [
    {
      serviceName: 'Finance WebProxy',
      status: 'Running',
      running: true
    },
    {
      serviceName: 'ReferenceData WebProxy',
      status: 'Running',
      running: true
    }
  ];

  ngOnInit() {
    this.loadService();
  }

  loadService(){
  this.getServiceStatus().subscribe(data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].ok == false) {
        this.listOfServices[i].running = false;
        this.listOfServices[i].status = 'Stopped';
      } else {
        this.listOfServices[i].running = true;
        this.listOfServices[i].status = 'Running';
      }
    }
    this.show = true;
  });
  }

  getServiceStatus(): Observable<any[]> {
    this.show = false;
    this.response = this.servicesStatusApiService
      .getStatusFinance()
      .pipe(catchError(error => of(error)));
    this.response2 = this.servicesStatusApiService
      .getStatusRefData()
      .pipe(catchError(error => of(error)));

    return forkJoin([this.response, this.response2]);
  }
}
