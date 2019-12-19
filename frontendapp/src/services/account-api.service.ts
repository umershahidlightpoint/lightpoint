import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  /*
  Get a Searched Account
  */
  getAccount(keyword: string | null | undefined) {
    const url = this.baseUrl + '/account/data/Search/?search=' + keyword;
    const params: any = {};
    if (keyword !== undefined) {
      params.keyword = keyword;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Accounts
  */
  getAccounts(keyword: string | null | undefined) {
    const url = this.baseUrl + '/accounts';
    const params: any = {};
    if (keyword !== undefined) {
      params.keyword = keyword;
    }

    return this.http.get(url, { params }).pipe(map((response: any) => response));
  }

  /*
  Get All Accounts
  */
  getAllAccounts() {
    const url = this.baseUrl + '/account';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Account Types
  */
  getAccountTypes(keyword: string) {
    const url = this.baseUrl + '/account_types';
    const params: any = {};
    if (keyword !== undefined) {
      params.keyword = keyword;
    }

    return this.http.get(url, { params }).pipe(map((response: any) => response));
  }

  /*
  Get the Account Tags
  */
  getAccountTags(id) {
    const url = this.baseUrl + '/account/' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Create an Account
  */
  createAccount(data) {
    const url = this.baseUrl + '/account';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  /*
  Edit an Account
  */
  editAccount(params) {
    const url = this.baseUrl + '/account/' + params.id;
    return this.http.put(url, params).pipe(map((response: any) => response));
  }

  /*
  Patch an Account
  */
  patchAccount(id, params) {
    const url = this.baseUrl + '/account/' + id;
    return this.http.patch(url, params).pipe(map((response: any) => response));
  }

  /*
  Delete an Account
  */
  deleteAccount(id) {
    const url = this.baseUrl + '/account/' + id;
    return this.http.delete(url).pipe(map((response: any) => response));
  }

  /*
  Get the Account Categories
  */
  accountCategories() {
    const url = this.baseUrl + '/account_category/';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Account Tags
  */
  accountTags() {
    const url = this.baseUrl + '/account_tag';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get an Account Type
  */
  accountTypes(id) {
    const url = this.baseUrl + '/account_type?accountCategoryId=' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }
}
