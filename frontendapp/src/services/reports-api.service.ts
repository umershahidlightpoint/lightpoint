import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config']
      ? window['config'].remoteServerUrl
      : environment.testCaseRemoteServerUrl;
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

  getFundAdminReconReport(date, fund) {
    const url = this.baseUrl + '/journal/recon?source=fundadmin&date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Report
  */
  getCostBasisReport(date, symbol, fund) {
    const url =
      this.baseUrl +
      '/journal/costbasisReport?date=' +
      date +
      '&symbol=' +
      symbol +
      '&fund=' +
      fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Chart
  */
  getCostBasisChart(symbol) {
    const url = this.baseUrl + '/journal/costbasisChart?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTaxLotReport(fromDate, toDate, symbol, fund, side) {
    const url =
      this.baseUrl +
      '/journal/taxlotReport?from=' +
      fromDate +
      '&to=' +
      toDate +
      '&symbol=' +
      symbol +
      '&fund=' +
      fund +
      '&side=' +
      side;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getClosingTaxLots(lporderid, fromDate, toDate) {
    const url = this.baseUrl + '/journal/closingTaxLots?orderid=' + lporderid + '&to=' + toDate;
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

  getPeriodJournals(symbol, now, period) {
    const url =
      this.baseUrl +
      '/journal/periodJournals?symbol=' +
      symbol +
      '&now=' +
      now +
      '&period=' +
      period;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getValidDates(column, source) {
    const url = this.baseUrl + '/journal/validDates?columnName=' + column + '&source=' + source;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getPositionMarketValueAppraisalReport(date) {
    const url = this.baseUrl + '/journal/marketValueAppraisalReport?date=' + date;
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
