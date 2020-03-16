import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Response } from 'src/shared/Models/response';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private baseUrl: string;
  private metaData: any;
  private dummyAccount: any;
  private userConfig: any;

  constructor(private http: HttpClient) {
    // tslint:disable-next-line: no-string-literal
    this.baseUrl = window['config'].remoteServerUrl;
  }

  getServerSideJournalsMeta(obj): Observable<any> {
    const url = this.baseUrl + '/journal/metaData';

    if (this.metaData) {
      return of(this.metaData);
    }

    return this.http.post(url, obj).pipe(
      map((response: any) => response),
      tap(response => (this.metaData = response))
    );
  }

  getDummyAccount(): Observable<any> {
    const url = this.baseUrl + '/account/dummy';

    if (this.dummyAccount) {
      return of(this.dummyAccount);
    }

    return this.http.get(url).pipe(
      map((response: any) => response),
      tap(response => (this.metaData = response))
    );
  }

  getUserConfig(project: string): Observable<any> {
    const url = this.baseUrl + '/configuration?project=' + project;

    if (this.userConfig) {
      return of(this.userConfig);
    }

    return this.http.get<Response<any>>(url).pipe(
      map((response: Response<any>) => response),
      tap((response: Response<any>) => (this.userConfig = response.payload))
    );
  }

  addUserConfig(configs) {
    const url = this.baseUrl + '/configuration';

    return this.http.post<Response<any>>(url, configs).pipe(
      map((response: Response<any>) => response),
      tap((response: Response<any>) => {
        if (response.isSuccessful) {
          this.userConfig.push(configs);
        }
      })
    );
  }

  updateUserConfig(configs) {
    const url = this.baseUrl + '/configuration';
    return this.http.put<Response<any>>(url, configs).pipe(
      map((response: Response<any>) => response),
      tap((response: Response<any>) => {
        if (response.isSuccessful) {
          this.userConfig[
            this.userConfig.findIndex(element => element.id === configs.id)
          ] = configs;
        }
      })
    );
  }

  getConfigByKey(key: string) {
    if (this.userConfig) {
      return this.userConfig.find(item => item.key === key);
    } else {
      return null;
    }
  }

  purgeServerSideJournalsMeta(): void {
    this.metaData = null;
  }

  purgeDummyAccount(): void {
    this.dummyAccount = null;
  }
}
