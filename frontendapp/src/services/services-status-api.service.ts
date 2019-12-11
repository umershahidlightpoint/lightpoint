import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesStatusApiService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
    this.refDataUrl = window['config'].referenceDataUrl;
  }

  getStatusFinance() {
    const url = this.baseUrl + '/ping';
    return this.http.get(url);
  }

  getStatusRefData() {
    const url = this.refDataUrl + '/ping';
    return this.http.get(url);
  }
}
