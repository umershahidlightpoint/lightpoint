import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Response } from 'src/shared/Models/response';

@Injectable({
  providedIn: 'root'
})
export class AssetServicesService {
  private baseUrl: string;
  private refDataUrl: string;

  constructor(private http: HttpClient) {
    // tslint:disable-next-line: no-string-literal
    this.baseUrl = window['config']
      ? // tslint:disable-next-line: no-string-literal
        window['config'].remoteServerUrl
      : environment.testCaseRemoteServerUrl;
    // tslint:disable-next-line: no-string-literal
    this.refDataUrl = window['config']
      ? // tslint:disable-next-line: no-string-literal
        window['config'].referenceDataUrl
      : environment.testCaseReferenceDataUrl;

      let root = window.document.location.origin;

      if ( !this.refDataUrl.startsWith("http"))
        this.refDataUrl = root + this.refDataUrl;

      debugger
  }

  /*
  Options Service EndPoints
  */
  getOptions(date: any): Observable<Response<any>> {
    const url = this.baseUrl + `/assetServicing/options?date=${date}`;

    return this.http.get<Response<any>>(url).pipe(map((response: Response<any>) => response));
  }
}
