(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./src/services/account-api.service.ts":
/*!*********************************************!*\
  !*** ./src/services/account-api.service.ts ***!
  \*********************************************/
/*! exports provided: AccountApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountApiService", function() { return AccountApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





var AccountApiService = /** @class */ (function () {
    function AccountApiService(http) {
        this.http = http;
        this.baseUrl = window['config']
            ? window['config'].remoteServerUrl
            : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseRemoteServerUrl;
    }
    /*
    Get a Searched Account
    */
    AccountApiService.prototype.getAccount = function (keyword) {
        var url = this.baseUrl + '/account/data/Search/?search=' + keyword;
        var params = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get the Accounts
    */
    AccountApiService.prototype.getAccounts = function (keyword) {
        var url = this.baseUrl + '/accounts';
        var params = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url, { params: params }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get All Accounts
    */
    AccountApiService.prototype.getAllAccounts = function () {
        var url = this.baseUrl + '/account';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get the Account Types
    */
    AccountApiService.prototype.getAccountTypes = function (keyword) {
        var url = this.baseUrl + '/account_types';
        var params = {};
        if (keyword !== undefined) {
            params.keyword = keyword;
        }
        return this.http.get(url, { params: params }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get the Account Tags
    */
    AccountApiService.prototype.getAccountTags = function (id) {
        var url = this.baseUrl + '/account/' + id;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Create an Account
    */
    AccountApiService.prototype.createAccount = function (data) {
        var url = this.baseUrl + '/account';
        return this.http.post(url, data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Edit an Account
    */
    AccountApiService.prototype.editAccount = function (params) {
        var url = this.baseUrl + '/account/' + params.id;
        return this.http.put(url, params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Patch an Account
    */
    AccountApiService.prototype.patchAccount = function (id, params) {
        var url = this.baseUrl + '/account/' + id;
        return this.http.patch(url, params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Delete an Account
    */
    AccountApiService.prototype.deleteAccount = function (id) {
        var url = this.baseUrl + '/account/' + id;
        return this.http.delete(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get the Account Categories
    */
    AccountApiService.prototype.accountCategories = function () {
        var url = this.baseUrl + '/account_category/';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get All Account Tags
    */
    AccountApiService.prototype.accountTags = function () {
        var url = this.baseUrl + '/account_tag';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get an Account Type
    */
    AccountApiService.prototype.accountTypes = function (id) {
        var url = this.baseUrl + '/account_type?accountCategoryId=' + id;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    AccountApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    AccountApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AccountApiService);
    return AccountApiService;
}());



/***/ }),

/***/ "./src/services/fund-theoretical-api.service.ts":
/*!******************************************************!*\
  !*** ./src/services/fund-theoretical-api.service.ts ***!
  \******************************************************/
/*! exports provided: FundTheoreticalApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FundTheoreticalApiService", function() { return FundTheoreticalApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");




var FundTheoreticalApiService = /** @class */ (function () {
    function FundTheoreticalApiService(http) {
        this.http = http;
        this.baseUrl = window['config'].remoteServerUrl;
    }
    /*
    Monthly Performance
    */
    FundTheoreticalApiService.prototype.getMonthlyPerformance = function () {
        var url = this.baseUrl + '/calculation/monthlyPerformance';
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.calMonthlyPerformance = function (data) {
        var url = this.baseUrl + '/calculation/monthlyPerformance';
        return this.http.post(url, data);
    };
    FundTheoreticalApiService.prototype.commitMonthlyPerformance = function (data) {
        var url = this.baseUrl + '/calculation/monthlyPerformance';
        return this.http.put(url, data);
    };
    FundTheoreticalApiService.prototype.monthlyPerformanceAudit = function (id) {
        var url = this.baseUrl + '/calculation/monthlyPerformanceAudit?id=' + id;
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.getMonthlyPerformanceStatus = function () {
        var url = this.baseUrl + '/calculation/monthlyPerformance/status';
        return this.http.get(url);
    };
    /*
    Tax Rate
    */
    FundTheoreticalApiService.prototype.getTaxRates = function () {
        var url = this.baseUrl + '/taxRate';
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.createTaxRate = function (data) {
        var url = this.baseUrl + '/taxRate';
        return this.http.post(url, data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) { return response; }));
    };
    FundTheoreticalApiService.prototype.editTaxRate = function (id, data) {
        var url = this.baseUrl + '/taxRate/' + id;
        return this.http.put(url, data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) { return response; }));
    };
    FundTheoreticalApiService.prototype.deleteTaxRate = function (id) {
        var url = this.baseUrl + '/taxRate/' + id;
        return this.http.delete(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) { return response; }));
    };
    /*
    Market Price
    */
    FundTheoreticalApiService.prototype.getMarketPriceData = function () {
        var url = this.baseUrl + '/marketdata/prices';
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.editMarketPriceData = function (data) {
        var url = this.baseUrl + '/marketdata/prices';
        return this.http.put(url, data);
    };
    FundTheoreticalApiService.prototype.getMarketPriceAudit = function (id) {
        var url = this.baseUrl + '/marketdata/audit?id=' + id;
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.uploadMarketPriceData = function (file) {
        var url = this.baseUrl + '/marketdata/prices/upload';
        var formData = new FormData();
        formData.append('fileKey', file, file.name);
        return this.http.post(url, formData);
    };
    /*
    Daily PnL
    */
    FundTheoreticalApiService.prototype.getDailyUnofficialPnL = function (from, to) {
        var url = this.baseUrl + '/calculation/dailyUnofficialPnl?from=' + from + '&to=' + to;
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.uploadDailyUnofficialPnl = function (file) {
        var url = this.baseUrl + '/calculation/dailyUnofficialPnlAudit/upload';
        var formData = new FormData();
        formData.append('fileKey', file, file.name);
        return this.http.post(url, formData);
    };
    /*
    Fx Rate
    */
    FundTheoreticalApiService.prototype.getFxRatesData = function () {
        var url = this.baseUrl + '/fxRates/fxRate';
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.GetAuditTrail = function (id) {
        var url = this.baseUrl + '/fxRates/audit?id=' + id;
        return this.http.get(url);
    };
    FundTheoreticalApiService.prototype.editFxRatePriceData = function (data) {
        var url = this.baseUrl + '/fxRates/fxRate';
        return this.http.put(url, data);
    };
    FundTheoreticalApiService.prototype.uploadFxData = function (file) {
        var url = this.baseUrl + '/fxRates/upload';
        var formData = new FormData();
        formData.append('fileKey', file, file.name);
        return this.http.post(url, formData);
    };
    FundTheoreticalApiService.prototype.uploadTradeData = function (file) {
        var url = this.baseUrl + '/fileManagement/uploadTrade';
        var formData = new FormData();
        formData.append('fileKey', file, file.name);
        return this.http.post(url, formData);
    };
    FundTheoreticalApiService.prototype.commitTradeData = function (data) {
        var url = this.baseUrl + '/fileManagement/commitTrade';
        return this.http.post(url, data);
    };
    FundTheoreticalApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    FundTheoreticalApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], FundTheoreticalApiService);
    return FundTheoreticalApiService;
}());



/***/ }),

/***/ "./src/services/reports-api.service.ts":
/*!*********************************************!*\
  !*** ./src/services/reports-api.service.ts ***!
  \*********************************************/
/*! exports provided: ReportsApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsApiService", function() { return ReportsApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





var ReportsApiService = /** @class */ (function () {
    function ReportsApiService(http) {
        this.http = http;
        this.baseUrl = window['config']
            ? window['config'].remoteServerUrl
            : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseRemoteServerUrl;
    }
    /*
    Get Trial Balance Report
    */
    ReportsApiService.prototype.getTrialBalanceReport = function (fromDate, toDate, fund) {
        var url = this.baseUrl +
            '/journal/trialBalanceReport?from=' +
            fromDate +
            '&to=' +
            toDate +
            '&fund=' +
            fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getReconReport = function (date, fund) {
        var url = this.baseUrl + '/journal/recon?source=daypnl&date=' + date + '&fund=' + fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getBookmonReconReport = function (date, fund) {
        var url = this.baseUrl + '/journal/recon?source=exposure&date=' + date + '&fund=' + fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getFundAdminReconReport = function (date, fund) {
        var url = this.baseUrl + '/journal/recon?source=fundadmin&date=' + date + '&fund=' + fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getDetailPnLToDateReport = function (fromDate, toDate, symbol) {
        var url = this.baseUrl +
            '/journal/detailPnLDateReport?from=' +
            fromDate +
            '&to=' +
            toDate +
            '&symbol=' +
            symbol;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get Cost Basis Report
    */
    ReportsApiService.prototype.getCostBasisReport = function (date, symbol, fund) {
        var url = this.baseUrl +
            '/journal/costbasisReport?date=' +
            date +
            '&symbol=' +
            symbol +
            '&fund=' +
            fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    /*
    Get Cost Basis Chart
    */
    ReportsApiService.prototype.getCostBasisChart = function (symbol) {
        var url = this.baseUrl + '/journal/costbasisChart?symbol=' + symbol;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getTaxLotReport = function (fromDate, toDate, symbol, fund, side) {
        var url = this.baseUrl +
            '/journal/taxlotReport?from=' +
            fromDate +
            '&to=' +
            toDate +
            '&symbol=' +
            symbol +
            '&fund=' +
            fund +
            '&side=' +
            side;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getClosingTaxLots = function (lporderid, fromDate, toDate) {
        var url = this.baseUrl + '/journal/closingTaxLots?orderid=' + lporderid + '&to=' + toDate;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getTaxLotsReport = function (fromDate, toDate, fund) {
        var url = this.baseUrl + '/journal/taxlotsReport?from=' + fromDate + '&to=' + toDate + '&fund=' + fund;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getLatestJournalDate = function () {
        var url = this.baseUrl + '/journal/lastPostedDate';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getPeriodJournals = function (symbol, now, period) {
        var url = this.baseUrl +
            '/journal/periodJournals?symbol=' +
            symbol +
            '&now=' +
            now +
            '&period=' +
            period;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getValidDates = function (column, source) {
        var url = this.baseUrl + '/journal/validDates?columnName=' + column + '&source=' + source;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getPositionMarketValueAppraisalReport = function (date) {
        var url = this.baseUrl + '/journal/marketValueAppraisalReport?date=' + date;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.prototype.getHistoricPerformanceReport = function (fromDate, toDate) {
        var url = this.baseUrl + '/journal/historicPerformanceReport?from=' + fromDate + '&to=' + toDate;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    ReportsApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    ReportsApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], ReportsApiService);
    return ReportsApiService;
}());



/***/ })

}]);
//# sourceMappingURL=common.js.map