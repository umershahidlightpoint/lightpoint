import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesStatusApiService {
  private baseUrl: string;
  private refDataUrl: string;

  resFinance: any;
  resRefData: any;

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

  private servicesStatus = new BehaviorSubject(false);
  servicesStatusBool$ = this.servicesStatus.asObservable();

  private servicesArr = new BehaviorSubject(null);
  servicesStatusArr$ = this.servicesArr.asObservable();

  constructor(private http: HttpClient) {
    // this.baseUrl = window['config'].remoteServerUrl;
    // this.refDataUrl = window['config'].referenceDataUrl;
    this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
    this.refDataUrl = window['config'] ? window['config'].referenceDataUrl : environment.testCaseReferenceDataUrl;
  }

  getStatusFinance() {
    const url = this.baseUrl + '/ping';
    return this.http.get(url);
  }

  getStatusRefData() {
    const url = this.refDataUrl + '/ping';
    return this.http.get(url);
  }

  setServicesStatus(obj: any) {
    this.servicesStatus.next(obj);
  }

  storeServicesArr(obj: any) {
    this.servicesArr.next(obj);
  }

  loadServices(): any {
    this.getServiceStatus().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].ok === false) {
          this.listOfServices[i].running = false;
          this.listOfServices[i].status = 'Stopped';
        } else {
          this.listOfServices[i].running = true;
          this.listOfServices[i].status = 'Running';
        }
      }
      this.storeServicesArr(this.listOfServices);
      this.setServicesStatus(this.getStatus());
    });
  }

  getStatus() {
    const status = this.listOfServices.find(item => item.running === false);
    return status === undefined ? true : false;
  }

  getServiceStatus(): Observable<any> {
    this.resFinance = this.getStatusFinance().pipe(
      catchError(error => of(error))
    );
    this.resRefData = this.getStatusRefData().pipe(
      catchError(error => of(error))
    );

    return forkJoin([this.resFinance, this.resRefData]);
  }
}