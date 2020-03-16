import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
    // this.refDataUrl = 'http://localhost:4000/refdata';
  }

  getReportingCurrencies(): Observable<any> {
    const url = this.baseUrl + '/setting/currency';
    return this.http.get(url);
  }

  getSettings(): Observable<any> {
    const url = this.baseUrl + '/setting';
    return this.http.get(url);
  }

  createSettings(obj): Observable<any> {
    const url = this.baseUrl + '/setting';
    return this.http.post(url, obj).pipe(map((response: any) => response));
  }

  saveSettings(obj): Observable<any> {
    const url = this.baseUrl + '/setting';
    return this.http.put(url, obj).pipe(map((response: any) => response));
  }
}
