import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, timer, Subject, forkJoin, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityApiService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {

    this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
    this.refDataUrl = window['config'] ? window['config'].referenceDataUrl : environment.testCaseReferenceDataUrl;

  }

  // Security

  createSecurity(payload) {
    const url = this.baseUrl + '/security/details';
    return this.http.post(url, payload).pipe(map((response: any) => response));
  }

  getSecurityConfig(symbol) { // For get fields related to symbol
    const url = this.baseUrl + '/security/config?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
  }

  getSecurityDetail(symbol) { // Get detail for single security
    const url = this.baseUrl + '/security/detail?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
  }

  getSecurityDetails() { // For get all securites
    const url = this.baseUrl + '/security/details';

    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
  }

  updateSecurity(payload) { // for single updation security detail
    const url = this.baseUrl + '/security/details';
    return this.http.put(url, payload).pipe(map((response: any) => response));
  }

  deleteSecurity(id) {
    const obj = {
      Id: id
    };
    const url = this.baseUrl + '/security/deleteSecurityDetail';
    return this.http.put(url, obj).pipe(map((response: any) => response));
  }

  getSecurityTypes() { // For get multiple securityTypes eg common stock, journal etc
    const url = this.baseUrl + '/security/securityType';

    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
  }

  getSecurityType(securityType) { // For get single securityType
    const url = this.baseUrl + '/security/configuration?securityType=' + securityType;

    return this.http.get(url).pipe(map((response: any) => response), retry(1), catchError(this.handleError));
  }

  getDataForSecurityModal(symbol) {
    const config = this.getSecurityConfig(symbol);
    const securityDetails = this.getSecurityDetail(symbol);
    // const getSecurityTypes = this.getSecurityTypes();
    return forkJoin([
      config,
      securityDetails,
      // getSecurityTypes
    ]);
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
    return throwError(errorMessage);
}

}
