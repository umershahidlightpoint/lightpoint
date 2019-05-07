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
        this.baseUrl = API_BASE_URL;
    }

    getLedger(id: string, page: number, customer_id: number | undefined, account_id: number | undefined) {
        const params: any = {};
        params.page = page;
        params.fund_id = id;
        const url = this.baseUrl + '/ledgers';
        if (customer_id !== undefined) {
            params.customer_id = customer_id;
        }
        if (account_id !== undefined) {
            params.account_id = account_id;
        }
        return this.http.get(url, { params }).pipe(map((response: any) => response));
    }
    groupByCustomer(id) {
        debugger
        let url_ = this.baseUrl + "/ledgers/group?fund_id={id}&group_by=customer";
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
        const url = this.baseUrl + '/funds';
        return this.http.get(url).pipe(map((response: any) => response));

    }
    getAccounts(keyword: string | null | undefined) {
        const url = this.baseUrl + '/accounts';
        const params: any = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url, { params }).pipe(map((response: any) => response));
    }

    getCustomers(keyword: string | null | undefined) {
        const url = this.baseUrl + '/customers';
        const params: any = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url).pipe(map((response: any) => response));
    }

    createLedger(data: LedgerInput) {
        const url = this.baseUrl + '/ledgers';
        return this.http.post(url, { params: data }).pipe(map((response: any) => response));

    }
    updateLedger(ledgerId: any | undefined, data: LedgerInput) {
        const url = this.baseUrl + '/ledgers/' + ledgerId;
        return this.http.put(url, { params: data }).pipe(map((response: any) => response));
    }

    getLedgerById(id) {
        const url = this.baseUrl + '/ledgers/' + id;
        return this.http.get(url).pipe(map((response: any) => response));
    }

}

export class LedgerInput {
    value: number | undefined
    customer_id: string | undefined
    account_id: string | undefined
    fund_id: string | undefined
    effectiveDate: any | undefined;
}
