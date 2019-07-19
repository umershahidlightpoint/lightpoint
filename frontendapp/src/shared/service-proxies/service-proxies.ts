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

    getLedger(id: string, page: number, params: any = {}) {
        params.page = page;
        params.fund_id = id;
        const url = this.baseUrl + '/ledgers';
        return this.http.get(url, { params }).pipe(map((response: any) => response));
    }

    getFunds() {
        const url = encodeURI('http://localhost:9092/api/refdata/data?refdata=fund');
        return this.http.get(url).pipe(map((response: any) => response));
    }

    getJournals(symbal : any,pageNumber : any| null | undefined, pageSize  : any| null | undefined,
        accountId : any| null | undefined,valueFilter : any| null | undefined, 
        sortColum : any| null | undefined,sortDirection: any| null | undefined) {
        //let searchStart : any;
        //searchStart = false;
        let url =   'http://localhost:9092/api/journal/data/'+symbal+'/?pageNumber='+pageNumber+'&pageSize='+pageSize+'&sortColum='+sortColum+'&sortDirection='+sortDirection ;
        if (accountId != null)
        {  
            url = url +'&accountId='+accountId;
            //searchStart= true;
        }
        if (valueFilter != null)
        {  
            url = url +'&value='+valueFilter;
            //if (searchStart){ url = url +'&value='+valueFilter;}else{ url = url +'/?value='+valueFilter;}
        }
    
        return this.http.get(url ).pipe(map((response: any) => response));
    }

    getJournalLogs(symbal : any,pageNumber : any| null | undefined, pageSize  : any| null | undefined,
        accountId : any| null | undefined,valueFilter : any| null | undefined, 
        sortColum : any| null | undefined,sortDirection: any| null | undefined) {
        //let searchStart : any;
        //searchStart = false;
        let url =   'http://localhost:9092/api/journallog/data/'+symbal+'/?pageNumber='+pageNumber+'&pageSize='+pageSize+'&sortColum='+sortColum+'&sortDirection='+sortDirection ;
        if (accountId != null)
        {  
            url = url +'&accountId='+accountId;
            //searchStart= true;
        }
        if (valueFilter != null)
        {  
            url = url +'&value='+valueFilter;
            //if (searchStart){ url = url +'&value='+valueFilter;}else{ url = url +'/?value='+valueFilter;}
        }
    
        return this.http.get(url ).pipe(map((response: any) => response));
    }


    groupByCustomer(id) {
        const url = this.baseUrl + '/ledgers/group';
        const params: any = {};
        params.fund_id = id;
        params.group_by = 'customer';
        return this.http.get(url, { params }).pipe(map((response: any) => response));
    }

    getAccount(keyword: string | null | undefined) {
        const url =  'http://localhost:9092/api/account/data/Search/?search='+keyword;
        const params: any = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
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
        return this.http.post(url, data).pipe(map((response: any) => response));

    }
    updateLedger(ledgerId: any | undefined, data: LedgerInput) {
        const url = this.baseUrl + '/ledgers/' + ledgerId;
        return this.http.put(url, data).pipe(map((response: any) => response));
    }

    getLedgerById(id) {
        const url = this.baseUrl + '/ledgers/' + id;
        return this.http.get(url).pipe(map((response: any) => response));
    }

    getAccountTypes(keyword: string) {
        const url = this.baseUrl + '/account_types';
        const params: any = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url, { params }).pipe(map((response: any) => response));
    }

    getAllAccounts() {
        const url =  'http://localhost:9092/api/account' ;
        return this.http.get(url,).pipe(map((response: any) => response));
    }

}

export class LedgerInput {
    value: number | undefined
    customer_id: string | undefined
    account_id: string | undefined
    fund_id: string | undefined
    effectiveDate: any | undefined;
}
