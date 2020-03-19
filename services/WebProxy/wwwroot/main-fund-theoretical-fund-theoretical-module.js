(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-fund-theoretical-fund-theoretical-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.html":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.html ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Action Buttons Form -->\r\n<form>\r\n\r\n  <!-- Form Row -->\r\n  <div class=\"form-row\">\r\n\r\n    <!-- Date Filter -->\r\n    <div class=\"col-auto\">\r\n      <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n        [(ngModel)]=\"selected\" name=\"selectedDaterange\" [ranges]=\"ranges\" [showClearButton]=\"true\"\r\n        [alwaysShowCalendars]=\"true\" (ngModelChange)=\"ngModelChange($event)\" [keepCalendarOpeningWithRange]=\"true\" />\r\n    </div>\r\n    <!-- Date Filter Ends -->\r\n\r\n    <!-- Clear Filters -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearExternalFilter()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Filters Ends -->\r\n\r\n    <!-- Grid Utils Container -->\r\n    <div class=\"ml-auto mr-3\">\r\n\r\n      <!-- Grid Utils Starts -->\r\n      <app-grid-utils class=\"mr-0\" [utilsConfig]=\"utilsConfig\" [gridOptions]=\"dailyPnlGrid\" (refresh)=\"refreshGrid()\">\r\n      </app-grid-utils>\r\n      <!-- Grid Utils Ends -->\r\n\r\n      <!-- Expand/Collapse Button -->\r\n      <ng-template #tooltipTemplate>{{dailyPnLConfig.chartsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n      <button class=\"btn btn-pa\" [disabled]=\"disableCharts\" [tooltip]=\"tooltipTemplate\" placement=\"top\"\r\n        (click)=\"dailyPnLConfig.chartsView = !dailyPnLConfig.chartsView\">\r\n        <i class=\"fa\"\r\n          [ngClass]=\"{'fa-arrow-right': dailyPnLConfig.chartsView, 'fa-arrow-left': !dailyPnLConfig.chartsView}\"></i>\r\n      </button>\r\n      <!-- Expand/Collapse Button Ends -->\r\n\r\n    </div>\r\n    <!-- Grid Utils Container Ends -->\r\n\r\n  </div>\r\n  <!-- Form Row Ends -->\r\n\r\n</form>\r\n<!-- Action Buttons Form Ends -->\r\n\r\n<!-- Grid/Charts Row Starts -->\r\n<div [ngStyle]=\"styleForHeight\">\r\n\r\n  <!-- Main Split Row Starts -->\r\n  <div class=\"split-area row h-100\">\r\n\r\n    <!-- AS Split Main Container -->\r\n    <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\" [useTransition]=\"dailyPnLConfig.useTransition\"\r\n      (dragEnd)=\"applyPageLayout($event)\" (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n      <!-- Daily PnL Split Area -->\r\n      <as-split-area [visible]=\"dailyPnLConfig.dailyPnLView\" [size]=\"dailyPnLConfig.dailyPnLSize\" order=\"1\">\r\n\r\n        <ag-grid-angular class=\"h-100 ag-theme-balham\" [gridOptions]=\"dailyPnlGrid\">\r\n        </ag-grid-angular>\r\n\r\n      </as-split-area>\r\n      <!-- Daily PnL Split Area Ends -->\r\n\r\n      <!-- Charts Split Area -->\r\n      <as-split-area [visible]=\"dailyPnLConfig.chartsView\" [size]=\"dailyPnLConfig.chartsSize\" order=\"2\">\r\n\r\n        <app-calculation-graphs *ngIf=\"dailyPnLConfig.chartsView\" class=\"w-100 h-100\" [chartObject]=\"graphObject\"\r\n          [mode]=\"'single'\">\r\n        </app-calculation-graphs>\r\n\r\n      </as-split-area>\r\n      <!-- Charts Split Area Ends -->\r\n\r\n    </as-split>\r\n    <!-- AS Split Main Container Ends -->\r\n\r\n  </div>\r\n  <!-- Main Split Row Ends -->\r\n\r\n</div>\r\n<!-- Grid/Charts Row Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fund-theoretical.component.html":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fund-theoretical.component.html ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid -->\r\n<div *ngIf=\"hideGrid\" [ngStyle]=\"containerDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Ends -->\r\n\r\n<!-- Main Container -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- Tab Set -->\r\n  <tabset class=\"tab-color\">\r\n\r\n    <!-- Fund Theoretical Tab Starts -->\r\n    <tab heading=\"Fund Theoretical\" (selectTab)=\"activeFundTheretical()\">\r\n\r\n      <!-- Fund Theoretical Container -->\r\n      <div [ngStyle]=\"style\">\r\n\r\n        <!-- Action Buttons Form Tag Starts -->\r\n        <form>\r\n\r\n          <!-- Form Row Div Starts -->\r\n          <div class=\"row\">\r\n\r\n            <!-- Date Picker Div Starts -->\r\n            <div class=\"col-auto\">\r\n              <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n                [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\"selectedDate\"\r\n                [singleDatePicker]=\"true\" [autoApply]=\"true\" autocomplete=\"off\" [showDropdowns]=\"true\" />\r\n            </div>\r\n            <!-- Date Picker Div Ends -->\r\n\r\n            <!-- Generate Rows Div Starts -->\r\n            <div class=\"col-auto\">\r\n              <button class=\"btn btn-pa\" type=\"button\" (click)=\"generateRows()\" [disabled]=\"!generateFundsDate\">\r\n                Generate Rows\r\n              </button>\r\n            </div>\r\n            <!-- Generate Rows Div Ends -->\r\n\r\n            <!-- Action Buttons Div Starts -->\r\n            <div class=\"ml-auto mr-3\">\r\n\r\n              <button class=\"btn btn-pa ml-2\" type=\"button\" [disabled]=\"disableCommit || commitLoader\"\r\n                (click)=\"commitPerformanceData()\">\r\n                Commit\r\n                <span *ngIf=\"commitLoader\" class=\"spinner-border spinner-border-sm\" role=\"status\"\r\n                  aria-hidden=\"true\"></span>\r\n              </button>\r\n\r\n              <ng-template #tooltipTemplate>{{fundTheoreticalConfig.chartsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n              <button class=\"btn btn-pa ml-2\" [disabled]=\"disableCharts\" [tooltip]=\"tooltipTemplate\" placement=\"top\"\r\n                (click)=\"onToggleChartsView()\">\r\n                <i class=\"fa\"\r\n                  [ngClass]=\"{'fa-arrow-right': fundTheoreticalConfig.chartsView, 'fa-arrow-left': !fundTheoreticalConfig.chartsView}\"></i>\r\n              </button>\r\n\r\n            </div>\r\n            <!-- Action Buttons Div Ends -->\r\n\r\n          </div>\r\n          <!-- Form Row Div Ends -->\r\n\r\n        </form>\r\n        <!-- Action Buttons Form Tag Ends -->\r\n\r\n        <!-- Style For Height Container Starts -->\r\n        <div [ngStyle]=\"styleForHeight\">\r\n\r\n          <!-- Main Split Row Starts -->\r\n          <div class=\"split-area row h-100\">\r\n\r\n            <!-- AS Split Main Container -->\r\n            <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\"\r\n              [useTransition]=\"fundTheoreticalConfig.useTransition\" (dragEnd)=\"applyPageLayout($event)\"\r\n              (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n              <!-- Fund Theoretical Split Area -->\r\n              <as-split-area [visible]=\"fundTheoreticalConfig.fundTheoreticalView\"\r\n                [size]=\"fundTheoreticalConfig.fundTheoreticalSize\" order=\"1\">\r\n\r\n                <!-- Fund Theoretical Grid -->\r\n                <ag-grid-angular class=\"h-100 ag-theme-balham\" [gridOptions]=\"fundTheoreticalGrid\">\r\n                </ag-grid-angular>\r\n\r\n              </as-split-area>\r\n              <!-- Fund Theoretical Split Area Ends -->\r\n\r\n              <!-- Charts Split Area -->\r\n              <as-split-area [visible]=\"fundTheoreticalConfig.chartsView\" [size]=\"fundTheoreticalConfig.chartsSize\"\r\n                order=\"2\">\r\n\r\n                <app-calculation-graphs *ngIf=\"fundTheoreticalConfig.chartsView\" class=\"w-50 h-50\"\r\n                  [chartObject]=\"graphObject\" [mode]=\"'many'\">\r\n                </app-calculation-graphs>\r\n\r\n              </as-split-area>\r\n              <!-- Charts Split Area Ends -->\r\n\r\n            </as-split>\r\n            <!-- AS Split Main Container Ends -->\r\n\r\n          </div>\r\n          <!-- Main Split Row Ends -->\r\n\r\n        </div>\r\n        <!-- Style For Height Container Ends -->\r\n\r\n      </div>\r\n      <!-- Fund Theoretical Container Ends -->\r\n\r\n    </tab>\r\n    <!-- Fund Theoretical Tab Ends -->\r\n\r\n    <!-- Daily PNL Tab Starts -->\r\n    <tab heading=\"Daily PnL\" (selectTab)=\"activeDailyPnL()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-daily-pnl *ngIf=\"isDailyPnLActive\"></app-daily-pnl>\r\n      </div>\r\n    </tab>\r\n    <!-- Daily PNL Tab Ends -->\r\n\r\n    <!-- Tax Rate Tab Starts -->\r\n    <tab heading=\"Tax Rate\" (selectTab)=\"activeTaxRate()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-tax-rates *ngIf=\"isTaxRateActive\"></app-tax-rates>\r\n      </div>\r\n    </tab>\r\n    <!-- Tax Rate Tab Ends -->\r\n\r\n    <!-- Tax Rate Tab Starts -->\r\n    <tab heading=\"Market Prices\" (selectTab)=\"activeMarketPrices()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-market-prices *ngIf=\"isMarketPricesActive\"></app-market-prices>\r\n      </div>\r\n      <!-- Tax Rate Tab Ends -->\r\n    </tab>\r\n\r\n    <!-- Fx Rate Tab -->\r\n    <tab heading=\"Fx Rate\" (selectTab)=\"activeFxRate()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-fx-rates *ngIf=\"isFxRateActive\"></app-fx-rates>\r\n      </div>\r\n      <!-- Fx Rate Tab -->\r\n    </tab>\r\n\r\n  </tabset>\r\n  <!-- Tab Set Ends -->\r\n\r\n</div>\r\n<!-- Main Container Ends -->\r\n\r\n<!-- Data Grid Modal -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\">\r\n</app-data-grid-modal>\r\n\r\n<!-- Confirmation Modal -->\r\n<app-confirmation-modal #confirmationModal [title]=\"'Reset Performance'\"\r\n  [description]=\"'All your changes will be lost.\\nAre you sure you want to reset performance?'\"\r\n  (confirmed)=\"confirmReset()\">\r\n</app-confirmation-modal>\r\n\r\n<!-- Date Picker Modal -->\r\n<app-date-picker-modal #datePickerModal (dateSelected)=\"addCustom($event)\" [modalTitle]=\"'Select a Date'\">\r\n</app-date-picker-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fx-rates/fx-rates.component.html":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fx-rates/fx-rates.component.html ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Filters/Action Buttons Row -->\r\n<div class=\"row\">\r\n\r\n  <!-- Fund Filter -->\r\n  <!-- <div class=\"col-md-2\">\r\n    <select class=\"form-control\" [(ngModel)]=\"vRange\" [selectedIndex]=\"0\" (ngModelChange)=\"vChange($event)\">\r\n      <option *ngFor=\"let a of vRanges\" [ngValue]=\"a.Days\">\r\n        {{ a.Description }}\r\n      </option>\r\n    </select>\r\n  </div> -->\r\n  <!-- Fund Filter Ends -->\r\n\r\n  <!-- Symbol Filter -->\r\n  <div class=\"col-auto\">\r\n    <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Currency\" name=\"currency\"\r\n      [(ngModel)]=\"filterByCurrency\" (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\"\r\n      class=\"form-control\" />\r\n  </div>\r\n  <!-- Symbol Filter Ends -->\r\n\r\n  <!-- Date Picker -->\r\n  <div class=\"col-auto\">\r\n    <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n      [(ngModel)]=\"selectedDate\" name=\"selectedDaterange\" [showClearButton]=\"true\" [alwaysShowCalendars]=\"true\"\r\n      (ngModelChange)=\"ngModelChange($event)\" [keepCalendarOpeningWithRange]=\"true\" />\r\n  </div>\r\n  <!-- Date Picker Ends -->\r\n\r\n  <!-- Clear Button -->\r\n  <div class=\"mr-auto\">\r\n    <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n      <i class=\"fa fa-remove\"></i>\r\n    </button>\r\n  </div>\r\n  <!-- Clear Button Ends -->\r\n\r\n  <!-- Action Buttons -->\r\n  <div class=\"ml-auto mr-3\">\r\n\r\n    <button class=\"btn btn-pa mr-2\" type=\"button\" [disabled]=\"disableCommit\" (click)=\"commitMarketPriceData()\">\r\n      Commit\r\n    </button>\r\n\r\n    <!-- Grid Utils Starts -->\r\n    <app-grid-utils class=\"mr-0\" [utilsConfig]=\"utilsConfig\" [gridOptions]=\"fxRate\" (refresh)=\"refreshGrid()\">\r\n      <!-- Grid Utils Ends -->\r\n    </app-grid-utils>\r\n\r\n    <!-- Expand/Collapse Button -->\r\n    <ng-template #tooltipTemplate>{{fxRatesConfig.chartsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n    <button class=\"btn btn-pa\" [disabled]=\"disableCharts\" [tooltip]=\"tooltipTemplate\" placement=\"top\"\r\n      (click)=\"onToggleChartsView()\">\r\n      <i class=\"fa\"\r\n        [ngClass]=\"{'fa-arrow-right': fxRatesConfig.chartsView, 'fa-arrow-left': !fxRatesConfig.chartsView}\"></i>\r\n    </button>\r\n    <!-- Expand/Collapse Button Ends -->\r\n\r\n  </div>\r\n  <!-- Action Buttons Ends -->\r\n\r\n</div>\r\n<!-- Filters/Action Buttons Row Ends -->\r\n\r\n<!-- Content Container -->\r\n<div [ngStyle]=\"styleForHeight\">\r\n\r\n  <!-- Main Split Row Starts -->\r\n  <div class=\"split-area row h-100\">\r\n\r\n    <!-- AS Split Main Container -->\r\n    <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\" [useTransition]=\"fxRatesConfig.useTransition\"\r\n      (dragEnd)=\"applyPageLayout($event)\" (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n      <!-- FX Rates Split Area -->\r\n      <as-split-area [visible]=\"fxRatesConfig.fxRatesView\" [size]=\"fxRatesConfig.fxRatesSize\" order=\"1\">\r\n\r\n        <!-- FX Rates Grid -->\r\n        <ag-grid-angular class=\"h-100 ag-theme-balham\" [gridOptions]=\"fxRate\">\r\n        </ag-grid-angular>\r\n\r\n      </as-split-area>\r\n      <!-- FX Rates Split Area Ends -->\r\n\r\n      <!-- Charts Split Area -->\r\n      <as-split-area [visible]=\"fxRatesConfig.chartsView\" [size]=\"fxRatesConfig.chartsSize\" order=\"2\">\r\n\r\n        <app-calculation-graphs *ngIf=\"fxRatesConfig.chartsView\" class=\"w-50 h-75\" [chartObject]=\"graphObject\"\r\n          [mode]=\"'single'\">\r\n        </app-calculation-graphs>\r\n\r\n      </as-split-area>\r\n      <!-- Charts Split Area Ends -->\r\n\r\n    </as-split>\r\n    <!-- AS Split Main Container Ends -->\r\n\r\n  </div>\r\n  <!-- Main Split Row Ends -->\r\n\r\n</div>\r\n<!-- Content Container Ends -->\r\n\r\n<!-- Data Grid Modal -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\"></app-data-grid-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/market-prices/market-prices.component.html":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/market-prices/market-prices.component.html ***!
  \************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Filters/Action Buttons Row -->\r\n<div class=\"row\">\r\n\r\n  <!-- Fund Filter -->\r\n  <!-- <div class=\"col-md-2\">\r\n    <select class=\"form-control\" [(ngModel)]=\"vRange\" [selectedIndex]=\"0\" (ngModelChange)=\"vChange($event)\">\r\n      <option *ngFor=\"let a of vRanges\" [ngValue]=\"a.Days\">\r\n        {{ a.Description }}\r\n      </option>\r\n    </select>\r\n  </div> -->\r\n  <!-- Fund Filter Ends -->\r\n\r\n  <!-- Symbol Filter -->\r\n  <div class=\"col-auto\">\r\n    <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n      (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n  </div>\r\n  <!-- Symbol Filter Ends -->\r\n\r\n  <!-- Date Picker -->\r\n  <div class=\"col-auto\">\r\n    <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n      [(ngModel)]=\"selectedDate\" name=\"selectedDaterange\" [showClearButton]=\"true\" [alwaysShowCalendars]=\"true\"\r\n      (ngModelChange)=\"ngModelChange($event)\" [keepCalendarOpeningWithRange]=\"true\" />\r\n  </div>\r\n  <!-- Date Picker Ends -->\r\n\r\n  <!-- Clear Button -->\r\n  <div class=\"mr-auto\">\r\n    <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n      <i class=\"fa fa-remove\"></i>\r\n    </button>\r\n  </div>\r\n  <!-- Clear Button Ends -->\r\n\r\n  <!-- Action Buttons -->\r\n  <div class=\"ml-auto mr-3\">\r\n\r\n    <button class=\"btn btn-pa mr-2\" type=\"button\" [disabled]=\"disableCommit\" (click)=\"commitMarketPriceData()\">\r\n      Commit\r\n    </button>\r\n\r\n    <!-- Grid Utils -->\r\n    <app-grid-utils class=\"mr-0\" [utilsConfig]=\"utilsConfig\" [gridOptions]=\"marketPriceGrid\" (refresh)=\"refreshGrid()\">\r\n    </app-grid-utils>\r\n    <!-- Grid Utils Ends -->\r\n\r\n    <!-- Expand/Collapse Button -->\r\n    <ng-template #tooltipTemplate>{{marketPricesConfig.chartsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n    <button class=\"btn btn-pa\" [disabled]=\"disableCharts\" [tooltip]=\"tooltipTemplate\" placement=\"top\"\r\n      (click)=\"onToggleChartsView()\">\r\n      <i class=\"fa\"\r\n        [ngClass]=\"{'fa-arrow-right': marketPricesConfig.chartsView, 'fa-arrow-left': !marketPricesConfig.chartsView}\"></i>\r\n    </button>\r\n    <!-- Expand/Collapse Button Ends -->\r\n\r\n  </div>\r\n  <!-- Action Buttons Ends -->\r\n\r\n</div>\r\n<!-- Filters/Action Buttons Row Ends -->\r\n\r\n<!-- Content Container -->\r\n<div [ngStyle]=\"styleForHeight\">\r\n\r\n  <!-- Main Split Row Starts -->\r\n  <div class=\"split-area row h-100\">\r\n\r\n    <!-- AS Split Main Container -->\r\n    <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"horizontal\"\r\n      [useTransition]=\"marketPricesConfig.useTransition\" (dragEnd)=\"applyPageLayout($event)\"\r\n      (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n      <!-- Market Prices Split Area -->\r\n      <as-split-area [visible]=\"marketPricesConfig.marketPricesView\" [size]=\"marketPricesConfig.marketPricesSize\"\r\n        order=\"1\">\r\n\r\n        <!-- Market Prices Grid -->\r\n        <ag-grid-angular class=\"h-100 ag-theme-balham\" [gridOptions]=\"marketPriceGrid\">\r\n        </ag-grid-angular>\r\n\r\n      </as-split-area>\r\n      <!-- Market Prices Split Area Ends -->\r\n\r\n      <!-- Charts Split Area -->\r\n      <as-split-area [visible]=\"marketPricesConfig.chartsView\" [size]=\"marketPricesConfig.chartsSize\" order=\"2\">\r\n\r\n        <app-calculation-graphs *ngIf=\"marketPricesConfig.chartsView\" class=\"w-50 h-75\" [chartObject]=\"graphObject\"\r\n          [mode]=\"'single'\">\r\n        </app-calculation-graphs>\r\n\r\n      </as-split-area>\r\n      <!-- Charts Split Area Ends -->\r\n\r\n    </as-split>\r\n    <!-- AS Split Main Container Ends -->\r\n\r\n  </div>\r\n  <!-- Main Split Row Ends -->\r\n\r\n</div>\r\n<!-- Content Container Ends -->\r\n\r\n<!-- Data Grid Modal -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\"></app-data-grid-modal>\r\n\r\n<!-- Create Security Modal -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.html":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.html ***!
  \************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- LP Modal -->\r\n<lp-modal #lpModal size=\"large\" [title]=\"editTaxRate ? 'Edit Tax Rate' : 'Add Tax Rate'\" [footerConfig]=\"footerConfig\"\r\n  (closed)=\"onCloseModal()\" (canceled)=\"onCloseModal()\" (confirmed)=\"form.ngSubmit.emit()\">\r\n\r\n  <!-- Modal Content -->\r\n  <div class=\"p-3\">\r\n\r\n    <!-- Tax Rate Form Starts -->\r\n    <form #form=\"ngForm\" (ngSubmit)=\"saveTaxRate()\">\r\n\r\n      <!-- Date Range Picker Starts -->\r\n      <div class=\"form-group\">\r\n\r\n        <div class=\"row\">\r\n\r\n          <!-- Date Label -->\r\n          <div class=\"col-sm-3\">\r\n            <label> Tax Period </label>\r\n          </div>\r\n\r\n          <!-- Date Picker -->\r\n          <div *ngIf=\"!editTaxRate\" class=\"col-sm-9\">\r\n            <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\"\r\n              [(ngModel)]=\"selectedDate\" (ngModelChange)=\"changeDate($event)\" name=\"selectedDate\" [showDropdowns]=\"true\"\r\n              [autoApply]=\"true\" autocomplete=\"off\" [disabled]=\"editTaxRate\" />\r\n          </div>\r\n          <div *ngIf=\"editTaxRate\" class=\"col-sm-9\">\r\n            <input class=\"form-control\" type=\"text\"\r\n              value=\"{{selectedDate.startDate | date:'yyyy-MM-dd'}} - {{selectedDate.endDate | date:'yyyy-MM-dd'}}\"\r\n              name=\"selectedDate\" [disabled]=\"editTaxRate\" />\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Date Range Picker Ends -->\r\n\r\n      <!-- Long Term Tax Rate Starts -->\r\n      <div class=\"form-group\">\r\n\r\n        <div class=\"row\">\r\n\r\n          <!-- Long Term Tax Rate Label -->\r\n          <div class=\"col-sm-3\">\r\n            <label> Long Term Tax Rate </label>\r\n          </div>\r\n\r\n          <!-- Long Term Tax Rate Input -->\r\n          <div class=\"col-sm-9\">\r\n            <input class=\"form-control\" [(ngModel)]=\"longTermTaxRate\" name=\"longTermTaxRate\" type=\"number\" step=\".07\">\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Long Term Tax Rate Ends -->\r\n\r\n      <!-- Short Term Tax Rate Starts -->\r\n      <div class=\"form-group\">\r\n\r\n        <div class=\"row\">\r\n\r\n          <!-- Short Term Tax Rate Label -->\r\n          <div class=\"col-sm-3\">\r\n            <label> Short Term Tax Rate </label>\r\n          </div>\r\n\r\n          <!-- Short Term Tax Rate Input -->\r\n          <div class=\"col-sm-9\">\r\n            <input class=\"form-control\" [(ngModel)]=\"shortTermTaxRate\" name=\"shortTermTaxRate\" type=\"number\" step=\".07\">\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Short Term Tax Rate Div Ends -->\r\n\r\n      <!-- Short Term Period Starts-->\r\n      <div class=\"form-group\">\r\n\r\n        <div class=\"row\">\r\n\r\n          <!-- Short Term Period Label -->\r\n          <div class=\"col-sm-3\">\r\n            <label> Short Term Period </label>\r\n          </div>\r\n\r\n          <!-- Short Term Period Input -->\r\n          <div class=\"col-sm-9\">\r\n            <input class=\"form-control\" [(ngModel)]=\"shortTermPeriod\" name=\"shortTermPeriod\" type=\"number\" step=\".07\">\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- Short Term Period Ends-->\r\n\r\n    </form>\r\n    <!-- Tax Rate Form Starts -->\r\n\r\n  </div>\r\n  <!-- Modal Content Ends -->\r\n\r\n</lp-modal>\r\n<!-- LP Modal Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rates.component.html":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rates.component.html ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Action Buttons Form Tag Starts -->\r\n<form>\r\n  <!-- Form Row Div Starts -->\r\n  <div class=\"form-row\">\r\n    <!-- Action Buttons Div Starts -->\r\n    <div class=\"ml-auto w-100\">\r\n\r\n      <!-- Action Buttons Flex End Div Starts -->\r\n      <div class=\"col-12 d-flex justify-content-end\">\r\n\r\n        <!-- Overlapping Label Div Starts -->\r\n        <div *ngIf=\"showOverlappingBtn\">\r\n          <p class=\"legend-label\">Overlap</p>\r\n        </div>\r\n        <!-- Overlapping Label Div Ends -->\r\n\r\n        <!-- Overlapping Color Div Starts -->\r\n        <div *ngIf=\"showOverlappingBtn\">\r\n          <button class=\"btn overlap-color opacity-1 height-38px width-40px mr-2\" [disabled]=\"true\">\r\n          </button>\r\n        </div>\r\n        <!-- Overlapping Color Div Ends -->\r\n\r\n        <!-- Gap Label Div Starts -->\r\n        <div *ngIf=\"showGapBtn\">\r\n          <p class=\"legend-label\">Gap</p>\r\n        </div>\r\n        <!-- Overlapping Label Div Ends -->\r\n\r\n        <!-- Gap Color Div Starts -->\r\n        <div *ngIf=\"showGapBtn\">\r\n          <button class=\"btn gap-color opacity-1 height-38px width-40px mr-2\" [disabled]=\"true\">\r\n          </button>\r\n        </div>\r\n        <!-- Gap Color Div Ends -->\r\n\r\n        <!-- Grid Utils Starts -->\r\n        <app-grid-utils class=\"mr-0\" [utilsConfig]=\"utilsConfig\" [gridOptions]=\"taxRatesGrid\" (refresh)=\"refreshGrid()\">\r\n        </app-grid-utils>\r\n        <!-- Grid Utils Ends -->\r\n\r\n        <!-- Add Tax Rate Button Starts -->\r\n        <button class=\"btn btn-pa\" (click)=\"openTaxRateModal()\" tooltip=\"Add TaxRate\" placement=\"top\">\r\n          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n        </button>\r\n        <!-- Add Tax Rate Button Ends -->\r\n      </div>\r\n      <!-- Action Buttons Flex End Div Ends -->\r\n\r\n    </div>\r\n    <!-- Action Buttons Div Ends -->\r\n  </div>\r\n  <!-- Form Row Div Ends -->\r\n</form>\r\n<!-- Action Buttons Form Tag Ends -->\r\n\r\n<!-- Div To Measure Identifier Starts -->\r\n<div #divToMeasure>\r\n\r\n  <!-- Style For Height Div Starts-->\r\n  <div [ngStyle]=\"styleForHeight\">\r\n\r\n    <!-- Ag Grid Selector Starts -->\r\n    <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"taxRatesGrid\">\r\n    </ag-grid-angular>\r\n    <!-- Ag Grid Selector Ends -->\r\n\r\n    <!-- Action Buttons Template Starts -->\r\n    <ng-template #actionButtons let-row>\r\n      <button class=\"btn action-btn width-15 height-30px\" (click)=\"editTaxRate(row)\" tooltip=\"Edit\" placement=\"auto\"\r\n        container=\"body\">\r\n        <i class=\"fa fa-lg fa-edit\" aria-hidden=\"true\"></i>\r\n      </button>\r\n      <button class=\"btn height-30px\" (click)=\"openConfirmationModal(row)\" tooltip=\"Delete\" placement=\"auto\"\r\n        container=\"body\">\r\n        <i class=\"fa fa-lg fa-trash-o\" aria-hidden=\"true\"></i>\r\n      </button>\r\n    </ng-template>\r\n    <!-- Action Buttons Template Ends -->\r\n\r\n  </div>\r\n  <!-- Style For Height Div Ends -->\r\n\r\n</div>\r\n<!-- Div To Measure Identifier Ends -->\r\n\r\n<!-- Tax Rate Modal Selector Starts-->\r\n<app-tax-rate-modal #taxRateModal (closeModalEvent)=\"closeTaxRateModal()\">\r\n</app-tax-rate-modal>\r\n<!-- Tax Rate Modal Selector Ends-->\r\n\r\n<!-- Confirmation Modal Component Selector Starts -->\r\n<app-confirmation-modal #confirmationModal [title]=\"'Delete Tax Rate'\" (confirmed)=\"deleteTaxRate()\">\r\n</app-confirmation-modal>\r\n<!-- Confirmation Modal Component Selector Ends -->");

/***/ }),

/***/ "./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.scss ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vZnVuZC10aGVvcmV0aWNhbC9kYWlseS1wbmwvZGFpbHktcG5sLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.ts ***!
  \************************************************************************/
/*! exports provided: DailyPnlComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DailyPnlComponent", function() { return DailyPnlComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var src_services_service_proxies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");












var DailyPnlComponent = /** @class */ (function () {
    function DailyPnlComponent(cdRef, financeService, fundTheoreticalApiService, toastrService, decimalPipe, cacheService) {
        this.cdRef = cdRef;
        this.financeService = financeService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.toastrService = toastrService;
        this.decimalPipe = decimalPipe;
        this.cacheService = cacheService;
        this.dailyPnLConfig = {
            dailyPnLSize: 50,
            chartsSize: 50,
            dailyPnLView: true,
            chartsView: false,
            useTransition: true
        };
        this.selectedDate = null;
        this.fileToUpload = null;
        this.graphObject = null;
        this.disableCharts = true;
        this.sliderValue = 0;
        this.uploadLoader = false;
        this.disableFileUpload = true;
        this.returnsFormatString = '1.2-2';
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["HeightStyle"])(224);
        this.utilsConfig = {
            expandGrid: false,
            collapseGrid: false,
            refreshGrid: true,
            resetGrid: false,
            exportExcel: false
        };
    }
    DailyPnlComponent.prototype.ngOnInit = function () {
        this.getFunds();
        // this.getDailyPnL();
        this.initGrid();
        this.getPreDefinedRanges();
    };
    DailyPnlComponent.prototype.ngAfterViewInit = function () {
        this.initPageLayout();
    };
    DailyPnlComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dailyPnLConfigKey);
        if (config) {
            this.dailyPnLConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    DailyPnlComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.dailyPnLConfig.dailyPnLSize = event.sizes[0];
            this.dailyPnLConfig.chartsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dailyPnLConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dailyPnLConfigKey,
            value: JSON.stringify(this.dailyPnLConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dailyPnLConfigKey
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
    DailyPnlComponent.prototype.getPreDefinedRanges = function () {
        var _this = this;
        var payload = {
            GridName: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridName"].journalsLedgers
        };
        this.cacheService.getServerSideJournalsMeta(payload).subscribe(function (result) {
            _this.fundsRange = result.payload.FundsRange;
            _this.ranges = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["getRange"])(_this.getCustomFundRange());
        }, function (err) { });
    };
    DailyPnlComponent.prototype.onFilterChanged = function (event) {
        try {
            this.getDailyPnL();
        }
        catch (ex) { }
    };
    DailyPnlComponent.prototype.getCustomFundRange = function (fund) {
        if (fund === void 0) { fund = 'All Funds'; }
        var customRange = {};
        this.fundsRange.forEach(function (element) {
            if (fund === 'All Funds' && moment__WEBPACK_IMPORTED_MODULE_4__().year() !== element.Year) {
                customRange[element.Year] = [
                    [
                        moment__WEBPACK_IMPORTED_MODULE_4__(element.Year + "-01-01").startOf('year'),
                        moment__WEBPACK_IMPORTED_MODULE_4__(element.Year + "-01-01").endOf('year')
                    ]
                ][0];
            }
            else if (fund === element.fund && moment__WEBPACK_IMPORTED_MODULE_4__().year() !== element.Year) {
                customRange[element.Year] = [
                    [
                        moment__WEBPACK_IMPORTED_MODULE_4__(element.Year + "-01-01").startOf('year'),
                        moment__WEBPACK_IMPORTED_MODULE_4__(element.Year + "-01-01").endOf('year')
                    ]
                ][0];
            }
        });
        return customRange;
    };
    DailyPnlComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (response) {
            _this.funds = response.payload.map(function (item) { return item.FundCode; });
            _this.initCols();
        });
    };
    DailyPnlComponent.prototype.getPortfolios = function () {
        var _this = this;
        this.financeService.getPortfolios().subscribe(function (response) {
            _this.portfolios = response.payload.map(function (item) { return item.PortfolioCode; });
            _this.initCols();
        });
    };
    DailyPnlComponent.prototype.sortDailyPnl = function (x, y) {
        var dateDiff = new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
        if (dateDiff != 0) {
            return dateDiff;
        }
        else {
            return y.Id - x.Id;
        }
    };
    DailyPnlComponent.prototype.getDailyPnL = function () {
        var _this = this;
        this.dailyPnlGrid.api.showLoadingOverlay();
        var from = this.startDate ? moment__WEBPACK_IMPORTED_MODULE_4__(this.startDate).format('YYYY-MM-DD') : null;
        var to = this.endDate ? moment__WEBPACK_IMPORTED_MODULE_4__(this.endDate).format('YYYY-MM-DD') : null;
        this.fundTheoreticalApiService.getDailyUnofficialPnL(from, to).subscribe(function (response) {
            _this.dailyPnlGrid.api.hideOverlay();
            if (response.statusCode === 200) {
                var sortedData = response.payload.sort(function (x, y) { return _this.sortDailyPnl(x, y); });
                _this.dailyPnLData = sortedData.map(function (data) { return ({
                    businessDate: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["DateFormatter"])(data.BusinessDate),
                    fund: data.Fund,
                    portFolio: data.PortFolio,
                    tradePnL: data.TradePnL,
                    day: data.Day,
                    dailyPercentageReturn: data.DailyPercentageReturn,
                    longPnL: data.LongPnL,
                    longPercentageChange: data.LongPercentageChange,
                    shortPnL: data.ShortPnL,
                    shortPercentageChange: data.ShortPercentageChange,
                    longExposure: data.LongExposure,
                    shortExposure: data.ShortExposure,
                    grossExposure: data.GrossExposure,
                    netExposure: data.NetExposure,
                    sixMdBetaNetExposure: data.SixMdBetaNetExposure,
                    twoYwBetaNetExposure: data.TwoYwBetaNetExposure,
                    sixMdBetaShortExposure: data.SixMdBetaShortExposure,
                    navMarket: data.NavMarket,
                    dividendUSD: data.DividendUSD,
                    commUSD: data.CommUSD,
                    feeTaxesUSD: data.FeeTaxesUSD,
                    financingUSD: data.FinancingUSD,
                    otherUSD: data.OtherUSD,
                    pnLPercentage: data.PnLPercentage,
                    mtdPercentageReturn: data.MTDPercentageReturn,
                    qtdPercentageReturn: data.QTDPercentageReturn,
                    ytdPercentageReturn: data.YTDPercentageReturn,
                    itdPercentageReturn: data.ITDPercentageReturn,
                    mtdPnL: data.MTDPnL,
                    qtdPnL: data.QTDPnL,
                    ytdPnL: data.YTDPnL,
                    itdPnL: data.ITDPnL,
                    createdBy: data.CreatedBy,
                    lastUpdatedBy: data.LastUpdatedBy,
                    createdDate: data.CreatedDate,
                    lastUpdatedDate: data.lastUpdatedDate
                }); });
                _this.dailyPnlGrid.api.setRowData(_this.dailyPnLData);
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["AutoSizeAllColumns"])(_this.dailyPnlGrid);
            }
        }, function (err) {
            _this.dailyPnlGrid.api.hideOverlay();
        });
    };
    DailyPnlComponent.prototype.initGrid = function () {
        this.dailyPnlGrid = {
            columnDefs: this.getColDefs(),
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_5__["GridLayoutMenuComponent"] },
            getExternalFilterState: this.getExternalFilterState.bind(this),
            pinnedBottomRowData: null,
            onRowSelected: function (params) { },
            clearExternalFilter: this.clearExternalFilter.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            singleClickEdit: true,
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            enableCellChangeFlash: true,
            animateRows: true,
            onGridReady: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["AutoSizeAllColumns"])(params);
            },
            onFirstDataRendered: function (params) {
                // AutoSizeAllColumns(params);
            },
            onCellValueChanged: function (params) { },
            defaultColDef: {
                resizable: true
            }
        };
        this.dailyPnlGrid.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridId"].dailyPnlId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridName"].dailyPnl, this.dailyPnlGrid);
    };
    DailyPnlComponent.prototype.initCols = function () {
        var colDefs = this.getColDefs();
        this.dailyPnlGrid.api.setColumnDefs(colDefs);
        this.dailyPnlGrid.api.sizeColumnsToFit();
    };
    DailyPnlComponent.prototype.clearExternalFilter = function () {
        this.selected = null;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_4__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_4__();
        this.dailyPnlGrid.api.onFilterChanged();
    };
    DailyPnlComponent.prototype.isExternalFilterPassed = function (object) {
        var dateFilter = object.dateFilter;
        this.setDateRange(dateFilter);
        this.dailyPnlGrid.api.onFilterChanged();
    };
    DailyPnlComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    DailyPnlComponent.prototype.getExternalFilterState = function () {
        return {
            dateFilter: this.DateRangeLabel !== ''
                ? this.DateRangeLabel
                : {
                    startDate: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
                    endDate: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
                }
        };
    };
    DailyPnlComponent.prototype.isExternalFilterPresent = function () {
        if (this.startDate) {
            return true;
        }
    };
    DailyPnlComponent.prototype.doesExternalFilterPass = function (node) {
        return true;
    };
    DailyPnlComponent.prototype.getColDefs = function () {
        var _this = this;
        var colDefs = [
            {
                headerName: 'Is Modified',
                field: 'modified',
                hide: true
            },
            {
                headerName: 'Business Date',
                field: 'businessDate',
                filter: true,
                suppressCellFlash: true
            },
            {
                headerName: 'Portfolio*',
                field: 'portFolio',
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['None'].concat(this.portfolios)
                }
            },
            {
                headerName: 'Fund*',
                field: 'fund',
                filter: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['None'].concat(this.funds)
                }
            },
            {
                headerName: 'Trade P/L',
                field: 'tradePnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.tradePnL, false); }
            },
            {
                headerName: 'Day',
                field: 'day',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.day, false); }
            },
            {
                headerName: 'Daily % Return',
                field: 'dailyPercentageReturn',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.dailyPercentageReturn, true); }
            },
            {
                headerName: 'Long P/L',
                field: 'longPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.longPnL, false); }
            },
            {
                headerName: 'Long % Change',
                field: 'longPercentageChange',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.longPercentageChange, false); }
            },
            {
                headerName: 'Short P/L',
                field: 'shortPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.shortPnL, false); }
            },
            {
                headerName: 'Short % Change',
                field: 'shortPercentageChange',
                valueFormatter: function (params) {
                    return _this.numberFormatter(params.node.data.shortPercentageChange, false);
                }
            },
            {
                headerName: 'Long Exposure',
                field: 'longExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.longExposure, false); }
            },
            {
                headerName: 'Short Exposure',
                field: 'shortExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.shortExposure, false); }
            },
            {
                headerName: 'Gross Exposure',
                field: 'grossExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.grossExposure, false); }
            },
            {
                headerName: 'Net Exposure',
                field: 'netExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.netExposure, false); }
            },
            {
                headerName: '6md Beta Net Exposure',
                field: 'sixMdBetaNetExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.sixMdBetaNetExposure, false); }
            },
            {
                headerName: '2Yw Beta Net Exposure',
                field: 'twoYwBetaNetExposure',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.twoYwBetaNetExposure, false); }
            },
            {
                headerName: '6md Beta Short Exposure',
                field: 'sixMdBetaShortExposure',
                valueFormatter: function (params) {
                    return _this.numberFormatter(params.node.data.sixMdBetaShortExposure, false);
                }
            },
            {
                headerName: 'Nav Market',
                field: 'navMarket',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.navMarket, false); }
            },
            {
                headerName: 'Dividend USD',
                field: 'dividendUSD',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.dividendUSD, false); }
            },
            {
                headerName: 'Comm USD',
                field: 'commUSD',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.commUSD, false); }
            },
            {
                headerName: 'Fee/Taxes USD',
                field: 'feeTaxesUSD',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.feeTaxesUSD, false); }
            },
            {
                headerName: 'Financing USD',
                field: 'financingUSD',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.financingUSD, false); }
            },
            {
                headerName: 'Other USD',
                field: 'otherUSD',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.otherUSD, false); }
            },
            {
                headerName: 'P/L %',
                field: 'pnLPercentage',
                valueFormatter: function (params) { return _this.returnsFormatter(params.node.data.pnLPercentage, true, _this.returnsFormatString); }
            },
            {
                headerName: 'MTD % Return',
                field: 'mtdPercentageReturn',
                valueFormatter: function (params) { return _this.returnsFormatter(params.node.data.mtdPercentageReturn, true, _this.returnsFormatString); }
            },
            {
                headerName: 'QTD % Return',
                field: 'qtdPercentageReturn',
                valueFormatter: function (params) { return _this.returnsFormatter(params.node.data.qtdPercentageReturn, true, _this.returnsFormatString); }
            },
            {
                headerName: 'YTD % Return',
                field: 'ytdPercentageReturn',
                valueFormatter: function (params) { return _this.returnsFormatter(params.node.data.ytdPercentageReturn, true, _this.returnsFormatString); }
            },
            {
                headerName: 'ITD % Return',
                field: 'itdPercentageReturn',
                valueFormatter: function (params) { return _this.returnsFormatter(params.node.data.itdPercentageReturn, true, _this.returnsFormatString); }
            },
            {
                headerName: 'MTD PnL',
                field: 'mtdPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.mtdPnL, false); }
            },
            {
                headerName: 'QTD PnL',
                field: 'qtdPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.qtdPnL, false); }
            },
            {
                headerName: 'YTD PnL',
                field: 'ytdPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.ytdPnL, false); }
            },
            {
                headerName: 'ITD PnL',
                field: 'itdPnL',
                valueFormatter: function (params) { return _this.numberFormatter(params.node.data.itdPnL, false); }
            },
            {
                headerName: 'Created By',
                field: 'createdBy',
                hide: true
            },
            {
                headerName: 'Last Updated By ',
                field: 'lastUpdatedBy ',
                hide: true
            },
            {
                headerName: 'Created Date',
                field: 'createdDate',
                hide: true
            },
            {
                headerName: 'Last Updated Date',
                field: 'lastUpdatedDate',
                hide: true
            }
        ];
        colDefs.forEach(function (colDef) {
            if (!(colDef.field === 'modified' ||
                colDef.field === 'businessDate' ||
                colDef.field === 'portfolio' ||
                colDef.field === 'fund')) {
                colDef['type'] = 'numericColumn';
            }
        });
        return colDefs;
    };
    DailyPnlComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Visualize',
                action: function () {
                    _this.visualizeData();
                }
            },
            {
                name: 'Decimal Places 2',
                action: function () {
                    _this.returnsFormatString = '1.2-2';
                    _this.refreshGrid();
                }
            },
            {
                name: 'Decimal Places 16',
                action: function () {
                    _this.returnsFormatString = '1.16-16';
                    _this.refreshGrid();
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    DailyPnlComponent.prototype.ngModelChange = function (e) {
        this.startDate = e.startDate;
        this.endDate = e.endDate;
        this.getRangeLabel();
        this.dailyPnlGrid.api.onFilterChanged();
    };
    DailyPnlComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    DailyPnlComponent.prototype.visualizeData = function () {
        var data = {};
        var focusedCell = this.dailyPnlGrid.api.getFocusedCell();
        var selectedRow = this.dailyPnlGrid.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
        var column = focusedCell.column.getColDef().field;
        var columnLabel = focusedCell.column.getUserProvidedColDef().headerName;
        data[columnLabel] = [];
        var toDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedRow.businessDate);
        var fromDate = moment__WEBPACK_IMPORTED_MODULE_4__(selectedRow.businessDate).subtract(30, 'days');
        var selectedPortfolio = selectedRow.portFolio;
        this.dailyPnlGrid.api.forEachNodeAfterFilter(function (rowNode, index) {
            var currentDate = moment__WEBPACK_IMPORTED_MODULE_4__(rowNode.data.businessDate);
            if (rowNode.data.portFolio === selectedPortfolio
            // &&
            // currentDate.isSameOrAfter(fromDate) &&
            // currentDate.isSameOrBefore(toDate)
            ) {
                data[columnLabel].push({
                    date: rowNode.data.businessDate,
                    value: rowNode.data[column]
                });
            }
        });
        this.graphObject = {
            xAxisLabel: 'Date',
            yAxisLabel: columnLabel,
            lineColors: ['#ff6960', '#00bd9a'],
            height: 410,
            width: '95%',
            chartTitle: selectedPortfolio,
            propId: 'lineDailyPnL',
            graphData: data,
            dateTimeFormat: 'YYYY-MM-DD',
            referenceDate: toDate
        };
        this.dailyPnLConfig.chartsView = true;
        this.disableCharts = false;
    };
    DailyPnlComponent.prototype.uploadDailyUnofficialPnl = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService
            .uploadDailyUnofficialPnl(this.fileToUpload)
            .subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful) {
                _this.fileInput.nativeElement.value = '';
                _this.disableFileUpload = true;
                _this.dailyPnLData = response.payload.map(function (data) { return ({
                    businessDate: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["DateFormatter"])(data.BusinessDate),
                    fund: data.Fund,
                    portFolio: data.PortFolio,
                    tradePnL: data.TradePnL,
                    day: data.Day,
                    dailyPercentageReturn: data.DailyPercentageReturn,
                    longPnL: data.LongPnL,
                    longPercentageChange: data.LongPercentageChange,
                    shortPnL: data.ShortPnL,
                    shortPercentageChange: data.ShortPercentageChange,
                    longExposure: data.LongExposure,
                    shortExposure: data.ShortExposure,
                    grossExposure: data.GrossExposure,
                    netExposure: data.NetExposure,
                    sixMdBetaNetExposure: data.SixMdBetaNetExposure,
                    twoYwBetaNetExposure: data.TwoYwBetaNetExposure,
                    sixMdBetaShortExposure: data.SixMdBetaShortExposure,
                    navMarket: data.NavMarket,
                    dividendUSD: data.DividendUSD,
                    commUSD: data.CommUSD,
                    feeTaxesUSD: data.FeeTaxesUSD,
                    financingUSD: data.FinancingUSD,
                    otherUSD: data.OtherUSD,
                    pnLPercentage: data.PnLPercentage,
                    mtdPercentageReturn: data.MTDPercentageReturn,
                    qtdPercentageReturn: data.QTDPercentageReturn,
                    ytdPercentageReturn: data.YTDPercentageReturn,
                    itdPercentageReturn: data.ITDPercentageReturn,
                    mtdPnL: data.MTDPnL,
                    qtdPnL: data.QTDPnL,
                    ytdPnL: data.YTDPnL,
                    itdPnL: data.ITDPnL,
                    createdBy: data.CreatedBy,
                    lastUpdatedBy: data.LastUpdatedBy,
                    createdDate: data.CreatedDate,
                    lastUpdatedDate: data.lastUpdatedDate
                }); });
                _this.dailyPnlGrid.api.setRowData(_this.dailyPnLData);
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    DailyPnlComponent.prototype.refreshGrid = function () {
        this.dailyPnlGrid.api.showLoadingOverlay();
        this.getDailyPnL();
    };
    DailyPnlComponent.prototype.numberFormatter = function (numberToFormat, isInPercentage) {
        var per = numberToFormat;
        if (isInPercentage) {
            per = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["PercentageFormatter"])(numberToFormat);
        }
        var formattedValue = this.decimalPipe.transform(per, '1.2-2');
        return formattedValue.toString();
    };
    DailyPnlComponent.prototype.returnsFormatter = function (numberToFormat, isInPercentage, format) {
        var per = numberToFormat;
        if (isInPercentage) {
            per = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["PercentageFormatter"])(numberToFormat);
        }
        var formattedValue = this.decimalPipe.transform(per, format);
        return formattedValue.toString();
    };
    DailyPnlComponent.prototype.onFileInput = function (files) {
        this.disableFileUpload = false;
        this.fileToUpload = files.item(0);
    };
    DailyPnlComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"] },
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_10__["FundTheoreticalApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_2__["DecimalPipe"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__["CacheService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], DailyPnlComponent.prototype, "fileInput", void 0);
    DailyPnlComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-daily-pnl',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./daily-pnl.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./daily-pnl.component.scss */ "./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_service_proxies__WEBPACK_IMPORTED_MODULE_9__["FinanceServiceProxy"],
            src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_10__["FundTheoreticalApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["DecimalPipe"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__["CacheService"]])
    ], DailyPnlComponent);
    return DailyPnlComponent;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/fund-theoretical.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fund-theoretical.component.scss ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vZnVuZC10aGVvcmV0aWNhbC9mdW5kLXRoZW9yZXRpY2FsLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/fund-theoretical.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fund-theoretical.component.ts ***!
  \*********************************************************************/
/*! exports provided: FundTheoreticalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FundTheoreticalComponent", function() { return FundTheoreticalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var _shared_Component_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/Component/ag-grid-checkbox/ag-grid-checkbox.component */ "./src/shared/Component/ag-grid-checkbox/ag-grid-checkbox.component.ts");
/* harmony import */ var _shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_shared_Component_date_picker_modal_date_picker_modal_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/Component/date-picker-modal/date-picker-modal.component */ "./src/shared/Component/date-picker-modal/date-picker-modal.component.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");


















var FundTheoreticalComponent = /** @class */ (function () {
    function FundTheoreticalComponent(cdRef, cacheService, toastrService, dataService, financeService, fundTheoreticalApiService, dataDictionary, downloadExcelUtils) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.financeService = financeService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.dataDictionary = dataDictionary;
        this.downloadExcelUtils = downloadExcelUtils;
        this.fundTheoreticalConfig = {
            fundTheoreticalSize: 50,
            chartsSize: 50,
            fundTheoreticalView: true,
            chartsView: false,
            useTransition: true
        };
        this.selectedDate = null;
        this.disableCommit = true;
        this.fileToUpload = null;
        this.disableFileUpload = true;
        this.disableCharts = true;
        this.isDailyPnLActive = false;
        this.isTaxRateActive = false;
        this.isMarketPricesActive = false;
        this.isFxRateActive = false;
        this.uploadLoader = false;
        this.commitLoader = false;
        this.confirmOption = {
            generateRows: false,
            uploadRows: false
        };
        this.monthsArray = [
            { id: 0, month: 'January' },
            { id: 1, month: 'February' },
            { id: 2, month: 'March' },
            { id: 3, month: 'April' },
            { id: 4, month: 'May' },
            { id: 5, month: 'June' },
            { id: 6, month: 'July' },
            { id: 7, month: 'August' },
            { id: 8, month: 'September' },
            { id: 9, month: 'October' },
            { id: 10, month: 'November' },
            { id: 11, month: 'December' }
        ];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["HeightStyle"])(224);
        this.containerDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.portfolios = [];
        this.hideGrid = false;
        this.currentYear = moment__WEBPACK_IMPORTED_MODULE_3__().get('year');
        var currentMonthObj = this.monthsArray.find(function (obj) { return obj.id === moment__WEBPACK_IMPORTED_MODULE_3__().get('month'); });
        this.currentMonth = currentMonthObj.month;
    }
    FundTheoreticalComponent.prototype.ngOnInit = function () {
        this.getFunds();
        this.getPortfolios();
        this.getMonthlyPerformance();
        this.initGrid();
    };
    FundTheoreticalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.initPageLayout();
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
            }
        });
    };
    FundTheoreticalComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fundTheoreticalConfigKey);
        if (config) {
            this.fundTheoreticalConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    FundTheoreticalComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.fundTheoreticalConfig.fundTheoreticalSize = event.sizes[0];
            this.fundTheoreticalConfig.chartsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fundTheoreticalConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fundTheoreticalConfigKey,
            value: JSON.stringify(this.fundTheoreticalConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fundTheoreticalConfigKey
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
    FundTheoreticalComponent.prototype.activeFundTheretical = function () {
        this.getMonthlyPerformance();
    };
    FundTheoreticalComponent.prototype.activeDailyPnL = function () {
        this.isDailyPnLActive = true;
    };
    FundTheoreticalComponent.prototype.activeTaxRate = function () {
        this.isTaxRateActive = true;
    };
    FundTheoreticalComponent.prototype.activeMarketPrices = function () {
        this.isMarketPricesActive = true;
    };
    FundTheoreticalComponent.prototype.activeFxRate = function () {
        this.isFxRateActive = true;
    };
    FundTheoreticalComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (response) {
            _this.funds = response.payload.map(function (item) { return item.FundCode; });
            _this.funds.push('None');
            _this.initCols();
        });
    };
    FundTheoreticalComponent.prototype.getPortfolios = function () {
        var _this = this;
        this.financeService.getPortfolios().subscribe(function (response) {
            if (response && response.payload) {
                _this.portfolios = response.payload.map(function (item) { return item.PortfolioCode; });
            }
            _this.portfolios.push('None');
            _this.initCols();
        });
    };
    FundTheoreticalComponent.prototype.getMonthlyPerformance = function () {
        var _this = this;
        var rowNodeId = 1;
        this.fundTheoreticalApiService.getMonthlyPerformance().subscribe(function (response) {
            var modifiedData = response.payload.map(function (data) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, data, { RowId: rowNodeId++ });
            });
            _this.totalGridRows = rowNodeId;
            _this.monthlyPerformanceData = _this.formatPerformanceData(modifiedData);
            if (_this.fundTheoreticalGrid) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["AutoSizeAllColumns"])(_this.fundTheoreticalGrid);
            }
            var isCurrentMonthAdded = _this.monthlyPerformanceData.find(function (data) { return data.month === _this.currentMonth && data.year === _this.currentYear; });
            if (!isCurrentMonthAdded && _this.monthlyPerformanceData.length > 0) {
                _this.monthlyPerformanceData.push(_this.createRow(_this.currentYear, _this.currentMonth, 0));
            }
            if (_this.monthlyPerformanceData.length > 0) {
                _this.disableCharts = false;
            }
            _this.fundTheoreticalGrid.api.setRowData(_this.monthlyPerformanceData);
        });
    };
    FundTheoreticalComponent.prototype.initGrid = function () {
        var _this = this;
        this.fundTheoreticalGrid = {
            rowData: this.monthlyPerformanceData,
            pinnedBottomRowData: null,
            columnDefs: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            onFilterChanged: this.generateData.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotRowTotals: 'after',
            pivotColumnGroupTotals: 'after',
            animateRows: true,
            singleClickEdit: true,
            enableCellChangeFlash: true,
            deltaRowDataMode: true,
            onRowSelected: function (params) { },
            getRowNodeId: function (data) {
                return data.rowId;
            },
            onFirstDataRendered: function (params) { },
            onCellValueChanged: function (params) {
                _this.onCellValueChanged(params);
            },
            defaultColDef: {
                resizable: true
            }
        };
        this.fundTheoreticalGrid.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].fundTheoreticalId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].fundTheoretical, this.fundTheoreticalGrid);
    };
    FundTheoreticalComponent.prototype.initCols = function () {
        var colDefs = this.getColDefs();
        this.fundTheoreticalGrid.api.setColumnDefs(colDefs);
        Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["AutoSizeAllColumns"])(this.fundTheoreticalGrid);
        this.fundTheoreticalGrid.api.sizeColumnsToFit();
    };
    FundTheoreticalComponent.prototype.getColDefs = function () {
        var _this = this;
        return [
            {
                headerName: 'Is Modified',
                field: 'modified',
                hide: true
            },
            {
                headerName: 'Estimated',
                field: 'estimated',
                cellEditor: 'agSelectCellEditor',
                cellRendererFramework: _shared_Component_ag_grid_checkbox_ag_grid_checkbox_component__WEBPACK_IMPORTED_MODULE_6__["AgGridCheckboxComponent"],
                // To call onCellValueChangedMethod from AgGridCheckboxComponent
                customMethod: function (params) { return _this.onCellValueChanged(params); }
            },
            {
                headerName: 'Year',
                field: 'year',
                sortable: true,
                filter: true,
                suppressCellFlash: true
            },
            {
                headerName: 'Month',
                field: 'month',
                sortable: true,
                filter: true,
                suppressCellFlash: true
            },
            {
                headerName: 'Fund*',
                field: 'fund',
                sortable: true,
                filter: true,
                editable: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: this.funds
                }
            },
            {
                headerName: 'Portfolio*',
                field: 'portfolio',
                editable: true,
                filter: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: this.portfolios
                }
            },
            {
                headerName: 'Start of Month Estimate NAV*',
                field: 'startOfMonthEstimateNav',
                sortable: true,
                editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.startOfMonthEstimateNav, false);
                }
            },
            {
                headerName: 'Performance*',
                field: 'performance',
                sortable: true,
                editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.performance, false);
                }
            },
            {
                headerName: 'Admin Month End NAV',
                field: 'monthEndNav',
                sortable: true,
                // editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.monthEndNav, false);
                }
            },
            {
                headerName: 'MTD*',
                field: 'mtd',
                sortable: true,
                editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) { return _this.dataDictionary.numberFormatter(params.node.data.mtd, true); }
            },
            {
                headerName: 'YTD Net Perf',
                field: 'ytdNetPerformance',
                sortable: true,
                suppressCellFlash: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.ytdNetPerformance, false);
                }
            },
            {
                headerName: 'QTD Net %',
                field: 'qtd',
                sortable: true,
                type: 'numericColumn',
                valueFormatter: function (params) { return _this.dataDictionary.numberFormatter(params.node.data.qtd, true); }
            },
            {
                headerName: 'YTD Net %',
                field: 'ytd',
                sortable: true,
                type: 'numericColumn',
                valueFormatter: function (params) { return _this.dataDictionary.numberFormatter(params.node.data.ytd, true); }
            },
            {
                headerName: 'ITD Net %',
                field: 'itd',
                sortable: true,
                type: 'numericColumn',
                valueFormatter: function (params) { return _this.dataDictionary.numberFormatter(params.node.data.itd, true); }
            },
            {
                headerName: 'Created By',
                field: 'createdBy',
                hide: true
            },
            {
                headerName: 'Last Updated By ',
                field: 'lastUpdatedBy ',
                hide: true
            },
            {
                headerName: 'Created Date',
                field: 'createdDate',
                hide: true
            },
            {
                headerName: 'Last Updated Date',
                field: 'lastUpdatedDate',
                hide: true
            }
        ];
    };
    FundTheoreticalComponent.prototype.onCellValueChanged = function (params) {
        if ((params.colDef.field === 'monthEndNav' ||
            params.colDef.field === 'performance' ||
            params.colDef.field === 'mtd') &&
            params.newValue != params.oldValue) {
            this.doCalculation();
            params.data.modified = true;
            this.disableCommit = false;
        }
        if ((params.colDef.field === 'fund' && params.data.fund !== 'None') ||
            (params.colDef.field === 'portfolio' && params.data.portfolio !== 'None') ||
            params.colDef.field === 'estimated') {
            this.doCalculation();
            this.disableCommit = false;
            params.data.modified = true;
        }
        if (params.colDef.field === 'performance' ||
            params.colDef.field === 'startOfMonthEstimateNav') {
            var monthEndNavSum_1;
            if (params.colDef.field === 'performance') {
                monthEndNavSum_1 = +params.newValue + +params.data.startOfMonthEstimateNav;
            }
            else {
                monthEndNavSum_1 = +params.newValue + +params.data.performance;
            }
            var row_1 = this.fundTheoreticalGrid.api.getRowNode(params.data.rowId);
            params.data.modified = true;
            setTimeout(function () {
                row_1.setDataValue('monthEndNav', monthEndNavSum_1.toString());
            }, 500);
        }
    };
    FundTheoreticalComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Add Current Month',
                action: function () {
                    _this.addCurrentMonth(params);
                }
            },
            {
                name: 'Add Next Month',
                action: function () {
                    _this.addNextMonth(params);
                }
            },
            {
                name: 'Add Row',
                action: function () {
                    _this.datePickerModal.showModal(params);
                }
            },
            {
                name: 'Delete Row',
                action: function () {
                    _this.deleteRow(params);
                }
            },
            {
                name: 'View Audit Trail',
                action: function () {
                    _this.viewRow(params);
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    FundTheoreticalComponent.prototype.addCurrentMonth = function (params) {
        var index = params.node.rowIndex;
        var newRow = this.createRow(params.node.data.year, params.node.data.month, this.totalGridRows + 1);
        params.api.updateRowData({
            add: [newRow],
            addIndex: index + 1
        });
        this.totalGridRows += 1;
    };
    FundTheoreticalComponent.prototype.addNextMonth = function (params) {
        var forMonth = moment__WEBPACK_IMPORTED_MODULE_3__()
            .year(params.node.data.year)
            .month(params.node.data.month);
        var nextMonth = forMonth.add(1, 'month').format('MMMM');
        var newYear = forMonth.format('YYYY');
        var index = params.node.rowIndex;
        var newRow = this.createRow(newYear, nextMonth, this.totalGridRows + 1);
        params.api.updateRowData({
            add: [newRow],
            addIndex: index + 1
        });
        this.totalGridRows += 1;
    };
    FundTheoreticalComponent.prototype.addCustom = function ($event) {
        var params = $event.params;
        var date = $event.selectedDate;
        var year = date.format('YYYY');
        var month = date.format('MMMM');
        var index = params.node.rowIndex;
        var newRow = this.createRow(year, month, this.totalGridRows + 1);
        params.api.updateRowData({
            add: [newRow],
            addIndex: index + 1
        });
        this.totalGridRows += 1;
    };
    FundTheoreticalComponent.prototype.deleteRow = function (params) {
        var rowData = params.node.data;
        if (rowData.id === 0) {
            params.api.updateRowData({
                remove: [rowData]
            });
        }
        else {
            this.toastrService.error('Cannot delete this record!');
        }
    };
    FundTheoreticalComponent.prototype.viewRow = function (rowNode) {
        var _this = this;
        var id = rowNode.node.data.id;
        this.fundTheoreticalApiService.monthlyPerformanceAudit(id).subscribe(function (response) {
            var payload = response.payload;
            var modifiedData = _this.formatPerformanceData(payload);
            var columns = _this.getColDefs();
            var modifiedCols = columns.map(function (col) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, col, { editable: false });
            });
            _this.title = 'Audit Trail';
            _this.dataGridModal.openModal(modifiedCols, modifiedData);
        });
    };
    FundTheoreticalComponent.prototype.DateFormatter = function (date, option, isStringFormat) {
        var dateObject;
        if (isStringFormat) {
            dateObject = moment__WEBPACK_IMPORTED_MODULE_3__(date);
        }
        else {
            dateObject = date;
        }
        var formattedValue;
        switch (option) {
            case 1:
                formattedValue = moment__WEBPACK_IMPORTED_MODULE_3__(dateObject).get('year');
                break;
            case 2:
                var monthId_1 = moment__WEBPACK_IMPORTED_MODULE_3__(dateObject).get('month');
                formattedValue = this.monthsArray.find(function (obj) { return obj.id === monthId_1; });
                formattedValue = formattedValue.month;
                break;
        }
        return formattedValue;
    };
    FundTheoreticalComponent.prototype.changeDate = function (date) {
        var startDate = date.startDate;
        this.generateFundsDate = startDate;
    };
    FundTheoreticalComponent.prototype.generateRows = function () {
        if (this.monthlyPerformanceData.length > 0) {
            this.confirmOption.generateRows = true;
            this.confirmationModal.showModal();
        }
        else {
            this.generateMonthlyPerformanceRows();
        }
    };
    FundTheoreticalComponent.prototype.generateMonthlyPerformanceRows = function () {
        var today = moment__WEBPACK_IMPORTED_MODULE_3__();
        var totalMonths = today.diff(this.generateFundsDate, 'months');
        var count = 0;
        var generateFundsDate = this.generateFundsDate;
        this.monthlyPerformanceData = [];
        while (count <= totalMonths) {
            this.monthlyPerformanceData.push(this.createRow(this.DateFormatter(generateFundsDate, 1, false), this.DateFormatter(generateFundsDate, 2, false), count));
            generateFundsDate.add(1, 'month');
            count++;
        }
        this.totalGridRows = count;
        this.disableCharts = false;
        this.selectedDate = null;
        this.confirmOption.generateRows = false;
        this.fundTheoreticalGrid.api.setRowData([]);
        this.fundTheoreticalGrid.api.setRowData(this.monthlyPerformanceData);
    };
    FundTheoreticalComponent.prototype.onFileInput = function (files) {
        this.disableFileUpload = false;
        this.fileToUpload = files.item(0);
    };
    FundTheoreticalComponent.prototype.uploadRows = function () {
        if (this.monthlyPerformanceData.length > 0) {
            this.confirmOption.uploadRows = true;
            this.confirmationModal.showModal();
        }
        else {
            this.uploadMonthlyPerformance();
        }
    };
    FundTheoreticalComponent.prototype.uploadMonthlyPerformance = function () {
        var _this = this;
        var rowNodeId = 1;
        this.uploadLoader = true;
        this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful) {
                var modifiedData = response.payload.map(function (data) {
                    return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, data, { RowId: rowNodeId++, Estimated: true });
                });
                _this.totalGridRows = rowNodeId;
                _this.monthlyPerformanceData = _this.formatPerformanceData(modifiedData);
                _this.fundTheoreticalGrid.api.setRowData(_this.monthlyPerformanceData);
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_17__["AutoSizeAllColumns"])(_this.fundTheoreticalGrid);
                _this.disableFileUpload = true;
                _this.fileInput.nativeElement.value = '';
                _this.confirmOption.uploadRows = false;
                _this.disableCommit = false;
                _this.disableCharts = false;
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FundTheoreticalComponent.prototype.confirmReset = function () {
        var _a = this.confirmOption, generateRows = _a.generateRows, uploadRows = _a.uploadRows;
        if (generateRows) {
            this.generateMonthlyPerformanceRows();
        }
        else if (uploadRows) {
            this.uploadMonthlyPerformance();
        }
    };
    FundTheoreticalComponent.prototype.doCalculation = function () {
        var _this = this;
        var rowRecords = [];
        this.fundTheoreticalGrid.api.forEachNode(function (node) {
            rowRecords.push(node.data);
        });
        var formattedRecords = rowRecords.map(function (data) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, data, { fund: data.fund === 'None' ? null : data.fund, portfolio: data.portfolio === 'None' ? null : data.portfolio, performanceDate: data.year + '-' + _this.getMomentMonth(data.month) + '-' + '01' })); });
        this.fundTheoreticalApiService.calMonthlyPerformance(formattedRecords).subscribe(function (response) {
            var rows = _this.formatPerformanceData(response.payload);
            _this.fundTheoreticalGrid.api.setRowData(rows);
            _this.generateData();
        });
    };
    FundTheoreticalComponent.prototype.commitPerformanceData = function () {
        var _this = this;
        var recordsToCommit = [];
        this.fundTheoreticalGrid.api.forEachNode(function (node, index) {
            if (node.data.id === 0 || node.data.modified) {
                recordsToCommit.push(node.data);
            }
        });
        var formattedRecords;
        if (recordsToCommit.length > 0) {
            formattedRecords = recordsToCommit.map(function (data) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, data, { fund: data.fund === 'None' ? null : data.fund, portfolio: data.portfolio === 'None' ? null : data.portfolio, performanceDate: data.year + '-' + _this.getMomentMonth(data.month) + '-' + '01' })); });
            this.commitLoader = true;
            this.fundTheoreticalApiService
                .commitMonthlyPerformance(formattedRecords)
                .subscribe(function (response) {
                _this.commitLoader = false;
                if (response.isSuccessful) {
                    _this.toastrService.success('Sucessfully Commited.');
                    _this.getMonthlyPerformance();
                }
                else {
                    _this.toastrService.error('Something went wrong! Try Again.');
                }
            });
        }
        else {
            this.toastrService.error('No changes to commit.');
        }
        this.disableCommit = true;
    };
    FundTheoreticalComponent.prototype.onToggleChartsView = function () {
        this.fundTheoreticalConfig.chartsView = !this.fundTheoreticalConfig.chartsView;
        if (this.fundTheoreticalConfig.chartsView) {
            this.generateData();
        }
    };
    FundTheoreticalComponent.prototype.generateData = function () {
        var _this = this;
        var dataObject = [
            // { label: 'YTDNetPerformance', data: [] },
            { label: 'QTD', data: [] },
            { label: 'YTD', data: [] },
            { label: 'ITD', data: [] }
        ];
        var chartData = {};
        dataObject.forEach(function (model) {
            var _a;
            _this.fundTheoreticalGrid.api.forEachNodeAfterFilter(function (rowNode, index) {
                model.data.push({
                    date: _this.getMomentMonth(rowNode.data.month) + '-' + '01' + '-' + rowNode.data.year,
                    value: rowNode.data[model.label === 'YTDNetPerformance' ? 'ytdNetPerformance' : model.label.toLowerCase()] * 100
                });
            });
            chartData = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, chartData, (_a = {}, _a[model.label] = model.data, _a));
        });
        this.graphObject = {
            xAxisLabel: 'Date',
            yAxisLabel: 'Value',
            lineColors: ['#34A9FF', '#FFA000', ' #00BD9A'],
            height: '100%',
            width: '100%',
            chartTitle: 'Monthly Performance',
            propId: 'linePerformance',
            graphData: chartData,
            dateTimeFormat: 'MM-DD-YYYY'
        };
    };
    FundTheoreticalComponent.prototype.formatPerformanceData = function (records) {
        var _this = this;
        var formattedRecords = records.map(function (record) { return ({
            id: record.Id,
            rowId: record.RowId,
            modified: record.Modified,
            estimated: record.Estimated,
            year: _this.DateFormatter(record.PerformanceDate, 1, true),
            month: _this.DateFormatter(record.PerformanceDate, 2, true),
            fund: record.Fund === null ? 'None' : record.Fund,
            portfolio: record.PortFolio === null ? 'None' : record.PortFolio,
            monthEndNav: record.MonthEndNav,
            startOfMonthEstimateNav: record.StartOfMonthEstimateNav,
            performance: record.Performance,
            mtd: record.MTD,
            ytdNetPerformance: record.YTDNetPerformance,
            qtd: record.QTD,
            ytd: record.YTD,
            itd: record.ITD,
            createdBy: record.CreatedBy,
            lastUpdatedBy: record.lastUpdatedBy,
            createdDate: record.createdDate,
            lastUpdatedDate: record.lastUpdatedBy
        }); });
        return formattedRecords;
    };
    FundTheoreticalComponent.prototype.createRow = function (generatedYear, generatedMonth, rowNodeId) {
        return {
            id: 0,
            rowId: rowNodeId,
            modified: false,
            estimated: true,
            year: generatedYear,
            month: generatedMonth,
            fund: 'None',
            portfolio: 'None',
            monthEndNav: 0,
            startOfMonthEstimateNav: 0,
            performance: 0,
            mtd: 0,
            ytdNetPerformance: 0,
            qtd: 0,
            ytd: 0,
            itd: 0,
            createdBy: '',
            lastUpdatedBy: '',
            createdDate: '',
            lastUpdatedDate: ''
        };
    };
    FundTheoreticalComponent.prototype.getMomentMonth = function (month) {
        var momentMonth = this.monthsArray.find(function (obj) { return obj.month === month; });
        var monthInNum = momentMonth.id + 1;
        if (monthInNum < 9) {
            return '0' + monthInNum;
        }
        else {
            return monthInNum;
        }
    };
    FundTheoreticalComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Accounts',
            sheetName: 'First Sheet',
            columnKeys: ['accountName', 'description', 'category', 'hasJournal', 'type']
        };
        this.fundTheoreticalGrid.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    FundTheoreticalComponent.prototype.refreshGrid = function () {
        this.fundTheoreticalGrid.api.showLoadingOverlay();
    };
    FundTheoreticalComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_10__["CacheService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__["DataService"] },
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_12__["FinanceServiceProxy"] },
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_13__["FundTheoreticalApiService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__["DataDictionary"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_7__["DataGridModalComponent"])
    ], FundTheoreticalComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_9__["ConfirmationModalComponent"])
    ], FundTheoreticalComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('datePickerModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_date_picker_modal_date_picker_modal_component__WEBPACK_IMPORTED_MODULE_8__["DatePickerModalComponent"])
    ], FundTheoreticalComponent.prototype, "datePickerModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], FundTheoreticalComponent.prototype, "fileInput", void 0);
    FundTheoreticalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-fund-theoretical',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./fund-theoretical.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fund-theoretical.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./fund-theoretical.component.scss */ "./src/app/main/fund-theoretical/fund-theoretical.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_10__["CacheService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__["DataService"],
            _services_service_proxies__WEBPACK_IMPORTED_MODULE_12__["FinanceServiceProxy"],
            src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_13__["FundTheoreticalApiService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_14__["DataDictionary"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_16__["DownloadExcelUtils"]])
    ], FundTheoreticalComponent);
    return FundTheoreticalComponent;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/fund-theoretical.module.ts":
/*!******************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fund-theoretical.module.ts ***!
  \******************************************************************/
/*! exports provided: FundTheoreticalModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FundTheoreticalModule", function() { return FundTheoreticalModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var ngcatalyst__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngcatalyst */ "./node_modules/ngcatalyst/fesm5/ngcatalyst.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var _fund_theoretical_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./fund-theoretical.component */ "./src/app/main/fund-theoretical/fund-theoretical.component.ts");
/* harmony import */ var _fund_theoretical_daily_pnl_daily_pnl_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../fund-theoretical/daily-pnl/daily-pnl.component */ "./src/app/main/fund-theoretical/daily-pnl/daily-pnl.component.ts");
/* harmony import */ var _fund_theoretical_fx_rates_fx_rates_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../fund-theoretical/fx-rates/fx-rates.component */ "./src/app/main/fund-theoretical/fx-rates/fx-rates.component.ts");
/* harmony import */ var _fund_theoretical_market_prices_market_prices_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../fund-theoretical/market-prices/market-prices.component */ "./src/app/main/fund-theoretical/market-prices/market-prices.component.ts");
/* harmony import */ var _fund_theoretical_tax_rates_tax_rates_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../fund-theoretical/tax-rates/tax-rates.component */ "./src/app/main/fund-theoretical/tax-rates/tax-rates.component.ts");
/* harmony import */ var _tax_rates_tax_rate_modal_tax_rate_modal_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./tax-rates/tax-rate-modal/tax-rate-modal.component */ "./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.ts");
/* harmony import */ var _fund_theoretical_route__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./fund-theoretical.route */ "./src/app/main/fund-theoretical/fund-theoretical.route.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");



















var fundtheoreticalComponents = [
    _fund_theoretical_component__WEBPACK_IMPORTED_MODULE_11__["FundTheoreticalComponent"],
    _fund_theoretical_daily_pnl_daily_pnl_component__WEBPACK_IMPORTED_MODULE_12__["DailyPnlComponent"],
    _fund_theoretical_fx_rates_fx_rates_component__WEBPACK_IMPORTED_MODULE_13__["FxRatesComponent"],
    _fund_theoretical_market_prices_market_prices_component__WEBPACK_IMPORTED_MODULE_14__["MarketPricesComponent"],
    _fund_theoretical_tax_rates_tax_rates_component__WEBPACK_IMPORTED_MODULE_15__["TaxRatesComponent"],
    _tax_rates_tax_rate_modal_tax_rate_modal_component__WEBPACK_IMPORTED_MODULE_16__["TaxRateModalComponent"]
];
var FundTheoreticalModule = /** @class */ (function () {
    function FundTheoreticalModule() {
    }
    FundTheoreticalModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: fundtheoreticalComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TooltipModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_4__["TypeaheadModule"].forRoot(),
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                ngcatalyst__WEBPACK_IMPORTED_MODULE_7__["NgcatalystModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterModule"].forChild(_fund_theoretical_route__WEBPACK_IMPORTED_MODULE_17__["FundtheoreticalRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_9__["LpToolkitModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_10__["AngularSplitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_18__["SharedModule"]
            ]
        })
    ], FundTheoreticalModule);
    return FundTheoreticalModule;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/fund-theoretical.route.ts":
/*!*****************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fund-theoretical.route.ts ***!
  \*****************************************************************/
/*! exports provided: FundtheoreticalRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FundtheoreticalRoutes", function() { return FundtheoreticalRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _fund_theoretical_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fund-theoretical.component */ "./src/app/main/fund-theoretical/fund-theoretical.component.ts");
/* harmony import */ var src_services_guards_performance_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/services/guards/performance-can-deactivate-guard.service */ "./src/services/guards/performance-can-deactivate-guard.service.ts");



var FundtheoreticalRoutes = [
    {
        path: '',
        component: _fund_theoretical_component__WEBPACK_IMPORTED_MODULE_1__["FundTheoreticalComponent"],
        canDeactivate: [src_services_guards_performance_can_deactivate_guard_service__WEBPACK_IMPORTED_MODULE_2__["PerformanceCanDeactivateGuard"]]
    }
];


/***/ }),

/***/ "./src/app/main/fund-theoretical/fx-rates/fx-rates.component.scss":
/*!************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fx-rates/fx-rates.component.scss ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vZnVuZC10aGVvcmV0aWNhbC9meC1yYXRlcy9meC1yYXRlcy5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/fx-rates/fx-rates.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/main/fund-theoretical/fx-rates/fx-rates.component.ts ***!
  \**********************************************************************/
/*! exports provided: FxRatesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FxRatesComponent", function() { return FxRatesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var _services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");












var FxRatesComponent = /** @class */ (function () {
    function FxRatesComponent(cdRef, cacheService, toastrService, fundTheoreticalApiService, dataDictionary) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.toastrService = toastrService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.dataDictionary = dataDictionary;
        this.fxRatesConfig = {
            fxRatesSize: 50,
            chartsSize: 50,
            fxRatesView: true,
            chartsView: false,
            useTransition: true
        };
        this.graphObject = null;
        this.disableCharts = true;
        this.fileToUpload = null;
        this.uploadLoader = false;
        this.disableFileUpload = true;
        this.disableCommit = true;
        this.filterByCurrency = '';
        this.selectedDate = null;
        this.selectedYAxis = null;
        this.selectedXAxis = null;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["Ranges"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["HeightStyle"])(224);
        this.overlappingStyle = { backgroundColor: '#f9a89f' };
        this.vRanges = [
            {
                Description: 'Last 30 days',
                Days: 30
            },
            {
                Description: 'Last 2 months',
                Days: 60
            },
            {
                Description: 'Last 6 months',
                Days: 180
            },
            {
                Description: 'Last year',
                Days: 360
            },
            {
                Description: 'Custom',
                Days: 0
            }
        ];
        this.vRange = this.vRanges[0].Days;
        this.utilsConfig = {
            expandGrid: false,
            collapseGrid: false,
            refreshGrid: true,
            resetGrid: false,
            exportExcel: false
        };
        this.commitLoader = false;
    }
    FxRatesComponent.prototype.ngOnInit = function () {
        this.getData();
        this.initGrid();
    };
    FxRatesComponent.prototype.ngAfterViewInit = function () {
        this.initPageLayout();
    };
    FxRatesComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fxRatesConfigKey);
        if (config) {
            this.fxRatesConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    FxRatesComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.fxRatesConfig.fxRatesSize = event.sizes[0];
            this.fxRatesConfig.chartsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fxRatesConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fxRatesConfigKey,
            value: JSON.stringify(this.fxRatesConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].fxRatesConfigKey
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
    FxRatesComponent.prototype.getData = function () {
        var _this = this;
        this.disableCommit = true;
        this.fundTheoreticalApiService.getFxRatesData().subscribe(function (response) {
            if (response.isSuccessful) {
                var data = response.payload.sort(function (x, y) {
                    return new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
                });
                _this.gridData = data.map(function (data) { return ({
                    id: data.Id,
                    securityId: data.SecurityId,
                    businessDate: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["DateFormatter"])(data.BusinessDate),
                    event: data.Event,
                    price: data.Price,
                    currency: data.Currency,
                    modified: false
                }); });
                _this.fxRate.api.setRowData(_this.gridData);
                _this.fxRate.api.sizeColumnsToFit();
            }
        });
    };
    FxRatesComponent.prototype.initGrid = function () {
        var _this = this;
        this.fxRate = {
            columnDefs: this.getColDefs(),
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            getExternalFilterState: this.getExternalFilterState.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            pinnedBottomRowData: null,
            onRowSelected: function (params) { },
            clearExternalFilter: this.clearFilters.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            singleClickEdit: true,
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            animateRows: true,
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },
            onFirstDataRendered: function (params) { },
            onCellValueChanged: function (params) {
                _this.onCellValueChanged(params);
            },
            getRowStyle: function (params) {
                if (params.data !== undefined && params.data.modified) {
                    return _this.overlappingStyle;
                }
            },
            getRowNodeId: function (data) {
                return data.id;
            },
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true
            }
        };
        this.fxRate.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].fxRateId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].fxRate, this.fxRate);
    };
    FxRatesComponent.prototype.initCols = function () {
        var colDefs = this.getColDefs();
        this.fxRate.api.setColumnDefs(colDefs);
    };
    FxRatesComponent.prototype.doesExternalFilterPass = function (node) {
        var businessDate = new Date(node.data.businessDate);
        if ((this.filterByCurrency !== '' && this.startDate) || this.endDate) {
            return (node.data.currency.toLowerCase().includes(this.filterByCurrency.toLowerCase()) &&
                businessDate >= this.startDate.toDate() &&
                businessDate <= this.endDate.toDate());
        }
        if (this.filterByCurrency !== '') {
            return node.data.currency.toLowerCase().includes(this.filterByCurrency.toLowerCase());
        }
        if (this.startDate || this.endDate) {
            return businessDate >= this.startDate.toDate() && businessDate <= this.endDate.toDate();
        }
    };
    FxRatesComponent.prototype.isExternalFilterPresent = function () {
        if (this.startDate || this.endDate || this.filterByCurrency !== '') {
            return true;
        }
    };
    FxRatesComponent.prototype.clearFilters = function () {
        this.fxRate.api.redrawRows();
        (this.filterByCurrency = ''), (this.selected = null);
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_3__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_3__();
        this.selectedDate = null;
        this.fxRate.api.setFilterModel(null);
        this.fxRate.api.onFilterChanged();
    };
    FxRatesComponent.prototype.getExternalFilterState = function () {
        return {
            currencyFilter: this.filterByCurrency,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    FxRatesComponent.prototype.isExternalFilterPassed = function (object) {
        var currencyFilter = object.currencyFilter;
        var dateFilter = object.dateFilter;
        this.filterByCurrency = currencyFilter !== undefined ? currencyFilter : this.filterByCurrency;
        this.setDateRange(dateFilter);
        this.fxRate.api.onFilterChanged();
    };
    FxRatesComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    FxRatesComponent.prototype.onCellValueChanged = function (params) {
        if (params.colDef.field === 'price' && params.oldValue != params.newValue) {
            this.disableCommit = false;
            var row = this.fxRate.api.getRowNode(params.data.id);
            row.setDataValue('modified', true);
        }
    };
    FxRatesComponent.prototype.getColDefs = function () {
        var _this = this;
        var colDefs = [
            {
                headerName: 'Business Date',
                field: 'businessDate',
                enableRowGroup: true,
                suppressCellFlash: true
            },
            {
                headerName: 'Currency',
                field: 'currency',
                enableRowGroup: true
            },
            {
                headerName: 'Event',
                field: 'event',
                enableRowGroup: true
            },
            {
                headerName: 'Fx Rate',
                field: 'price',
                editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return params.data !== undefined
                        ? _this.dataDictionary.numberFormatter(params.node.data.price, false, '1.8-8')
                        : '';
                }
            },
            {
                headerName: 'Is Modified',
                field: 'modified',
                hide: true
            }
        ];
        return colDefs;
    };
    FxRatesComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Visualize',
                action: function () {
                    _this.visualizeData();
                }
            },
            {
                name: 'FxRate Audit Trail',
                action: function () {
                    _this.openDataGridModal(params);
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_9__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    FxRatesComponent.prototype.openDataGridModal = function (rowNode) {
        var _this = this;
        var id = rowNode.node.data.id;
        this.fundTheoreticalApiService.GetAuditTrail(id).subscribe(function (response) {
            var payload = response.payload;
            var columns = _this.getAuditColDefs();
            var modifiedCols = columns.map(function (col) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, col, { editable: false });
            });
            _this.title = 'Fx Rate';
            _this.dataGridModal.openModal(modifiedCols, payload);
        });
    };
    FxRatesComponent.prototype.getAuditColDefs = function () {
        return [
            {
                headerName: 'Business Date',
                field: 'BusinessDate',
                sortable: true
            },
            {
                headerName: 'Event',
                field: 'Event'
            },
            {
                headerName: 'LastUpdatedBy',
                field: 'LastUpdatedBy'
            },
            {
                headerName: 'LastUpdatedOn',
                field: 'LastUpdatedOn'
            },
            {
                headerName: 'Price',
                field: 'Price'
            }
        ];
    };
    FxRatesComponent.prototype.onToggleChartsView = function () {
        this.fxRatesConfig.chartsView = !this.fxRatesConfig.chartsView;
    };
    FxRatesComponent.prototype.vChange = function ($event) { };
    FxRatesComponent.prototype.visualizeData = function () {
        var _this = this;
        var data = {};
        var toDate;
        var fromDate;
        var focusedCell = this.fxRate.api.getFocusedCell();
        var selectedRow = this.fxRate.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
        var column = 'price';
        var selectedCurrency = selectedRow.currency;
        data[selectedCurrency] = [];
        if (this.vRange != 0) {
            toDate = moment__WEBPACK_IMPORTED_MODULE_3__(selectedRow.businessDate);
            fromDate = moment__WEBPACK_IMPORTED_MODULE_3__(selectedRow.businessDate).subtract(this.vRange, 'days');
        }
        this.selectedXAxis = toDate;
        this.selectedYAxis = selectedCurrency;
        this.fxRate.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.group) {
                return;
            }
            var currentDate = moment__WEBPACK_IMPORTED_MODULE_3__(rowNode.data.businessDate);
            if (_this.vRange != 0) {
                if (rowNode.data.currency === selectedCurrency
                // &&
                // currentDate.isSameOrAfter(fromDate) &&
                // currentDate.isSameOrBefore(toDate)
                ) {
                    data[selectedCurrency].push({
                        date: rowNode.data.businessDate,
                        value: rowNode.data[column]
                    });
                }
            }
            else {
                if (rowNode.data.currency === selectedCurrency) {
                    data[selectedCurrency].push({
                        date: rowNode.data.businessDate,
                        value: rowNode.data[column]
                    });
                }
            }
        });
        this.graphObject = {
            xAxisLabel: 'Date',
            yAxisLabel: 'Price',
            lineColors: ['#ff6960', '#00bd9a'],
            height: 410,
            width: '95%',
            chartTitle: selectedCurrency,
            propId: 'lineFxPrice',
            graphData: data,
            dateTimeFormat: 'YYYY-MM-DD',
            referenceDate: toDate
        };
        this.fxRatesConfig.chartsView = true;
        this.disableCharts = false;
    };
    FxRatesComponent.prototype.commitMarketPriceData = function () {
        var _this = this;
        var recordsToCommit = [];
        this.fxRate.api.forEachNode(function (node, index) {
            if (node.data.modified) {
                recordsToCommit.push({
                    Id: node.data.id,
                    Price: node.data.price
                });
            }
        });
        this.commitLoader = true;
        this.fundTheoreticalApiService.editFxRatePriceData(recordsToCommit).subscribe(function (response) {
            _this.commitLoader = false;
            _this.disableCommit = true;
            if (response.isSuccessful) {
                _this.toastrService.success('Sucessfully Commited.');
                _this.getData();
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FxRatesComponent.prototype.uploadData = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService.uploadFxData(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful) {
                _this.fileInput.nativeElement.value = '';
                _this.disableFileUpload = true;
                _this.gridData = response.payload;
                _this.fxRate.api.setRowData(_this.gridData);
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FxRatesComponent.prototype.ngModelChange = function (date) {
        this.startDate = date.startDate;
        this.endDate = date.endDate;
        this.fxRate.api.onFilterChanged();
    };
    FxRatesComponent.prototype.onSymbolKey = function (e) {
        this.filterByCurrency = e.srcElement.value;
        this.fxRate.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    FxRatesComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterByCurrency = e;
        this.fxRate.api.onFilterChanged();
    };
    FxRatesComponent.prototype.refreshGrid = function () {
        this.fxRate.api.showLoadingOverlay();
        this.getData();
    };
    FxRatesComponent.prototype.onFileInput = function (files) {
        this.disableFileUpload = false;
        this.fileToUpload = files.item(0);
    };
    FxRatesComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__["CacheService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: _services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__["FundTheoreticalApiService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], FxRatesComponent.prototype, "fileInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_6__["DataGridModalComponent"])
    ], FxRatesComponent.prototype, "dataGridModal", void 0);
    FxRatesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-fx-rates',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./fx-rates.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/fx-rates/fx-rates.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./fx-rates.component.scss */ "./src/app/main/fund-theoretical/fx-rates/fx-rates.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__["CacheService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            _services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__["FundTheoreticalApiService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__["DataDictionary"]])
    ], FxRatesComponent);
    return FxRatesComponent;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/market-prices/market-prices.component.scss":
/*!**********************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/market-prices/market-prices.component.scss ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vZnVuZC10aGVvcmV0aWNhbC9tYXJrZXQtcHJpY2VzL21hcmtldC1wcmljZXMuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/market-prices/market-prices.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/market-prices/market-prices.component.ts ***!
  \********************************************************************************/
/*! exports provided: MarketPricesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarketPricesComponent", function() { return MarketPricesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");













var MarketPricesComponent = /** @class */ (function () {
    function MarketPricesComponent(cdRef, cacheService, toastrService, fundTheoreticalApiService, securityApiService, dataDictionary) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.toastrService = toastrService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.securityApiService = securityApiService;
        this.dataDictionary = dataDictionary;
        this.isLoading = false;
        this.marketPricesConfig = {
            marketPricesSize: 50,
            chartsSize: 50,
            marketPricesView: true,
            chartsView: false,
            useTransition: true
        };
        this.selectedDate = null;
        this.fileToUpload = null;
        this.graphObject = null;
        this.disableCharts = true;
        this.sliderValue = 0;
        this.uploadLoader = false;
        this.disableFileUpload = true;
        this.disableCommit = true;
        this.filterBySymbol = '';
        this.selectedYAxis = null;
        this.selectedXAxis = null;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["Ranges"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["HeightStyle"])(224);
        this.overlappingStyle = { backgroundColor: '#f9a89f' };
        this.vRanges = [
            {
                Description: 'Last 30 days',
                Days: 30
            },
            {
                Description: 'Last 2 months',
                Days: 60
            },
            {
                Description: 'Last 6 months',
                Days: 180
            },
            {
                Description: 'Last year',
                Days: 360
            },
            {
                Description: 'Custom',
                Days: 0
            }
        ];
        this.vRange = this.vRanges[0].Days;
        this.utilsConfig = {
            expandGrid: false,
            collapseGrid: false,
            refreshGrid: true,
            resetGrid: false,
            exportExcel: false
        };
        this.commitLoader = false;
    }
    MarketPricesComponent.prototype.ngOnInit = function () {
        this.getData();
        this.initGrid();
    };
    MarketPricesComponent.prototype.ngAfterViewInit = function () {
        this.initPageLayout();
    };
    MarketPricesComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].marketPricesConfigKey);
        if (config) {
            this.marketPricesConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    MarketPricesComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.marketPricesConfig.marketPricesSize = event.sizes[0];
            this.marketPricesConfig.chartsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].marketPricesConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].marketPricesConfigKey,
            value: JSON.stringify(this.marketPricesConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["LayoutConfig"].marketPricesConfigKey
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
    MarketPricesComponent.prototype.getData = function () {
        var _this = this;
        this.disableCommit = true;
        this.fundTheoreticalApiService.getMarketPriceData().subscribe(function (response) {
            if (response.isSuccessful) {
                var data = response.payload.sort(function (x, y) {
                    return new Date(y.BusinessDate).getTime() - new Date(x.BusinessDate).getTime();
                });
                _this.gridData = data.map(function (element) { return ({
                    id: element.Id,
                    securityId: element.SecurityId,
                    businessDate: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["DateFormatter"])(element.BusinessDate),
                    symbol: element.Symbol,
                    event: element.Event,
                    price: element.Price,
                    modified: false
                }); });
                _this.marketPriceGrid.api.setRowData(_this.gridData);
                _this.marketPriceGrid.api.sizeColumnsToFit();
            }
        });
    };
    MarketPricesComponent.prototype.initGrid = function () {
        var _this = this;
        this.marketPriceGrid = {
            columnDefs: this.getColDefs(),
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            getExternalFilterState: this.getExternalFilterState.bind(this),
            pinnedBottomRowData: null,
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            onRowSelected: function (params) { },
            clearExternalFilter: this.clearFilters.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            singleClickEdit: true,
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            animateRows: true,
            onGridReady: function (params) {
                _this.marketPriceGrid.api.sizeColumnsToFit();
            },
            onFirstDataRendered: function (params) { },
            onCellValueChanged: function (params) {
                _this.onCellValueChanged(params);
            },
            getRowStyle: function (params) {
                if (params.data !== undefined && params.data.modified) {
                    return _this.overlappingStyle;
                }
            },
            getRowNodeId: function (data) {
                return data.id;
            },
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true
            }
        };
        this.marketPriceGrid.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].marketPriceId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].marketPrice, this.marketPriceGrid);
    };
    MarketPricesComponent.prototype.initCols = function () {
        var colDefs = this.getColDefs();
        this.marketPriceGrid.api.setColumnDefs(colDefs);
    };
    MarketPricesComponent.prototype.doesExternalFilterPass = function (node) {
        var businessDate = new Date(node.data.businessDate);
        if ((this.filterBySymbol !== '' && this.startDate) || this.endDate) {
            return (node.data.symbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
                businessDate >= this.startDate.toDate() &&
                businessDate <= this.endDate.toDate());
        }
        if (this.filterBySymbol !== '') {
            return node.data.symbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        if (this.startDate || this.endDate) {
            return businessDate >= this.startDate.toDate() && businessDate <= this.endDate.toDate();
        }
    };
    MarketPricesComponent.prototype.isExternalFilterPresent = function () {
        if (this.startDate || this.endDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    MarketPricesComponent.prototype.clearFilters = function () {
        this.marketPriceGrid.api.redrawRows();
        (this.filterBySymbol = ''), (this.selected = null);
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_3__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_3__();
        this.selectedDate = null;
        this.marketPriceGrid.api.setFilterModel(null);
        this.marketPriceGrid.api.onFilterChanged();
    };
    MarketPricesComponent.prototype.getExternalFilterState = function () {
        return {
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    MarketPricesComponent.prototype.isExternalFilterPassed = function (object) {
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.marketPriceGrid.api.onFilterChanged();
    };
    MarketPricesComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selectedDate =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    MarketPricesComponent.prototype.onCellValueChanged = function (params) {
        if (params.colDef.field === 'price' && params.oldValue != params.newValue) {
            this.disableCommit = false;
            var row = this.marketPriceGrid.api.getRowNode(params.data.id);
            row.setDataValue('modified', true);
        }
    };
    MarketPricesComponent.prototype.getColDefs = function () {
        var _this = this;
        var colDefs = [
            {
                headerName: 'Business Date',
                field: 'businessDate',
                enableRowGroup: true,
                suppressCellFlash: true
            },
            {
                headerName: 'Symbol',
                field: 'symbol',
                enableRowGroup: true
            },
            {
                headerName: 'Event',
                field: 'event',
                enableRowGroup: true
            },
            {
                headerName: 'Price',
                field: 'price',
                editable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return params.data !== undefined
                        ? _this.dataDictionary.numberFormatter(params.node.data.price, false, '1.8-8')
                        : '';
                }
            },
            {
                headerName: 'Is Modified',
                field: 'modified',
                hide: true
            }
        ];
        return colDefs;
    };
    MarketPricesComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Visualize',
                action: function () {
                    _this.visualizeData();
                }
            },
            {
                name: 'Audit Trail',
                action: function () {
                    _this.openDataGridModal(params);
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
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    MarketPricesComponent.prototype.openDataGridModal = function (rowNode) {
        var _this = this;
        var id = rowNode.node.data.id;
        this.fundTheoreticalApiService.getMarketPriceAudit(id).subscribe(function (response) {
            var payload = response.payload;
            var columns = _this.getAuditColDefs();
            var modifiedCols = columns.map(function (col) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, col, { editable: false });
            });
            _this.title = 'Market Price';
            _this.dataGridModal.openModal(modifiedCols, payload);
        });
    };
    MarketPricesComponent.prototype.getAuditColDefs = function () {
        return [
            {
                headerName: 'Business Date',
                field: 'BusinessDate',
                sortable: true
            },
            {
                headerName: 'Symbol',
                field: 'Symbol'
            },
            {
                headerName: 'Event',
                field: 'Event'
            },
            {
                headerName: 'LastUpdatedBy',
                field: 'LastUpdatedBy'
            },
            {
                headerName: 'LastUpdatedOn',
                field: 'LastUpdatedOn'
            },
            {
                headerName: 'Price',
                field: 'Price'
            },
            {
                headerName: 'SecurityId',
                field: 'SecurityId'
            }
        ];
    };
    MarketPricesComponent.prototype.onToggleChartsView = function () {
        this.marketPricesConfig.chartsView = !this.marketPricesConfig.chartsView;
    };
    MarketPricesComponent.prototype.vChange = function ($event) { };
    MarketPricesComponent.prototype.visualizeData = function () {
        var _this = this;
        var data = {};
        var toDate;
        var fromDate;
        var focusedCell = this.marketPriceGrid.api.getFocusedCell();
        var selectedRow = this.marketPriceGrid.api.getDisplayedRowAtIndex(focusedCell.rowIndex).data;
        var column = 'price';
        var selectedSymbol = selectedRow.symbol;
        data[selectedSymbol] = [];
        if (this.vRange != 0) {
            toDate = moment__WEBPACK_IMPORTED_MODULE_3__(selectedRow.businessDate);
            fromDate = moment__WEBPACK_IMPORTED_MODULE_3__(selectedRow.businessDate).subtract(this.vRange, 'days');
        }
        this.selectedXAxis = toDate;
        this.selectedYAxis = selectedSymbol;
        this.marketPriceGrid.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.group) {
                return;
            }
            var currentDate = moment__WEBPACK_IMPORTED_MODULE_3__(rowNode.data.businessDate);
            if (_this.vRange != 0) {
                if (rowNode.data.symbol === selectedSymbol
                // &&
                // currentDate.isSameOrAfter(fromDate) &&
                // currentDate.isSameOrBefore(toDate)
                ) {
                    data[selectedSymbol].push({
                        date: rowNode.data.businessDate,
                        value: rowNode.data[column]
                    });
                }
            }
            else {
                if (rowNode.data.symbol === selectedSymbol) {
                    data[selectedSymbol].push({
                        date: rowNode.data.businessDate,
                        value: rowNode.data[column]
                    });
                }
            }
        });
        this.graphObject = {
            xAxisLabel: 'Date',
            yAxisLabel: 'Symbol',
            lineColors: ['#ff6960', '#00bd9a'],
            height: 410,
            width: '95%',
            chartTitle: selectedSymbol,
            propId: 'lineMarketPrice',
            graphData: data,
            dateTimeFormat: 'YYYY-MM-DD',
            referenceDate: toDate
        };
        this.marketPricesConfig.chartsView = true;
        this.disableCharts = false;
    };
    MarketPricesComponent.prototype.commitMarketPriceData = function () {
        var _this = this;
        var recordsToCommit = [];
        this.marketPriceGrid.api.forEachNode(function (node, index) {
            if (node.data.modified) {
                recordsToCommit.push({
                    Id: node.data.id,
                    Price: node.data.price
                });
            }
        });
        this.commitLoader = true;
        this.fundTheoreticalApiService.editMarketPriceData(recordsToCommit).subscribe(function (response) {
            _this.commitLoader = false;
            _this.disableCommit = true;
            if (response.isSuccessful) {
                _this.toastrService.success('Sucessfully Commited.');
                _this.getData();
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    MarketPricesComponent.prototype.uploadData = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService.uploadMarketPriceData(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful) {
                _this.fileInput.nativeElement.value = '';
                _this.disableFileUpload = true;
                _this.gridData = response.payload;
                _this.marketPriceGrid.api.setRowData(_this.gridData);
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    MarketPricesComponent.prototype.ngModelChange = function (date) {
        this.startDate = date.startDate;
        this.endDate = date.endDate;
        this.marketPriceGrid.api.onFilterChanged();
    };
    MarketPricesComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.marketPriceGrid.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    MarketPricesComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.marketPriceGrid.api.onFilterChanged();
    };
    MarketPricesComponent.prototype.refreshGrid = function () {
        this.marketPriceGrid.api.showLoadingOverlay();
        this.getData();
    };
    MarketPricesComponent.prototype.onFileInput = function (files) {
        this.disableFileUpload = false;
        this.fileToUpload = files.item(0);
    };
    MarketPricesComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__["CacheService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__["FundTheoreticalApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__["SecurityApiService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_11__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], MarketPricesComponent.prototype, "fileInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_6__["CreateSecurityComponent"])
    ], MarketPricesComponent.prototype, "securityModal", void 0);
    MarketPricesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-market-prices',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./market-prices.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/market-prices/market-prices.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./market-prices.component.scss */ "./src/app/main/fund-theoretical/market-prices/market-prices.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_7__["CacheService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_8__["FundTheoreticalApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__["SecurityApiService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_11__["DataDictionary"]])
    ], MarketPricesComponent);
    return MarketPricesComponent;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.scss ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vZnVuZC10aGVvcmV0aWNhbC90YXgtcmF0ZXMvdGF4LXJhdGUtbW9kYWwvdGF4LXJhdGUtbW9kYWwuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.ts ***!
  \********************************************************************************************/
/*! exports provided: TaxRateModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxRateModalComponent", function() { return TaxRateModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");






var TaxRateModalComponent = /** @class */ (function () {
    function TaxRateModalComponent(toastrService, fundTheoreticalApiService) {
        this.toastrService = toastrService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.closeModalEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.selectedDate = null;
        this.longTermTaxRate = 0;
        this.shortTermTaxRate = 0;
        this.shortTermPeriod = 365;
        this.footerConfig = {
            showConfirmButton: true
        };
    }
    TaxRateModalComponent.prototype.ngOnInit = function () {
        this.editTaxRate = false;
    };
    TaxRateModalComponent.prototype.changeDate = function (date) {
        this.selectedDate = date;
    };
    TaxRateModalComponent.prototype.saveTaxRate = function () {
        var _this = this;
        this.footerConfig = {
            confirmButtonDisabledState: true,
            confirmButtonLoadingState: true
        };
        var taxRatePayload = {
            effectiveFrom: this.selectedDate.startDate.format('YYYY-MM-DD'),
            effectiveTo: this.selectedDate.endDate.format('YYYY-MM-DD'),
            longTermTaxRate: this.longTermTaxRate,
            shortTermTaxRate: this.shortTermTaxRate,
            ShortTermPeriod: this.shortTermPeriod
        };
        if (this.editTaxRate) {
            var id = this.taxRate.id;
            this.fundTheoreticalApiService.editTaxRate(id, taxRatePayload).subscribe(function (response) {
                if (response.isSuccessful) {
                    _this.toastrService.success('Tax Rate is edited successfully !');
                    _this.lpModal.hideModal();
                    _this.closeModalEvent.emit(true);
                    setTimeout(function () { return _this.clearForm(); }, 500);
                }
                else {
                    _this.lpModal.hideModal();
                    _this.toastrService.error('Failed to edit Tax Rate !');
                }
                _this.footerConfig = {
                    confirmButtonDisabledState: false,
                    confirmButtonLoadingState: false
                };
            }, function (error) {
                _this.footerConfig = {
                    confirmButtonDisabledState: false,
                    confirmButtonLoadingState: false
                };
                _this.lpModal.hideModal();
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
        else {
            this.fundTheoreticalApiService.createTaxRate(taxRatePayload).subscribe(function (response) {
                if (response.isSuccessful) {
                    _this.toastrService.success('Tax Rate is created successfully !');
                    _this.lpModal.hideModal();
                    _this.closeModalEvent.emit(true);
                    setTimeout(function () { return _this.clearForm(); }, 500);
                }
                else {
                    _this.toastrService.error('Failed to create Tax Rate !');
                }
                _this.footerConfig = {
                    confirmButtonDisabledState: false,
                    confirmButtonLoadingState: false
                };
            }, function (error) {
                _this.footerConfig = {
                    confirmButtonDisabledState: false,
                    confirmButtonLoadingState: false
                };
                _this.lpModal.hideModal();
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
    };
    TaxRateModalComponent.prototype.taxRateValidation = function (taxRateObject, lastTaxRateData) {
        if (lastTaxRateData === null) {
            return 1;
        }
        var effectiveFrom = moment__WEBPACK_IMPORTED_MODULE_4__(taxRateObject.effectiveFrom);
        var effectiveTo = moment__WEBPACK_IMPORTED_MODULE_4__(this.lastTaxRateData.effectiveTo);
        var dayDiff = effectiveFrom.diff(effectiveTo, 'days');
        return effectiveFrom.diff(effectiveTo, 'days');
    };
    TaxRateModalComponent.prototype.openModal = function (rowData, previoustaxRateData) {
        this.lastTaxRateData = previoustaxRateData;
        if (rowData && Object.keys(rowData).length > 1) {
            this.editTaxRate = true;
            this.footerConfig = {
                confirmButtonText: 'Edit',
                confirmButtonIcon: 'fa-edit'
            };
            this.taxRate = rowData;
            this.selectedDate = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_4__(this.taxRate.effectiveFrom),
                endDate: moment__WEBPACK_IMPORTED_MODULE_4__(this.taxRate.effectiveTo)
            };
            this.longTermTaxRate = this.taxRate.longTermTaxRate;
            this.shortTermTaxRate = this.taxRate.shortTermTaxRate;
            this.shortTermPeriod = this.taxRate.shortTermPeriod;
        }
        else {
            this.footerConfig = {
                confirmButtonText: 'Save',
                confirmButtonIcon: 'fa-save'
            };
        }
        this.lpModal.showModal();
    };
    TaxRateModalComponent.prototype.onCloseModal = function () {
        var _this = this;
        setTimeout(function () { return _this.clearForm(); }, 1000);
    };
    TaxRateModalComponent.prototype.clearForm = function () {
        this.editTaxRate = false;
        this.selectedDate = null;
        this.longTermTaxRate = 0;
        this.shortTermTaxRate = 0;
        this.shortTermPeriod = 365;
    };
    TaxRateModalComponent.ctorParameters = function () { return [
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_5__["FundTheoreticalApiService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('lpModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["ModalComponent"])
    ], TaxRateModalComponent.prototype, "lpModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], TaxRateModalComponent.prototype, "closeModalEvent", void 0);
    TaxRateModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tax-rate-modal',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./tax-rate-modal.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./tax-rate-modal.component.scss */ "./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_5__["FundTheoreticalApiService"]])
    ], TaxRateModalComponent);
    return TaxRateModalComponent;
}());



/***/ }),

/***/ "./src/app/main/fund-theoretical/tax-rates/tax-rates.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/tax-rates/tax-rates.component.scss ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".action-btn {\n  margin-left: 2.5rem;\n  padding: 2px;\n}\n\n.legend-label {\n  margin: 0.8rem 0.4rem 0 0;\n  font-size: 1rem;\n  font-weight: 600;\n  line-height: 0.5;\n}\n\n.overlap-color {\n  background-color: #f9a89f;\n}\n\n.gap-color {\n  background-color: #ffcfcf;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9mdW5kLXRoZW9yZXRpY2FsL3RheC1yYXRlcy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXGZ1bmQtdGhlb3JldGljYWxcXHRheC1yYXRlc1xcdGF4LXJhdGVzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL2Z1bmQtdGhlb3JldGljYWwvdGF4LXJhdGVzL3RheC1yYXRlcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG1CQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UseUJBQUE7QUNDRjs7QURFQTtFQUNFLHlCQUFBO0FDQ0YiLCJmaWxlIjoic3JjL2FwcC9tYWluL2Z1bmQtdGhlb3JldGljYWwvdGF4LXJhdGVzL3RheC1yYXRlcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hY3Rpb24tYnRuIHtcclxuICBtYXJnaW4tbGVmdDogMi41cmVtO1xyXG4gIHBhZGRpbmc6IDJweDtcclxufVxyXG5cclxuLmxlZ2VuZC1sYWJlbCB7XHJcbiAgbWFyZ2luOiAwLjhyZW0gMC40cmVtIDAgMDtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICBsaW5lLWhlaWdodDogMC41O1xyXG59XHJcblxyXG4ub3ZlcmxhcC1jb2xvciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5YTg5ZjtcclxufVxyXG5cclxuLmdhcC1jb2xvciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmY2ZjZjtcclxufVxyXG4iLCIuYWN0aW9uLWJ0biB7XG4gIG1hcmdpbi1sZWZ0OiAyLjVyZW07XG4gIHBhZGRpbmc6IDJweDtcbn1cblxuLmxlZ2VuZC1sYWJlbCB7XG4gIG1hcmdpbjogMC44cmVtIDAuNHJlbSAwIDA7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbGluZS1oZWlnaHQ6IDAuNTtcbn1cblxuLm92ZXJsYXAtY29sb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlhODlmO1xufVxuXG4uZ2FwLWNvbG9yIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmY2ZjZjtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/fund-theoretical/tax-rates/tax-rates.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/main/fund-theoretical/tax-rates/tax-rates.component.ts ***!
  \************************************************************************/
/*! exports provided: TaxRatesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxRatesComponent", function() { return TaxRatesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tax_rate_modal_tax_rate_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tax-rate-modal/tax-rate-modal.component */ "./src/app/main/fund-theoretical/tax-rates/tax-rate-modal/tax-rate-modal.component.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");












var TaxRatesComponent = /** @class */ (function () {
    function TaxRatesComponent(fundTheoreticalApiService, toastrService, dataDictionary) {
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.toastrService = toastrService;
        this.dataDictionary = dataDictionary;
        this.showOverlappingBtn = false;
        this.showGapBtn = false;
        this.utilsConfig = {
            expandGrid: false,
            collapseGrid: false,
            refreshGrid: true,
            resetGrid: true,
            exportExcel: false
        };
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["HeightStyle"])(224);
        this.gapStyle = { backgroundColor: '#ffcfcf' };
        this.overlappingStyle = { backgroundColor: '#f9a89f' };
        this.initGrid();
    }
    TaxRatesComponent.prototype.ngOnInit = function () { };
    TaxRatesComponent.prototype.ngAfterViewInit = function () {
        this.getTaxRates();
    };
    TaxRatesComponent.prototype.getTaxRates = function () {
        var _this = this;
        this.showGapBtn = false;
        this.showOverlappingBtn = false;
        this.fundTheoreticalApiService.getTaxRates().subscribe(function (result) {
            if (result.payload) {
                _this.taxRatesData = result.payload.map(function (item) { return ({
                    id: item.Id,
                    effectiveFrom: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["DateFormatter"])(item.EffectiveFrom),
                    effectiveTo: Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["DateFormatter"])(item.EffectiveTo),
                    longTermTaxRate: item.LongTermTaxRate,
                    shortTermTaxRate: item.ShortTermTaxRate,
                    shortTermPeriod: item.ShortTermPeriod,
                    createdBy: item.CreatedBy,
                    lastUpdatedBy: item.LastUpdatedBy,
                    createdDate: item.CreatedDate,
                    lastUpdatedDate: item.LastUpdatedDate,
                    isOverLapped: item.IsOverLapped,
                    isGapPresent: item.IsGapPresent
                }); });
            }
            _this.taxRatesData.find(function (taxRate) {
                if (taxRate.isOverLapped) {
                    _this.showOverlappingBtn = true;
                    return true;
                }
            });
            _this.taxRatesData.find(function (taxRate) {
                if (taxRate.isGapPresent) {
                    _this.showGapBtn = true;
                    return true;
                }
            });
            _this.taxRatesGrid.api.setRowData(_this.taxRatesData);
        });
        this.setColDefs();
    };
    TaxRatesComponent.prototype.initGrid = function () {
        var _this = this;
        this.taxRatesGrid = {
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_3__["GridLayoutMenuComponent"] },
            getExternalFilterState: function () {
                return {};
            },
            pinnedBottomRowData: null,
            onRowSelected: function (params) { },
            clearExternalFilter: function () { },
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            singleClickEdit: true,
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },
            onFirstDataRendered: function (params) {
                params.api.sizeColumnsToFit();
            },
            getRowStyle: function (params) {
                if (params.data.isOverLapped) {
                    return _this.overlappingStyle;
                }
                if (params.data.isGapPresent) {
                    return _this.gapStyle;
                }
            }
        };
        this.taxRatesGrid.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_5__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__["GridId"].taxRatesId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__["GridName"].taxRates, this.taxRatesGrid);
    };
    TaxRatesComponent.prototype.setColDefs = function () {
        var _this = this;
        var colDefs = [
            {
                headerName: 'Id',
                field: 'id',
                hide: true
            },
            {
                headerName: 'Effective From',
                field: 'effectiveFrom',
                sortable: true,
                filter: true
            },
            {
                headerName: 'Effective To',
                field: 'effectiveTo',
                sortable: true,
                filter: true
            },
            {
                headerName: 'Long Term Tax Rate %',
                field: 'longTermTaxRate',
                sortable: true,
                filter: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.longTermTaxRate, true);
                }
            },
            {
                headerName: 'Short Term Tax Rate %',
                field: 'shortTermTaxRate',
                sortable: true,
                type: 'numericColumn',
                valueFormatter: function (params) {
                    return _this.dataDictionary.numberFormatter(params.node.data.shortTermTaxRate, true);
                }
            },
            {
                headerName: 'Short Term Period',
                field: 'shortTermPeriod',
                sortable: true,
                type: 'numericColumn'
            },
            {
                headerName: 'Actions',
                cellRendererFramework: src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_8__["TemplateRendererComponent"],
                cellRendererParams: {
                    ngTemplate: this.actionButtons
                },
                minWidth: 200
            },
            {
                headerName: 'Created By',
                field: 'createdBy',
                hide: true
            },
            {
                headerName: 'Last Updated By ',
                field: 'lastUpdatedBy ',
                hide: true
            },
            {
                headerName: 'Created Date',
                field: 'createdDate',
                hide: true
            },
            {
                headerName: 'Is Over Lapped',
                field: 'isOverLapped',
                hide: true
            },
            {
                headerName: 'Is Gap Present',
                field: 'isGapPresent',
                hide: true
            }
        ];
        this.taxRatesGrid.api.setColumnDefs(colDefs);
    };
    TaxRatesComponent.prototype.getContextMenuItems = function (params) {
        var addDefaultItems = [];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_6__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    TaxRatesComponent.prototype.refreshGrid = function () {
        this.taxRatesGrid.api.showLoadingOverlay();
        this.getTaxRates();
    };
    TaxRatesComponent.prototype.openTaxRateModal = function () {
        var lastTaxRateData;
        if (this.taxRatesData.length !== 0) {
            lastTaxRateData = this.taxRatesData[this.taxRatesData.length - 1];
        }
        else {
            lastTaxRateData = null;
        }
        this.taxRateModal.openModal(null, lastTaxRateData);
    };
    TaxRatesComponent.prototype.closeTaxRateModal = function () {
        this.getTaxRates();
    };
    TaxRatesComponent.prototype.editTaxRate = function (row) {
        var lastIndex = this.taxRatesData.findIndex(function (taxRate) { return taxRate.id === row.id; });
        var lastTaxRateData = this.taxRatesData[lastIndex];
        this.taxRateModal.openModal(row, lastTaxRateData);
    };
    TaxRatesComponent.prototype.openConfirmationModal = function (row) {
        this.taxRateRow = row;
        this.confirmationModal.showModal();
    };
    TaxRatesComponent.prototype.deleteTaxRate = function () {
        var _this = this;
        this.fundTheoreticalApiService.deleteTaxRate(this.taxRateRow.id).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Tax Rate deleted successfully!');
                _this.getTaxRates();
            }
            else {
                _this.toastrService.error('TaxRate deletion failed!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    TaxRatesComponent.ctorParameters = function () { return [
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_11__["FundTheoreticalApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_9__["ToastrService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('taxRateModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _tax_rate_modal_tax_rate_modal_component__WEBPACK_IMPORTED_MODULE_2__["TaxRateModalComponent"])
    ], TaxRatesComponent.prototype, "taxRateModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], TaxRatesComponent.prototype, "actionButtons", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_7__["ConfirmationModalComponent"])
    ], TaxRatesComponent.prototype, "confirmationModal", void 0);
    TaxRatesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tax-rates',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./tax-rates.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/fund-theoretical/tax-rates/tax-rates.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./tax-rates.component.scss */ "./src/app/main/fund-theoretical/tax-rates/tax-rates.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_11__["FundTheoreticalApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_9__["ToastrService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_10__["DataDictionary"]])
    ], TaxRatesComponent);
    return TaxRatesComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-fund-theoretical-fund-theoretical-module.js.map