import { Component, OnInit } from '@angular/core';
import { ServicesStatusApiService } from '../../../../services/services-status-api.service';

@Component({
  selector: 'app-services-status',
  templateUrl: './services-status.component.html',
  styleUrls: ['./services-status.component.css']
})
export class ServicesStatusComponent implements OnInit {

  show: Boolean = false;

  constructor(public servicesStatusApiService: ServicesStatusApiService) {}

  listOfServices: any[];

  ngOnInit() {
    this.servicesStatusApiService.loadServices();
    this.servicesStatusApiService.servicesStatusArr$.subscribe(data => {
      this.show = true;
      this.listOfServices = data;
    });
  }

}
