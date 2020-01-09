import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  // /*
  // TaxLots Maintenance Tab Services
  // */

  getTaxLotReport(fromDate, toDate, symbol, fund) {
    const url =
      this.baseUrl + '/journal/taxlotReport?from=' + fromDate + '&to=' + toDate + '&symbol=' + symbol + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getLatestJournalDate() {
    const url = this.baseUrl + '/journal/lastPostedDate';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getAllClosingTaxLots() {
    const url = this.baseUrl + '/journal/allClosingTaxLots';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  taxLotReversal(obj) {
    const url = this.baseUrl + 'api/taxLotMaintenance/reverseTaxLotAlleviation';
    return this.http.put(url,obj).pipe(map((response: any) => response));
  }

  getProspectiveTradesToAlleviateTaxLot(symbol: string, side: string) {
    const url = this.baseUrl + 'api/taxLotMaintenance/taxlotsReport?symbol=' + symbol + '&side=' + side;
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
