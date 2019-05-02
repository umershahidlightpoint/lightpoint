import { map, filter, switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';


export const API_BASE_URL = environment.remoteServerUrl;

@Injectable()
export class FinancePocServiceProxy {
    private http: HttpClient;
    private baseUrl: string;

    constructor(http: HttpClient) {
        this.http = http;
        this.baseUrl = API_BASE_URL
    }

    getLedger(id: string, page: number) {
        let url_ = this.baseUrl + "/ledger?fund={id}&page=" + page;
        url_ = url_.replace('{id}', id);

        let options_: any = {
            observe: "response",
            responseType: "json",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.get(url_).pipe(map((response: any) => response));

    }

    getFunds() {
        let url_ = this.baseUrl + "/funds";

        let options_: any = {
            observe: "response",
            responseType: "json",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.get(url_).pipe(map((response: any) => response));

    }



}

export class ProductRatingInput {
    rating: number | undefined
    productId: number | undefined
}
