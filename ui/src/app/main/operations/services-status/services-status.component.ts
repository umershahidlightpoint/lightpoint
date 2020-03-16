import { Component, OnInit } from '@angular/core';
import { ServicesStatusApiService } from '../../../../services/services-status-api.service';

@Component({
  selector: 'app-services-status',
  templateUrl: './services-status.component.html',
  styleUrls: ['./services-status.component.scss']
})
export class ServicesStatusComponent implements OnInit {
  show = false;

  constructor(public servicesStatusApiService: ServicesStatusApiService) {}

  listOfServices: any[];

  ngOnInit() {
    this.servicesStatusApiService.loadServices();
    this.servicesStatusApiService.servicesStatusArr$.subscribe(data => {
      this.listOfServices = data;
      this.show = true;
    });
  }

  loadService() {
    this.show = false;
    this.servicesStatusApiService.loadServices();
  }
}
