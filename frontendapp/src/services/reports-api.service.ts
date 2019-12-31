import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  /*
  Get Trial Balance Report
  */
  getTrialBalanceReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl +
      '/journal/trialBalanceReport?from=' +
      fromDate +
      '&to=' +
      toDate +
      '&fund=' +
      fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getReconReport(date, fund) {
    const url = this.baseUrl + '/journal/recon?source=daypnl&date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getBookmonReconReport(date, fund) {
    const url = this.baseUrl + '/journal/recon?source=exposure&date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Report
  */
  getCostBasisReport(date, fund) {
    const url = this.baseUrl + '/journal/costbasisReport?date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Chart
  */
  getCostBasisChart(symbol) {
    const url = this.baseUrl + '/journal/costbasisChart?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTaxLotReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl + '/journal/taxlotReport?from=' + fromDate + '&to=' + toDate + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getClosingTaxLots(lporderid) {
    const url = this.baseUrl + '/journal/closingTaxLots?orderid=' + lporderid;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTaxLotsReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl + '/journal/taxlotsReport?from=' + fromDate + '&to=' + toDate + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getLatestJournalDate() {
    const url = this.baseUrl + '/journal/lastPostedDate';
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
