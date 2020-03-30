import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FundTheoreticalApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }
  /*
  Monthly Performance
  */
  getMonthlyPerformance(): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.get(url);
  }

  calMonthlyPerformance(data): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.post(url, data);
  }

  commitMonthlyPerformance(data): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.put(url, data);
  }

  monthlyPerformanceAudit(id): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformanceAudit?id=' + id;
    return this.http.get(url);
  }

  getMonthlyPerformanceStatus(): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance/status';
    return this.http.get(url);
  }

  /*
  Tax Rate
  */
  getTaxRates(): Observable<any> {
    const url = this.baseUrl + '/taxRate';
    return this.http.get(url);
  }

  createTaxRate(data) {
    const url = this.baseUrl + '/taxRate';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  editTaxRate(id, data) {
    const url = this.baseUrl + '/taxRate/' + id;
    return this.http.put(url, data).pipe(map((response: any) => response));
  }

  deleteTaxRate(id) {
    const url = this.baseUrl + '/taxRate/' + id;
    return this.http.delete(url).pipe(map((response: any) => response));
  }

  /*
  Market Price
  */
  getMarketPriceData(): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.get(url);
  }

  editMarketPriceData(data): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.put(url, data);
  }

  getMarketPriceAudit(id): Observable<any> {
    const url = this.baseUrl + '/marketdata/audit?id=' + id;
    return this.http.get(url);
  }

  uploadMarketPriceData(file: File): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  /* 
  Daily PnL
  */
  getDailyUnofficialPnL(from, to): Observable<any> {
    const url = this.baseUrl + '/calculation/dailyUnofficialPnl?from=' + from + '&to=' + to;
    return this.http.get(url);
  }

  uploadDailyUnofficialPnl(file: File): Observable<any> {
    const url = this.baseUrl + '/calculation/dailyUnofficialPnlAudit/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  /*
  Fx Rate
  */
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

  uploadTradeData(file: File): Observable<any> {
    const url = this.baseUrl + '/fileManagement/uploadTrade';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  uploadJournalData(file: File): Observable<any> {
    const url = this.baseUrl + '/fileManagement/uploadJournal';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  commitJournalData(data): Observable<any> {
    const url = this.baseUrl + '/fileManagement/commitJournal';
    return this.http.post(url, data);
  }

  commitTradeData(data): Observable<any> {
    const url = this.baseUrl + '/fileManagement/commitTrade';
    return this.http.post(url, data);
  }
}
