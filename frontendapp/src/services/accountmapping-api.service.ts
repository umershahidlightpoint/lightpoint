import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountmappingApiService {
  private baseUrl: string;

  private selectedAccounList = new BehaviorSubject(false);
  selectedAccounList$ = this.selectedAccounList.asObservable();

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  storeAccountList(obj: any) {
    this.selectedAccounList.next(obj);
  }

  getMappedAccounts(): Observable<any> {
    const url = this.baseUrl + '/account/mappedAccount';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  postAccountMapping(obj): Observable<any> {
    const url = this.baseUrl + '/account/chartOfAccountMapping';
    return this.http.post(url, obj).pipe(map((response: any) => response));
  }
}
