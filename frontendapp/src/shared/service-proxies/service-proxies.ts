import { map, filter, switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

export const API_BASE_URL = environment.remoteServerUrl;

@Injectable()
export class FinancePocServiceProxy {
    private http: HttpClient;
    private baseUrl: string;

    constructor(http: HttpClient) {
        this.http = http;
        this.baseUrl = API_BASE_URL
    }

    getLedger(id: string, page: number, customer_id: number | undefined, account_id: number | undefined) {

        let url_ = this.baseUrl + "/ledgers?fund_id={id}&page=" + page + "&";

        url_ = url_.replace('{id}', id);
        if (customer_id !== undefined) {
            url_ += "customer_id=" + encodeURIComponent("" + customer_id) + "&";
        }
        if (account_id !== undefined) {
            url_ += "account_id=" + encodeURIComponent("" + account_id);
        }
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
    getAccounts(searchTerm: string | null | undefined) {
        let url_ = this.baseUrl + "/accounts?keyword=";
        if (searchTerm !== undefined)
            url_ += encodeURIComponent(searchTerm)


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
    getCustomers(searchTerm: string | null | undefined) {
        let url_ = this.baseUrl + "/customers?keyword=";
        if (searchTerm !== undefined)
            url_ += encodeURIComponent(searchTerm)


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

    createLedger(data: LedgerInput) {
        let url_ = this.baseUrl + "/ledgers";
        const content_ = JSON.stringify(data);
        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "json",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };
        return this.http.post(url_, content_, options_).pipe(map((response: any) => response));

    }
    updateLedger(ledgerId: number | undefined, data: LedgerInput) {
        let url_ = this.baseUrl + "/ledgers/{ledgerId}";
        const content_ = JSON.stringify(data);
        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "json",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };
        return this.http.post(url_, content_, options_).pipe(map((response: any) => response));
    }
    getLedgerById(id) {
        let url_ = this.baseUrl + "/ledgers/";
        if (id !== undefined)
            url_ += encodeURIComponent(id)


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

export class LedgerInput {
    value: number | undefined
    customer_id: string | undefined
    account_id: string | undefined
    fund_id: string | undefined
    effectiveDate: any | undefined;
}
