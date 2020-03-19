(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-reconciliation-reconciliation-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.html":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.html ***!
  \******************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- Symbol Filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n    <!-- Symbol Filter Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\" selectedDate\" [singleDatePicker]=\"true\"\r\n          [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Util Buttons Div Starts -->\r\n    <div class=\"col-auto ml-auto mr-2\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <ng-template #tooltipTemplate>{{action.accountingBookMonView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button (click)=\"action.accountingBookMonView = !action.accountingBookMonView\" class=\"btn btn-pa\"\r\n          [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-down': action.accountingBookMonView, 'fa-arrow-up': !action.accountingBookMonView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Util Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Legends Row Starts -->\r\n  <div class=\"row mx-0 mt-2\">\r\n\r\n    <!-- Reconciled Details Legend Starts -->\r\n    <div class=\"col-12 p-0\">\r\n\r\n      <!-- Legend Tag Starts -->\r\n      <div class=\"row mx-0\">\r\n\r\n        <div class=\"font-weight-bold\">Reconciled Details</div>\r\n\r\n        <div class=\"d-flex ml-auto mr-2\">\r\n\r\n          <ng-container *ngIf=\"showNonZeroBtn\">\r\n            <p class=\"legend-label\">Non-Zero</p>\r\n            <button class=\"btn nonZero opacity-1 legend-height width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInAccountingBtn\">\r\n            <p class=\"legend-label ml-2\">Not in Accounting</p>\r\n            <button class=\"btn notInAccounting legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInBookMonBtn\">\r\n            <p class=\"legend-label ml-2\">Not in BookMon</p>\r\n            <button class=\"btn notInBookMon legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Legend Tag Ends -->\r\n\r\n    </div>\r\n    <!-- Reconciled Details Legend Ends -->\r\n\r\n  </div>\r\n  <!-- Legends Row Ends -->\r\n\r\n  <!-- Reports Grid Div Starts -->\r\n  <div class=\"mt-0\" [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Main Split Row Starts -->\r\n    <div class=\"split-area row h-100\">\r\n\r\n      <!-- AS Split Main Container -->\r\n      <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"vertical\" [useTransition]=\"action.useTransition\"\r\n        (dragEnd)=\"action.reconciledGridSize=$event.sizes[0]; action.accountingBookMonSize=$event.sizes[1];\">\r\n\r\n        <!-- Reconciled Details Split Area -->\r\n        <as-split-area [visible]=\"action.reconciledGridView\" [size]=\"action.reconciledGridSize\" order=\"1\">\r\n          <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n        </as-split-area>\r\n        <!-- Reconciled Details Split Area Ends -->\r\n\r\n        <!-- Accounting/BookMon Split Area -->\r\n        <as-split-area [visible]=\"action.accountingBookMonView\" [size]=\"action.accountingBookMonSize\" order=\"2\">\r\n\r\n          <div class=\"row h-100\">\r\n\r\n            <div class=\"col-6 pr-0\">\r\n              <div class=\"font-weight-bold\">Accounting Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"portfolioOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n            <div class=\"col-6 pl-0\">\r\n              <div class=\"font-weight-bold\">BookMon Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"bookmonOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </as-split-area>\r\n        <!-- Accounting/BookMon Split Area Ends -->\r\n\r\n      </as-split>\r\n      <!-- AS Split Main Container Ends -->\r\n\r\n    </div>\r\n    <!-- Main Split Row Ends -->\r\n\r\n  </div>\r\n  <!-- Reports Grid Div Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends -->\r\n\r\n<!-- Data Grid Modal Starts -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\" [expanded]=\"true\">\r\n</app-data-grid-modal>\r\n<!-- Data Grid Modal Ends -->\r\n\r\n<!-- Create Security Modal -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n<!-- Create Security Modal Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.html":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.html ***!
  \****************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- Symbol Filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n    <!-- Symbol Filter Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\"selectedDate\" [singleDatePicker]=\"true\"\r\n          [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Util Buttons Div Starts -->\r\n    <div class=\"col-auto ml-auto mr-2\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <ng-template #tooltipTemplate>{{action.accountingBookMonView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button (click)=\"action.accountingBookMonView = !action.accountingBookMonView\" class=\"btn btn-pa\"\r\n          [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-down': action.accountingBookMonView, 'fa-arrow-up': !action.accountingBookMonView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Util Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Legends Row Starts -->\r\n  <div class=\"row mx-0 mt-2\">\r\n\r\n    <!-- Reconciled Details Legend Starts -->\r\n    <div class=\"col-12 p-0\">\r\n\r\n      <!-- Legend Tag Starts -->\r\n      <div class=\"row mx-0\">\r\n\r\n        <div class=\"font-weight-bold\">Reconciled Details</div>\r\n\r\n        <div class=\"d-flex ml-auto mr-2\">\r\n\r\n          <ng-container *ngIf=\"showNonZeroBtn\">\r\n            <p class=\"legend-label\">Non-Zero</p>\r\n            <button class=\"btn nonZero opacity-1 legend-height width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInAccountingBtn\">\r\n            <p class=\"legend-label ml-2\">Not in Accounting</p>\r\n            <button class=\"btn notInAccounting legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInBookMonBtn\">\r\n            <p class=\"legend-label ml-2\">Not in BookMon</p>\r\n            <button class=\"btn notInBookMon legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Legend Tag Ends -->\r\n\r\n    </div>\r\n    <!-- Reconciled Details Legend Ends -->\r\n\r\n  </div>\r\n  <!-- Legends Row Ends -->\r\n\r\n  <!-- Reports Grid Div Starts -->\r\n  <div class=\"mt-0\" [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Main Split Row Starts -->\r\n    <div class=\"split-area row h-100\">\r\n\r\n      <!-- AS Split Main Container -->\r\n      <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"vertical\" [useTransition]=\"action.useTransition\"\r\n        (dragEnd)=\"action.reconciledGridSize=$event.sizes[0]; action.accountingBookMonSize=$event.sizes[1];\">\r\n\r\n        <!-- Reconciled Details Split Area -->\r\n        <as-split-area [visible]=\"action.reconciledGridView\" [size]=\"action.reconciledGridSize\" order=\"1\">\r\n          <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n        </as-split-area>\r\n        <!-- Reconciled Details Split Area Ends -->\r\n\r\n        <!-- Accounting/BookMon Split Area -->\r\n        <as-split-area [visible]=\"action.accountingBookMonView\" [size]=\"action.accountingBookMonSize\" order=\"2\">\r\n\r\n          <div class=\"row h-100\">\r\n\r\n            <div class=\"col-6 pr-0\">\r\n              <div class=\"font-weight-bold\">Accounting Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"portfolioOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n            <div class=\"col-6 pl-0\">\r\n              <div class=\"font-weight-bold\">BookMon Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"bookmonOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </as-split-area>\r\n        <!-- Accounting/BookMon Split Area Ends -->\r\n\r\n      </as-split>\r\n      <!-- AS Split Main Container Ends -->\r\n\r\n    </div>\r\n    <!-- Main Split Row Ends -->\r\n\r\n  </div>\r\n  <!-- Reports Grid Div Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends -->\r\n\r\n<!-- Data Grid Modal Starts -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\" [expanded]=\"true\">\r\n</app-data-grid-modal>\r\n<!-- Data Grid Modal Ends -->\r\n\r\n<!-- Create Security Modal -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n<!-- Create Security Modal Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.html ***!
  \**************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Container -->\r\n<div *ngIf=\"hideGrid\" [ngStyle]=\"processingMsgDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Container Ends -->\r\n\r\n<!-- Report Main Container -->\r\n<div [hidden]=\"isLoading\" [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Filters Row -->\r\n    <div class=\"row \">\r\n\r\n        <!-- Funds Dropdown -->\r\n        <!-- <div class=\"col-auto\">\r\n            <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n                <option selected>All Funds</option>\r\n                <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n                    {{ fund.fundCode }}\r\n                </option>\r\n            </select>\r\n        </div> -->\r\n        <!-- Funds Dropdown Ends -->\r\n\r\n        <!-- Symbol Filter -->\r\n        <div class=\"col-auto\">\r\n            <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\"\r\n                [(ngModel)]=\"filterBySymbol\" (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\"\r\n                class=\"form-control\" />\r\n        </div>\r\n        <!-- Symbol Filter Ends -->\r\n\r\n        <!-- DateRange Label -->\r\n        <div class=\"font-weight-bold\">\r\n            <label class=\"text-right\"> {{ DateRangeLabel }} </label>\r\n        </div>\r\n        <!-- DateRange Label Ends -->\r\n\r\n        <!-- Date Picker -->\r\n        <div class=\"col-auto\">\r\n            <form>\r\n                <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\"\r\n                    placeholder=\"Choose date\" [(ngModel)]=\"selected\" name=\"selectedDaterange\"\r\n                    (ngModelChange)=\"changeDate($event)\" [maxDate]=\"maxDate\" />\r\n            </form>\r\n        </div>\r\n        <!-- Date Picker Ends -->\r\n\r\n        <!-- Clear Button -->\r\n        <div class=\"col-auto\">\r\n            <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n                <i class=\"fa fa-remove\"></i>\r\n            </button>\r\n        </div>\r\n        <!-- Clear Button Ends -->\r\n\r\n        <!-- Util Buttons -->\r\n        <div class=\"ml-auto\">\r\n\r\n            <!-- Refresh Button -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n                    <i class=\"fa fa-refresh\"></i></button>\r\n            </div>\r\n            <!-- Refresh Button Ends -->\r\n\r\n            <!-- Export to Excel Button -->\r\n            <div class=\"mr-2 d-inline-block\">\r\n                <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n                    <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n                </button>\r\n            </div>\r\n            <!-- Export to Excel Button Ends -->\r\n\r\n        </div>\r\n        <!-- Util Buttons Ends -->\r\n\r\n    </div>\r\n    <!-- Filters Row Ends -->\r\n\r\n    <!-- Report Grid Starts -->\r\n    <div [ngStyle]=\"styleForHeight\">\r\n\r\n        <!-- Main Split Row Starts -->\r\n        <div class=\"split-area row h-100\">\r\n\r\n            <!-- AS Split Main Container -->\r\n            <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\" [useTransition]=\"true\">\r\n\r\n                <!-- Detail PnL Split Area -->\r\n                <as-split-area [visible]=\"true\" [size]=\"50\" order=\"1\">\r\n                    <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" (rowSelected)=\"onRowSelected($event)\"\r\n                        [gridOptions]=\"gridOptions\">\r\n                    </ag-grid-angular>\r\n                </as-split-area>\r\n                <!-- Detail PnL Split Area Ends -->\r\n\r\n                <!-- Other Split Area -->\r\n                <as-split-area [visible]=\"false\" [size]=\"50\" order=\"2\">\r\n\r\n                </as-split-area>\r\n                <!-- Other Split Area Ends -->\r\n\r\n            </as-split>\r\n            <!-- AS Split Main Container Ends -->\r\n\r\n        </div>\r\n        <!-- Main Split Row Ends -->\r\n\r\n    </div>\r\n    <!-- Report Grid Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Container Ends-->\r\n\r\n<!-- Create Dividend Modal -->\r\n<app-create-dividend #dividendModal (modalClose)=\"closeDividendModal()\"></app-create-dividend>\r\n\r\n<!-- Create Stock Splits Modal -->\r\n<app-create-stock-splits #stockSplitsModal (modalClose)=\"closeStockSplitModal()\">\r\n</app-create-stock-splits>\r\n\r\n<!-- Create Security Modal -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.html":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.html ***!
  \**********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n    </div>\r\n    <!-- Funds Dropdown Div Ends -->\r\n\r\n    <!-- Symbol Filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n    <!-- Symbol Filter Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\" selectedDate\" [singleDatePicker]=\"true\"\r\n          [autoApply]=\"true\" [maxDate]=\"maxDate\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Util Buttons Div Starts -->\r\n    <div class=\"col-auto ml-auto mr-2\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <ng-template #tooltipTemplate>{{action.accountingBookMonView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button (click)=\"action.accountingBookMonView = !action.accountingBookMonView\" class=\"btn btn-pa\"\r\n          [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-down': action.accountingBookMonView, 'fa-arrow-up': !action.accountingBookMonView}\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Util Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Legends Row Starts -->\r\n  <div class=\"row mx-0 mt-2\">\r\n\r\n    <!-- Reconciled Details Legend Starts -->\r\n    <div class=\"col-12 p-0\">\r\n\r\n      <!-- Legend Tag Starts -->\r\n      <div class=\"row mx-0\">\r\n\r\n        <div class=\"font-weight-bold\">Reconciled Details</div>\r\n\r\n        <div class=\"d-flex ml-auto mr-2\">\r\n\r\n          <ng-container *ngIf=\"showNonZeroBtn\">\r\n            <p class=\"legend-label\">Non-Zero</p>\r\n            <button class=\"btn nonZero opacity-1 legend-height width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInAccountingBtn\">\r\n            <p class=\"legend-label ml-2\">Not in Accounting</p>\r\n            <button class=\"btn notInAccounting legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n          <ng-container *ngIf=\"showNotInBookMonBtn\">\r\n            <p class=\"legend-label ml-2\">Not in FundAdmin</p>\r\n            <button class=\"btn notInBookMon legend-height opacity-1 width-40px ml-2\" [disabled]=\"true\">\r\n            </button>\r\n          </ng-container>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Legend Tag Ends -->\r\n\r\n    </div>\r\n    <!-- Reconciled Details Legend Ends -->\r\n\r\n  </div>\r\n  <!-- Legends Row Ends -->\r\n\r\n  <!-- Reports Grid Div Starts -->\r\n  <div class=\"mt-0\" [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Main Split Row Starts -->\r\n    <div class=\"split-area row h-100\">\r\n\r\n      <!-- AS Split Main Container -->\r\n      <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"vertical\" [useTransition]=\"action.useTransition\"\r\n        (dragEnd)=\"action.reconciledGridSize=$event.sizes[0]; action.accountingBookMonSize=$event.sizes[1];\">\r\n\r\n        <!-- Reconciled Details Split Area -->\r\n        <as-split-area [visible]=\"action.reconciledGridView\" [size]=\"action.reconciledGridSize\" order=\"1\">\r\n          <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n        </as-split-area>\r\n        <!-- Reconciled Details Split Area Ends -->\r\n\r\n        <!-- Accounting/BookMon Split Area -->\r\n        <as-split-area [visible]=\"action.accountingBookMonView\" [size]=\"action.accountingBookMonSize\" order=\"2\">\r\n\r\n          <div class=\"row h-100\">\r\n\r\n            <div class=\"col-6 pr-0\">\r\n              <div class=\"font-weight-bold\">Accounting Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"portfolioOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n            <div class=\"col-6 pl-0\">\r\n              <div class=\"font-weight-bold\">FundAdmin Details</div>\r\n              <ag-grid-angular class=\"ag-theme-balham grid-height\" [gridOptions]=\"bookmonOptions\">\r\n              </ag-grid-angular>\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </as-split-area>\r\n        <!-- Accounting/BookMon Split Area Ends -->\r\n\r\n      </as-split>\r\n      <!-- AS Split Main Container Ends -->\r\n\r\n    </div>\r\n    <!-- Main Split Row Ends -->\r\n\r\n  </div>\r\n  <!-- Reports Grid Div Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends -->\r\n\r\n<!-- Data Grid Modal Starts -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\" [expanded]=\"true\">\r\n</app-data-grid-modal>\r\n<!-- Data Grid Modal Ends -->\r\n\r\n<!-- Create Security Modal -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n<!-- Create Security Modal Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/reconciliation.component.html":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/reconciliation.component.html ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Reconciliation Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Tab View Starts -->\r\n    <tabset class=\"tab-color\">\r\n\r\n        <tab heading=\"Fund Admin\" (selectTab)=\"activateFundAdminReconcile()\">\r\n            <div [ngStyle]=\"style\">\r\n                <rep-fundadmin-reconcile *ngIf=\"fundadminReconcileActive\"></rep-fundadmin-reconcile>\r\n            </div>\r\n        </tab>\r\n\r\n        <tab heading=\"DayPnL\" (selectTab)=\"activateDayPnLReconcile()\">\r\n            <div [ngStyle]=\"style\">\r\n                <rep-daypnl-reconcile *ngIf=\"dayPnLReconcileActive\"></rep-daypnl-reconcile>\r\n            </div>\r\n        </tab>\r\n\r\n        <tab heading=\"Bookmon\" (selectTab)=\"activateBookmonReconcile()\">\r\n            <div [ngStyle]=\"style\">\r\n                <rep-bookmon-reconcile *ngIf=\"bookmonReconcileActive\"></rep-bookmon-reconcile>\r\n            </div>\r\n        </tab>\r\n\r\n        <tab heading=\"DetailPnLToDate\" (selectTab)=\"activateDetailPnLToDateReport()\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-detail-pnl-date *ngIf=\"detailPnLToDateReportActive\"></app-detail-pnl-date>\r\n            </div>\r\n        </tab>\r\n\r\n    </tabset>\r\n    <!-- Tab View Ends -->\r\n\r\n</div>\r\n<!-- Reports Ends-->");

/***/ }),

/***/ "./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.scss":
/*!****************************************************************************************!*\
  !*** ./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.scss ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".grid-height {\n  height: calc(100% - 24px);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZWNvbmNpbGlhdGlvbi9ib29rbW9uLXJlY29uY2lsZS9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXHJlY29uY2lsaWF0aW9uXFxib29rbW9uLXJlY29uY2lsZVxcYm9va21vbi1yZWNvbmNpbGUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vYm9va21vbi1yZWNvbmNpbGUvYm9va21vbi1yZWNvbmNpbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9yZWNvbmNpbGlhdGlvbi9ib29rbW9uLXJlY29uY2lsZS9ib29rbW9uLXJlY29uY2lsZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5ncmlkLWhlaWdodCB7XHJcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSAyNHB4KTtcclxufVxyXG4iLCIuZ3JpZC1oZWlnaHQge1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDI0cHgpO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.ts ***!
  \**************************************************************************************/
/*! exports provided: BookmonReconcileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmonReconcileComponent", function() { return BookmonReconcileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");

















var BookmonReconcileComponent = /** @class */ (function () {
    function BookmonReconcileComponent(financeService, reportsApiService, dataService, securityApiService, toastrService, downloadExcelUtils, dataDictionary) {
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.dataService = dataService;
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.dataDictionary = dataDictionary;
        this.action = {
            reconciledGridSize: 50,
            accountingBookMonSize: 50,
            reconciledGridView: true,
            accountingBookMonView: false,
            useTransition: true
        };
        this.fund = 'All Funds';
        this.isLoading = false;
        this.filterBySymbol = '';
        this.showNonZeroBtn = false;
        this.showNotInAccountingBtn = false;
        this.showNotInBookMonBtn = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["HeightStyle"])(248);
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
    BookmonReconcileComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_3__();
    };
    BookmonReconcileComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD')
                };
            }
            else {
            }
        }, function (error) { });
    };
    BookmonReconcileComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
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
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            getRowStyle: function (params) {
                var style = {};
                if (params.data.nonZero) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["LegendColors"].nonZeroStyle;
                }
                if (params.data.notInBookMon) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["LegendColors"].notInBookMonStyle;
                }
                if (params.data.notInAccounting) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["LegendColors"].notInAccountingStyle;
                }
                return style;
            },
            columnDefs: [
                {
                    field: 'Symbol',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'SecurityType',
                    width: 120,
                    headerName: 'Security Type',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Diff_Quantity',
                    headerName: 'Quantity Diff',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Diff_Exposure',
                    headerName: 'Exposure Diff',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Diff_Price',
                    headerName: 'Price Diff',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Diff_Fx',
                    headerName: 'Fx',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                },
                {
                    headerName: 'Id',
                    field: 'id',
                    hide: true
                },
                {
                    headerName: 'Non-zero',
                    field: 'nonZero',
                    hide: true
                },
                {
                    headerName: 'Not in BookMon',
                    field: 'notInBookMon',
                    hide: true
                },
                {
                    headerName: 'Not in Accounting',
                    field: 'notInAccounting',
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].bookMonReconcileId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].bookmonReconcile, this.gridOptions);
        this.bookmonOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onCellClicked: this.rowSelected.bind(this),
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
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Quantity',
                    headerName: 'Quantity',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Exposure',
                    headerName: 'Exposure',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Price',
                    headerName: 'Price',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Fx',
                    headerName: 'Fx',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.portfolioOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onCellClicked: this.rowSelected.bind(this),
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
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Quantity',
                    headerName: 'Quantity',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Exposure',
                    headerName: 'Exposure',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Price',
                    headerName: 'Price',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Fx',
                    headerName: 'Fx',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: priceFormatter
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
    };
    BookmonReconcileComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
            }
        });
    };
    BookmonReconcileComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    BookmonReconcileComponent.prototype.getReport = function (date, fund) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getBookmonReconReport(moment__WEBPACK_IMPORTED_MODULE_3__(date).format('YYYY-MM-DD'), fund)
            .subscribe(function (response) {
            _this.reconciledData = _this.setIdentifierForReconDataAndCheckMissingRows(response.payload[0], response.payload[1], response.payload[2]);
            _this.portfolioData = response.payload[1];
            _this.bookmonData = response.payload[2];
            _this.gridOptions.api.setRowData(_this.reconciledData);
            _this.gridOptions.api.sizeColumnsToFit();
            _this.portfolioOptions.api.setRowData(_this.portfolioData);
            _this.portfolioOptions.api.sizeColumnsToFit();
            _this.bookmonOptions.api.setRowData(_this.bookmonData);
            _this.bookmonOptions.api.sizeColumnsToFit();
            _this.isLoading = false;
        });
    };
    BookmonReconcileComponent.prototype.setIdentifierForReconDataAndCheckMissingRows = function (reconData, accountingData, bookMonData) {
        var i = 0;
        var modifiedReconData = reconData.map(function (x) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, x, { id: i++ }, (x.Diff_Quantity !== 0 || x.Diff_Exposure !== 0 ? { nonZero: true } : { nonZero: false }), (accountingData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInAccounting: true }
            : { notInAccounting: false }), (bookMonData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInBookMon: true }
            : { notInBookMon: false }))); });
        this.showNonZeroBtn =
            (modifiedReconData.find(function (data) { return data.nonZero === true; }) || {}).nonZero || false;
        this.showNotInAccountingBtn =
            (modifiedReconData.find(function (data) { return data.notInAccounting === true; }) || {}).notInAccounting ||
                false;
        this.showNotInBookMonBtn =
            (modifiedReconData.find(function (data) { return data.notInBookMon === true; }) || {}).notInBookMon || false;
        return modifiedReconData;
    };
    BookmonReconcileComponent.prototype.rowSelected = function (row) {
        var _this = this;
        var symbol = row.data.symbol;
        var mySymbol = row.data.Symbol;
        this.bookmonOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.bookmonOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
        this.portfolioOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.portfolioOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
    };
    BookmonReconcileComponent.prototype.onRowDoubleClicked = function (params) {
        this.gridOptions.api.showLoadingOverlay();
        this.openDataGridModal(params.data);
    };
    BookmonReconcileComponent.prototype.openDataGridModal = function (rowData) {
        var _this = this;
        var Symbol = rowData.Symbol;
        this.reportsApiService
            .getTaxLotReport(null, null, Symbol, null, false)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["finalize"])(function () { return _this.gridOptions.api.hideOverlay(); }))
            .subscribe(function (response) {
            var payload = response.payload;
            var columns = _this.getTaxLotColDefs();
            _this.title = 'Tax Lot Status';
            _this.dataGridModal.openModal(columns, payload);
        });
    };
    BookmonReconcileComponent.prototype.getTaxLotColDefs = function () {
        return [
            {
                field: 'open_id',
                headerName: 'Order Id',
                hide: true
            },
            {
                field: 'trade_date',
                headerName: 'Trade Date',
                sortable: true,
                filter: true,
                valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["dateFormatter"]
            },
            {
                field: 'symbol',
                headerName: 'Symbol',
                rowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'status',
                headerName: 'Status',
                sortable: true,
                filter: true
            },
            {
                field: 'side',
                headerName: 'Side',
                sortable: true,
                filter: true
            },
            {
                field: 'original_quantity',
                headerName: 'Orig Qty',
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: currencyFormatter,
                aggFunc: 'sum'
            },
            {
                field: 'quantity',
                headerName: 'Rem Qty',
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: currencyFormatter,
                aggFunc: 'sum'
            },
            {
                field: 'investment_at_cost',
                headerName: 'Investment @ Cost',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["moneyFormatter"]
            }
        ];
    };
    BookmonReconcileComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    BookmonReconcileComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    BookmonReconcileComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    BookmonReconcileComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    BookmonReconcileComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    BookmonReconcileComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    BookmonReconcileComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.Symbol).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
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
    BookmonReconcileComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    BookmonReconcileComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    BookmonReconcileComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    BookmonReconcileComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    BookmonReconcileComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    BookmonReconcileComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.endDate = undefined;
        this.selectedDate = null;
        this.gridOptions.api.setRowData([]);
        this.portfolioOptions.api.setRowData([]);
        this.bookmonOptions.api.setRowData([]);
        this.filterBySymbol = '';
    };
    BookmonReconcileComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.portfolioOptions.api.showLoadingOverlay();
        this.bookmonOptions.api.showLoadingOverlay();
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.endDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, 'ALL');
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            this.getReport(startDate, 'ALL');
        }
    };
    BookmonReconcileComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    BookmonReconcileComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__["ReportsApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__["DataService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_11__["ToastrService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_14__["DownloadExcelUtils"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_12__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__["DataGridModalComponent"])
    ], BookmonReconcileComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_16__["CreateSecurityComponent"])
    ], BookmonReconcileComponent.prototype, "securityModal", void 0);
    BookmonReconcileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-bookmon-reconcile',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./bookmon-reconcile.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./bookmon-reconcile.component.scss */ "./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_9__["ReportsApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_7__["DataService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_10__["SecurityApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_11__["ToastrService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_14__["DownloadExcelUtils"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_12__["DataDictionary"]])
    ], BookmonReconcileComponent);
    return BookmonReconcileComponent;
}());

function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["CommaSeparatedFormat"])(params.value);
}
function priceFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_15__["FormatNumber8"])(params.value);
}


/***/ }),

/***/ "./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.scss ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".grid-height {\n  height: calc(100% - 24px);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZWNvbmNpbGlhdGlvbi9kYXlwbmwtcmVjb25jaWxlL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxccmVjb25jaWxpYXRpb25cXGRheXBubC1yZWNvbmNpbGVcXGRheXBubC1yZWNvbmNpbGUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vZGF5cG5sLXJlY29uY2lsZS9kYXlwbmwtcmVjb25jaWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UseUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vZGF5cG5sLXJlY29uY2lsZS9kYXlwbmwtcmVjb25jaWxlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmdyaWQtaGVpZ2h0IHtcclxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDI0cHgpO1xyXG59XHJcbiIsIi5ncmlkLWhlaWdodCB7XG4gIGhlaWdodDogY2FsYygxMDAlIC0gMjRweCk7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.ts ***!
  \************************************************************************************/
/*! exports provided: DayPnlComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DayPnlComponent", function() { return DayPnlComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");


















var DayPnlComponent = /** @class */ (function () {
    function DayPnlComponent(financeService, reportsApiService, dataService, dataDictionary, agGridUtils, securityApiService, toastrService, downloadExcelUtils) {
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.dataService = dataService;
        this.dataDictionary = dataDictionary;
        this.agGridUtils = agGridUtils;
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.action = {
            reconciledGridSize: 50,
            accountingBookMonSize: 50,
            reconciledGridView: true,
            accountingBookMonView: false,
            useTransition: true
        };
        this.fund = 'All Funds';
        this.filterBySymbol = '';
        this.isLoading = false;
        this.showNonZeroBtn = false;
        this.showNotInAccountingBtn = false;
        this.showNotInBookMonBtn = false;
        this.labels = [];
        this.displayChart = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["HeightStyle"])(248);
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
    DayPnlComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_3__();
    };
    DayPnlComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
            }
        });
    };
    DayPnlComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (response) {
            if (response.isSuccessful && response.statusCode === 200) {
                _this.journalDate = response.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    DayPnlComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    DayPnlComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
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
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            getRowStyle: function (params) {
                var style = {};
                if (params.data.nonZero) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].nonZeroStyle;
                }
                if (params.data.notInBookMon) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].notInBookMonStyle;
                }
                if (params.data.notInAccounting) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].notInAccountingStyle;
                }
                return style;
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'Symbol',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'SecurityType',
                    width: 120,
                    headerName: 'SecurityType',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Diff_DayPnl',
                    headerName: 'Difference',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                },
                {
                    headerName: 'Id',
                    field: 'id',
                    hide: true
                },
                {
                    headerName: 'Non-zero',
                    field: 'nonZero',
                    hide: true
                },
                {
                    headerName: 'Not in BookMon',
                    field: 'notInBookMon',
                    hide: true
                },
                {
                    headerName: 'Not in Accounting',
                    field: 'notInAccounting',
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].dayPnlReconcileId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].dayPnlReconcile, this.gridOptions);
        this.bookmonOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onCellClicked: this.rowSelected.bind(this),
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
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'DayPnl',
                    headerName: 'Day Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.portfolioOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            onCellClicked: this.rowSelected.bind(this),
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'DayPnl',
                    headerName: 'Day Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
    };
    // Being Called Twice (Fixed)
    DayPnlComponent.prototype.getReport = function (date, fund) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getReconReport(moment__WEBPACK_IMPORTED_MODULE_3__(date).format('YYYY-MM-DD'), fund)
            .subscribe(function (response) {
            _this.reconciledData = _this.setIdentifierForReconDataAndCheckMissingRows(response.payload[0], response.payload[1], response.payload[2]);
            _this.portfolioData = response.payload[1];
            _this.bookmonData = response.payload[2];
            _this.gridOptions.api.setRowData(_this.reconciledData);
            _this.gridOptions.api.sizeColumnsToFit();
            _this.portfolioOptions.api.setRowData(_this.portfolioData);
            _this.portfolioOptions.api.sizeColumnsToFit();
            _this.bookmonOptions.api.setRowData(_this.bookmonData);
            _this.bookmonOptions.api.sizeColumnsToFit();
            _this.isLoading = false;
        });
    };
    DayPnlComponent.prototype.setIdentifierForReconDataAndCheckMissingRows = function (reconData, accountingData, bookMonData) {
        var i = 0;
        var modifiedReconData = reconData.map(function (x) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, x, { id: i++ }, (x.Diff_DayPnl !== 0 ? { nonZero: true } : { nonZero: false }), (accountingData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInAccounting: true }
            : { notInAccounting: false }), (bookMonData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInBookMon: true }
            : { notInBookMon: false }))); });
        this.showNonZeroBtn =
            (modifiedReconData.find(function (data) { return data.nonZero === true; }) || {}).nonZero || false;
        this.showNotInAccountingBtn =
            (modifiedReconData.find(function (data) { return data.notInAccounting === true; }) || {}).notInAccounting ||
                false;
        this.showNotInBookMonBtn =
            (modifiedReconData.find(function (data) { return data.notInBookMon === true; }) || {}).notInBookMon || false;
        return modifiedReconData;
    };
    DayPnlComponent.prototype.rowSelected = function (row) {
        var _this = this;
        var symbol = row.data.symbol;
        var mySymbol = row.data.Symbol;
        this.bookmonOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.bookmonOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
        this.portfolioOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.portfolioOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
    };
    DayPnlComponent.prototype.onRowDoubleClicked = function (params) {
        this.gridOptions.api.showLoadingOverlay();
        this.openDataGridModal(params.data);
    };
    DayPnlComponent.prototype.openDataGridModal = function (rowData) {
        var _this = this;
        console.log('DATA ::', rowData);
        var Symbol = rowData.Symbol, Diff_DayPnl = rowData.Diff_DayPnl;
        var startDate = this.selectedDate.startDate;
        this.financeService
            .getTradeJournals('', startDate.format('YYYY-MM-DD'), Symbol)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["finalize"])(function () { return _this.gridOptions.api.hideOverlay(); }))
            .subscribe(function (response) {
            var data = response.data, meta = response.meta;
            var someArray = _this.agGridUtils.columizeData(data, meta.Columns);
            var columns = _this.dataDictionary.getTradeJournalColDefs(meta.Columns);
            var filteredData = someArray.filter(function (item) {
                return item.AccountType === 'CHANGE IN UNREALIZED GAIN/(LOSS)' ||
                    item.AccountType === 'REALIZED GAIN/(LOSS)';
            });
            _this.title = "Trade Journals (Difference: " + Diff_DayPnl + ")";
            _this.dataGridModal.openModal(columns, filteredData);
        });
    };
    DayPnlComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    DayPnlComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    DayPnlComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    DayPnlComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    DayPnlComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    DayPnlComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    DayPnlComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.Symbol).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
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
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    DayPnlComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== ''
                ? { startDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.startDate), endDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.endDate) }
                : null;
    };
    DayPnlComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    DayPnlComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    DayPnlComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate;
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    DayPnlComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    DayPnlComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.filterBySymbol = '';
        this.DateRangeLabel = '';
        this.selectedDate = null;
        this.endDate = undefined;
        this.showNonZeroBtn = false;
        this.showNotInAccountingBtn = false;
        this.showNotInBookMonBtn = false;
        this.gridOptions.api.setRowData([]);
        this.portfolioOptions.api.setRowData([]);
        this.bookmonOptions.api.setRowData([]);
    };
    DayPnlComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.portfolioOptions.api.showLoadingOverlay();
        this.bookmonOptions.api.showLoadingOverlay();
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.endDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, 'ALL');
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            this.getReport(startDate, 'ALL');
        }
    };
    DayPnlComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    DayPnlComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__["DataDictionary"] },
        { type: src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_12__["ToastrService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__["DataGridModalComponent"])
    ], DayPnlComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__["CreateSecurityComponent"])
    ], DayPnlComponent.prototype, "securityModal", void 0);
    DayPnlComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-daypnl-reconcile',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./daypnl-reconcile.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./daypnl-reconcile.component.scss */ "./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__["DataDictionary"],
            src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_12__["ToastrService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"]])
    ], DayPnlComponent);
    return DayPnlComponent;
}());

function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["MoneyFormat"])(params.value);
}


/***/ }),

/***/ "./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.scss ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vZGV0YWlsLXBubC1kYXRlL2RldGFpbC1wbmwtZGF0ZS5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.ts ***!
  \**********************************************************************************/
/*! exports provided: DetailPnlDateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailPnlDateComponent", function() { return DetailPnlDateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/Modal/create-dividend/create-dividend.component */ "./src/shared/Modal/create-dividend/create-dividend.component.ts");
/* harmony import */ var src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/Modal/create-stock-splits/create-stock-splits.component */ "./src/shared/Modal/create-stock-splits/create-stock-splits.component.ts");
/* harmony import */ var _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./../../../../shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");


















var DetailPnlDateComponent = /** @class */ (function () {
    function DetailPnlDateComponent(dataService, financeService, reportsApiService, agGridUtils, dataDictionary, downloadExcelUtils, securityApiService, toastrService) {
        this.dataService = dataService;
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.agGridUtils = agGridUtils;
        this.dataDictionary = dataDictionary;
        this.downloadExcelUtils = downloadExcelUtils;
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        // fund: any = 'All Funds';
        // funds: Fund;
        this.filterBySymbol = '';
        this.isLoading = false;
        this.isExpanded = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["HeightStyle"])(220);
        // private filterSubject: Subject<string> = new Subject();
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
    DetailPnlDateComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_2__();
        // In case we add Funds filter later
        // this.getFunds();
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
    DetailPnlDateComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                // this.getFunds();
            }
        });
    };
    DetailPnlDateComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selected = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_2__(_this.startDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    DetailPnlDateComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_8__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                lp_toolkit__WEBPACK_IMPORTED_MODULE_8__["GridUtils"].autoSizeAllColumns(params);
            },
            columnDefs: [
                {
                    field: 'SecurityId',
                    headerName: 'SecurityId'
                },
                {
                    field: 'SecurityCode',
                    headerName: 'Security Code'
                },
                {
                    field: 'SecurityType',
                    headerName: 'Security Type'
                },
                {
                    field: 'SecurityName',
                    headerName: 'Security Name'
                },
                {
                    field: 'ISIN',
                    headerName: 'ISIN'
                },
                {
                    field: 'side',
                    headerName: 'Side'
                },
                {
                    field: 'Fund',
                    headerName: 'Fund'
                },
                {
                    field: 'BusDate',
                    headerName: 'Business Date',
                    valueFormatter: dateFormatter
                },
                {
                    field: 'currency',
                    headerName: 'currency'
                },
                {
                    field: 'position',
                    headerName: 'position',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'realizedPnl',
                    headerName: 'Realized PnL',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'realizedPnl_FX',
                    headerName: 'Realized PnL FX',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'realizedPnl_Net',
                    headerName: 'Realized PnL Net',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Cost',
                    headerName: 'Cost',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealizedPnl',
                    headerName: 'Unrealized PnL',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealizedPnl_FX',
                    headerName: 'Unrealized PnL FX',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealizedPnl_FX_Translation',
                    headerName: 'Unrealized PnL FX Translation',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'unrealizedPnl_Net',
                    headerName: 'Unrealized PnL Net',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'market_Value',
                    headerName: 'Market Value',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Pnl',
                    headerName: 'PnL',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'commission',
                    headerName: 'Commission',
                    cellClass: 'rightAlign',
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'fees',
                    headerName: 'Fees',
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
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_9__["GridId"].detailPnlDateId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_9__["GridName"].detailPnlDate, this.gridOptions);
    };
    // In case we add Funds filter later
    // getFunds() {
    //   this.financeService.getFunds().subscribe(result => {
    //     this.funds = result.payload.map(item => ({
    //       fundId: item.FundId,
    //       fundCode: item.FundCode
    //     }));
    //   });
    // }
    // Being called twice
    DetailPnlDateComponent.prototype.getReport = function (fromDate, toDate, symbol) {
        var _this = this;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getDetailPnLToDateReport(moment__WEBPACK_IMPORTED_MODULE_2__(fromDate).format('YYYY-MM-DD'), moment__WEBPACK_IMPORTED_MODULE_2__(toDate).format('YYYY-MM-DD'), symbol)
            .subscribe(function (response) {
            _this.gridOptions.api.hideOverlay();
            _this.data = response.payload;
            _this.gridOptions.api.setRowData(_this.data);
            _this.gridOptions.api.expandAll();
            lp_toolkit__WEBPACK_IMPORTED_MODULE_8__["GridUtils"].autoSizeAllColumns(_this.gridOptions);
        }, function (error) {
            _this.gridOptions.api.hideOverlay();
        });
    };
    DetailPnlDateComponent.prototype.onRowSelected = function (event) { };
    DetailPnlDateComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        // In case we add Funds filter later
        // this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.gridOptions.api.onFilterChanged();
    };
    DetailPnlDateComponent.prototype.isExternalFilterPresent = function () {
        // In case we add Funds filter later
        // if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
        //   return true;
        // }
        if (this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    DetailPnlDateComponent.prototype.doesExternalFilterPass = function (node) {
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
            var cellSymbol = node.data.SecurityCode === null ? '' : node.data.SecurityCode;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    DetailPnlDateComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
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
                            _this.securityApiService.getDataForSecurityModal(params.node.data.SecurityCode).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.SecurityCode, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.SecurityCode, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
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
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    DetailPnlDateComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    DetailPnlDateComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    DetailPnlDateComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        if (this.selected.startDate == null) {
            this.selected = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_2__(this.journalDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, this.journalDate, this.filterBySymbol);
        }
        else {
            var startDate = this.selected.startDate.format('YYYY-MM-DD');
            var endDate = this.selected.endDate.format('YYYY-MM-DD');
            this.getReport(startDate, endDate, this.filterBySymbol);
        }
    };
    DetailPnlDateComponent.prototype.clearFilters = function () {
        // this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.selected = null;
        this.filterBySymbol = '';
        // Client Side Filters
        // this.gridOptions.api.setRowData(this.data);
        // Server Side Filters
        this.gridOptions.api.setRowData([]);
    };
    DetailPnlDateComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    DetailPnlDateComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    DetailPnlDateComponent.prototype.getExternalFilterState = function () {
        return {
            // In case we add Funds filter later
            // fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: { startDate: this.startDate, endDate: this.endDate }
        };
    };
    DetailPnlDateComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        // In case we need to enable filter from Server Side
        this.getReport(this.startDate, this.endDate, this.filterBySymbol
        // In case we add Funds filter later
        // this.fund === 'All Funds' ? 'ALL' : this.fund
        );
        this.getRangeLabel();
        // this.gridOptions.api.onFilterChanged();
    };
    DetailPnlDateComponent.prototype.changeFund = function (selectedFund) {
        // In case we add Funds filter later
        // this.fund = selectedFund;
        // In case we need to enable from Server Side
        this.getReport(this.startDate, this.endDate, this.filterBySymbol
        // In case we add Funds filter later
        // this.fund === 'All Funds' ? 'ALL' : this.fund
        );
        // this.gridOptions.api.onFilterChanged();
    };
    DetailPnlDateComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Tax Lot Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    DetailPnlDateComponent.ctorParameters = function () { return [
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_4__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_5__["ReportsApiService"] },
        { type: src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_13__["AgGridUtils"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__["DataDictionary"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_6__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_7__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dividendModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_10__["CreateDividendComponent"])
    ], DetailPnlDateComponent.prototype, "dividendModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('stockSplitsModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_11__["CreateStockSplitsComponent"])
    ], DetailPnlDateComponent.prototype, "stockSplitsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_12__["CreateSecurityComponent"])
    ], DetailPnlDateComponent.prototype, "securityModal", void 0);
    DetailPnlDateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-detail-pnl-date',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./detail-pnl-date.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./detail-pnl-date.component.scss */ "./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_4__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_5__["ReportsApiService"],
            src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_13__["AgGridUtils"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__["DataDictionary"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_6__["SecurityApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_7__["ToastrService"]])
    ], DetailPnlDateComponent);
    return DetailPnlDateComponent;
}());

function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["CommaSeparatedFormat"])(params.value);
}
function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["DateFormatter"])(params.value);
}


/***/ }),

/***/ "./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.scss ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".grid-height {\n  height: calc(100% - 24px);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9yZWNvbmNpbGlhdGlvbi9mdW5kYWRtaW4tcmVjb25jaWxlL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxccmVjb25jaWxpYXRpb25cXGZ1bmRhZG1pbi1yZWNvbmNpbGVcXGZ1bmRhZG1pbi1yZWNvbmNpbGUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vZnVuZGFkbWluLXJlY29uY2lsZS9mdW5kYWRtaW4tcmVjb25jaWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UseUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vZnVuZGFkbWluLXJlY29uY2lsZS9mdW5kYWRtaW4tcmVjb25jaWxlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmdyaWQtaGVpZ2h0IHtcclxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDI0cHgpO1xyXG59XHJcbiIsIi5ncmlkLWhlaWdodCB7XG4gIGhlaWdodDogY2FsYygxMDAlIC0gMjRweCk7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.ts ***!
  \******************************************************************************************/
/*! exports provided: FundAdminReconcileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FundAdminReconcileComponent", function() { return FundAdminReconcileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/reports-api.service */ "./src/services/reports-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");


















var FundAdminReconcileComponent = /** @class */ (function () {
    function FundAdminReconcileComponent(financeService, reportsApiService, dataService, securityApiService, toastrService, downloadExcelUtils, dataDictionary, agGridUtils) {
        this.financeService = financeService;
        this.reportsApiService = reportsApiService;
        this.dataService = dataService;
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.dataDictionary = dataDictionary;
        this.agGridUtils = agGridUtils;
        this.action = {
            reconciledGridSize: 50,
            accountingBookMonSize: 50,
            reconciledGridView: true,
            accountingBookMonView: false,
            useTransition: true
        };
        this.fund = 'All Funds';
        this.isLoading = false;
        this.filterBySymbol = '';
        this.showNonZeroBtn = false;
        this.showNotInAccountingBtn = false;
        this.showNotInBookMonBtn = false;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["HeightStyle"])(248);
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
    FundAdminReconcileComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_3__();
    };
    FundAdminReconcileComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.reportsApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selectedDate = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_3__(_this.startDate, 'YYYY-MM-DD')
                };
            }
            else {
            }
        }, function (error) { });
    };
    FundAdminReconcileComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            onCellClicked: this.rowSelected.bind(this),
            onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            enableFilter: true,
            animateRows: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            getRowStyle: function (params) {
                var style = {};
                if (params.data.nonZero) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].nonZeroStyle;
                }
                if (params.data.notInBookMon) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].notInBookMonStyle;
                }
                if (params.data.notInAccounting) {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["LegendColors"].notInAccountingStyle;
                }
                return style;
            },
            columnDefs: [
                {
                    field: 'Symbol',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'SecurityType',
                    width: 120,
                    headerName: 'Security Type',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Diff_Quantity',
                    headerName: 'Quantity Diff',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'Diff_DayPnl',
                    headerName: 'Day Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'Diff_MTDPnl',
                    headerName: 'MTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'Diff_YTDPnl',
                    headerName: 'YTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                },
                {
                    headerName: 'Id',
                    field: 'id',
                    hide: true
                },
                {
                    headerName: 'Non-zero',
                    field: 'nonZero',
                    hide: true
                },
                {
                    headerName: 'Not in BookMon',
                    field: 'notInBookMon',
                    hide: true
                },
                {
                    headerName: 'Not in Accounting',
                    field: 'notInAccounting',
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].fundAdminReconcileId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].fundAdminReconcile, this.gridOptions);
        this.bookmonOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onCellClicked: this.rowSelected.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            enableFilter: true,
            animateRows: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Quantity',
                    headerName: 'Quantity',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'DayPnl',
                    headerName: 'Day Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'MTDPnl',
                    headerName: 'MTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'YTDPnl',
                    headerName: 'YTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.portfolioOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onCellClicked: this.rowSelected.bind(this),
            onRowDoubleClicked: this.onRowDoubleClickedSymbol.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            enableFilter: true,
            animateRows: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridColumnApi = params.columnApi;
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
            },
            columnDefs: [
                {
                    field: 'SecurityCode',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Fund',
                    width: 120,
                    headerName: 'Fund',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'Quantity',
                    headerName: 'Quantity',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'DayPnl',
                    headerName: 'Day Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'MtdPnl',
                    headerName: 'MTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'YtdPnl',
                    headerName: 'YTD Pnl',
                    cellClass: 'rightAlign',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["pnlFormatter"]
                },
                {
                    field: 'Currency',
                    width: 50,
                    headerName: 'Currency',
                    sortable: true,
                    filter: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
    };
    FundAdminReconcileComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
            }
        });
    };
    FundAdminReconcileComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    FundAdminReconcileComponent.prototype.getReport = function (date, fund) {
        var _this = this;
        this.isLoading = true;
        this.gridOptions.api.showLoadingOverlay();
        this.reportsApiService
            .getFundAdminReconReport(moment__WEBPACK_IMPORTED_MODULE_3__(date).format('YYYY-MM-DD'), fund)
            .subscribe(function (response) {
            _this.reconciledData = _this.setIdentifierForReconDataAndCheckMissingRows(response.payload[0], response.payload[1], response.payload[2]);
            _this.portfolioData = response.payload[1];
            _this.bookmonData = response.payload[2];
            _this.gridOptions.api.setRowData(_this.reconciledData);
            _this.gridOptions.api.sizeColumnsToFit();
            _this.portfolioOptions.api.setRowData(_this.portfolioData);
            _this.portfolioOptions.api.sizeColumnsToFit();
            _this.bookmonOptions.api.setRowData(_this.bookmonData);
            _this.bookmonOptions.api.sizeColumnsToFit();
            _this.isLoading = false;
        });
    };
    FundAdminReconcileComponent.prototype.setIdentifierForReconDataAndCheckMissingRows = function (reconData, accountingData, bookMonData) {
        var i = 0;
        var modifiedReconData = reconData.map(function (x) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, x, { id: i++ }, (x.Diff_Quantity !== 0 || x.Diff_DayPnl !== 0 || x.Diff_MTDPnl !== 0 || x.Diff_YTDPnl !== 0
            ? { nonZero: true }
            : { nonZero: false }), (accountingData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInAccounting: true }
            : { notInAccounting: false }), (bookMonData.find(function (y) { return y.SecurityCode === x.Symbol; }) === undefined
            ? { notInBookMon: true }
            : { notInBookMon: false }))); });
        this.showNonZeroBtn =
            (modifiedReconData.find(function (data) { return data.nonZero === true; }) || {}).nonZero || false;
        this.showNotInAccountingBtn =
            (modifiedReconData.find(function (data) { return data.notInAccounting === true; }) || {}).notInAccounting ||
                false;
        this.showNotInBookMonBtn =
            (modifiedReconData.find(function (data) { return data.notInBookMon === true; }) || {}).notInBookMon || false;
        return modifiedReconData;
    };
    FundAdminReconcileComponent.prototype.rowSelected = function (row) {
        var _this = this;
        var symbol = row.data.symbol;
        var mySymbol = row.data.Symbol;
        this.bookmonOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.bookmonOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
        this.portfolioOptions.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.SecurityCode === mySymbol) {
                rowNode.setSelected(true);
                _this.portfolioOptions.api.ensureIndexVisible(rowNode.rowIndex);
            }
            else {
                rowNode.setSelected(false);
            }
        });
    };
    FundAdminReconcileComponent.prototype.onRowDoubleClicked = function (params) {
        this.gridOptions.api.showLoadingOverlay();
        this.openDataGridModal(params.data);
    };
    FundAdminReconcileComponent.prototype.openDataGridModal = function (rowData) {
        var _this = this;
        var Symbol = rowData.Symbol;
        this.reportsApiService
            .getTaxLotReport(null, null, Symbol, null, false)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["finalize"])(function () { return _this.gridOptions.api.hideOverlay(); }))
            .subscribe(function (response) {
            var payload = response.payload;
            var columns = _this.getTaxLotColDefs();
            _this.title = 'Tax Lot Status';
            _this.dataGridModal.openModal(columns, payload);
        });
    };
    FundAdminReconcileComponent.prototype.onRowDoubleClickedSymbol = function (params) {
        var cellFocused = this.portfolioOptions.api.getFocusedCell().column.getColDef().field;
        if (cellFocused === 'DayPnl') {
            var cellHeaderName = 'day';
            this.openDataGridModalSymbol(params.data, cellHeaderName);
        }
        else if (cellFocused === 'MtdPnl') {
            var cellHeaderName = 'mtd';
            this.openDataGridModalSymbol(params.data, cellHeaderName);
        }
        else {
            var cellHeaderName = 'ytd';
            this.openDataGridModalSymbol(params.data, cellHeaderName);
        }
    };
    FundAdminReconcileComponent.prototype.openDataGridModalSymbol = function (rowData, period) {
        var _this = this;
        var SecurityCode = rowData.SecurityCode;
        this.reportsApiService
            .getPeriodJournals(SecurityCode, this.startDate, period)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["finalize"])(function () { return _this.gridOptions.api.hideOverlay(); }))
            .subscribe(function (response) {
            var payload = response.payload, meta = response.meta;
            var someArray = _this.agGridUtils.columizeData(payload, meta.Columns);
            var columns = _this.getTradeJournalColDefs(meta.Columns);
            _this.title = 'Trade Journals';
            _this.dataGridModal.openModal(columns, someArray);
        });
    };
    FundAdminReconcileComponent.prototype.getTradeJournalColDefs = function (columns) {
        var colDefs = [
            this.dataDictionary.column('debit', false),
            this.dataDictionary.column('credit', false),
            this.dataDictionary.column('balance', false),
            this.dataDictionary.column('when', false),
            this.dataDictionary.column('end_price', false),
            this.dataDictionary.column('start_price', false),
            {
                field: 'fund',
                headerName: 'Fund',
                enableRowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'AccountCategory',
                width: 120,
                headerName: 'Category',
                enableRowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'event',
                width: 120,
                headerName: 'Event',
                rowGroup: true,
                enableRowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'AccountType',
                width: 120,
                headerName: 'Type',
                enableRowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'AccountName',
                width: 120,
                headerName: 'Account Name',
                enableRowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'AccountDescription',
                width: 120,
                headerName: 'Account Description',
                enableRowGroup: true,
                sortable: true,
                filter: true
            }
        ];
        return this.agGridUtils.customizeColumns(colDefs, columns, ['account_id', 'id', 'value', 'source', 'generated_by', 'Id', 'AllocationId', 'EMSOrderId'], false);
    };
    FundAdminReconcileComponent.prototype.getTaxLotColDefs = function () {
        return [
            {
                field: 'open_id',
                headerName: 'Order Id',
                hide: true
            },
            {
                field: 'trade_date',
                headerName: 'Trade Date',
                sortable: true,
                filter: true,
                valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["dateFormatter"]
            },
            {
                field: 'symbol',
                headerName: 'Symbol',
                rowGroup: true,
                sortable: true,
                filter: true
            },
            {
                field: 'status',
                headerName: 'Status',
                sortable: true,
                filter: true
            },
            {
                field: 'side',
                headerName: 'Side',
                sortable: true,
                filter: true
            },
            {
                field: 'original_quantity',
                headerName: 'Orig Qty',
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: currencyFormatter,
                aggFunc: 'sum'
            },
            {
                field: 'quantity',
                headerName: 'Rem Qty',
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: currencyFormatter,
                aggFunc: 'sum'
            },
            {
                field: 'investment_at_cost',
                headerName: 'Investment @ Cost',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["moneyFormatter"]
            }
        ];
    };
    FundAdminReconcileComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    FundAdminReconcileComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    FundAdminReconcileComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    FundAdminReconcileComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    FundAdminReconcileComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    FundAdminReconcileComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    FundAdminReconcileComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Security Details',
                subMenu: [
                    {
                        name: 'Extend',
                        action: function () {
                            _this.isLoading = true;
                            _this.securityApiService.getDataForSecurityModal(params.node.data.Symbol).subscribe(function (_a) {
                                var config = _a[0], securityDetails = _a[1];
                                _this.isLoading = false;
                                if (!config.isSuccessful) {
                                    _this.toastrService.error('No security type found against the selected symbol!');
                                    return;
                                }
                                if (securityDetails.payload.length === 0) {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, null, 'extend');
                                }
                                else {
                                    _this.securityModal.openSecurityModalFromOutside(params.node.data.Symbol, config.payload[0].SecurityType, config.payload[0].Fields, securityDetails.payload[0], 'extend');
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
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    FundAdminReconcileComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    FundAdminReconcileComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    FundAdminReconcileComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    FundAdminReconcileComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    FundAdminReconcileComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    FundAdminReconcileComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.endDate = undefined;
        this.selectedDate = null;
        this.gridOptions.api.setRowData([]);
        this.portfolioOptions.api.setRowData([]);
        this.bookmonOptions.api.setRowData([]);
        this.filterBySymbol = '';
    };
    FundAdminReconcileComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.portfolioOptions.api.showLoadingOverlay();
        this.bookmonOptions.api.showLoadingOverlay();
        if (this.selectedDate.startDate == null) {
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.endDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, 'ALL');
        }
        else {
            var startDate = this.selectedDate.startDate.format('YYYY-MM-DD');
            this.getReport(startDate, 'ALL');
        }
    };
    FundAdminReconcileComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Cost Basis Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    FundAdminReconcileComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"] },
        { type: src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_12__["ToastrService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__["DataDictionary"] },
        { type: src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__["DataGridModalComponent"])
    ], FundAdminReconcileComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__["CreateSecurityComponent"])
    ], FundAdminReconcileComponent.prototype, "securityModal", void 0);
    FundAdminReconcileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'rep-fundadmin-reconcile',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./fundadmin-reconcile.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./fundadmin-reconcile.component.scss */ "./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"],
            src_services_reports_api_service__WEBPACK_IMPORTED_MODULE_10__["ReportsApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_12__["ToastrService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_13__["DataDictionary"],
            src_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"]])
    ], FundAdminReconcileComponent);
    return FundAdminReconcileComponent;
}());

function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["CommaSeparatedFormat"])(params.value);
}


/***/ }),

/***/ "./src/app/main/reconciliation/reconciliation.component.scss":
/*!*******************************************************************!*\
  !*** ./src/app/main/reconciliation/reconciliation.component.scss ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vcmVjb25jaWxpYXRpb24vcmVjb25jaWxpYXRpb24uY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/reconciliation/reconciliation.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/main/reconciliation/reconciliation.component.ts ***!
  \*****************************************************************/
/*! exports provided: ReconciliationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReconciliationComponent", function() { return ReconciliationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");




var ReconciliationComponent = /** @class */ (function () {
    function ReconciliationComponent(dataService) {
        this.dataService = dataService;
        this.fundadminReconcileActive = true;
        this.dayPnLReconcileActive = false;
        this.bookmonReconcileActive = false;
        this.detailPnLToDateReportActive = false;
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
    ReconciliationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
        });
    };
    ReconciliationComponent.prototype.activateFundAdminReconcile = function () {
        this.fundadminReconcileActive = true;
    };
    ReconciliationComponent.prototype.activateDayPnLReconcile = function () {
        this.dayPnLReconcileActive = true;
    };
    ReconciliationComponent.prototype.activateBookmonReconcile = function () {
        this.bookmonReconcileActive = true;
    };
    ReconciliationComponent.prototype.activateDetailPnLToDateReport = function () {
        this.detailPnLToDateReportActive = true;
    };
    ReconciliationComponent.ctorParameters = function () { return [
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"] }
    ]; };
    ReconciliationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-reconciliation',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./reconciliation.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/reconciliation/reconciliation.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./reconciliation.component.scss */ "./src/app/main/reconciliation/reconciliation.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_common_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], ReconciliationComponent);
    return ReconciliationComponent;
}());



/***/ }),

/***/ "./src/app/main/reconciliation/reconciliation.module.ts":
/*!**************************************************************!*\
  !*** ./src/app/main/reconciliation/reconciliation.module.ts ***!
  \**************************************************************/
/*! exports provided: ReconciliationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReconciliationModule", function() { return ReconciliationModule; });
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
/* harmony import */ var _reconciliation_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./reconciliation.component */ "./src/app/main/reconciliation/reconciliation.component.ts");
/* harmony import */ var _reconciliation_daypnl_reconcile_daypnl_reconcile_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../reconciliation/daypnl-reconcile/daypnl-reconcile.component */ "./src/app/main/reconciliation/daypnl-reconcile/daypnl-reconcile.component.ts");
/* harmony import */ var _reconciliation_bookmon_reconcile_bookmon_reconcile_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../reconciliation/bookmon-reconcile/bookmon-reconcile.component */ "./src/app/main/reconciliation/bookmon-reconcile/bookmon-reconcile.component.ts");
/* harmony import */ var _reconciliation_fundadmin_reconcile_fundadmin_reconcile_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../reconciliation/fundadmin-reconcile/fundadmin-reconcile.component */ "./src/app/main/reconciliation/fundadmin-reconcile/fundadmin-reconcile.component.ts");
/* harmony import */ var _detail_pnl_date_detail_pnl_date_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./detail-pnl-date/detail-pnl-date.component */ "./src/app/main/reconciliation/detail-pnl-date/detail-pnl-date.component.ts");
/* harmony import */ var _reconciliation_routes__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./reconciliation.routes */ "./src/app/main/reconciliation/reconciliation.routes.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");



















var reconcileComponents = [
    _reconciliation_component__WEBPACK_IMPORTED_MODULE_12__["ReconciliationComponent"],
    _reconciliation_daypnl_reconcile_daypnl_reconcile_component__WEBPACK_IMPORTED_MODULE_13__["DayPnlComponent"],
    _reconciliation_bookmon_reconcile_bookmon_reconcile_component__WEBPACK_IMPORTED_MODULE_14__["BookmonReconcileComponent"],
    _reconciliation_fundadmin_reconcile_fundadmin_reconcile_component__WEBPACK_IMPORTED_MODULE_15__["FundAdminReconcileComponent"],
    _detail_pnl_date_detail_pnl_date_component__WEBPACK_IMPORTED_MODULE_16__["DetailPnlDateComponent"]
];
var ReconciliationModule = /** @class */ (function () {
    function ReconciliationModule() {
    }
    ReconciliationModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: reconcileComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_reconciliation_routes__WEBPACK_IMPORTED_MODULE_17__["ReconciliationRoutes"]),
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
                _shared_module__WEBPACK_IMPORTED_MODULE_18__["SharedModule"]
            ]
        })
    ], ReconciliationModule);
    return ReconciliationModule;
}());



/***/ }),

/***/ "./src/app/main/reconciliation/reconciliation.routes.ts":
/*!**************************************************************!*\
  !*** ./src/app/main/reconciliation/reconciliation.routes.ts ***!
  \**************************************************************/
/*! exports provided: ReconciliationRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReconciliationRoutes", function() { return ReconciliationRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _reconciliation_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reconciliation.component */ "./src/app/main/reconciliation/reconciliation.component.ts");


var ReconciliationRoutes = [
    {
        path: '',
        component: _reconciliation_component__WEBPACK_IMPORTED_MODULE_1__["ReconciliationComponent"]
    }
];


/***/ })

}]);
//# sourceMappingURL=main-reconciliation-reconciliation-module.js.map