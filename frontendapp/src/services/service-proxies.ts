import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FinanceServiceProxy {
  private http: HttpClient;
  private baseUrl: string;
  private refDataUrl: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.baseUrl = window['config'].remoteServerUrl;
    this.refDataUrl = window['config'].referenceDataUrl;
  }

  /*
  Get the Customers
  */
  getCustomers(keyword: string | null | undefined) {
    const url = this.baseUrl + '/customers';
    const params: any = {};
    if (keyword !== undefined) {
      params.keyword = keyword;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Ledgers
  */
  getLedger(id: string, page: number, params: any = {}) {
    params.page = page;
    params.fund_id = id;
    const url = this.baseUrl + '/ledgers';
    return this.http.get(url, { params }).pipe(map((response: any) => response));
  }

  /*
  Get a Ledger
  */
  getLedgerById(id) {
    const url = this.baseUrl + '/ledgers/' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Funds
  */
  getFunds() {
    const url = encodeURI(this.refDataUrl + '/refdata/data?refdata=fund');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Portfolios
  */
  getPortfolios() {
    const url = encodeURI(this.refDataUrl + '/refdata/data?refdata=portfolio');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Set of Accruals
  */
  getAccruals() {
    const url = encodeURI(this.refDataUrl + '/accruals?period=ITD');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Allocations / AccrualId is Necessary as this is the Linkage between the Accrual and the Allocation / Trade
  */
  getAccrualAllocations(accrualId: string) {
    const url = encodeURI(this.refDataUrl + '/accruals/allocations?accrualid=' + accrualId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTrades() {
    const url = encodeURI(this.refDataUrl + '/trades?period=ITD&journal=false');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTrade(lpOrderId: any) {
    const url = encodeURI(this.refDataUrl + '/trades?period=' + lpOrderId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getOpsBlotterJournals() {
    const url = encodeURI(this.refDataUrl + '/trades?period=ITD&journal=true');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTradeAllocations(orderId: string) {
    const url = encodeURI(this.refDataUrl + '/trades/allocations?orderId=' + orderId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTradeJournals(orderId: string) {
    const url = encodeURI(this.refDataUrl + '/trades/journals?orderId=' + orderId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  uploadMonthlyPerformance(file: File): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  getMarketPriceForSymbol(symbol) {
    const url = this.baseUrl + '/marketdata/getSymbolPrices?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
