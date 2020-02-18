import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private baseUrl: string;
  private metaData: any;
  private dummyAccount: any;
  private userConfig: any;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  getServerSideJournalsMeta(obj): Observable<any> {
    const url = this.baseUrl + '/journal/metaData';

    if (this.metaData) {
      return of(this.metaData);
    }

    return this.http.post(url, obj).pipe(
      map((response: any) => response),
      tap(data => (this.metaData = data))
    );
  }

  getDummyAccount(): Observable<any> {
    const url = this.baseUrl + '/account/dummy';

    if (this.dummyAccount) {
      return of(this.dummyAccount);
    }

    return this.http.get(url).pipe(
      map((response: any) => response),
      tap(data => (this.metaData = data))
    );
  }

  getUserConfig(project): Observable<any> {
    const url = this.baseUrl + '/configuration?project=' + project;

    if (this.userConfig) {
      return of(this.userConfig);
    }

    return this.http.get(url).pipe(
      map((response: any) => response),
      tap(data => (this.userConfig = data))
    );
  }

  addUserConfig(configs){
    const url = this.baseUrl + '/configuration';
    return this.http.post(url,configs).pipe(map((response: any) => response));
  }

  updateUserConfig(configs){
    const url = this.baseUrl + '/configuration';
    return this.http.put(url,configs).pipe(map((response: any) => response));
  }

  getConfigBasedOnKey(key){
    if(this.userConfig){
      return this.userConfig.filter(x => x.key === key);
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
