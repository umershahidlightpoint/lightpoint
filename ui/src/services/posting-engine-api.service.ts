import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PostingEngine,
  PostingEngineStatus,
  IsPostingEngineRunning
} from 'src/shared/Models/posting-engine';

@Injectable({
  providedIn: 'root'
})
export class PostingEngineApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // this.baseUrl = window['config'].remoteServerUrl;
    this.baseUrl = window['config'] ? window['config'].remoteServerUrl : environment.testCaseRemoteServerUrl;
    // this.refDataUrl = 'http://localhost:4000/refdata';
  }
  /*
  Start the Posting Engine
  */
  startPostingEngine(period: any): Observable<PostingEngine> {
    const url = this.baseUrl + '/postingEngine?period=' + period;
    return this.http.get<PostingEngine>(url).pipe(map((response: PostingEngine) => response));
  }

  /*
  Start Posting Engine with a single Order
  */
  startPostingEngineSingleOrder(orderId: any): Observable<PostingEngine> {
    const url = this.baseUrl + '/postingEngine/order?orderId=' + orderId;
    return this.http.get<PostingEngine>(url).pipe(map((response: PostingEngine) => response));
  }

  /*
  Get the Posting Engine Status
  */
  runningEngineStatus(key): Observable<PostingEngineStatus> {
    const url = this.baseUrl + '/PostingEngine/status/' + key;
    return this.http
      .get<PostingEngineStatus>(url)
      .pipe(map((response: PostingEngineStatus) => response));
  }

  /*
  Get the Posting Engine Progress
  */
  isPostingEngineRunning(): Observable<IsPostingEngineRunning> {
    const url = this.baseUrl + '/PostingEngine/progress';
    return this.http
      .get<IsPostingEngineRunning>(url)
      .pipe(map((response: IsPostingEngineRunning) => response));
  }

  /*
  Clear All the Journals
  */
  clearJournals(type) {
    const url = this.baseUrl + '/postingEngine?type=' + type;
    return this.http.delete(url).pipe(map((response: any) => response));
  }
}
