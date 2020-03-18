(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-reports-reports-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/balance-report/balance-report.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/balance-report/balance-report.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Table for Headings Starts -->\r\n<table class=\"table table-sm table-striped table-bordered table-secondary table-header\">\r\n  <thead>\r\n    <tr>\r\n      <th scope=\"col\" class=\"first-cell\">\r\n        {{tableHeader | titlecase}}</th>\r\n      <th scope=\"col\" class=\"other-cells center-position\">Debit</th>\r\n      <th scope=\"col\" class=\"other-cells center-position\">Credit</th>\r\n      <th scope=\"col\" class=\"other-cells center-position\">Balance</th>\r\n    </tr>\r\n  </thead>\r\n</table>\r\n<!-- Table for Headings Ends -->\r\n\r\n<!-- Trial Report Div Starts -->\r\n<div [ngStyle]=\"containerDiv\">\r\n  <!-- Table for Data Starts -->\r\n  <table class=\"table table-sm table-striped table-bordered\">\r\n    <tbody>\r\n      <tr *ngFor=\"let report of trialBalanceReport; let i = index\">\r\n        <td class=\"first-cell cell-style\"> {{ report.accountName }}</td>\r\n        <td [ngStyle]=\"{'background-size.%': !report.debitPercentage ? 0 : report.debitPercentage}\"\r\n          class=\"other-cells debit cell-style bg-size-100\">\r\n          {{ report.debit | number: '1.2-2' }}\r\n        </td>\r\n        <td [ngStyle]=\"{'background-size.%': !report.creditPercentage ? 0 : report.creditPercentage}\"\r\n          class=\"other-cells credit cell-style bg-size-100\">\r\n          {{ report.credit | number: '1.2-2' }}</td>\r\n        <td class=\"other-cells balance cell-style\">\r\n          {{ report.balance | number: '1.2-2' }}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n  <!-- Table for Data Ends -->\r\n</div>\r\n<!-- Trial Report Div Ends -->\r\n\r\n<!-- Table for Footer Starts -->\r\n<table class=\"table table-sm table-striped table-bordered table-secondary table-footer\">\r\n  <tfoot>\r\n    <tr>\r\n      <td class=\"first-cell\">Total</td>\r\n      <td class=\"other-cells end-position\">\r\n        {{ trialBalanceReportStats?.totalDebit | number: '1.2-2' }}</td>\r\n      <td class=\"other-cells end-position\">\r\n        {{ trialBalanceReportStats?.totalCredit | number: '1.2-2' }}</td>\r\n      <td class=\"other-cells end-position\">\r\n        {{ (trialBalanceReportStats?.totalCredit - trialBalanceReportStats?.totalDebit) | number: '1.2-2' }}\r\n      </td>\r\n    </tr>\r\n  </tfoot>\r\n</table>\r\n<!-- Table for Footer Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/costbasis/costbasis.component.html":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/costbasis/costbasis.component.html ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row\">\r\n\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- Symbol Filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n    <!-- Symbol Filter Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\" selectedDate\"\r\n          [isInvalidDate]=\"isInvalidDate.bind(this)\" [singleDatePicker]=\"true\" [autoApply]=\"true\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Util Buttons Div Starts -->\r\n    <div class=\"col-auto ml-auto\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <ng-template #tooltipTemplate>{{costBasisConfig.chartsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button class=\"btn btn-pa\" [tooltip]=\"tooltipTemplate\" placement=\"top\"\r\n          (click)=\"costBasisConfig.chartsView = !costBasisConfig.chartsView\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-right': costBasisConfig.chartsView, 'fa-arrow-left': !costBasisConfig.chartsView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Util Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Grid/Charts Row Starts -->\r\n  <div [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Main Split Row Starts -->\r\n    <div class=\"split-area row h-100\">\r\n\r\n      <!-- AS Split Main Container -->\r\n      <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\"\r\n        [useTransition]=\"costBasisConfig.useTransition\" (dragEnd)=\"applyPageLayout($event)\"\r\n        (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n        <!-- Cost Basis Split Area -->\r\n        <as-split-area [visible]=\"costBasisConfig.costBasisView\" [size]=\"costBasisConfig.costBasisSize\" order=\"1\">\r\n\r\n          <!-- Cost Basis Grid -->\r\n          <ag-grid-angular class=\"w-100 h-50 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n\r\n          <!-- Time Series Grid -->\r\n          <ag-grid-angular class=\"w-100 h-50 ag-theme-balham\" [gridOptions]=\"timeseriesOptions\">\r\n          </ag-grid-angular>\r\n\r\n        </as-split-area>\r\n        <!-- Cost Basis Split Area Ends -->\r\n\r\n        <!-- Charts Split Area -->\r\n        <as-split-area [visible]=\"costBasisConfig.chartsView\" [size]=\"costBasisConfig.chartsSize\" order=\"2\">\r\n\r\n          <!-- Charts Message -->\r\n          <div *ngIf=\"!chartData\" class=\"w-100 h-100 d-flex justify-content-center align-items-center\">\r\n            <p class=\"h4 font-weight-light\">Please select a row for Visualization</p>\r\n          </div>\r\n\r\n          <!-- Charts Wrapper -->\r\n          <div *ngIf=\"chartData && costBasisConfig.chartsView\" class=\"line-chart-wrapper d-flex flex-wrap\">\r\n\r\n            <!-- Charts Tab Set -->\r\n            <tabset class=\"w-100 ml-3\">\r\n\r\n              <tab heading=\"Realized/Unrealized P&L\">\r\n\r\n                <div class=\"row\">\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\"chart-title\">Unrealized P&L</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"'unrealizedData'\" [lineColors]=\"lineColors\"\r\n                      [dateTimeFormat]=\"'YYYY-MM-DD'\" [data]=\"unrealizedData\" [xAxisLabel]=\"'Date'\" [yAxisLabel]=\"''\"\r\n                      [divHeight]=\"divHeight\" [threshold]=0 [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\"chart-title\">Realized P&L</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"'realalizedData'\" [lineColors]=\"lineColors\"\r\n                      [dateTimeFormat]=\"'YYYY-MM-DD'\" [threshold]=0 [data]=\"realizedData\" [xAxisLabel]=\"'Date'\"\r\n                      [yAxisLabel]=\"''\" [divHeight]=\"divHeight\" [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                </div>\r\n\r\n              </tab>\r\n\r\n              <tab heading=\"Measure\">\r\n\r\n                <div class=\"row\">\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\" chart-title\">Investment at Cost</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"propIDBalance\" [lineColors]=\"lineColors\"\r\n                      [data]=\"bData\" [dateTimeFormat]=\"'YYYY-MM-DD'\" [threshold]=0 [xAxisLabel]=\"'Date'\"\r\n                      [yAxisLabel]=\"''\" [divHeight]=\"divHeight\" [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\"chart-title\">Quantity</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"propIDQuantity\" [lineColors]=\"lineColors\"\r\n                      [data]=\"qData\" [dateTimeFormat]=\"'YYYY-MM-DD'\" [threshold]=0 [xAxisLabel]=\"'Date'\"\r\n                      [yAxisLabel]=\"''\" [divHeight]=\"divHeight\" [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\"chart-title\">Exposure (at Cost)</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"propIDCostBasis\" [lineColors]=\"lineColors\"\r\n                      [data]=\"cbData\" [dateTimeFormat]=\"'YYYY-MM-DD'\" [threshold]=0 [xAxisLabel]=\"'Date'\"\r\n                      [yAxisLabel]=\"''\" [divHeight]=\"divHeight\" [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                  <div class=\"w-100 col-6 pt-10\">\r\n                    <div class=\"chart-title\">Net P&L</div>\r\n                    <eikos-line-plot class=\"d-block chart\" [propID]=\"'netpnlData'\" [lineColors]=\"lineColors\"\r\n                      [data]=\"netpnlData\" [dateTimeFormat]=\"'YYYY-MM-DD'\" [threshold]=0 [xAxisLabel]=\"'Date'\"\r\n                      [yAxisLabel]=\"''\" [divHeight]=\"divHeight\" [divWidth]=\"divWidth\">\r\n                    </eikos-line-plot>\r\n                  </div>\r\n\r\n                  <div *ngIf=\"marketPriceChart\" class=\"w-100\">\r\n                    <app-calculation-graphs class=\"w-50 h-75\" [chartObject]=\"graphObject\" [mode]=\"'single'\">\r\n                    </app-calculation-graphs>\r\n                  </div>\r\n\r\n                </div>\r\n\r\n              </tab>\r\n\r\n            </tabset>\r\n            <!-- Charts Tab Set Ends -->\r\n\r\n          </div>\r\n          <!-- Charts Wrapper Ends -->\r\n\r\n        </as-split-area>\r\n        <!-- Charts Split Area Ends -->\r\n\r\n      </as-split>\r\n      <!-- AS Split Main Container Ends -->\r\n\r\n    </div>\r\n    <!-- Main Split Row Ends -->\r\n\r\n  </div>\r\n  <!-- Grid/Charts Row Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends-->\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/historical-performance/historical-performance.component.html":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/historical-performance/historical-performance.component.html ***!
  \*********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Filters Div Starts -->\r\n    <div class=\"row\">\r\n\r\n        <!-- Funds Dropdown Div Starts -->\r\n        <!-- <div class=\"col-auto\">\r\n            <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n                <option selected>All Funds</option>\r\n                <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n                    {{ fund.fundCode }}\r\n                </option>\r\n            </select>\r\n        </div> -->\r\n        <!-- Funds Dropdown Div Ends -->\r\n\r\n        <!-- Symbol Filter -->\r\n        <!-- <div class=\"col-auto\">\r\n            <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\"\r\n                [(ngModel)]=\"filterBySymbol\" (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\"\r\n                class=\"form-control\" />\r\n        </div> -->\r\n        <!-- Symbol Filter Ends -->\r\n\r\n        <!-- Date Picker Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <form>\r\n                <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n                    [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\" selectedDate\"\r\n                    [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n            </form>\r\n        </div>\r\n        <!-- Date Picker Div Ends -->\r\n\r\n        <!-- Clear Button Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n                <i class=\"fa fa-remove\"></i>\r\n            </button>\r\n        </div>\r\n        <!-- Clear Button Div Ends -->\r\n\r\n        <!-- Util Buttons Div Starts -->\r\n        <div class=\"col-auto ml-auto\">\r\n\r\n            <!-- Refresh Button Div Starts -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n                    <i class=\"fa fa-refresh\"></i></button>\r\n            </div>\r\n            <!-- Refresh Button Div Ends -->\r\n\r\n            <!-- Export to Excel Button -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n                    <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n                </button>\r\n            </div>\r\n            <!-- Export to Excel Button Ends -->\r\n\r\n        </div>\r\n        <!-- Util Buttons Div Ends -->\r\n\r\n    </div>\r\n    <!-- Filters Div Ends -->\r\n\r\n    <!-- Grid/Charts Row Starts -->\r\n    <div [ngStyle]=\"styleForHeight\">\r\n\r\n        <!-- Main Split Row Starts -->\r\n        <div class=\"split-area row h-100\">\r\n\r\n            <!-- AS Split Main Container -->\r\n            <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\" [useTransition]=\"true\">\r\n\r\n                <!-- Cost Basis Split Area -->\r\n                <as-split-area [visible]=\"true\" [size]=\"50\" order=\"1\">\r\n\r\n                    <!-- Cost Basis Grid -->\r\n                    <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n                    </ag-grid-angular>\r\n\r\n                </as-split-area>\r\n                <!-- Cost Basis Split Area Ends -->\r\n\r\n                <!-- Charts Split Area -->\r\n                <as-split-area [visible]=\"false\" [size]=\"50\" order=\"2\">\r\n\r\n                </as-split-area>\r\n                <!-- Charts Split Area Ends -->\r\n\r\n            </as-split>\r\n            <!-- AS Split Main Container Ends -->\r\n\r\n        </div>\r\n        <!-- Main Split Row Ends -->\r\n\r\n    </div>\r\n    <!-- Grid/Charts Row Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends-->\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.html":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.html ***!
  \***************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Filters Div Starts -->\r\n    <div class=\"row\">\r\n\r\n        <!-- Funds Dropdown Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n                <option selected>All Funds</option>\r\n                <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n                    {{ fund.fundCode }}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- Funds Dropdown Div Ends -->\r\n\r\n        <!-- Symbol Filter -->\r\n        <div class=\"col-auto\">\r\n            <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\"\r\n                [(ngModel)]=\"filterBySymbol\" (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\"\r\n                class=\"form-control\" />\r\n        </div>\r\n        <!-- Symbol Filter Ends -->\r\n\r\n        <!-- Date Picker Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <form>\r\n                <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n                    [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\" selectedDate\"\r\n                    [singleDatePicker]=\"true\" [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n            </form>\r\n        </div>\r\n        <!-- Date Picker Div Ends -->\r\n\r\n        <!-- Clear Button Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n                <i class=\"fa fa-remove\"></i>\r\n            </button>\r\n        </div>\r\n        <!-- Clear Button Div Ends -->\r\n\r\n        <!-- Util Buttons Div Starts -->\r\n        <div class=\"col-auto ml-auto\">\r\n\r\n            <!-- Refresh Button Div Starts -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n                    <i class=\"fa fa-refresh\"></i></button>\r\n            </div>\r\n            <!-- Refresh Button Div Ends -->\r\n\r\n            <!-- Export to Excel Button -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n                    <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n                </button>\r\n            </div>\r\n            <!-- Export to Excel Button Ends -->\r\n\r\n        </div>\r\n        <!-- Util Buttons Div Ends -->\r\n\r\n    </div>\r\n    <!-- Filters Div Ends -->\r\n\r\n    <!-- Grid/Charts Row Starts -->\r\n    <div [ngStyle]=\"styleForHeight\">\r\n\r\n        <!-- Main Split Row Starts -->\r\n        <div class=\"split-area row h-100\">\r\n\r\n            <!-- AS Split Main Container -->\r\n            <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\" [useTransition]=\"true\">\r\n\r\n                <!-- Cost Basis Split Area -->\r\n                <as-split-area [visible]=\"true\" [size]=\"50\" order=\"1\">\r\n\r\n                    <!-- Cost Basis Grid -->\r\n                    <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n                    </ag-grid-angular>\r\n\r\n                </as-split-area>\r\n                <!-- Cost Basis Split Area Ends -->\r\n\r\n                <!-- Charts Split Area -->\r\n                <as-split-area [visible]=\"false\" [size]=\"50\" order=\"2\">\r\n\r\n                </as-split-area>\r\n                <!-- Charts Split Area Ends -->\r\n\r\n            </as-split>\r\n            <!-- AS Split Main Container Ends -->\r\n\r\n        </div>\r\n        <!-- Main Split Row Ends -->\r\n\r\n    </div>\r\n    <!-- Grid/Charts Row Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends-->\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/reports.component.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/reports.component.html ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Tab View Starts -->\r\n  <tabset class=\"tab-color\">\r\n\r\n    <tab heading=\"Cost Basis\" (selectTab)=\"activateCostBasisReport()\">\r\n      <div [ngStyle]=\"style\">\r\n        <rep-costbasis *ngIf=\"costBasisReportActive\"></rep-costbasis>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Tax Lots Open/Closed\" (selectTab)=\"activateTaxLotReport()\">\r\n      <div [ngStyle]=\"style\">\r\n        <rep-taxlotstatus *ngIf=\"taxLotReportActive\"></rep-taxlotstatus>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Trial Balance\" (selectTab)=\"activateTrialBalanceReport()\">\r\n      <div [ngStyle]=\"style\">\r\n        <rep-trial-balance *ngIf=\"trialBalanceReportActive\"></rep-trial-balance>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Position/Market Value Appraisal\" (selectTab)=\"activatePositionMarketValueAppraisalReport()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-position-market-value-appraisal *ngIf=\"positionMarketValueAppraisalActive\">\r\n        </app-position-market-value-appraisal>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Historic Performance\" (selectTab)=\"activateHistoricReport()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-historical-performance *ngIf=\"historicPerformanceActive\"></app-historical-performance>\r\n      </div>\r\n    </tab>\r\n\r\n  </tabset>\r\n  <!-- Tab View Ends -->\r\n\r\n</div>\r\n<!-- Reports Ends-->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlots/taxlots.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlots/taxlots.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-md-2\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- DateRange Label Div Starts -->\r\n    <div class=\"font-weight-bold\">\r\n      <label class=\"text-right\"> {{ DateRangeLabel }} </label>\r\n    </div>\r\n    <!-- DateRange Label Div Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-md-5\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selected\" name=\"selectedDaterange\" [ranges]=\"ranges\" [showClearButton]=\"true\"\r\n          [alwaysShowCalendars]=\"true\" (ngModelChange)=\"changeDate($event)\" [keepCalendarOpeningWithRange]=\"true\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-md-3\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!----- Buttons Div Starts ----->\r\n    <div class=\"ml-auto\">\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n    </div>\r\n    <!----- Buttons Div Ends ----->\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Report Grid Starts -->\r\n  <div [ngStyle]=\"styleForHeight\">\r\n    <ag-grid-angular class=\"w-50 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n    </ag-grid-angular>\r\n  </div>\r\n  <!-- Report Grid Ends -->\r\n</div>\r\n<!-- Reports Main Div Ends-->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlotstatus/taxlotstatus.component.html":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlotstatus/taxlotstatus.component.html ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Loader -->\r\n<div *ngIf=\"isLoading\" class=\"loader-wrapper mtop-15\">\r\n  <lp-loading></lp-loading>\r\n  <!-- Loader -->\r\n</div>\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [hidden]=\"isLoading\" [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n      <!-- Funds Dropdown Div Ends -->\r\n    </div>\r\n\r\n    <!-- Symbol filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n\r\n    <!-- DateRange Label Div Starts -->\r\n    <div class=\"font-weight-bold\">\r\n      <label class=\"text-right\"> {{ DateRangeLabel }} </label>\r\n    </div>\r\n    <!-- DateRange Label Div Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selected\" name=\"selectedDaterange\" (ngModelChange)=\"changeDate($event)\" [singleDatePicker]=\"true\"\r\n          [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Buttons Div Starts -->\r\n    <div class=\"ml-auto\">\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <div class=\"d-inline-block\"\r\n        [ngClass]=\"{'mr-2': taxLotStatusHorizontalConfig.closingTaxLotView, 'mr-3': !taxLotStatusHorizontalConfig.closingTaxLotView}\">\r\n        <ng-template #tooltipTemplate>{{taxLotStatusHorizontalConfig.closingTaxLotView ? 'Expand' : 'Collapse'}}\r\n        </ng-template>\r\n        <button\r\n          (click)=\"taxLotStatusHorizontalConfig.closingTaxLotView = !taxLotStatusHorizontalConfig.closingTaxLotView\"\r\n          class=\"btn btn-pa\" [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-right': taxLotStatusHorizontalConfig.closingTaxLotView, 'fa-arrow-left': !taxLotStatusHorizontalConfig.closingTaxLotView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n      <!-- Vertical Expand/Collapse Button -->\r\n      <div *ngIf=\"taxLotStatusHorizontalConfig.closingTaxLotView\" class=\"d-inline-block\"\r\n        [ngClass]=\"{'mr-3': taxLotStatusHorizontalConfig.closingTaxLotView, 'mr-2': !taxLotStatusHorizontalConfig.closingTaxLotView}\">\r\n        <ng-template #tooltipTemplate>{{taxLotStatusVerticalConfig.journalView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button (click)=\"taxLotStatusVerticalConfig.journalView = !taxLotStatusVerticalConfig.journalView\"\r\n          class=\"btn btn-pa\" [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-down': taxLotStatusVerticalConfig.journalView, 'fa-arrow-up': !taxLotStatusVerticalConfig.journalView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Vertical Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Report Grid Starts -->\r\n  <div [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Main Split Row Starts -->\r\n    <div class=\"split-area row h-100\">\r\n\r\n      <!-- AS Split Main Container -->\r\n      <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\"\r\n        [useTransition]=\"taxLotStatusHorizontalConfig.useTransition\" (dragEnd)=\"applyHorizontalPageLayout($event)\"\r\n        (transitionEnd)=\"applyHorizontalPageLayout($event)\">\r\n\r\n        <!-- Tax Lot Split Area -->\r\n        <as-split-area [visible]=\"taxLotStatusHorizontalConfig.taxLotStatusView\"\r\n          [size]=\"taxLotStatusHorizontalConfig.taxLotStatusSize\" order=\"1\">\r\n          <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" (rowSelected)=\"onRowSelected($event)\"\r\n            [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n        </as-split-area>\r\n        <!-- Tax Lot Split Area Ends -->\r\n\r\n        <!-- Closing Tax Lot Split Area -->\r\n        <as-split-area [visible]=\"taxLotStatusHorizontalConfig.closingTaxLotView\"\r\n          [size]=\"taxLotStatusHorizontalConfig.closingTaxLotSize\" order=\"2\">\r\n\r\n          <!-- Closing Tax Lot Split Container -->\r\n          <as-split disabled=\"false\" direction=\"vertical\" [useTransition]=\"taxLotStatusVerticalConfig.useTransition\"\r\n            (dragEnd)=\"applyVerticalPageLayout($event)\" (transitionEnd)=\"applyVerticalPageLayout($event)\">\r\n\r\n            <!-- Closing Tax Lot Area -->\r\n            <as-split-area [visible]=\" taxLotStatusVerticalConfig.closingTaxLotView\"\r\n              [size]=\"taxLotStatusVerticalConfig.closingTaxLotSize\" order=\"1\">\r\n\r\n              <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" (rowSelected)=\"onTradeRowSelected($event)\"\r\n                [gridOptions]=\"closingTaxLots\">\r\n              </ag-grid-angular>\r\n\r\n            </as-split-area>\r\n            <!-- Closing Tax Lot Area Ends -->\r\n\r\n            <!-- Journals Area -->\r\n            <as-split-area [visible]=\"taxLotStatusVerticalConfig.journalView\"\r\n              [size]=\"taxLotStatusVerticalConfig.journalSize\" order=\"2\">\r\n\r\n              <div class=\"w-100 height-90 p-0\">\r\n                <app-journals [subscription]=\"tradeSelectionChanged\" [title]=\"'Journals'\"></app-journals>\r\n              </div>\r\n\r\n            </as-split-area>\r\n            <!-- Journals Area Ends -->\r\n\r\n          </as-split>\r\n          <!-- Closing Tax Lot Split Container Ends -->\r\n\r\n        </as-split-area>\r\n        <!-- Closing Tax Lot Split Area Ends -->\r\n\r\n      </as-split>\r\n      <!-- AS Split Main Container Ends -->\r\n\r\n    </div>\r\n    <!-- Main Split Row Ends -->\r\n\r\n  </div>\r\n  <!-- Report Grid Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends-->\r\n\r\n<!-- Data Modal -->\r\n<app-data-modal #dataModal title=\"Trade Detail\" [isCustomData]=\"true\">\r\n</app-data-modal>\r\n<!-- Data Modal Ends -->\r\n\r\n<!-- Data Grid Modal Starts -->\r\n<app-data-grid-modal #dataGridModal gridTitle=\"Open Tax Lot Journals\" [expanded]=\"true\">\r\n</app-data-grid-modal>\r\n<!-- Data Grid Modal Ends -->\r\n\r\n<app-create-dividend #dividendModal (modalClose)=\"closeDividendModal()\"></app-create-dividend>\r\n\r\n<app-create-stock-splits #stockSplitsModal (modalClose)=\"closeStockSplitModal()\">\r\n</app-create-stock-splits>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/trial-balance/trial-balance.component.html":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/trial-balance/trial-balance.component.html ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- DateRange Label Div Starts -->\r\n    <div class=\"font-weight-bold\">\r\n      <label style=\"text-align: right\"> {{ DateRangeLabel }} </label>\r\n    </div>\r\n    <!-- DateRange Label Div Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selected\" name=\"selectedDaterange\" [ranges]=\"ranges\" [showClearButton]=\"true\"\r\n          [alwaysShowCalendars]=\"true\" (ngModelChange)=\"changeDate($event)\" [keepCalendarOpeningWithRange]=\"true\"\r\n          [maxDate]=\"maxDate\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-md-3\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!----- Buttons Div Starts ----->\r\n    <div class=\"ml-auto mr-2\">\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n    </div>\r\n    <!----- Buttons Div Ends ----->\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Report Grid Starts -->\r\n  <div #divToMeasureJournal>\r\n    <div [ngStyle]=\"styleForHeight\">\r\n      <app-report-grid #trialBalanceReportGrid [trialBalanceReport]=\"trialBalanceReport\"\r\n        [trialBalanceReportStats]=\"trialBalanceReportStats\" [tableHeader]=\"title\" [hideGrid]=\"hideGrid\"\r\n        [isDataLoaded]=\"isDataLoaded\" [isTrialBalance]=\"true\" [externalFilters]=\"externalFilters\"\r\n        (externalFilterPassed)=\"isExternalFilterPassed($event)\" (clearFilters)=\"clearFilters()\">\r\n      </app-report-grid>\r\n    </div>\r\n  </div>\r\n</div>\r\n<!-- Reports Main Div Ends-->");

/***/ }),

/***/ "./src/app/main/reports/balance-report/balance-report.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/main/reports/balance-report/balance-report.component.scss ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.table-header {\n  color: #3a3b3c;\n  background-color: #f5f7f7;\n  margin-bottom: 0;\n}\n\n.table-header th {\n  font-weight: 600;\n}\n\n.table-footer {\n  margin-bottom: 0 !important;\n  color: #2a2b3c;\n  background-color: #f5f7f7;\n  font-weight: 600;\n}\n\ntd {\n  background-repeat: no-repeat;\n}\n\ntd.balance {\n  padding-right: 18px;\n  text-align: end;\n  font-weight: 500;\n}\n\ntd.debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\ntd.credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px;\n  text-align: end;\n  font-weight: 500;\n}\n\n.cell-style {\n  color: black;\n  font-weight: 400;\n  font-size: 14px;\n}\n\n.first-cell {\n  width: 40%;\n}\n\n.other-cells {\n  width: 20%;\n}\n\n.end-position {\n  text-align: end;\n}\n\n.center-position {\n  text-align: center;\n}\n\n.wrong-balance {\n  color: white;\n  background-color: #dc6464;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n.table-striped > tbody > tr:nth-child(2n+1) > td,\n.table-striped > tbody > tr:nth-child(2n+1) > th {\n  background-color: #fcfdfe;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL2JhbGFuY2UtcmVwb3J0L0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxccmVwb3J0c1xcYmFsYW5jZS1yZXBvcnRcXGJhbGFuY2UtcmVwb3J0LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL3JlcG9ydHMvYmFsYW5jZS1yZXBvcnQvYmFsYW5jZS1yZXBvcnQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsU0FBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxjQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLDJCQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLDRCQUFBO0FDQ0Y7O0FERUE7RUFDRSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UseUhBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ1BGOztBRFVBO0VBQ0Usd0hBQUE7RUFTQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ2ZGOztBRGtCQTtFQUNFLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUNmRjs7QURrQkE7RUFDRSxVQUFBO0FDZkY7O0FEa0JBO0VBQ0UsVUFBQTtBQ2ZGOztBRGtCQTtFQUNFLGVBQUE7QUNmRjs7QURrQkE7RUFDRSxrQkFBQTtBQ2ZGOztBRGtCQTtFQUNFLFlBQUE7RUFDQSx5QkFBQTtBQ2ZGOztBRGtCQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0FDZkY7O0FEa0JBO0VBQ0Usa0NBQUE7RUFDQSxtQkFBQTtFQUNBLDZCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBRUEsc0NBQUE7QUNmRjs7QURrQkE7O0VBRUUseUJBQUE7QUNmRiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVwb3J0cy9iYWxhbmNlLXJlcG9ydC9iYWxhbmNlLXJlcG9ydC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnRhYmxlLWhlYWRlciB7XHJcbiAgY29sb3I6ICMzYTNiM2M7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjdmNztcclxuICBtYXJnaW4tYm90dG9tOiAwO1xyXG59XHJcblxyXG4udGFibGUtaGVhZGVyIHRoIHtcclxuICBmb250LXdlaWdodDogNjAwO1xyXG59XHJcblxyXG4udGFibGUtZm9vdGVyIHtcclxuICBtYXJnaW4tYm90dG9tOiAwICFpbXBvcnRhbnQ7XHJcbiAgY29sb3I6ICMyYTJiM2M7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjdmNztcclxuICBmb250LXdlaWdodDogNjAwO1xyXG59XHJcblxyXG50ZCB7XHJcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxufVxyXG5cclxudGQuYmFsYW5jZSB7XHJcbiAgcGFkZGluZy1yaWdodDogMThweDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxudGQuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG50ZC5jcmVkaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIGxlZnQsXHJcbiAgICByZ2IoMjIwLCAxMDAsIDEwMCwgMSkgMCUsXHJcbiAgICByZ2IoMjI1LCAxMTAsIDExMCwgMSkgMTclLFxyXG4gICAgcmdiYSgyMzAsIDExNSwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDI0MCwgMTIwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYmEoMjUwLCAxMjUsIDEyNSwgMSkgODMlLFxyXG4gICAgcmdiYSgyNTUsIDE1MCwgMTUwLCAxKSAxMDAlXHJcbiAgKTtcclxuICBwYWRkaW5nLXJpZ2h0OiAxOHB4O1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG4uY2VsbC1zdHlsZSB7XHJcbiAgY29sb3I6IGJsYWNrO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG59XHJcblxyXG4uZmlyc3QtY2VsbCB7XHJcbiAgd2lkdGg6IDQwJTtcclxufVxyXG5cclxuLm90aGVyLWNlbGxzIHtcclxuICB3aWR0aDogMjAlO1xyXG59XHJcblxyXG4uZW5kLXBvc2l0aW9uIHtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbn1cclxuXHJcbi5jZW50ZXItcG9zaXRpb24ge1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLndyb25nLWJhbGFuY2Uge1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjIwLCAxMDAsIDEwMCk7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gIHdpZHRoOiAxMHB4O1xyXG4gIHotaW5kZXg6IDEwMDA7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gIC8qIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7ICovXHJcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICBib3JkZXI6IDRweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE2MCwgMTYwLCAxNjApO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICAtd2Via2l0LXRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xyXG59XHJcblxyXG4udGFibGUtc3RyaXBlZCA+IHRib2R5ID4gdHI6bnRoLWNoaWxkKDJuICsgMSkgPiB0ZCxcclxuLnRhYmxlLXN0cmlwZWQgPiB0Ym9keSA+IHRyOm50aC1jaGlsZCgybiArIDEpID4gdGgge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZkZmU7XHJcbn1cclxuIiwiYm9keSxcbmh0bWwge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLnRhYmxlLWhlYWRlciB7XG4gIGNvbG9yOiAjM2EzYjNjO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmN2Y3O1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuXG4udGFibGUtaGVhZGVyIHRoIHtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbn1cblxuLnRhYmxlLWZvb3RlciB7XG4gIG1hcmdpbi1ib3R0b206IDAgIWltcG9ydGFudDtcbiAgY29sb3I6ICMyYTJiM2M7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY3Zjc7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbnRkIHtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbn1cblxudGQuYmFsYW5jZSB7XG4gIHBhZGRpbmctcmlnaHQ6IDE4cHg7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxudGQuZGViaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM2NGRjNjQgMCUsICM2ZWUxNmUgMTclLCAjNzNlNjczIDMzJSwgIzc4ZjA3OCA2NyUsICM3ZGZhN2QgODMlLCAjOTZmZjk2IDEwMCUpO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDEwMCU7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxudGQuY3JlZGl0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsICNkYzY0NjQgMCUsICNlMTZlNmUgMTclLCAjZTY3MzczIDMzJSwgI2YwNzg3OCA2NyUsICNmYTdkN2QgODMlLCAjZmY5Njk2IDEwMCUpO1xuICBwYWRkaW5nLXJpZ2h0OiAxOHB4O1xuICB0ZXh0LWFsaWduOiBlbmQ7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbi5jZWxsLXN0eWxlIHtcbiAgY29sb3I6IGJsYWNrO1xuICBmb250LXdlaWdodDogNDAwO1xuICBmb250LXNpemU6IDE0cHg7XG59XG5cbi5maXJzdC1jZWxsIHtcbiAgd2lkdGg6IDQwJTtcbn1cblxuLm90aGVyLWNlbGxzIHtcbiAgd2lkdGg6IDIwJTtcbn1cblxuLmVuZC1wb3NpdGlvbiB7XG4gIHRleHQtYWxpZ246IGVuZDtcbn1cblxuLmNlbnRlci1wb3NpdGlvbiB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLndyb25nLWJhbGFuY2Uge1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYzY0NjQ7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICB3aWR0aDogMTBweDtcbiAgei1pbmRleDogMTAwMDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIC8qIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7ICovXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJvcmRlcjogNHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTBhMGEwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xufVxuXG4udGFibGUtc3RyaXBlZCA+IHRib2R5ID4gdHI6bnRoLWNoaWxkKDJuKzEpID4gdGQsXG4udGFibGUtc3RyaXBlZCA+IHRib2R5ID4gdHI6bnRoLWNoaWxkKDJuKzEpID4gdGgge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNmZGZlO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/reports/balance-report/balance-report.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/main/reports/balance-report/balance-report.component.ts ***!
  \*************************************************************************/
/*! exports provided: BalanceReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BalanceReportComponent", function() { return BalanceReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var BalanceReportComponent = /** @class */ (function () {
    function BalanceReportComponent() {
        this.isLoading = false;
        this.containerDiv = {
            borderLeft: '1px solid #cecece',
            borderRight: '1px solid #cecece',
            width: '100%',
            height: 'calc(100vh - 320px)',
            boxSizing: 'border-box',
            overflow: 'overlay'
        };
    }
    BalanceReportComponent.prototype.ngOnInit = function () { };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BalanceReportComponent.prototype, "trialBalanceReport", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BalanceReportComponent.prototype, "trialBalanceReportStats", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BalanceReportComponent.prototype, "isLoading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], BalanceReportComponent.prototype, "hideGrid", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], BalanceReportComponent.prototype, "tableHeader", void 0);
    BalanceReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-balance-report',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./balance-report.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/balance-report/balance-report.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./balance-report.component.scss */ "./src/app/main/reports/balance-report/balance-report.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], BalanceReportComponent);
    return BalanceReportComponent;
}());



/***/ }),

/***/ "./src/app/main/reports/costbasis/costbasis.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/main/reports/costbasis/costbasis.component.scss ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n\n.line-chart-wrapper {\n  padding-top: 1.6rem;\n  overflow: hidden;\n}\n\n.chart-title {\n  font-size: 1em;\n  font-weight: 500;\n  line-height: 0;\n}\n\n::ng-deep .line-chart-wrapper svg {\n  height: 24rem;\n}\n\n::ng-deep .line-chart-wrapper .axis line {\n  stroke: #3b3a39 !important;\n}\n\n::ng-deep .line-chart-wrapper .y-axis {\n  color: #b3b2b6 !important;\n}\n\n::ng-deep .line-chart-wrapper .x-axis {\n  color: #94918e !important;\n}\n\n::ng-deep .line-chart-wrapper .line {\n  fill: none;\n  stroke-width: 3 !important;\n}\n\n::ng-deep .line-chart-wrapper .axis path,\n.axis line {\n  stroke: #32a0f3;\n}\n\n::ng-deep .line-chart-wrapper {\n  padding-top: 0px !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL2Nvc3RiYXNpcy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXHJlcG9ydHNcXGNvc3RiYXNpc1xcY29zdGJhc2lzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL3JlcG9ydHMvY29zdGJhc2lzL2Nvc3RiYXNpcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLGFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxTQUFBO0FDQ0Y7O0FERUE7RUFDRSxXQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0Usa0NBQUE7RUFDQSxtQkFBQTtFQUNBLDZCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBRUEsc0NBQUE7QUNDRjs7QURFQTtFQUNFO0lBQ0UsWUFBQTtFQ0NGO0FBQ0Y7O0FERUE7RUFDRTtJQUNFLFdBQUE7RUNBRjtBQUNGOztBREdBO0VBQ0UseUhBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ1RGOztBRFlBO0VBQ0Usd0hBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxpQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxtQkFBQTtFQUNBLGdCQUFBO0FDakJGOztBRG9CQTtFQUNFLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNqQkY7O0FEb0JBO0VBQ0UsYUFBQTtBQ2pCRjs7QURvQkE7RUFDRSwwQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSx5QkFBQTtBQ2pCRjs7QURvQkE7RUFDRSx5QkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxVQUFBO0VBQ0EsMEJBQUE7QUNqQkY7O0FEb0JBOztFQUVFLGVBQUE7QUNqQkY7O0FEb0JBO0VBQ0UsMkJBQUE7QUNqQkYiLCJmaWxlIjoic3JjL2FwcC9tYWluL3JlcG9ydHMvY29zdGJhc2lzL2Nvc3RiYXNpcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnJlZnJlc2gtc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogOHJlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNDYlO1xyXG4gIGxlZnQ6IDQ4JTtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XHJcbiAgY29sb3I6ICM2MDYyNjQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxNTBweDtcclxufVxyXG5cclxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XHJcbiAgem9vbTogMC41O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xyXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDE2MCwgMTYwKTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuXHJcbjo6bmctZGVlcCAuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmNyZWRpdCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxyXG4gICAgdG8gbGVmdCxcclxuICAgIHJnYigyMjAsIDEwMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigyMjUsIDExMCwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2JhKDIzMCwgMTE1LCAxMTUsIDEpIDMzJSxcclxuICAgIHJnYmEoMjQwLCAxMjAsIDEyMCwgMSkgNjclLFxyXG4gICAgcmdiYSgyNTAsIDEyNSwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2JhKDI1NSwgMTUwLCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG5cclxuLmxpbmUtY2hhcnQtd3JhcHBlciB7XHJcbiAgcGFkZGluZy10b3A6IDEuNnJlbTtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4uY2hhcnQtdGl0bGUge1xyXG4gIGZvbnQtc2l6ZTogMWVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgbGluZS1oZWlnaHQ6IDA7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIHN2ZyB7XHJcbiAgaGVpZ2h0OiAyNHJlbTtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5saW5lLWNoYXJ0LXdyYXBwZXIgLmF4aXMgbGluZSB7XHJcbiAgc3Ryb2tlOiAjM2IzYTM5ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIC55LWF4aXMge1xyXG4gIGNvbG9yOiAjYjNiMmI2ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIC54LWF4aXMge1xyXG4gIGNvbG9yOiAjOTQ5MThlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIC5saW5lIHtcclxuICBmaWxsOiBub25lO1xyXG4gIHN0cm9rZS13aWR0aDogMyAhaW1wb3J0YW50O1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmxpbmUtY2hhcnQtd3JhcHBlciAuYXhpcyBwYXRoLFxyXG4uYXhpcyBsaW5lIHtcclxuICBzdHJva2U6ICMzMmEwZjM7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIHtcclxuICBwYWRkaW5nLXRvcDogMHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuIiwiYm9keSxcbmh0bWwge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLnJlZnJlc2gtc3Bpbm5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiA4cmVtO1xuICBoZWlnaHQ6IDNyZW07XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA0NiU7XG4gIGxlZnQ6IDQ4JTtcbiAgYm9yZGVyOiAxcHggc29saWQgZ3JleTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZjZmJmZDtcbiAgY29sb3I6ICM2MDYyNjQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB6LWluZGV4OiAxMDAwO1xufVxuXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xuICB3aWR0aDogMTUwcHg7XG59XG5cbi5tYXQtZGF0ZXBpY2tlci1jb250ZW50IC5tYXQtY2FsZW5kYXIge1xuICB6b29tOiAwLjU7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICB3aWR0aDogMTBweDtcbiAgei1pbmRleDogMTAwMDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIC8qIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7ICovXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJvcmRlcjogNHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTBhMGEwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcbiAgICB3aWR0aDogMzIwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xuICAgIHdpZHRoOiBhdXRvO1xuICB9XG59XG46Om5nLWRlZXAgLmRlYml0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjNjRkYzY0IDAlLCAjNmVlMTZlIDE3JSwgIzczZTY3MyAzMyUsICM3OGYwNzggNjclLCAjN2RmYTdkIDgzJSwgIzk2ZmY5NiAxMDAlKTtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xuICB0ZXh0LWFsaWduOiBlbmQ7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbjo6bmctZGVlcCAuY3JlZGl0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsICNkYzY0NjQgMCUsICNlMTZlNmUgMTclLCAjZTY3MzczIDMzJSwgI2YwNzg3OCA2NyUsICNmYTdkN2QgODMlLCAjZmY5Njk2IDEwMCUpO1xuICBwYWRkaW5nLXJpZ2h0OiAxOHB4ICFpbXBvcnRhbnQ7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi5saW5lLWNoYXJ0LXdyYXBwZXIge1xuICBwYWRkaW5nLXRvcDogMS42cmVtO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4uY2hhcnQtdGl0bGUge1xuICBmb250LXNpemU6IDFlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbGluZS1oZWlnaHQ6IDA7XG59XG5cbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIHN2ZyB7XG4gIGhlaWdodDogMjRyZW07XG59XG5cbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIC5heGlzIGxpbmUge1xuICBzdHJva2U6ICMzYjNhMzkgIWltcG9ydGFudDtcbn1cblxuOjpuZy1kZWVwIC5saW5lLWNoYXJ0LXdyYXBwZXIgLnktYXhpcyB7XG4gIGNvbG9yOiAjYjNiMmI2ICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAubGluZS1jaGFydC13cmFwcGVyIC54LWF4aXMge1xuICBjb2xvcjogIzk0OTE4ZSAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLmxpbmUtY2hhcnQtd3JhcHBlciAubGluZSB7XG4gIGZpbGw6IG5vbmU7XG4gIHN0cm9rZS13aWR0aDogMyAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLmxpbmUtY2hhcnQtd3JhcHBlciAuYXhpcyBwYXRoLFxuLmF4aXMgbGluZSB7XG4gIHN0cm9rZTogIzMyYTBmMztcbn1cblxuOjpuZy1kZWVwIC5saW5lLWNoYXJ0LXdyYXBwZXIge1xuICBwYWRkaW5nLXRvcDogMHB4ICFpbXBvcnRhbnQ7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/reports/costbasis/costbasis.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/main/reports/costbasis/costbasis.component.ts ***!
  \***************************************************************/
/*! exports provided: CostBasisComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CostBasisComponent", function() { return CostBasisComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");















var CostBasisComponent = /** @class */ (function () {
    function CostBasisComponent(cdRef, cacheService, toastrService, dataService, financeService, reportsApiService, securityApiService, downloadExcelUtils) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.securityApiService = securityApiService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.costBasisConfig = {
            costBasisSize: 50,
            chartsSize: 50,
            costBasisView: true,
            chartsView: false,
            useTransition: true
        };
        this.fund = 'All Funds';
        // private filterSubject: Subject<string> = new Subject();
        this.filterBySymbol = '';
        this.isLoading = false;
        this.labels = [];
        this.selectedChartOption = 'CostBasis';
        this.selectedChartTitle = 'Cost Basis';
        this.chartOptions = [
            { key: 'CostBasis', value: 'Cost Basis' },
            { key: 'Balance', value: 'Balance' },
            { key: 'Quantity', value: 'Quantity' }
        ];
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["HeightStyle"])(220);
        this.propIDCostBasis = 'CostBasisLineChart';
        this.propIDBalance = 'BalanceLineChart';
        this.propIDQuantity = 'QuantityLineChart';
        this.divHeight = 200;
        this.divWidth = '95%';
        this.lineColors = ['#ff6960', '#00bd9a'];
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.graphObject = null;
        this.marketPriceChart = false;
        this.validDates = null;
        this.hideGrid = false;
    }
    CostBasisComponent.prototype.ngOnInit = function () {
        this.initGrid();
        // this.getLatestJournalDate();
        this.getValidDates();
        this.getFunds();
        // In case we need to enable filter by symbol from server side
        // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
        //   this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // });
    };
    CostBasisComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.initPageLayout();
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
            }
        });
    };
    CostBasisComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].costBasisConfigKey);
        if (config) {
            this.costBasisConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    CostBasisComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.costBasisConfig.costBasisSize = event.sizes[0];
            this.costBasisConfig.chartsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].costBasisConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].costBasisConfigKey,
            value: JSON.stringify(this.costBasisConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].costBasisConfigKey
        };
        if (!config) {
            this.cacheService.addUserConfig(payload).subscribe(function (response) {
                console.log('User Config Added');
            });
        }
        else {
            this.cacheService.updateUserConfig(payload).subscribe(function (response) {
                console.log('User Config Updated');
            });
        }
    };
    // getLatestJournalDate() {
    //   this.reportsApiService.getLatestJournalDate().subscribe(
    //     date => {
    //       if (date.isSuccessful && date.statusCode === 200) {
    //         this.journalDate = date.payload[0].when;
    //         this.startDate = this.journalDate;
    //         this.selectedDate = {
    //           startDate: moment(this.startDate, 'YYYY-MM-DD'),
    //           endDate: moment(this.endDate, 'YYYY-MM-DD')
    //         };
    //       }
    //     },
    //     error => {}
    //   );
    // }
    // Dates against which Data is Present
    CostBasisComponent.prototype.getValidDates = function () {
        var _this = this;
        this.reportsApiService.getValidDates('business_date', 'cost_basis').subscribe(function (resp) {
            if (resp.isSuccessful &&
                resp.statusCode === 200 &&
                resp.payload &&
                resp.payload.length > 0) {
                _this.validDates = resp.payload.map(function (x) { return moment__WEBPACK_IMPORTED_MODULE_2__(x, 'YYYY-MM-DD').format('YYYY-MM-DD'); });
                _this.journalDate = resp.payload[0];
                _this.startDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.endDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    CostBasisComponent.prototype.isInvalidDate = function (event) {
        if (event.isValid) {
            var date_1 = event.format('YYYY-MM-DD');
            if (!this.validDates) {
                return false;
            }
            else if (this.validDates.some(function (x) { return x === date_1; })) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    CostBasisComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_11__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            deltaRowDataMode: true,
            getRowNodeId: function (data) {
                return data.id;
            },
            onRowDataUpdated: function (params) {
                console.log('Data Updated ::', params);
            },
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'symbol',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'balance',
                    headerName: 'Exposure (at Cost)',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'quantity',
                    headerName: 'Quantity',
                    width: 100,
                    filter: true,
                    cellClass: 'rightAlign',
                    sortable: true,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'cost_basis',
                    headerName: 'Cost Basis',
                    width: 100,
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: costBasisFormatter
                },
                {
                    field: 'side',
                    width: 50,
                    headerName: 'Side',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'unrealized_pnl',
                    cellClass: 'rightAlign',
                    headerName: 'Unrealized P&L',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'unrealized_pnl_fx',
                    cellClass: 'rightAlign',
                    headerName: 'Unrealized P&L FX',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'realized_pnl',
                    cellClass: 'rightAlign',
                    headerName: 'Realized P&L',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'realized_pnl_fx',
                    cellClass: 'rightAlign',
                    headerName: 'Realized P&L FX',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'net',
                    cellClass: 'rightAlign',
                    headerName: 'Net P&L',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend',
                    cellClass: 'rightAlign',
                    headerName: 'Dividend',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend_withholding',
                    cellClass: 'rightAlign',
                    headerName: 'Withholding',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend_net',
                    cellClass: 'rightAlign',
                    headerName: 'Dividend Net',
                    valueFormatter: moneyFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridId"].costBasisId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridName"].costBasis, this.gridOptions);
        this.timeseriesOptions = {
            rowData: [],
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_11__["GridLayoutMenuComponent"] },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'business_date',
                    width: 120,
                    headerName: 'Date',
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'balance',
                    headerName: 'Exposure (at Cost)',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'quantity',
                    headerName: 'Quantity',
                    width: 100,
                    filter: true,
                    cellClass: 'rightAlign',
                    sortable: true,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'cost_basis',
                    headerName: 'Cost Basis',
                    width: 100,
                    filter: true,
                    cellClass: 'rightAlign',
                    sortable: true,
                    valueFormatter: costBasisFormatter
                },
                {
                    field: 'side',
                    width: 50,
                    sortable: true,
                    filter: true,
                    headerName: 'Side'
                },
                {
                    field: 'unrealized_pnl',
                    cellClass: 'rightAlign',
                    headerName: 'Unrealized P&L',
                    sortable: true,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'unrealized_pnl_fx',
                    cellClass: 'rightAlign',
                    headerName: 'Unrealized P&L FX',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'realized_pnl',
                    cellClass: 'rightAlign',
                    headerName: 'Realized P&L',
                    sortable: true,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'realized_pnl_fx',
                    cellClass: 'rightAlign',
                    headerName: 'Realized P&L FX',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'net',
                    cellClass: 'rightAlign',
                    headerName: 'Net P&L',
                    sortable: true,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend',
                    cellClass: 'rightAlign',
                    headerName: 'Dividend',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend_withholding',
                    cellClass: 'rightAlign',
                    headerName: 'Withholding',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dividend_net',
                    cellClass: 'rightAlign',
                    headerName: 'Dividend Net',
                    valueFormatter: moneyFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.timeseriesOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridId"].timeseriesId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridName"].timeseries, this.timeseriesOptions);
    };
    CostBasisComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    CostBasisComponent.prototype.getReport = function (date, symbol, fund) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getCostBasisReport(moment__WEBPACK_IMPORTED_MODULE_2__(date).format('YYYY-MM-DD'), symbol, fund)
            .subscribe(function (response) {
            _this.trialBalanceReportStats = response.stats;
            _this.trialBalanceReport = response.payload;
            if (_this.trialBalanceReport.length === 0) {
                _this.timeseriesOptions.api.setRowData([]);
                _this.costBasisConfig.chartsView = false;
            }
            _this.gridOptions.api.setRowData(_this.trialBalanceReport);
            _this.gridOptions.api.sizeColumnsToFit();
            _this.isLoading = false;
        });
    };
    CostBasisComponent.prototype.rowSelected = function (row) {
        var symbol = row.data.symbol;
        this.getMarketPriceData(symbol);
        this.getDataForCostBasisChart(symbol);
    };
    CostBasisComponent.prototype.getDataForCostBasisChart = function (symbol) {
        var _this = this;
        this.reportsApiService.getCostBasisChart(symbol).subscribe(function (response) {
            _this.chartData = response.payload;
            _this.chartData = _this.chartData.sort(function (x, y) {
                return new Date(y.business_date).getTime() - new Date(x.business_date).getTime();
            });
            _this.mapCostBasisData(response.payload, _this.selectedChartOption);
            _this.mapChartsData(response.payload);
            _this.timeseriesOptions.api.setRowData(_this.chartData);
            _this.timeseriesOptions.api.sizeColumnsToFit();
        });
    };
    CostBasisComponent.prototype.getMarketPriceData = function (symbol) {
        var _this = this;
        this.financeService.getMarketPriceForSymbol(symbol).subscribe(function (response) {
            _this.mapMarketPriceChartData(response.payload, symbol);
        });
    };
    CostBasisComponent.prototype.mapMarketPriceChartData = function (chartData, symbol) {
        var data = {};
        var toDate = chartData != null ? moment__WEBPACK_IMPORTED_MODULE_2__(chartData[0].BusinessDate).format('YYYY-MM-DD') : null;
        data[symbol] = [];
        // tslint:disable-next-line: forin
        for (var item in chartData) {
            data[symbol].push({
                date: moment__WEBPACK_IMPORTED_MODULE_2__(chartData[item].BusinessDate).format('YYYY-MM-DD'),
                value: chartData[item].Price
            });
        }
        this.graphObject = {
            xAxisLabel: 'Date',
            yAxisLabel: 'Symbol',
            lineColors: ['#ff6960', '#00bd9a'],
            height: 220,
            width: '95%',
            chartTitle: symbol,
            propId: 'marketPriceCostBasis',
            graphData: data,
            dateTimeFormat: 'YYYY-MM-DD',
            referenceDate: toDate
        };
        this.marketPriceChart = true;
    };
    CostBasisComponent.prototype.mapCostBasisData = function (data, chartType) {
        this.labels = data.map(function (item) { return item.Date; });
        this.cbData = {
            chartType: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.Date, 'YYYY-MM-DD'),
                value: item[chartType]
            }); })
        };
    };
    CostBasisComponent.prototype.mapChartsData = function (data) {
        this.labels = data.map(function (item) { return item.business_date; });
        this.bData = {
            Balance: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.business_date, 'YYYY-MM-DD'),
                value: item.balance
            }); })
        };
        this.qData = {
            Quantity: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.business_date, 'YYYY-MM-DD'),
                value: item.quantity
            }); })
        };
        this.unrealizedData = {
            unrealized_pnl: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.business_date, 'YYYY-MM-DD'),
                value: item.unrealized_pnl
            }); })
        };
        this.realizedData = {
            realized_pnl: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.business_date, 'YYYY-MM-DD'),
                value: item.realized_pnl
            }); })
        };
        this.netpnlData = {
            Pnl: data.map(function (item) { return ({
                date: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatDate"])(item.business_date, 'YYYY-MM-DD'),
                value: item.net
            }); })
        };
    };
    CostBasisComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    CostBasisComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    CostBasisComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    CostBasisComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.filterBySymbol, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    CostBasisComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    CostBasisComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    CostBasisComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'View Chart',
                action: function () {
                    params.node.setSelected(true);
                    _this.rowSelected(params.node);
                    _this.costBasisConfig.chartsView = true;
                }
            },
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.symbol).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.symbol, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.symbol, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
                                }
                            }, function (error) {
                                _this.isLoading = false;
                            });
                        }
                    }
                ]
            }
        ];
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_13__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    CostBasisComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    CostBasisComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    CostBasisComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    CostBasisComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    CostBasisComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    CostBasisComponent.prototype.changeChart = function (selectedChart) {
        this.selectedChartOption = selectedChart;
        this.selectedChartTitle = this.chartOptions.find(function (_a) {
            var key = _a.key;
            return selectedChart === key;
        }).value;
        if (this.chartData) {
            this.mapCostBasisData(this.chartData, this.selectedChartOption);
        }
    };
    CostBasisComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.selectedDate = null;
        this.DateRangeLabel = '';
        this.endDate = undefined;
        this.filterBySymbol = '';
        this.gridOptions.api.setRowData([]);
        this.timeseriesOptions.api.setRowData([]);
        this.costBasisConfig.chartsView = false;
    };
    CostBasisComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.timeseriesOptions.api.setRowData([]);
        this.costBasisConfig.chartsView = false;
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.endDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            this.getReport(startDate, this.filterBySymbol, 'ALL');
        }
    };
    CostBasisComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    CostBasisComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_4__["CacheService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__["ReportsApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_14__["CreateSecurityComponent"])
    ], CostBasisComponent.prototype, "securityModal", void 0);
    CostBasisComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-costbasis',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./costbasis.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/costbasis/costbasis.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./costbasis.component.scss */ "./src/app/main/reports/costbasis/costbasis.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_4__["CacheService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__["ReportsApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__["DownloadExcelUtils"]])
    ], CostBasisComponent);
    return CostBasisComponent;
}());

function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["DateFormatter"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["CommaSeparatedFormat"])(params.value);
}
function costBasisFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatNumber4"])(params.value);
}
function decimnalFormatter2(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatNumber2"])(params.value);
}
function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["MoneyFormat"])(params.value);
}
function absCurrencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["CommaSeparatedFormat"])(Math.abs(params.value));
}


/***/ }),

/***/ "./src/app/main/reports/historical-performance/historical-performance.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/main/reports/historical-performance/historical-performance.component.scss ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVwb3J0cy9oaXN0b3JpY2FsLXBlcmZvcm1hbmNlL2hpc3RvcmljYWwtcGVyZm9ybWFuY2UuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/reports/historical-performance/historical-performance.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/main/reports/historical-performance/historical-performance.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: HistoricalPerformanceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HistoricalPerformanceComponent", function() { return HistoricalPerformanceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");














var HistoricalPerformanceComponent = /** @class */ (function () {
    function HistoricalPerformanceComponent(dataService, toastrService, financeService, reportsApiService, securityApiService, downloadExcelUtils) {
        this.dataService = dataService;
        this.toastrService = toastrService;
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.securityApiService = securityApiService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.fund = 'All Funds';
        // private filterSubject: Subject<string> = new Subject();
        this.filterBySymbol = '';
        this.isLoading = false;
        this.labels = [];
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(220);
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
    }
    HistoricalPerformanceComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_2__();
        // In case we need to enable filter by symbol from server side
        // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
        //   this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // });
    };
    HistoricalPerformanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
            }
        });
    };
    HistoricalPerformanceComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.endDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.endDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    HistoricalPerformanceComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_10__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            groupIncludeFooter: true,
            suppressAggFuncInHeader: true,
            groupIncludeTotalFooter: true,
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            deltaRowDataMode: true,
            getRowNodeId: function (data) {
                return data.id;
            },
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'AsOf',
                    headerName: 'AsOf',
                    valueFormatter: dateFormatter
                    // rowGroup: true,
                    // enableRowGroup: true
                },
                {
                    field: 'DayPnl',
                    headerName: 'DayPnl',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'EodNav',
                    headerName: 'EodNav',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                    // rowGroup: true,
                    // enableRowGroup: true
                },
                {
                    field: 'Withdrawls',
                    headerName: 'WithDrawls',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Contributions',
                    headerName: 'Contributions',
                    cellClass: 'rightAlign',
                },
                {
                    field: 'DayPnlPer',
                    headerName: 'DayPnlPer',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'MtdPnlPer',
                    headerName: 'MtdPnlPer',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'QtdPnlPer',
                    headerName: 'QtdPnlPer',
                    // aggFunc: 'sum',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'YtdPnlPer',
                    headerName: 'YtdPnlPer',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'ItdPnlPer',
                    headerName: 'ItdPnlPer',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'MtdPnl',
                    headerName: 'MtdPnl',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'QtdPnl',
                    headerName: 'QtdPnl',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'YtdPnl',
                    headerName: 'YtdPnl',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'ItdPnl',
                    headerName: 'ItdPnl',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                }
            ],
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridId"].positionMarketValueAppraisalId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridName"].positionMarketValueAppraisal, this.gridOptions);
    };
    HistoricalPerformanceComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    HistoricalPerformanceComponent.prototype.getReport = function (startDate, endDate) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getHistoricPerformanceReport(startDate, endDate)
            .subscribe(function (response) {
            _this.reportData = response.payload;
            _this.gridOptions.api.setRowData(_this.reportData);
            _this.gridOptions.api.sizeColumnsToFit();
            _this.isLoading = false;
            _this.gridOptions.api.hideOverlay();
        });
    };
    HistoricalPerformanceComponent.prototype.rowSelected = function (row) { };
    HistoricalPerformanceComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    HistoricalPerformanceComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the Moment we react to each Key Stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    HistoricalPerformanceComponent.prototype.onFilterChanged = function () { };
    HistoricalPerformanceComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        // this.getReport(this.startDate, this.filterBySymbol, this.fund);
        this.getReport(this.startDate, this.endDate);
        this.gridOptions.api.onFilterChanged();
    };
    HistoricalPerformanceComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    HistoricalPerformanceComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.EzeTicker === null ? '' : node.data.EzeTicker;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    HistoricalPerformanceComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.EzeTicker).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.EzeTicker, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.EzeTicker, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
                                }
                            }, function (error) {
                                _this.isLoading = false;
                            });
                        }
                    }
                ]
            }
        ];
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_12__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    HistoricalPerformanceComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    HistoricalPerformanceComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    HistoricalPerformanceComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    HistoricalPerformanceComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        // this.getReport(
        //   this.startDate,
        //   this.filterBySymbol,
        //   this.fund === 'All Funds' ? 'ALL' : this.fund
        // );
        this.getReport(this.startDate, this.endDate);
        this.getRangeLabel();
    };
    HistoricalPerformanceComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        // this.getReport(
        //   this.startDate,
        //   this.filterBySymbol,
        //   this.fund === 'All Funds' ? 'ALL' : this.fund
        // );
        this.getReport(this.startDate, this.endDate);
    };
    HistoricalPerformanceComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.selectedDate = null;
        this.DateRangeLabel = '';
        this.endDate = undefined;
        this.filterBySymbol = '';
        this.gridOptions.api.setRowData([]);
    };
    HistoricalPerformanceComponent.prototype.refreshReport = function () {
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD')
            };
            // this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
            this.getReport(this.startDate, this.endDate);
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            var endDate = this.selectedDate.endDate.format('YYYY-MM-DD');
            this.getReport(startDate, endDate);
            // this.getReport(startDate, this.filterBySymbol, 'ALL');
        }
    };
    HistoricalPerformanceComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    HistoricalPerformanceComponent.prototype.ngOnDestroy = function () { };
    HistoricalPerformanceComponent.ctorParameters = function () { return [
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_5__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_6__["ReportsApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__["SecurityApiService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__["CreateSecurityComponent"])
    ], HistoricalPerformanceComponent.prototype, "securityModal", void 0);
    HistoricalPerformanceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-historical-performance',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./historical-performance.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/historical-performance/historical-performance.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./historical-performance.component.scss */ "./src/app/main/reports/historical-performance/historical-performance.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_common_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_5__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_6__["ReportsApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__["SecurityApiService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__["DownloadExcelUtils"]])
    ], HistoricalPerformanceComponent);
    return HistoricalPerformanceComponent;
}());

function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["DateFormatter"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["CommaSeparatedFormat"])(params.value);
}
function costBasisFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["FormatNumber4"])(params.value);
}
function decimnalFormatter2(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["FormatNumber2"])(params.value);
}
function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["MoneyFormat"])(params.value);
}
function absCurrencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["CommaSeparatedFormat"])(Math.abs(params.value));
}


/***/ }),

/***/ "./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.scss":
/*!*************************************************************************************************************!*\
  !*** ./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.scss ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVwb3J0cy9wb3NpdGlvbi1tYXJrZXQtdmFsdWUtYXBwcmFpc2FsL3Bvc2l0aW9uLW1hcmtldC12YWx1ZS1hcHByYWlzYWwuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.ts":
/*!***********************************************************************************************************!*\
  !*** ./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.ts ***!
  \***********************************************************************************************************/
/*! exports provided: PositionMarketValueAppraisalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PositionMarketValueAppraisalComponent", function() { return PositionMarketValueAppraisalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");















var PositionMarketValueAppraisalComponent = /** @class */ (function () {
    function PositionMarketValueAppraisalComponent(dataService, toastrService, financeService, reportsApiService, securityApiService, downloadExcelUtils) {
        this.dataService = dataService;
        this.toastrService = toastrService;
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.securityApiService = securityApiService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.fund = 'All Funds';
        // private filterSubject: Subject<string> = new Subject();
        this.filterBySymbol = '';
        this.isLoading = false;
        this.labels = [];
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["HeightStyle"])(220);
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
    }
    PositionMarketValueAppraisalComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_2__();
        // In case we need to enable filter by symbol from server side
        // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
        //   this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // });
    };
    PositionMarketValueAppraisalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
            }
        });
    };
    PositionMarketValueAppraisalComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.endDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    PositionMarketValueAppraisalComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            groupIncludeFooter: true,
            suppressAggFuncInHeader: true,
            groupIncludeTotalFooter: true,
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            deltaRowDataMode: true,
            getRowNodeId: function (data) {
                return data.id;
            },
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'position',
                    headerName: 'Position',
                    rowGroup: true,
                    enableRowGroup: true
                },
                {
                    field: 'SecurityType',
                    headerName: 'SecurityType',
                    rowGroup: true,
                    enableRowGroup: true
                },
                {
                    field: 'EzeTicker',
                    headerName: 'Symbol',
                    enableRowGroup: true,
                    rowGroup: true,
                },
                {
                    field: 'ISIN',
                    headerName: 'ISIN'
                },
                {
                    field: 'Sedol',
                    headerName: 'Sedol'
                },
                {
                    field: 'Cusip',
                    headerName: 'Cusip'
                },
                {
                    field: 'SecurityDesc',
                    headerName: 'Instrument Name'
                },
                {
                    field: 'quantity',
                    headerName: 'End Quantity',
                    aggFunc: 'sum',
                    enableValue: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'business_date',
                    headerName: 'Business Date',
                    cellClass: 'rightAlign',
                    valueFormatter: dateFormatter
                },
                {
                    field: 'cost_basis',
                    headerName: 'Cost Basis(Local)',
                    cellClass: 'rightAlign'
                },
                {
                    field: 'end_price',
                    headerName: 'End Price(Local)',
                    cellClass: 'rightAlign'
                },
                {
                    field: 'end_price_reporting',
                    headerName: 'End Price(Reporting)',
                    cellClass: 'rightAlign'
                },
                {
                    field: 'price_percent_change',
                    headerName: 'Price % Change',
                    cellClass: 'rightAlign',
                    valueFormatter: decimnalFormatter2
                },
                {
                    field: 'local_currency',
                    headerName: 'Local Currency'
                },
                {
                    field: 'fx_rate_to_reporting_currency',
                    headerName: 'FX Rate to Reporting Currency',
                    valueFormatter: decimnalFormatter4
                },
                {
                    field: 'end_market_value_local',
                    headerName: 'End Market Value(Local)',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'cost_local',
                    headerName: 'Cost(Local)',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealized_pnl_local',
                    headerName: 'Unrealized PnL(Local)',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'end_market_value_reporting',
                    headerName: 'End Market Value(Reporting)',
                    aggFunc: 'sum',
                    enableValue: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'cost_basis_reporting',
                    headerName: 'Cost(Reporting))',
                    cellClass: 'rightAlign',
                    aggFunc: 'sum',
                    enableValue: true,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealized_pnl_reporting',
                    headerName: 'Unrealized PnL(Reporting)',
                    aggFunc: 'sum',
                    enableValue: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                }
            ],
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridId"].positionMarketValueAppraisalId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridName"].positionMarketValueAppraisal, this.gridOptions);
    };
    PositionMarketValueAppraisalComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    PositionMarketValueAppraisalComponent.prototype.getReport = function (date, symbol, fund) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getPositionMarketValueAppraisalReport(moment__WEBPACK_IMPORTED_MODULE_2__(date).format('YYYY-MM-DD'))
            .subscribe(function (response) {
            _this.reportData = response.payload;
            _this.gridOptions.api.setRowData(_this.reportData);
            lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridUtils"].autoSizeAllColumns(_this.gridOptions);
            _this.isLoading = false;
            _this.gridOptions.api.hideOverlay();
        });
    };
    PositionMarketValueAppraisalComponent.prototype.rowSelected = function (row) { };
    PositionMarketValueAppraisalComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    PositionMarketValueAppraisalComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the Moment we react to each Key Stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    PositionMarketValueAppraisalComponent.prototype.onFilterChanged = function () { };
    PositionMarketValueAppraisalComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.filterBySymbol, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    PositionMarketValueAppraisalComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    PositionMarketValueAppraisalComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.EzeTicker === null ? '' : node.data.EzeTicker;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    PositionMarketValueAppraisalComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.EzeTicker).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.EzeTicker, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.EzeTicker, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
                                }
                            }, function (error) {
                                _this.isLoading = false;
                            });
                        }
                    }
                ]
            }
        ];
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_12__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    PositionMarketValueAppraisalComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    PositionMarketValueAppraisalComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    PositionMarketValueAppraisalComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    PositionMarketValueAppraisalComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    PositionMarketValueAppraisalComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    PositionMarketValueAppraisalComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.selectedDate = null;
        this.DateRangeLabel = '';
        this.endDate = undefined;
        this.filterBySymbol = '';
        this.gridOptions.api.setRowData([]);
    };
    PositionMarketValueAppraisalComponent.prototype.refreshReport = function () {
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.endDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, this.filterBySymbol, 'ALL');
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            this.getReport(startDate, this.filterBySymbol, 'ALL');
        }
    };
    PositionMarketValueAppraisalComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    PositionMarketValueAppraisalComponent.ctorParameters = function () { return [
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__["ReportsApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__["CreateSecurityComponent"])
    ], PositionMarketValueAppraisalComponent.prototype, "securityModal", void 0);
    PositionMarketValueAppraisalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-position-market-value-appraisal',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./position-market-value-appraisal.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./position-market-value-appraisal.component.scss */ "./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_7__["ReportsApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_10__["DownloadExcelUtils"]])
    ], PositionMarketValueAppraisalComponent);
    return PositionMarketValueAppraisalComponent;
}());

function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["DateFormatter"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["CommaSeparatedFormat"])(params.value);
}
function costBasisFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatNumber4"])(params.value);
}
function decimnalFormatter2(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatNumber2"])(params.value);
}
function decimnalFormatter4(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["FormatNumber4"])(params.value);
}
function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["MoneyFormat"])(params.value);
}
function absCurrencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["CommaSeparatedFormat"])(Math.abs(params.value));
}


/***/ }),

/***/ "./src/app/main/reports/reports.component.scss":
/*!*****************************************************!*\
  !*** ./src/app/main/reports/reports.component.scss ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxccmVwb3J0c1xccmVwb3J0cy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9yZXBvcnRzL3JlcG9ydHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsU0FBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxhQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFFBQUE7RUFDQSxTQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0UsWUFBQTtBQ0NGOztBREVBO0VBQ0UsU0FBQTtBQ0NGOztBREVBO0VBQ0UsV0FBQTtFQUNBLGFBQUE7QUNDRjs7QURFQTtFQUNFLGtDQUFBO0VBQ0EsbUJBQUE7RUFDQSw2QkFBQTtFQUNBLHlCQUFBO0VBQ0EsZUFBQTtFQUVBLHNDQUFBO0FDQ0Y7O0FERUE7RUFDRTtJQUNFLFlBQUE7RUNDRjtBQUNGOztBREVBO0VBQ0U7SUFDRSxXQUFBO0VDQUY7QUFDRjs7QURHQTtFQUNFLHlIQUFBO0VBU0EsOEJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUNURjs7QURZQTtFQUNFLHdIQUFBO0VBU0EsOEJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUNqQkY7O0FEb0JBO0VBQ0UsaUJBQUE7QUNqQkYiLCJmaWxlIjoic3JjL2FwcC9tYWluL3JlcG9ydHMvcmVwb3J0cy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnJlZnJlc2gtc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogOHJlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNDYlO1xyXG4gIGxlZnQ6IDQ4JTtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XHJcbiAgY29sb3I6ICM2MDYyNjQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxNTBweDtcclxufVxyXG5cclxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XHJcbiAgem9vbTogMC41O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xyXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDE2MCwgMTYwKTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuXHJcbjo6bmctZGVlcCAuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmNyZWRpdCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxyXG4gICAgdG8gbGVmdCxcclxuICAgIHJnYigyMjAsIDEwMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigyMjUsIDExMCwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2JhKDIzMCwgMTE1LCAxMTUsIDEpIDMzJSxcclxuICAgIHJnYmEoMjQwLCAxMjAsIDEyMCwgMSkgNjclLFxyXG4gICAgcmdiYSgyNTAsIDEyNSwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2JhKDI1NSwgMTUwLCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG4iLCJib2R5LFxuaHRtbCB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ucmVmcmVzaC1zcGlubmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDhyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDQ2JTtcbiAgbGVmdDogNDglO1xuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNmYmZkO1xuICBjb2xvcjogIzYwNjI2NDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHotaW5kZXg6IDEwMDA7XG59XG5cbi5tZC1kYXRlcGlja2VyLWlucHV0LWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxNTBweDtcbn1cblxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XG4gIHpvb206IDAuNTtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiAxMHB4O1xuICB6LWluZGV4OiAxMDAwO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgLyogYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDsgKi9cbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNhMGEwYTA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xuICAgIHdpZHRoOiAzMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XG4gICAgd2lkdGg6IGF1dG87XG4gIH1cbn1cbjo6bmctZGVlcCAuZGViaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM2NGRjNjQgMCUsICM2ZWUxNmUgMTclLCAjNzNlNjczIDMzJSwgIzc4ZjA3OCA2NyUsICM3ZGZhN2QgODMlLCAjOTZmZjk2IDEwMCUpO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDEwMCU7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuOjpuZy1kZWVwIC5jcmVkaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gbGVmdCwgI2RjNjQ2NCAwJSwgI2UxNmU2ZSAxNyUsICNlNjczNzMgMzMlLCAjZjA3ODc4IDY3JSwgI2ZhN2Q3ZCA4MyUsICNmZjk2OTYgMTAwJSk7XG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcbiAgdGV4dC1hbGlnbjogZW5kO1xuICBmb250LXdlaWdodDogNTAwO1xufVxuXG46Om5nLWRlZXAgLnJpZ2h0QWxpZ24ge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/reports/reports.component.ts":
/*!***************************************************!*\
  !*** ./src/app/main/reports/reports.component.ts ***!
  \***************************************************/
/*! exports provided: ReportsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsComponent", function() { return ReportsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");




var ReportsComponent = /** @class */ (function () {
    function ReportsComponent(dataService) {
        this.dataService = dataService;
        this.costBasisReportActive = true;
        this.taxLotReportActive = false;
        this.trialBalanceReportActive = false;
        this.positionMarketValueAppraisalActive = false;
        this.historicPerformanceActive = false;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__["Style"];
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
    }
    ReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
        });
    };
    ReportsComponent.prototype.activateCostBasisReport = function () {
        this.costBasisReportActive = true;
    };
    ReportsComponent.prototype.activateTaxLotReport = function () {
        this.taxLotReportActive = true;
    };
    ReportsComponent.prototype.activateTrialBalanceReport = function () {
        this.trialBalanceReportActive = true;
    };
    ReportsComponent.prototype.activatePositionMarketValueAppraisalReport = function () {
        this.positionMarketValueAppraisalActive = true;
    };
    ReportsComponent.prototype.activateHistoricReport = function () {
        this.historicPerformanceActive = true;
    };
    ReportsComponent.ctorParameters = function () { return [
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"] }
    ]; };
    ReportsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-reports',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./reports.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/reports.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./reports.component.scss */ "./src/app/main/reports/reports.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], ReportsComponent);
    return ReportsComponent;
}());



/***/ }),

/***/ "./src/app/main/reports/reports.module.ts":
/*!************************************************!*\
  !*** ./src/app/main/reports/reports.module.ts ***!
  \************************************************/
/*! exports provided: ReportsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsModule", function() { return ReportsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/fesm5/ngx-bootstrap-dropdown.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var ngcatalyst__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngcatalyst */ "./node_modules/ngcatalyst/fesm5/ngcatalyst.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _reports_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./reports.component */ "./src/app/main/reports/reports.component.ts");
/* harmony import */ var _costbasis_costbasis_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./costbasis/costbasis.component */ "./src/app/main/reports/costbasis/costbasis.component.ts");
/* harmony import */ var _taxlots_taxlots_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./taxlots/taxlots.component */ "./src/app/main/reports/taxlots/taxlots.component.ts");
/* harmony import */ var _taxlotstatus_taxlotstatus_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./taxlotstatus/taxlotstatus.component */ "./src/app/main/reports/taxlotstatus/taxlotstatus.component.ts");
/* harmony import */ var _trial_balance_trial_balance_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./trial-balance/trial-balance.component */ "./src/app/main/reports/trial-balance/trial-balance.component.ts");
/* harmony import */ var _balance_report_balance_report_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./balance-report/balance-report.component */ "./src/app/main/reports/balance-report/balance-report.component.ts");
/* harmony import */ var _position_market_value_appraisal_position_market_value_appraisal_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./position-market-value-appraisal/position-market-value-appraisal.component */ "./src/app/main/reports/position-market-value-appraisal/position-market-value-appraisal.component.ts");
/* harmony import */ var _historical_performance_historical_performance_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./historical-performance/historical-performance.component */ "./src/app/main/reports/historical-performance/historical-performance.component.ts");
/* harmony import */ var _reports_routes__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./reports.routes */ "./src/app/main/reports/reports.routes.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");






















var reportComponents = [
    _reports_component__WEBPACK_IMPORTED_MODULE_12__["ReportsComponent"],
    _costbasis_costbasis_component__WEBPACK_IMPORTED_MODULE_13__["CostBasisComponent"],
    _taxlots_taxlots_component__WEBPACK_IMPORTED_MODULE_14__["TaxLotsComponent"],
    _taxlotstatus_taxlotstatus_component__WEBPACK_IMPORTED_MODULE_15__["TaxLotStatusComponent"],
    _trial_balance_trial_balance_component__WEBPACK_IMPORTED_MODULE_16__["TrialBalanceComponent"],
    _balance_report_balance_report_component__WEBPACK_IMPORTED_MODULE_17__["BalanceReportComponent"],
    _position_market_value_appraisal_position_market_value_appraisal_component__WEBPACK_IMPORTED_MODULE_18__["PositionMarketValueAppraisalComponent"],
    _historical_performance_historical_performance_component__WEBPACK_IMPORTED_MODULE_19__["HistoricalPerformanceComponent"]
];
var ReportsModule = /** @class */ (function () {
    function ReportsModule() {
    }
    ReportsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: reportComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_reports_routes__WEBPACK_IMPORTED_MODULE_20__["ReportsRoutes"]),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__["TypeaheadModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TooltipModule"],
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_8__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                angular_split__WEBPACK_IMPORTED_MODULE_9__["AngularSplitModule"],
                ngcatalyst__WEBPACK_IMPORTED_MODULE_10__["NgcatalystModule"],
                lp_toolkit__WEBPACK_IMPORTED_MODULE_11__["LpToolkitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_21__["SharedModule"]
            ]
        })
    ], ReportsModule);
    return ReportsModule;
}());



/***/ }),

/***/ "./src/app/main/reports/reports.routes.ts":
/*!************************************************!*\
  !*** ./src/app/main/reports/reports.routes.ts ***!
  \************************************************/
/*! exports provided: ReportsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsRoutes", function() { return ReportsRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _reports_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reports.component */ "./src/app/main/reports/reports.component.ts");


var ReportsRoutes = [
    {
        path: '',
        component: _reports_component__WEBPACK_IMPORTED_MODULE_1__["ReportsComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/reports/taxlots/taxlots.component.scss":
/*!*************************************************************!*\
  !*** ./src/app/main/reports/taxlots/taxlots.component.scss ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL3RheGxvdHMvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXHVpL3NyY1xcYXBwXFxtYWluXFxyZXBvcnRzXFx0YXhsb3RzXFx0YXhsb3RzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL3JlcG9ydHMvdGF4bG90cy90YXhsb3RzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFLFNBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UsYUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7QUNDRjs7QURFQTtFQUNFLFlBQUE7QUNDRjs7QURFQTtFQUNFLFNBQUE7QUNDRjs7QURFQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsNkJBQUE7RUFDQSx5QkFBQTtFQUNBLGVBQUE7RUFFQSxzQ0FBQTtBQ0NGOztBREVBO0VBQ0U7SUFDRSxZQUFBO0VDQ0Y7QUFDRjs7QURFQTtFQUNFO0lBQ0UsV0FBQTtFQ0FGO0FBQ0Y7O0FER0E7RUFDRSx5SEFBQTtFQVNBLDhCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FDVEY7O0FEWUE7RUFDRSx3SEFBQTtFQVNBLDhCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FDakJGOztBRG9CQTtFQUNFLGlCQUFBO0FDakJGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9yZXBvcnRzL3RheGxvdHMvdGF4bG90cy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnJlZnJlc2gtc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogOHJlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNDYlO1xyXG4gIGxlZnQ6IDQ4JTtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XHJcbiAgY29sb3I6ICM2MDYyNjQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxNTBweDtcclxufVxyXG5cclxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XHJcbiAgem9vbTogMC41O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xyXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDE2MCwgMTYwKTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuXHJcbjo6bmctZGVlcCAuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmNyZWRpdCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxyXG4gICAgdG8gbGVmdCxcclxuICAgIHJnYigyMjAsIDEwMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigyMjUsIDExMCwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2JhKDIzMCwgMTE1LCAxMTUsIDEpIDMzJSxcclxuICAgIHJnYmEoMjQwLCAxMjAsIDEyMCwgMSkgNjclLFxyXG4gICAgcmdiYSgyNTAsIDEyNSwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2JhKDI1NSwgMTUwLCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG4iLCJib2R5LFxuaHRtbCB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ucmVmcmVzaC1zcGlubmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDhyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDQ2JTtcbiAgbGVmdDogNDglO1xuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNmYmZkO1xuICBjb2xvcjogIzYwNjI2NDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHotaW5kZXg6IDEwMDA7XG59XG5cbi5tZC1kYXRlcGlja2VyLWlucHV0LWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxNTBweDtcbn1cblxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XG4gIHpvb206IDAuNTtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiAxMHB4O1xuICB6LWluZGV4OiAxMDAwO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgLyogYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDsgKi9cbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNhMGEwYTA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xuICAgIHdpZHRoOiAzMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XG4gICAgd2lkdGg6IGF1dG87XG4gIH1cbn1cbjo6bmctZGVlcCAuZGViaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM2NGRjNjQgMCUsICM2ZWUxNmUgMTclLCAjNzNlNjczIDMzJSwgIzc4ZjA3OCA2NyUsICM3ZGZhN2QgODMlLCAjOTZmZjk2IDEwMCUpO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDEwMCU7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuOjpuZy1kZWVwIC5jcmVkaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gbGVmdCwgI2RjNjQ2NCAwJSwgI2UxNmU2ZSAxNyUsICNlNjczNzMgMzMlLCAjZjA3ODc4IDY3JSwgI2ZhN2Q3ZCA4MyUsICNmZjk2OTYgMTAwJSk7XG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcbiAgdGV4dC1hbGlnbjogZW5kO1xuICBmb250LXdlaWdodDogNTAwO1xufVxuXG46Om5nLWRlZXAgLnJpZ2h0QWxpZ24ge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/reports/taxlots/taxlots.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/main/reports/taxlots/taxlots.component.ts ***!
  \***********************************************************/
/*! exports provided: TaxLotsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxLotsComponent", function() { return TaxLotsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/grid-layout-menu/grid-layout-menu.component */ "./src/shared/Component/grid-layout-menu/grid-layout-menu.component.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");











var TaxLotsComponent = /** @class */ (function () {
    function TaxLotsComponent(financeService, reportsApiService, dataService, downloadExcelUtils) {
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.dataService = dataService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.fund = 'All Funds';
        this.isLoading = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["HeightStyle"])(220);
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
    }
    TaxLotsComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getFunds();
        //this.getReport(null, null, 'ALL');
    };
    TaxLotsComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_6__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            /* Custom Method Binding for External Filters from Grid Layout Component */
            isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            getExternalFilterState: this.getExternalFilterState.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                //AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            columnDefs: [
                {
                    field: 'closing_lot_id',
                    width: 120,
                    headerName: 'Closing Tax Lot',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'open_lot_id',
                    width: 120,
                    headerName: 'Open Tax Lot',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'business_date',
                    width: 120,
                    headerName: 'Business Date',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'realized_pnl',
                    width: 120,
                    headerName: 'Realized P&L',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'trade_price',
                    width: 120,
                    headerName: 'Opening Price',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign'
                },
                {
                    field: 'cost_basis',
                    width: 120,
                    headerName: 'Closing Price',
                    sortable: true,
                    cellClass: 'rightAlign',
                    filter: true
                },
                {
                    field: 'quantity',
                    headerName: 'Quantity',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: absCurrencyFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_8__["GridId"].taxlotId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_8__["GridName"].taxlot, this.gridOptions);
    };
    TaxLotsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
                _this.getReport(null, null, 'ALL');
            }
        });
    };
    TaxLotsComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    TaxLotsComponent.prototype.getReport = function (toDate, fromDate, fund) {
        var _this = this;
        this.isLoading = true;
        this.reportsApiService.getTaxLotsReport(toDate, fromDate, fund).subscribe(function (response) {
            _this.stats = response.stats;
            _this.data = response.payload;
            _this.isLoading = false;
            _this.gridOptions.api.sizeColumnsToFit();
            _this.gridOptions.api.setRowData(_this.data);
        });
    };
    TaxLotsComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    TaxLotsComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.endDate, this.fund);
    };
    TaxLotsComponent.prototype.isExternalFilterPresent = function () { };
    TaxLotsComponent.prototype.doesExternalFilterPass = function (node) { };
    TaxLotsComponent.prototype.getContextMenuItems = function (params) {
        //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__["GetContextMenu"])(true, null, true, null, params);
    };
    TaxLotsComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    TaxLotsComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    TaxLotsComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.selected = null;
        this.DateRangeLabel = '';
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_4__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_4__();
        this.getReport(null, null, 'ALL');
    };
    TaxLotsComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            dateFilter: { startDate: this.startDate, endDate: this.endDate }
        };
    };
    TaxLotsComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    TaxLotsComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    TaxLotsComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Trial Balance Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    TaxLotsComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.clearFilters();
        this.getReport(null, null, 'ALL');
    };
    TaxLotsComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__["DownloadExcelUtils"] }
    ]; };
    TaxLotsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-taxlots',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./taxlots.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlots/taxlots.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./taxlots.component.scss */ "./src/app/main/reports/taxlots/taxlots.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_9__["DownloadExcelUtils"]])
    ], TaxLotsComponent);
    return TaxLotsComponent;
}());

function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["CommaSeparatedFormat"])(params.value);
}
function absCurrencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["CommaSeparatedFormat"])(Math.abs(params.value));
}


/***/ }),

/***/ "./src/app/main/reports/taxlotstatus/taxlotstatus.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/main/reports/taxlotstatus/taxlotstatus.component.scss ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n\n::ng-deep .loader-wrapper .spinner-grow {\n  width: 2rem !important;\n  height: 2rem !important;\n}\n\n.mtop-15 {\n  margin-top: 15%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL3RheGxvdHN0YXR1cy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXHJlcG9ydHNcXHRheGxvdHN0YXR1c1xcdGF4bG90c3RhdHVzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL3JlcG9ydHMvdGF4bG90c3RhdHVzL3RheGxvdHN0YXR1cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLGFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxTQUFBO0FDQ0Y7O0FERUE7RUFDRSxXQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0Usa0NBQUE7RUFDQSxtQkFBQTtFQUNBLDZCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBRUEsc0NBQUE7QUNDRjs7QURFQTtFQUNFO0lBQ0UsWUFBQTtFQ0NGO0FBQ0Y7O0FERUE7RUFDRTtJQUNFLFdBQUE7RUNBRjtBQUNGOztBREdBO0VBQ0UseUhBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ1RGOztBRFlBO0VBQ0Usd0hBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxpQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxzQkFBQTtFQUNBLHVCQUFBO0FDakJGOztBRG9CQTtFQUNFLGVBQUE7QUNqQkYiLCJmaWxlIjoic3JjL2FwcC9tYWluL3JlcG9ydHMvdGF4bG90c3RhdHVzL3RheGxvdHN0YXR1cy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnJlZnJlc2gtc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogOHJlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNDYlO1xyXG4gIGxlZnQ6IDQ4JTtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XHJcbiAgY29sb3I6ICM2MDYyNjQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxNTBweDtcclxufVxyXG5cclxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XHJcbiAgem9vbTogMC41O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xyXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDE2MCwgMTYwKTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuXHJcbjo6bmctZGVlcCAuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmNyZWRpdCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxyXG4gICAgdG8gbGVmdCxcclxuICAgIHJnYigyMjAsIDEwMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigyMjUsIDExMCwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2JhKDIzMCwgMTE1LCAxMTUsIDEpIDMzJSxcclxuICAgIHJnYmEoMjQwLCAxMjAsIDEyMCwgMSkgNjclLFxyXG4gICAgcmdiYSgyNTAsIDEyNSwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2JhKDI1NSwgMTUwLCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5sb2FkZXItd3JhcHBlciAuc3Bpbm5lci1ncm93IHtcclxuICB3aWR0aDogMnJlbSAhaW1wb3J0YW50O1xyXG4gIGhlaWdodDogMnJlbSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubXRvcC0xNSB7XHJcbiAgbWFyZ2luLXRvcDogMTUlO1xyXG59XHJcbiIsImJvZHksXG5odG1sIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5yZWZyZXNoLXNwaW5uZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogOHJlbTtcbiAgaGVpZ2h0OiAzcmVtO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNDYlO1xuICBsZWZ0OiA0OCU7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XG4gIGNvbG9yOiAjNjA2MjY0O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgei1pbmRleDogMTAwMDtcbn1cblxuLm1kLWRhdGVwaWNrZXItaW5wdXQtY29udGFpbmVyIHtcbiAgd2lkdGg6IDE1MHB4O1xufVxuXG4ubWF0LWRhdGVwaWNrZXItY29udGVudCAubWF0LWNhbGVuZGFyIHtcbiAgem9vbTogMC41O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDEwcHg7XG4gIHotaW5kZXg6IDEwMDA7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBib3JkZXI6IDRweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2EwYTBhMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICAtd2Via2l0LXRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XG4gICAgd2lkdGg6IDMyMHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxufVxuOjpuZy1kZWVwIC5kZWJpdCB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgIzY0ZGM2NCAwJSwgIzZlZTE2ZSAxNyUsICM3M2U2NzMgMzMlLCAjNzhmMDc4IDY3JSwgIzdkZmE3ZCA4MyUsICM5NmZmOTYgMTAwJSk7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwMCUgMTAwJTtcbiAgdGV4dC1hbGlnbjogZW5kO1xuICBmb250LXdlaWdodDogNTAwO1xufVxuXG46Om5nLWRlZXAgLmNyZWRpdCB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBsZWZ0LCAjZGM2NDY0IDAlLCAjZTE2ZTZlIDE3JSwgI2U2NzM3MyAzMyUsICNmMDc4NzggNjclLCAjZmE3ZDdkIDgzJSwgI2ZmOTY5NiAxMDAlKTtcbiAgcGFkZGluZy1yaWdodDogMThweCAhaW1wb3J0YW50O1xuICB0ZXh0LWFsaWduOiBlbmQ7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbjo6bmctZGVlcCAucmlnaHRBbGlnbiB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG46Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xuICB3aWR0aDogMnJlbSAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDJyZW0gIWltcG9ydGFudDtcbn1cblxuLm10b3AtMTUge1xuICBtYXJnaW4tdG9wOiAxNSU7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/reports/taxlotstatus/taxlotstatus.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/main/reports/taxlotstatus/taxlotstatus.component.ts ***!
  \*********************************************************************/
/*! exports provided: TaxLotStatusComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxLotStatusComponent", function() { return TaxLotStatusComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/Modal/create-dividend/create-dividend.component */ "./src/shared/Modal/create-dividend/create-dividend.component.ts");
/* harmony import */ var src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/Modal/create-stock-splits/create-stock-splits.component */ "./src/shared/Modal/create-stock-splits/create-stock-splits.component.ts");
/* harmony import */ var _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./../../../../shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/Component/data-modal/data-modal.component */ "./src/shared/Component/data-modal/data-modal.component.ts");
/* harmony import */ var src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! src/shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");























var TaxLotStatusComponent = /** @class */ (function () {
    function TaxLotStatusComponent(cdRef, cacheService, dataService, financeService, reportsApiService, securityApiService, agGridUtils, dataDictionary, downloadExcelUtils, toastrService) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.dataService = dataService;
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.securityApiService = securityApiService;
        this.agGridUtils = agGridUtils;
        this.dataDictionary = dataDictionary;
        this.downloadExcelUtils = downloadExcelUtils;
        this.toastrService = toastrService;
        this.fund = 'All Funds';
        this.isLoading = false;
        this.isExpanded = false;
        this.taxLotStatusHorizontalConfig = {
            taxLotStatusSize: 50,
            closingTaxLotSize: 50,
            taxLotStatusView: true,
            closingTaxLotView: false,
            useTransition: true
        };
        this.taxLotStatusVerticalConfig = {
            closingTaxLotSize: 50,
            journalSize: 50,
            closingTaxLotView: true,
            journalView: false,
            useTransition: true
        };
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["HeightStyle"])(220);
        // private filterSubject: Subject<string> = new Subject();
        this.filterBySymbol = '';
        this.tradeSelectionSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.tradeSelectionChanged = this.tradeSelectionSubject.asObservable();
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
    }
    TaxLotStatusComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_5__();
        // Comment out this API call, In case we need to enable filter from server side
        // this.getReport(
        //   this.startDate,
        //   this.endDate,
        //   this.filterBySymbol,
        //   this.fund === 'All Funds' ? 'ALL' : this.fund
        // );
        // In case we need to enable filter by Symbol from Server Side
        // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
        //   this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // });
    };
    TaxLotStatusComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.initPageLayout();
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
            }
        });
    };
    TaxLotStatusComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var horizontalConfig = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusHorizontalConfigKey);
        var verticalConfig = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusVerticalConfigKey);
        if (horizontalConfig) {
            this.taxLotStatusHorizontalConfig = JSON.parse(horizontalConfig.value);
        }
        if (verticalConfig) {
            this.taxLotStatusVerticalConfig = JSON.parse(verticalConfig.value);
        }
        this.cdRef.detectChanges();
    };
    TaxLotStatusComponent.prototype.applyHorizontalPageLayout = function (event) {
        if (event.sizes) {
            this.taxLotStatusHorizontalConfig.taxLotStatusSize = event.sizes[0];
            this.taxLotStatusHorizontalConfig.closingTaxLotSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusHorizontalConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusHorizontalConfigKey,
            value: JSON.stringify(this.taxLotStatusHorizontalConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusHorizontalConfigKey
        };
        if (!config) {
            this.cacheService.addUserConfig(payload).subscribe(function (response) {
                console.log('User Config Added');
            });
        }
        else {
            this.cacheService.updateUserConfig(payload).subscribe(function (response) {
                console.log('User Config Updated');
            });
        }
    };
    TaxLotStatusComponent.prototype.applyVerticalPageLayout = function (event) {
        if (event.sizes) {
            this.taxLotStatusVerticalConfig.closingTaxLotSize = event.sizes[0];
            this.taxLotStatusVerticalConfig.journalSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusVerticalConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusVerticalConfigKey,
            value: JSON.stringify(this.taxLotStatusVerticalConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["LayoutConfig"].taxLotStatusVerticalConfigKey
        };
        if (!config) {
            this.cacheService.addUserConfig(payload).subscribe(function (response) {
                console.log('User Config Added');
            });
        }
        else {
            this.cacheService.updateUserConfig(payload).subscribe(function (response) {
                console.log('User Config Updated');
            });
        }
    };
    TaxLotStatusComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selected = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_5__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_5__(_this.startDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    TaxLotStatusComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_11__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            columnDefs: [
                {
                    field: 'open_id',
                    width: 120,
                    headerName: 'Order Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
                {
                    field: 'trade_date',
                    width: 120,
                    headerName: 'Trade Date',
                    sortable: true,
                    filter: true,
                    valueFormatter: dateFormatter
                },
                /*
                {
                  field: 'business_date',
                  width: 120,
                  headerName: 'Date',
                  sortable: true,
                  filter: true,
                  valueFormatter: dateFormatter
                },
                */
                {
                    field: 'symbol',
                    width: 120,
                    headerName: 'Symbol',
                    rowGroup: true,
                    enableRowGroup: true,
                    sortable: true,
                    filter: true
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    sortable: true,
                    filter: true,
                    width: 120
                },
                {
                    field: 'side',
                    headerName: 'Side',
                    sortable: true,
                    filter: true,
                    width: 100
                },
                {
                    field: 'original_quantity',
                    headerName: 'Orig Qty',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter,
                    aggFunc: 'sum',
                    enableValue: true,
                },
                {
                    field: 'quantity',
                    headerName: 'Rem Qty',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter,
                    aggFunc: 'sum',
                    enableValue: true,
                },
                {
                    field: 'investment_at_cost',
                    headerName: 'IoC (USD)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'eod_px',
                    headerName: 'EOD px (Local)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["priceFormatterEx"]
                },
                {
                    field: 'trade_price',
                    headerName: 'Trade px (Local)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["priceFormatterEx"]
                },
                {
                    field: 'realized',
                    headerName: 'Realized (USD)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                },
                {
                    field: 'unrealized',
                    headerName: 'Unrealized (USD)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                },
                {
                    field: 'net',
                    headerName: 'Net P&L (USD)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                },
                {
                    field: 'original_investment_at_cost',
                    headerName: 'IoC (Local)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                },
                {
                    field: 'residual_investment_at_cost',
                    headerName: 'Residual IoC (Local)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridId"].taxlotStatusId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridName"].taxlotStatus, this.gridOptions);
        this.closingTaxLots = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_11__["GridLayoutMenuComponent"] },
            onRowDoubleClicked: this.onClosingTaxLotsRowDoubleClicked.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.closingTaxLots.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            columnDefs: [
                {
                    field: 'open_lot_id',
                    width: 120,
                    headerName: 'Open Tax Lot',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'closing_lot_id',
                    width: 120,
                    headerName: 'Closing Tax Lot',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'trade_date',
                    width: 120,
                    headerName: 'Trade Date',
                    sortable: true,
                    filter: true,
                    valueFormatter: dateFormatter
                },
                /*
                {
                  field: 'business_date',
                  width: 120,
                  headerName: 'Business Date',
                  sortable: true,
                  filter: true,
                  valueFormatter: dateFormatter
                },
                */
                {
                    field: 'realized_pnl',
                    width: 120,
                    headerName: 'Realized P&L',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'quantity',
                    headerName: 'Quantity',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'cost_basis',
                    width: 120,
                    headerName: 'Closing Price',
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: priceFormatter,
                    filter: true
                },
                {
                    field: 'trade_price',
                    width: 120,
                    headerName: 'Opening Price',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: priceFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.closingTaxLots.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridId"].closingTaxLotId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_12__["GridName"].closingTaxLots, this.closingTaxLots);
    };
    TaxLotStatusComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    TaxLotStatusComponent.prototype.getReport = function (toDate, fromDate, symbol, fund) {
        var _this = this;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getTaxLotReport(moment__WEBPACK_IMPORTED_MODULE_5__(toDate).format('YYYY-MM-DD'), moment__WEBPACK_IMPORTED_MODULE_5__(fromDate).format('YYYY-MM-DD'), symbol, fund, false)
            .subscribe(function (response) {
            _this.stats = response.stats;
            _this.data = response.payload;
            _this.gridOptions.api.sizeColumnsToFit();
            _this.gridOptions.api.setRowData(_this.data);
            _this.gridOptions.api.expandAll();
            _this.gridOptions.api.hideOverlay();
        }, function (error) {
            _this.gridOptions.api.hideOverlay();
        });
    };
    TaxLotStatusComponent.prototype.onTaxLotSelection = function (lporderid) {
        var _this = this;
        var startDate = this.selected.startDate.format('YYYY-MM-DD');
        var endDate = this.selected.endDate.format('YYYY-MM-DD');
        this.reportsApiService.getClosingTaxLots(lporderid, startDate, endDate).subscribe(function (response) {
            // this.stats = response.stats;
            // this.data = response.data;
            _this.closingTaxLots.api.sizeColumnsToFit();
            _this.closingTaxLots.api.setRowData(response.payload);
            if (response.payload.length === 0) {
                _this.tradeSelectionSubject.next('');
            }
            else {
                _this.tradeSelectionSubject.next(response.payload[0].closing_lot_id);
            }
        });
    };
    TaxLotStatusComponent.prototype.onRowDoubleClicked = function (params) {
        var open_id = params.data.open_id;
        this.getTrade(open_id);
    };
    TaxLotStatusComponent.prototype.onClosingTaxLotsRowDoubleClicked = function (params) {
        var closing_lot_id = params.data.closing_lot_id;
        this.getTrade(closing_lot_id);
    };
    TaxLotStatusComponent.prototype.getTrade = function (tradeId) {
        var _this = this;
        this.isLoading = true;
        this.financeService
            .getTrade(tradeId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () { return (_this.isLoading = false); }))
            .subscribe(function (response) {
            _this.dataModal.openModal(response[0], null, true);
        }, function (error) { });
    };
    TaxLotStatusComponent.prototype.onRowSelected = function (event) {
        if (event.node.selected) {
            this.onTaxLotSelection(event.node.data.open_id);
        }
    };
    TaxLotStatusComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    TaxLotStatusComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.gridOptions.api.onFilterChanged();
    };
    TaxLotStatusComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    TaxLotStatusComponent.prototype.doesExternalFilterPass = function (node) {
        // Client Side Filters
        // if (this.fund !== 'All Funds' && this.filterBySymbol !== '' && this.startDate) {
        //   const cellFund = node.data.fund;
        //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
        //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
        //   return (
        //     cellFund === this.fund &&
        //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        //     this.startDate <= cellDate &&
        //     this.endDate >= cellDate
        //   );
        // }
        // if (this.fund !== 'All Funds' && this.filterBySymbol !== '') {
        //   const cellFund = node.data.fund;
        //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
        //   return cellFund === this.fund && cellSymbol.includes(this.filterBySymbol);
        // }
        // if (this.fund !== 'All Funds' && this.startDate) {
        //   const cellFund = node.data.fund;
        //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
        //   return cellFund === this.fund && this.startDate <= cellDate && this.endDate >= cellDate;
        // }
        // if (this.filterBySymbol !== '' && this.startDate) {
        //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
        //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
        //   return (
        //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        //     this.startDate <= cellDate &&
        //     this.endDate >= cellDate
        //   );
        // }
        // if (this.fund !== 'All Funds') {
        //   const cellFund = node.data.fund;
        //   return cellFund === this.fund;
        // }
        // if (this.startDate) {
        //   const cellDate = moment(node.data.trade_date).format('YYYY-MM-DD');
        //   return this.startDate <= cellDate && this.endDate >= cellDate;
        // }
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    TaxLotStatusComponent.prototype.openDataGridModal = function (rowData) {
        var _this = this;
        var open_id = rowData.open_id;
        this.financeService
            .getTradeJournals(open_id, '', '')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () { return _this.gridOptions.api.hideOverlay(); }))
            .subscribe(function (response) {
            var data = response.data, meta = response.meta;
            var someArray = _this.agGridUtils.columizeData(data, meta.Columns);
            var columns = _this.dataDictionary.getTradeJournalColDefs(meta.Columns);
            _this.dataGridModal.openModal(columns, someArray);
        });
    };
    TaxLotStatusComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'View Journals',
                action: function () {
                    _this.gridOptions.api.showLoadingOverlay();
                    _this.openDataGridModal(params.node.data);
                }
            },
            {
                name: 'Corporate Actions',
                subMenu: [
                    {
                        name: 'Create Dividend',
                        action: function () {
                            _this.dividendModal.openDividendModalFromOutside(params.node.data.symbol);
                        }
                    },
                    {
                        name: 'Create Stock Split',
                        action: function () {
                            _this.stockSplitsModal.openStockSplitModalFromOutside(params.node.data.symbol);
                        }
                    }
                ]
            },
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.symbol).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.symbol, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.symbol, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
                                }
                            }, function (error) {
                                _this.isLoading = false;
                            });
                        },
                    }
                ]
            }
        ];
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_20__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    // getDataForSecurityModal(symbol) {
    //   const config = this.securityApiService.getSecurityConfig(symbol);
    //   const securityDetails = this.securityApiService.getSecurityDetail(symbol);
    //   return forkJoin([
    //     config,
    //     securityDetails
    //   ]);
    // }
    TaxLotStatusComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    TaxLotStatusComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    TaxLotStatusComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        if (this.selected.startDate == null) {
            this.selected = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_5__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_5__(this.journalDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, this.journalDate, this.filterBySymbol, 'ALL');
        }
        else {
            var startDate = this.selected.startDate.format('YYYY-MM-DD');
            var endDate = this.selected.endDate.format('YYYY-MM-DD');
            this.getReport(startDate, endDate, this.filterBySymbol, 'ALL');
        }
    };
    TaxLotStatusComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.selected = null;
        this.filterBySymbol = '';
        // Client Side Filters
        // this.gridOptions.api.setRowData(this.data);
        // Server Side Filters
        this.gridOptions.api.setRowData([]);
        this.closingTaxLots.api.setRowData([]);
        this.tradeSelectionSubject.next('');
    };
    TaxLotStatusComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    TaxLotStatusComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    TaxLotStatusComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: { startDate: this.startDate, endDate: this.endDate }
        };
    };
    TaxLotStatusComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        // In case we need to enable filter from Server Side
        this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
        // this.gridOptions.api.onFilterChanged();
    };
    TaxLotStatusComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        // In case we need to enable from Server Side
        this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // this.gridOptions.api.onFilterChanged();
    };
    TaxLotStatusComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Tax Lot Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    TaxLotStatusComponent.prototype.onTradeRowSelected = function (event) {
        if (event.node.selected) {
            this.tradeSelectionSubject.next(event.node.data.closing_lot_id);
        }
    };
    TaxLotStatusComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_1__["CacheService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__["DataService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__["ReportsApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__["SecurityApiService"] },
        { type: src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_18__["AgGridUtils"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_19__["DataDictionary"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_21__["DownloadExcelUtils"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('dataModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_17__["DataModalComponent"])
    ], TaxLotStatusComponent.prototype, "dataModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_13__["DataGridModalComponent"])
    ], TaxLotStatusComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('dividendModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_14__["CreateDividendComponent"])
    ], TaxLotStatusComponent.prototype, "dividendModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('stockSplitsModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_15__["CreateStockSplitsComponent"])
    ], TaxLotStatusComponent.prototype, "stockSplitsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_16__["CreateSecurityComponent"])
    ], TaxLotStatusComponent.prototype, "securityModal", void 0);
    TaxLotStatusComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'rep-taxlotstatus',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./taxlotstatus.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/taxlotstatus/taxlotstatus.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./taxlotstatus.component.scss */ "./src/app/main/reports/taxlotstatus/taxlotstatus.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_1__["CacheService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__["DataService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__["ReportsApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__["SecurityApiService"],
            src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_18__["AgGridUtils"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_19__["DataDictionary"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_21__["DownloadExcelUtils"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"]])
    ], TaxLotStatusComponent);
    return TaxLotStatusComponent;
}());

function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["MoneyFormat"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["CommaSeparatedFormat"])(params.value);
}
function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["DateFormatter"])(params.value);
}
function priceFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_22__["FormatNumber4"])(params.value);
}


/***/ }),

/***/ "./src/app/main/reports/trial-balance/trial-balance.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/main/reports/trial-balance/trial-balance.component.scss ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZXBvcnRzL3RyaWFsLWJhbGFuY2UvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXHVpL3NyY1xcYXBwXFxtYWluXFxyZXBvcnRzXFx0cmlhbC1iYWxhbmNlXFx0cmlhbC1iYWxhbmNlLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL3JlcG9ydHMvdHJpYWwtYmFsYW5jZS90cmlhbC1iYWxhbmNlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFLFNBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UsYUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7QUNDRjs7QURFQTtFQUNFLFlBQUE7QUNDRjs7QURFQTtFQUNFLFNBQUE7QUNDRjs7QURFQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsNkJBQUE7RUFDQSx5QkFBQTtFQUNBLGVBQUE7RUFFQSxzQ0FBQTtBQ0NGOztBREVBO0VBQ0U7SUFDRSxZQUFBO0VDQ0Y7QUFDRjs7QURFQTtFQUNFO0lBQ0UsV0FBQTtFQ0FGO0FBQ0Y7O0FER0E7RUFDRSx5SEFBQTtFQVNBLDhCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FDVEY7O0FEWUE7RUFDRSx3SEFBQTtFQVNBLDhCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FDakJGOztBRG9CQTtFQUNFLGlCQUFBO0FDakJGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9yZXBvcnRzL3RyaWFsLWJhbGFuY2UvdHJpYWwtYmFsYW5jZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksXHJcbmh0bWwge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLnJlZnJlc2gtc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogOHJlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNDYlO1xyXG4gIGxlZnQ6IDQ4JTtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmY2ZiZmQ7XHJcbiAgY29sb3I6ICM2MDYyNjQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxNTBweDtcclxufVxyXG5cclxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XHJcbiAgem9vbTogMC41O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OyAqL1xyXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDE2MCwgMTYwKTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuXHJcbjo6bmctZGVlcCAuZGViaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIHJpZ2h0LFxyXG4gICAgcmdiKDEwMCwgMjIwLCAxMDAsIDEpIDAlLFxyXG4gICAgcmdiKDExMCwgMjI1LCAxMTAsIDEpIDE3JSxcclxuICAgIHJnYigxMTUsIDIzMCwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDEyMCwgMjQwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYigxMjUsIDI1MCwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2IoMTUwLCAyNTUsIDE1MCwgMSkgMTAwJVxyXG4gICk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGVuZDtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmNyZWRpdCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxyXG4gICAgdG8gbGVmdCxcclxuICAgIHJnYigyMjAsIDEwMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigyMjUsIDExMCwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2JhKDIzMCwgMTE1LCAxMTUsIDEpIDMzJSxcclxuICAgIHJnYmEoMjQwLCAxMjAsIDEyMCwgMSkgNjclLFxyXG4gICAgcmdiYSgyNTAsIDEyNSwgMTI1LCAxKSA4MyUsXHJcbiAgICByZ2JhKDI1NSwgMTUwLCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG4iLCJib2R5LFxuaHRtbCB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ucmVmcmVzaC1zcGlubmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDhyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDQ2JTtcbiAgbGVmdDogNDglO1xuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNmYmZkO1xuICBjb2xvcjogIzYwNjI2NDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHotaW5kZXg6IDEwMDA7XG59XG5cbi5tZC1kYXRlcGlja2VyLWlucHV0LWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxNTBweDtcbn1cblxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XG4gIHpvb206IDAuNTtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiAxMHB4O1xuICB6LWluZGV4OiAxMDAwO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgLyogYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDsgKi9cbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgYm9yZGVyOiA0cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNhMGEwYTA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMXMgZWFzZTtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xuICAgIHdpZHRoOiAzMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XG4gICAgd2lkdGg6IGF1dG87XG4gIH1cbn1cbjo6bmctZGVlcCAuZGViaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM2NGRjNjQgMCUsICM2ZWUxNmUgMTclLCAjNzNlNjczIDMzJSwgIzc4ZjA3OCA2NyUsICM3ZGZhN2QgODMlLCAjOTZmZjk2IDEwMCUpO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMDAlIDEwMCU7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuOjpuZy1kZWVwIC5jcmVkaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gbGVmdCwgI2RjNjQ2NCAwJSwgI2UxNmU2ZSAxNyUsICNlNjczNzMgMzMlLCAjZjA3ODc4IDY3JSwgI2ZhN2Q3ZCA4MyUsICNmZjk2OTYgMTAwJSk7XG4gIHBhZGRpbmctcmlnaHQ6IDE4cHggIWltcG9ydGFudDtcbiAgdGV4dC1hbGlnbjogZW5kO1xuICBmb250LXdlaWdodDogNTAwO1xufVxuXG46Om5nLWRlZXAgLnJpZ2h0QWxpZ24ge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/reports/trial-balance/trial-balance.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/main/reports/trial-balance/trial-balance.component.ts ***!
  \***********************************************************************/
/*! exports provided: TrialBalanceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrialBalanceComponent", function() { return TrialBalanceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var _report_grid_report_grid_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../report-grid/report-grid.component */ "./src/app/main/reports/report-grid/report-grid.component.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");









var TrialBalanceComponent = /** @class */ (function () {
    function TrialBalanceComponent(financeService, reportsApiService, dataService, downloadExcelUtils) {
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.dataService = dataService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.startDate = '';
        this.endDate = '';
        this.title = 'Account Name';
        this.isDataLoaded = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["HeightStyle"])(220);
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
        this.getExternalFilters();
    }
    TrialBalanceComponent.prototype.ngOnInit = function () {
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_4__();
    };
    TrialBalanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
                _this.getReport(null, null, 'ALL');
            }
        });
    };
    TrialBalanceComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    TrialBalanceComponent.prototype.getReport = function (toDate, fromDate, fund) {
        var _this = this;
        this.isDataLoaded = false;
        this.reportsApiService.getTrialBalanceReport(toDate, fromDate, fund).subscribe(function (response) {
            _this.trialBalanceReportStats = response.stats;
            _this.trialBalanceReport = response.payload.map(function (data) { return ({
                accountName: data.AccountName,
                AccountCategory: data.AccountCategory,
                AccountType: data.AccountType,
                AccountName: data.AccountName,
                credit: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["FormatNumber2"])(data.Credit),
                creditPercentage: data.CreditPercentage,
                debit: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["FormatNumber2"])(data.Debit),
                debitPercentage: data.DebitPercentage,
                balance: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["FormatNumber2"])(data.Balance)
            }); });
            _this.isDataLoaded = true;
        });
    };
    TrialBalanceComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    TrialBalanceComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    TrialBalanceComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
        this.getExternalFilters();
    };
    TrialBalanceComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getExternalFilters();
    };
    TrialBalanceComponent.prototype.getExternalFilters = function () {
        this.externalFilters = {
            fundFilter: this.fund,
            dateFilter: this.DateRangeLabel !== ''
                ? this.DateRangeLabel
                : {
                    startDate: this.startDate !== null ? this.startDate : '',
                    endDate: this.endDate !== null ? this.endDate : ''
                }
        };
    };
    TrialBalanceComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter, dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.setDateRange(dateFilter);
        this.startDate = this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : null;
        this.endDate = this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : null;
        this.getReport(this.startDate, this.endDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    TrialBalanceComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.selected = null;
        this.DateRangeLabel = '';
        this.startDate = '';
        this.endDate = '';
        this.getReport(null, null, 'ALL');
    };
    TrialBalanceComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Trial Balance Reports',
            sheetName: 'First Sheet'
        };
        this.trialBalanceReportGrid.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    TrialBalanceComponent.prototype.refreshReport = function () {
        this.trialBalanceReportGrid.gridOptions.api.showLoadingOverlay();
        this.clearFilters();
        this.getReport(null, null, 'ALL');
    };
    TrialBalanceComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_8__["ReportsApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_6__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('trialBalanceReportGrid', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _report_grid_report_grid_component__WEBPACK_IMPORTED_MODULE_7__["ReportGridComponent"])
    ], TrialBalanceComponent.prototype, "trialBalanceReportGrid", void 0);
    TrialBalanceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-trial-balance',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./trial-balance.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reports/trial-balance/trial-balance.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./trial-balance.component.scss */ "./src/app/main/reports/trial-balance/trial-balance.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_8__["ReportsApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_6__["DownloadExcelUtils"]])
    ], TrialBalanceComponent);
    return TrialBalanceComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-reports-reports-module.js.map