import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export const API_BASE_URL = environment.remoteServerUrl;
export const REF_DATA_BASE_URL = environment.referenceDataUrl;

@Injectable({
  providedIn: 'root'
})
export class FxratesApiService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = API_BASE_URL;
    this.refDataUrl = REF_DATA_BASE_URL;
  }

  getMarketPriceData(): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.get(url);
  }

  getMarketPriceAudit(id): Observable<any> {
    const url = this.baseUrl + '/marketdata/audit?id=' + id;
    return this.http.get(url);
  }

  editMarketPriceData(data): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.put(url, data);
  }

  uploadMarketPriceData(file: File): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }
}
