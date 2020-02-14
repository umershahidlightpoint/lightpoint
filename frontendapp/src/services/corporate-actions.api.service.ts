import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CorporateActionsApiService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {

    this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
    // this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
  }

  createDividend(payload) {
    const url = this.baseUrl + '/corporateAction/cashDividend';
    return this.http.post(url, payload).pipe(map((response: any) => response));
  }

  updateDividend(payload) {
    const url = this.baseUrl + '/corporateAction/cashDividend';
    return this.http.put(url, payload).pipe(map((response: any) => response));
  }

  deleteDividend(id) {
    const obj = {
      Id: id
    };
    const url = this.baseUrl + '/corporateAction/deleteCashDividend';
    return this.http.put(url, obj).pipe(map((response: any) => response));
  }

  getDividends() {
    const url = this.baseUrl + '/corporateAction/cashDividend';
    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
}

getDividendDetails() {
  const url = this.baseUrl + '/corporateAction/cashDividendDetails';
  return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
}

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
}

}
