import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
        const url = encodeURI(this.baseUrl+'/refdata/data?refdata=fund');
        return this.http.get(url).pipe(map((response: any) => response));
    }

    createJounal(data){
        const url = this.baseUrl + '/journal';
        return this.http.post(url, data).pipe(map((response: any) => response));
    }

    getJournals(symbal : any,pageNumber : any| null | undefined, pageSize  : any| null | undefined,
        accountId : any| null | undefined,valueFilter : any| null | undefined, 
        sortColum : any| null | undefined,sortDirection: any| null | undefined) {
        //let searchStart : any;
        //searchStart = false;
        let url =   this.baseUrl+'/journal/data/'+symbal+'/?pageNumber='+pageNumber+'&pageSize='+pageSize+'&sortColum='+sortColum+'&sortDirection='+sortDirection ;
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
    
        return this.http.get(url).pipe(map((response: any) => response));
    }

    getJournalLogs(symbal : any,pageNumber : any| null | undefined, pageSize  : any| null | undefined,
        accountId : any| null | undefined,valueFilter : any| null | undefined, 
        sortColum : any| null | undefined,sortDirection: any| null | undefined) {
        //let searchStart : any;
        //searchStart = false;
        let url =   this.baseUrl+'/journallog/data/'+symbal+'/?pageNumber='+pageNumber+'&pageSize='+pageSize+'&sortColum='+sortColum+'&sortDirection='+sortDirection ;
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
        const url =  this.baseUrl+'/account/data/Search/?search='+keyword;
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
        const url =  this.baseUrl+'/account' ;
        return this.http.get(url,).pipe(map((response: any) => response));
    }

    getAccountTags(id) {
        const url =  this.baseUrl+'/account/'+id ;
        return this.http.get(url,).pipe(map((response: any) => response));
    }

    createAccount(data) {
        const url =  this.baseUrl+'/account' ;
        return this.http.post(url,data).pipe(map((response: any) => response));
    }

    editAccount(params) {
        const url =  this.baseUrl+'/account/'+params.id ;
        return this.http.put(url,params).pipe(map((response: any) => response));
    }

    patchAccount(id,params) {
        const url =  this.baseUrl+'/account/'+id ;
        return this.http.patch(url,params).pipe(map((response: any) => response));
    }

    deleteAccount(id) {
        const url =  this.baseUrl+'/account/'+id ;
        return this.http.delete(url).pipe(map((response: any) => response));
    }

    accountCategories() {
        const url =  this.baseUrl+'/account_category/' ;
        return this.http.get(url).pipe(map((response: any) => response));
    }

    accountTags(){
        //const url = this.baseUrl+'/account_def' ;
        const url = this.baseUrl+'/account_tag' ;
        return this.http.get(url).pipe(map((response: any) => response));
    }

    accountTypes(id){
        const url = this.baseUrl+'/account_type?accountCategoryId='+id ;
        return this.http.get(url).pipe(map((response: any) => response));
    }

    SaveDataGridState(data) {
        const url =  this.baseUrl+'/DataGrid' ;
        return this.http.post(url,data).pipe(map((response: any) => response));
    }

    getDataGridStatus(id) {
        const url =  this.baseUrl+'/DataGrid/'+id ;
        return this.http.get(url,).pipe(map((response: any) => response));
    }

    getGridLayouts(gridId, userid) {
        const url = encodeURI(this.baseUrl+'/DataGrid/GetDataGridLayouts?gridId='+gridId+'&userId='+userid );
        return this.http.get(url).pipe(map((response: any) => response));
    }

    GetAGridLayout(id) {
        const url =  this.baseUrl+'/DataGrid/GetAGridLayout?id='+id ;
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