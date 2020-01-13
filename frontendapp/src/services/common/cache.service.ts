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
}
