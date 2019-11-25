import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PostingEngine,
  PostingEngineStatus,
  IsPostingEngineRunning
} from '../Models/posting-engine';
import { ToastrService } from 'ngx-toastr';

export const API_BASE_URL = environment.remoteServerUrl;
export const REF_DATA_BASE_URL = environment.referenceDataUrl;

@Injectable()
export class FinanceServiceProxy {
  private http: HttpClient;
  private baseUrl: string;
  private refDataUrl: string;

  constructor(http: HttpClient, private injector: Injector, private toastrService: ToastrService) {
    this.http = http;
    this.baseUrl = API_BASE_URL;
    this.refDataUrl = REF_DATA_BASE_URL;
  }

  /*
  Get the Customers
  */
  getCustomers(keyword: string | null | undefined) {
    const url = this.baseUrl + '/customers';
    const params: any = {};
    if (keyword !== undefined) {
      params.keyword = keyword;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Ledgers
  */
  getLedger(id: string, page: number, params: any = {}) {
    params.page = page;
    params.fund_id = id;
    const url = this.baseUrl + '/ledgers';
    return this.http.get(url, { params }).pipe(map((response: any) => response));
  }

  /*
  Get the Funds
  */
  getFunds() {
    const url = encodeURI(this.refDataUrl + '/refdata/data?refdata=fund');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Portfolios
  */
  getPortfolios() {
    const url = encodeURI(this.refDataUrl + '/refdata/data?refdata=portfolio');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Set of Accruals
  */
  getAccruals() {
    const url = encodeURI(this.refDataUrl + '/accruals?period=ITD');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Allocations / AccrualId is Necessary as this is the Linkage between the Accrual and the Allocation / Trade
  */
  getAccrualAllocations(accrualId: string) {
    const url = encodeURI(this.refDataUrl + '/accruals/allocations?accrualid=' + accrualId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTrades() {
    const url = encodeURI(this.refDataUrl + '/trades?period=ITD&journal=false');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getOpsBlotterJournals() {
    const url = encodeURI(this.refDataUrl + '/trades?period=ITD&journal=true');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTradeAllocations(orderId: string) {
    const url = encodeURI(this.refDataUrl + '/trades/allocations?orderId=' + orderId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTradeJournals(orderId: string) {
    const url = encodeURI(this.refDataUrl + '/trades/journals?orderId=' + orderId);
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Create a New Journal
  */
  createJounal(data) {
    const url = this.baseUrl + '/journal';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  /*
  Get a Single Journal
  */
  getJournal(source) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Update a Journal
  */
  updateJournal(source, data) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.put(url, data).pipe(map((response: any) => response));
  }

  /*
  Delete a Journal
  */
  deleteJournal(source) {
    const url = this.baseUrl + '/journal/' + source;
    return this.http.delete(url).pipe(map((response: any) => response));
  }

  /*
  Get the Journals
  */
  getJournals(
    symbal: any,
    pageNumber: any | null | undefined,
    pageSize: any | null | undefined,
    accountId: any | null | undefined,
    valueFilter: any | null | undefined,
    sortColum: any | null | undefined,
    sortDirection: any | null | undefined
  ) {
    let url =
      this.baseUrl +
      '/journal/data/' +
      symbal +
      '/?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize +
      '&sortColum=' +
      sortColum +
      '&sortDirection=' +
      sortDirection;
    if (accountId != null) {
      url = url + '&accountId=' + accountId;
    }
    if (valueFilter != null) {
      url = url + '&value=' + valueFilter;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get the Journal Logs
  */
  getJournalLogs(
    symbal: any,
    pageNumber: any | null | undefined,
    pageSize: any | null | undefined,
    accountId: any | null | undefined,
    valueFilter: any | null | undefined,
    sortColum: any | null | undefined,
    sortDirection: any | null | undefined
  ) {
    let url =
      this.baseUrl +
      '/journallog/data/' +
      symbal +
      '/?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize +
      '&sortColum=' +
      sortColum +
      '&sortDirection=' +
      sortDirection;
    if (accountId != null) {
      url = url + '&accountId=' + accountId;
    }
    if (valueFilter != null) {
      url = url + '&value=' + valueFilter;
    }

    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get a Ledger
  */
  getLedgerById(id) {
    const url = this.baseUrl + '/ledgers/' + id;
    return this.http.get(url).pipe(map((response: any) => response));
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

  /*
  Save Grid Layout State
  */
  saveDataGridState(data) {
    const url = this.baseUrl + '/DataGrid';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  /*
  Get Grid Layout Status
  */
  getDataGridStatus(id) {
    const url = this.baseUrl + '/DataGrid/' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Grid Layouts
  */
  getAllGridLayouts() {
    const url = encodeURI(this.baseUrl + '/DataGrid/GetGridLayouts');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Layouts of Grid 
  */
  getGridLayouts(gridId, userId) {
    const url = encodeURI(
      this.baseUrl + '/DataGrid/GetDataGridLayouts?gridId=' + gridId + '&userId=' + userId
    );
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get a Grid Layout
  */
  GetAGridLayout(id) {
    const url = this.baseUrl + '/DataGrid/GetAGridLayout?id=' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Delete a Grid Layout
  */
  deleteGridLayout(id) {
    const url = this.baseUrl + '/DataGrid/' + id;
    return this.http.delete(url).pipe(map((response: any) => response));
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

  /*
  Get Trial Balance Report
  */
  getTrialBalanceReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl +
      '/journal/trialBalanceReport?from=' +
      fromDate +
      '&to=' +
      toDate +
      '&fund=' +
      fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getReconReport(date, fund) {
    const url = this.baseUrl + '/journal/recon?date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Report
  */
  getCostBasisReport(date, fund) {
    const url = this.baseUrl + '/journal/costbasisReport?date=' + date + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get Cost Basis Chart
  */
  getCostBasisChart(symbol) {
    const url = this.baseUrl + '/journal/costbasisChart?symbol=' + symbol;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTaxLotReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl + '/journal/taxlotReport?from=' + fromDate + '&to=' + toDate + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getClosingTaxLots(lporderid) {
    const url = this.baseUrl + '/journal/closingTaxLots?orderid=' + lporderid;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  getTaxLotsReport(fromDate, toDate, fund) {
    const url =
      this.baseUrl + '/journal/taxlotsReport?from=' + fromDate + '&to=' + toDate + '&fund=' + fund;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Files
  */
  getFiles() {
    const url = this.baseUrl + '/fileManagement/files';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  updateAction(body) {
    const url = this.baseUrl + '/fileManagement/UpdateFileAction';
    return this.http.post(url, body).pipe(map((response: any) => response));
  }

  /*
  Get Silver Files
  */
  getSilverFiles() {
    const url = this.baseUrl + '/fileManagement/s3Files';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Generate Files
  */
  generateFiles(body) {
    const url = this.baseUrl + '/fileManagement/silverEndOfDay';
    return this.http.post(url, body).pipe(map((response: any) => response));
  }

  getInvalidExportRecords(): Observable<any> {
    const url = this.baseUrl + '/fileManagement/FileExportException';
    return this.http.get(url);
  }

  /*
  Monthly Performance
  */
  getMonthlyPerformance(): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.get(url);
  }

  calMonthlyPerformance(data): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.post(url, data);
  }

  commitMonthlyPerformance(data): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance';
    return this.http.put(url, data);
  }

  monthlyPerformanceAudit(id): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformanceAudit?id=' + id;
    return this.http.get(url);
  }

  getMonthlyPerformanceStatus(): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance/status';
    return this.http.get(url);
  }

  getMarketPriceData(): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.get(url);
  }

  editMarketPriceData(data): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices';
    return this.http.put(url, data);
  }

  getMarketPriceAudit(id): Observable<any> {
    const url = this.baseUrl + '/marketdata/audit?id=' + id;
    return this.http.get(url);
  }

  uploadMarketPriceData(file: File): Observable<any> {
    const url = this.baseUrl + '/marketdata/prices/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  uploadMonthlyPerformance(file: File): Observable<any> {
    const url = this.baseUrl + '/calculation/monthlyPerformance/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  getDailyUnofficialPnL(): Observable<any> {
    const url = this.baseUrl + '/calculation/dailyUnofficialPnl';
    return this.http.get(url);
  }

  uploadDailyUnofficialPnl(file: File): Observable<any> {
    const url = this.baseUrl + '/calculation/dailyUnofficialPnlAudit/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(url, formData);
  }

  getTaxRates(): Observable<any> {
    const url = this.baseUrl + '/taxRate';
    return this.http.get(url);
  }

  createTaxRate(data) {
    const url = this.baseUrl + '/taxRate';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  editTaxRate(id, data) {
    const url = this.baseUrl + '/taxRate/' + id;
    return this.http.put(url, data).pipe(map((response: any) => response));
  }

  deleteTaxRate(id) {
    const url = this.baseUrl + '/taxRate/' + id;
    return this.http.delete(url).pipe(map((response: any) => response));
  }

  getJournalSummary(payload: any): Observable<any> {
    const url = this.baseUrl + '/analysis/journal';
    return this.http.post(url, JSON.parse(payload)).pipe(map((response: any) => response));
  }

  getJournalDetails(payload: any): Observable<any> {
    const url = this.baseUrl + '/analysis/journalDetails';
    return this.http.post(url, payload).pipe(map((response: any) => response));
  }
}
