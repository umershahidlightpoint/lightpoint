import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../shared/Models/response';
import { Journal } from 'src/shared/Models/journal';

@Injectable({
  providedIn: 'root'
})
export class JournalApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  /*
  Create a New Journal
  */
  createJounal(data) {
    const url = this.baseUrl + '/journal';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  /*
Get a Single Journal
*/
  getJournal(source) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.get<Response<Journal>>(url).pipe(map(response => response));
  }

  /*
Update a Journal
*/
  updateJournal(source, data) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.put(url, data).pipe(map((response: any) => response));
  }

  /*
Delete a Journal
*/
  deleteJournal(source) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.delete(url).pipe(map((response: any) => response));
  }

  /*
Get the Journals
*/
  getJournals(
    symbal: any,
    pageNumber: any | null | undefined,
    pageSize: any | null | undefined,
    accountId: any | null | undefined,
    valueFilter: any | null | undefined,
    sortColum: any | null | undefined,
    sortDirection: any | null | undefined
  ) {
    let url =
      this.baseUrl +
      '/journal/data/' +
      symbal +
      '/?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize +
      '&sortColum=' +
      sortColum +
      '&sortDirection=' +
      sortDirection;
    if (accountId != null) {
      url = url + '&accountId=' + accountId;
    }
    if (valueFilter != null) {
      url = url + '&value=' + valueFilter;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
Get the Journal Logs
*/
  getJournalLogs(
    symbal: any,
    pageNumber: any | null | undefined,
    pageSize: any | null | undefined,
    accountId: any | null | undefined,
    valueFilter: any | null | undefined,
    sortColum: any | null | undefined,
    sortDirection: any | null | undefined
  ) {
    let url =
      this.baseUrl +
      '/journallog/data/' +
      symbal +
      '/?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize +
      '&sortColum=' +
      sortColum +
      '&sortDirection=' +
      sortDirection;
    if (accountId != null) {
      url = url + '&accountId=' + accountId;
    }
    if (valueFilter != null) {
      url = url + '&value=' + valueFilter;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  getJournalSummary(payload: any): Observable<any> {
    const url = this.baseUrl + '/analysis/journal';
    return this.http.post(url, JSON.parse(payload)).pipe(map((response: any) => response));
  }

  getJournalDetails(payload: any): Observable<any> {
    const url = this.baseUrl + '/analysis/journalDetails';
    return this.http.post(url, payload).pipe(map((response: any) => response));
  }

  getServerSideJournals(obj) {
    const url = this.baseUrl + '/journal/serverSide';
    return this.http.post(url, obj).pipe(map((response: any) => response));
  }

  getServerSideJournalsTotal(obj) {
    const url = this.baseUrl + '/journal/totalCount';
    return this.http.post(url, obj).pipe(map((response: any) => response));
  }

  checkForJournals(toDate, fromDate) {
    const url = this.baseUrl + '/journal/doHaveJournals?to=' + toDate + '&from=' + fromDate;
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
