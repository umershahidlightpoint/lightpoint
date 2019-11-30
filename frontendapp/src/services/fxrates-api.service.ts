import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FxratesApiService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
    this.refDataUrl = window['config'].referenceDataUrl;
  }

  getFxRatesData(): Observable<any> {
    const url = this.baseUrl + '/fxRates/fxRate';
    return this.http.get(url);
  }

  GetAuditTrail(id): Observable<any> {
    const url = this.baseUrl + '/fxRates/audit?id=' + id;
    return this.http.get(url);
  }

  editFxRatePriceData(data): Observable<any> {
    const url = this.baseUrl + '/fxRates/fxRate';
    return this.http.put(url, data);
  }

  uploadFxData(file: File): Observable<any> {
    const url = this.baseUrl + '/fxRates/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }
}
