(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-journals-ledgers-journals-ledger-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.html":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.html ***!
  \*********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Modal Div Starts -->\r\n<div bsModal #modal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal\" aria-hidden=\"true\"\r\n  [config]=\"{backdrop: 'static'}\">\r\n\r\n  <!-- Modal Dialog Div Starts -->\r\n  <div class=\"modal-dialog modal-dialog-centered modal-lg\" id=\"modal-lg\">\r\n\r\n    <!-- Modal Content Div Starts -->\r\n    <div class=\"modal-content\">\r\n\r\n      <!-- Form Div Starts -->\r\n      <form #journalForm=\"ngForm\" (ngSubmit)=\"saveJournal()\">\r\n\r\n        <!-- Modal Header Starts-->\r\n        <div class=\"modal-header color-primary\">\r\n          <h3 *ngIf=\"!editJournal\"> Create Journal </h3>\r\n          <h3 *ngIf=\"editJournal\"> Edit Journal </h3>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" (click)=\"closeModal()\">&times;</button>\r\n        </div>\r\n        <!-- Modal Header Ends-->\r\n\r\n        <!-- Loading Spinner -->\r\n        <div *ngIf=\"isLoading\" class=\"d-flex justify-content-center align-items-center height-50vh\">\r\n          <lp-loading></lp-loading>\r\n        </div>\r\n        <!-- Loading Spinner Ends -->\r\n\r\n        <!-- Modal Body Starts-->\r\n        <div [hidden]=\"isLoading\" class=\"modal-body\">\r\n\r\n          <!-- No Result Alert -->\r\n          <alert *ngIf=\"noResult\" type=\"danger\" [dismissible]=\"true\">\r\n            <strong>Warning!</strong> Please, only select values from the dropdown!\r\n          </alert>\r\n          <!-- No Result Alert Ends -->\r\n\r\n          <!-- Fund Div Starts -->\r\n          <div class=\"form-group\">\r\n            <div class=\"row\">\r\n              <!-- Fund Label -->\r\n              <div class=\"col-sm-3\">\r\n                <label> Fund </label>\r\n              </div>\r\n              <!-- Fund Drop Down -->\r\n              <div class=\"col-sm-9\">\r\n                <select class=\"form-control custom-select\" name=\"fund\" ngModel required>\r\n                  <option selected disabled value=\"\">Select fund type</option>\r\n                  <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.FundCode\">\r\n                    {{ fund.FundCode }}\r\n                  </option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Fund Div Ends -->\r\n\r\n          <!-- To Account Section -->\r\n          <div class=\"form-group\">\r\n\r\n            <hr>\r\n            <!-- To Account Label -->\r\n            <div class=\"row\">\r\n              <div class=\"col-9\">\r\n                <h6>To Account</h6>\r\n              </div>\r\n              <div class=\"col-3\">\r\n                <select class=\"form-control custom-select\" name=\"toAccountEntryType\" (change)=onToEntrySelect($event)\r\n                  ngModel required>\r\n                  <option selected disabled value=\"\">Entry type</option>\r\n                  <option *ngFor=\"let entryType of entryTypes\" [value]=\"entryType.value\">\r\n                    {{ entryType.name }}\r\n                  </option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n            <!-- To Account Label Ends -->\r\n\r\n            <!-- Account Category / Type Row -->\r\n            <div class=\"row mt-2\">\r\n\r\n              <!-- Account Category TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select account category\" autocomplete=\"off\"\r\n                  typeaheadWaitMs=\"500\" [isAnimated]=\"true\" [typeaheadScrollable]=\"true\"\r\n                  [typeaheadIsFirstItemActive]=\"true\" [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\"\r\n                  [typeahead]=\"toAccountCategories\" typeaheadOptionField=\"name\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\"\r\n                  (typeaheadOnSelect)=\"onToAccountCategorySelected($event)\"\r\n                  (ngModelChange)=\"onToAccountCategoryChange($event)\" ngModel name=\"toAccountCategory\" required />\r\n              </div>\r\n              <!-- Account Category TypeAhead Ends -->\r\n\r\n              <!-- Account Type TypeAhead -->\r\n              <div [ngClass]=\"{'col-sm-6': !isFetchingToAccountTypes, 'col-sm-5': isFetchingToAccountTypes}\">\r\n                <input [disabled]=\"isFetchingToAccountTypes\" class=\"form-control\" placeholder=\"Select account type\"\r\n                  autocomplete=\"off\" typeaheadWaitMs=\"500\" [isAnimated]=\"true\" [typeaheadScrollable]=\"true\"\r\n                  [typeaheadIsFirstItemActive]=\"true\" [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\"\r\n                  [typeahead]=\"toAccountTypes\" typeaheadOptionField=\"name\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\"\r\n                  (typeaheadOnSelect)=\"onToAccountTypeSelected($event)\" ngModel name=\"toAccountType\" required />\r\n              </div>\r\n              <!-- Account Type TypeAhead Ends -->\r\n\r\n              <!-- Loader -->\r\n              <div *ngIf=\"isFetchingToAccountTypes\" class=\"col-sm-1 loader-wrapper\">\r\n                <lp-loading [loadingText]=\"false\"></lp-loading>\r\n              </div>\r\n              <!-- Loader Ends -->\r\n\r\n            </div>\r\n            <!-- Account Category / Type Row Ends -->\r\n\r\n            <!-- Symbol / Currency Row -->\r\n            <div class=\"row mt-2\">\r\n\r\n              <!-- Symbol TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select a symbol\" autocomplete=\"off\" typeaheadWaitMs=\"500\"\r\n                  [isAnimated]=\"true\" [typeaheadScrollable]=\"true\" [typeaheadIsFirstItemActive]=\"true\"\r\n                  [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\" [typeahead]=\"symbols\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\" ngModel name=\"toAccountSymbol\" required />\r\n              </div>\r\n              <!-- Symbol TypeAhead Ends -->\r\n\r\n              <!-- Currency TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select a currency\" autocomplete=\"off\" typeaheadWaitMs=\"500\"\r\n                  [isAnimated]=\"true\" [typeaheadScrollable]=\"true\" [typeaheadIsFirstItemActive]=\"true\"\r\n                  [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\" [typeahead]=\"currencies\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\" ngModel name=\"toAccountCurrency\" required />\r\n              </div>\r\n              <!-- Currency TypeAhead Ends -->\r\n\r\n            </div>\r\n            <!-- Account Category / Type Row Ends -->\r\n\r\n          </div>\r\n          <!-- To Account Section Ends -->\r\n\r\n          <!-- Account From Section -->\r\n          <div [hidden]=\"editJournal && selectedJournal && !selectedJournal.AccountFrom\" class=\"form-group\">\r\n\r\n            <hr>\r\n            <!-- From Account Label -->\r\n            <div class=\"row\">\r\n              <div class=\"col-9\">\r\n                <h6>From Account</h6>\r\n              </div>\r\n              <div class=\"col-3\">\r\n                <select disabled class=\"form-control custom-select\" name=\"fromAccountEntryType\" ngModel>\r\n                  <option selected disabled value=\"\">Entry type</option>\r\n                  <option *ngFor=\"let entryType of entryTypes\" [value]=\"entryType.value\">\r\n                    {{ entryType.name }}\r\n                  </option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n            <!-- Account From Label Ends -->\r\n\r\n            <!-- Account Category / Type Row -->\r\n            <div class=\"row mt-2\">\r\n\r\n              <!-- Account Category TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select account category\" autocomplete=\"off\"\r\n                  typeaheadWaitMs=\"500\" [isAnimated]=\"true\" [typeaheadScrollable]=\"true\"\r\n                  [typeaheadIsFirstItemActive]=\"true\" [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\"\r\n                  [typeahead]=\"fromAccountCategories\" typeaheadOptionField=\"name\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\"\r\n                  (typeaheadOnSelect)=\"onFromAccountCategorySelected($event)\" #fromAccountCategoryTypeahead=\"ngModel\"\r\n                  (ngModelChange)=\"onFromAccountCategoryChange($event)\" ngModel name=\"fromAccountCategory\"\r\n                  [required]=\"fromAccountTypeTypeahead.value !== '' || fromAccountSymbolTypeahead.value !== '' || fromAccountCurrencyTypeahead.value !== ''\" />\r\n              </div>\r\n              <!-- Account Category TypeAhead Ends -->\r\n\r\n              <!-- Account Type TypeAhead -->\r\n              <div [ngClass]=\"{'col-sm-6': !isFetchingFromAccountTypes, 'col-sm-5': isFetchingFromAccountTypes}\">\r\n                <input [disabled]=\"isFetchingFromAccountTypes\" class=\"form-control\" placeholder=\"Select account type\"\r\n                  autocomplete=\"off\" typeaheadWaitMs=\"500\" [isAnimated]=\"true\" [typeaheadScrollable]=\"true\"\r\n                  [typeaheadIsFirstItemActive]=\"true\" [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\"\r\n                  [typeahead]=\"fromAccountTypes\" typeaheadOptionField=\"name\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\"\r\n                  (typeaheadOnSelect)=\"onFromAccountTypeSelected($event)\" #fromAccountTypeTypeahead=\"ngModel\" ngModel\r\n                  name=\"fromAccountType\"\r\n                  [required]=\"fromAccountCategoryTypeahead.value !== '' || fromAccountSymbolTypeahead.value !== '' || fromAccountCurrencyTypeahead.value !== ''\" />\r\n              </div>\r\n              <!-- Account Type TypeAhead Ends -->\r\n\r\n              <!-- Loader -->\r\n              <div *ngIf=\"isFetchingFromAccountTypes\" class=\"col-sm-1 loader-wrapper\">\r\n                <lp-loading [loadingText]=\"false\"></lp-loading>\r\n              </div>\r\n              <!-- Loader Ends -->\r\n\r\n            </div>\r\n            <!-- Account Category / Type Row Ends -->\r\n\r\n            <!-- Symbol / Currency Row -->\r\n            <div class=\"row mt-2\">\r\n\r\n              <!-- Symbol TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select a symbol\" autocomplete=\"off\" typeaheadWaitMs=\"500\"\r\n                  [isAnimated]=\"true\" [typeaheadScrollable]=\"true\" [typeaheadIsFirstItemActive]=\"true\"\r\n                  [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\" [typeahead]=\"symbols\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\" #fromAccountSymbolTypeahead=\"ngModel\" ngModel\r\n                  name=\"fromAccountSymbol\"\r\n                  [required]=\"fromAccountCategoryTypeahead.value !== '' || fromAccountTypeTypeahead.value !== '' || fromAccountCurrencyTypeahead.value !== ''\" />\r\n              </div>\r\n              <!-- Symbol TypeAhead Ends -->\r\n\r\n              <!-- Currency TypeAhead -->\r\n              <div class=\"col-sm-6\">\r\n                <input class=\"form-control\" placeholder=\"Select a currency\" autocomplete=\"off\" typeaheadWaitMs=\"500\"\r\n                  [isAnimated]=\"true\" [typeaheadScrollable]=\"true\" [typeaheadIsFirstItemActive]=\"true\"\r\n                  [typeaheadMinLength]=\"0\" [typeaheadOptionsInScrollableView]=\"15\" [typeahead]=\"currencies\"\r\n                  (typeaheadNoResults)=\"typeaheadNoResults($event)\" #fromAccountCurrencyTypeahead=\"ngModel\" ngModel\r\n                  name=\"fromAccountCurrency\"\r\n                  [required]=\"fromAccountCategoryTypeahead.value !== '' || fromAccountTypeTypeahead.value !== '' || fromAccountSymbolTypeahead.value !== ''\" />\r\n              </div>\r\n              <!-- Currency TypeAhead Ends -->\r\n\r\n            </div>\r\n            <!-- Account Category / Type Row Ends -->\r\n\r\n          </div>\r\n          <!-- Account From Section Ends -->\r\n\r\n          <!-- As Of Date Div Starts -->\r\n          <div class=\"form-group\">\r\n            <!-- As Of Date Label -->\r\n            <div class=\"row\">\r\n              <div class=\"col-sm-3\">\r\n                <label> As Of </label>\r\n              </div>\r\n              <!-- As Of DatePicker -->\r\n              <div class=\"col-sm-9\">\r\n                <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\"\r\n                  placeholder=\"Choose a date\" name=\"selectedAsOfDate\" [(ngModel)]=\"selectedAsOfDate\" required\r\n                  [singleDatePicker]=\"true\" [maxDate]=\"maxDate\" [autoApply]=\"true\"\r\n                  (ngModelChange)=\"onDatesChanged($event)\" />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- As Of Date Div Ends -->\r\n\r\n          <!-- Value Div Starts-->\r\n          <div class=\"form-group\">\r\n            <div class=\"row\">\r\n              <!-- Value Label -->\r\n              <div class=\"col-sm-3\">\r\n                <label> Value </label>\r\n              </div>\r\n              <!-- Value Input -->\r\n              <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"number\" step=\".05\" name=\"value\" ngModel required>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Value Div Ends-->\r\n\r\n          <!-- Comments Div Starts -->\r\n          <div class=\"form-group\">\r\n            <!-- Comments Label -->\r\n            <div class=\"row\">\r\n              <div class=\"col-sm-3\">\r\n                <label> Comments </label>\r\n              </div>\r\n              <!-- Comments Input -->\r\n              <div class=\"col-sm-9\">\r\n                <textarea class=\"form-control\" rows=\"2\" name=\"comments\" ngModel required></textarea>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Comments Div Ends -->\r\n\r\n        </div>\r\n        <!-- Modal Body Ends-->\r\n\r\n        <!-- Modal Footer Starts -->\r\n        <div class=\"modal-footer\">\r\n\r\n          <button *ngIf=\"editJournal\" type=\"button\" class=\"btn btn-danger mr-auto\" [disabled]=\"isDeleting\"\r\n            (click)=\"deleteJournal()\"><i class=\"fa fa-trash\"></i> Delete\r\n            <span *ngIf=\"isDeleting\" class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\r\n          </button>\r\n\r\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"closeModal()\">\r\n            <i class=\"fa fa-times\" aria-hidden=\"true\"></i> Cancel\r\n          </button>\r\n\r\n          <button type=\"submit\" class=\"btn btn-pa\" [ngClass]=\"{'cursor-not-allowed': !journalForm.valid}\"\r\n            [disabled]=\"!journalForm.valid || !isAsOfDateValid || isSaving\">\r\n            <i class=\"fa\" [ngClass]=\" {'fa-edit':editJournal, 'fa-save':!editJournal}\"></i>\r\n            {{editJournal ? \"Update\" : \"Save\"}}\r\n            <span *ngIf=\"isSaving\" class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\r\n          </button>\r\n\r\n        </div>\r\n        <!-- Modal Footer Ends -->\r\n\r\n      </form>\r\n      <!-- Form Div Ends -->\r\n\r\n    </div>\r\n    <!-- Modal Content Div Ends -->\r\n\r\n  </div>\r\n  <!-- Modal Dialog Div Ends -->\r\n\r\n</div>\r\n<!-- Modal Div Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-layout.component.html":
/*!************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-layout.component.html ***!
  \************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div Starts -->\r\n<div *ngIf=\"hideGrid\" [ngStyle]=\"containerDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Container Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Tabs Container -->\r\n    <tabset class=\"tab-color\">\r\n\r\n        <!-- Server Side Journal Tab Starts -->\r\n        <tab heading=\"Journals\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-journals-server-side *ngIf=\"isServerSideJournalActive\"></app-journals-server-side>\r\n            </div>\r\n        </tab>\r\n        <!-- Server Side Journal Tab Ends -->\r\n\r\n        <!-- Nav Tab Starts -->\r\n        <tab heading=\"NAV\" (selectTab)=\"activateTab('Nav')\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-journals-server-side *ngIf=\"isNavActive\" defaultView='Nav'></app-journals-server-side>\r\n            </div>\r\n        </tab>\r\n        <!-- Nav Tab Ends -->\r\n\r\n        <!-- Balance Sheet Tab Starts -->\r\n        <tab heading=\"Balance Sheet\" (selectTab)=\"activateTab('BalanceSheet')\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-journals-server-side *ngIf=\"isBalanceSheetActive\" defaultView='Balance Sheet'>\r\n                </app-journals-server-side>\r\n            </div>\r\n        </tab>\r\n        <!-- Balance Sheet Tab Ends -->\r\n\r\n        <!-- Income Statement Tab Starts -->\r\n        <tab heading=\"Income Statement\" (selectTab)=\"activateTab('IncomeStatement')\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-journals-server-side *ngIf=\"isIncomeStatementActive\" defaultView='Income Statement'>\r\n                </app-journals-server-side>\r\n            </div>\r\n        </tab>\r\n        <!-- Income Statement Tab Ends -->\r\n\r\n        <!-- Trial Balance Tab Starts -->\r\n        <tab heading=\"Trial Balance\" (selectTab)=\"activateTab('TrialBalance')\">\r\n            <div [ngStyle]=\"style\">\r\n                <app-journals-server-side *ngIf=\"isTrialBalanceActive\" defaultView='Trial Balance'>\r\n                </app-journals-server-side>\r\n            </div>\r\n        </tab>\r\n        <!-- Trial Balance Tab Ends -->\r\n\r\n        <!-- Client Side Journal Tab Starts -->\r\n        <!-- <tab heading=\"Client Side Journals\" (selectTab)=\"activateTab('ClientSideJournal')\">\r\n            <app-journals-ledgers *ngIf=\"isClientJournalActive\"></app-journals-ledgers>\r\n        </tab> -->\r\n        <!-- Client Side Journal Tab Ends -->\r\n\r\n    </tabset>\r\n    <!-- Tabs Container Ends -->\r\n\r\n</div>\r\n<!-- Container Div Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.html":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.html ***!
  \**************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div Starts -->\r\n<div *ngIf=\"hideGrid\" [ngStyle]=\"containerDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n        <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n    <!-- Filters Row -->\r\n    <div class=\"row\">\r\n\r\n        <!-- Funds Dropdown Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"ngModelChangeFund($event)\">\r\n                <option selected>All Funds</option>\r\n                <option *ngFor=\"let f of funds\" [ngValue]=\"f.FundCode\">\r\n                    {{ f.FundCode }}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- Funds Dropdown Div Ends -->\r\n\r\n        <!-- Symbol Filter -->\r\n        <div class=\"col-auto\">\r\n            <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\"\r\n                [(ngModel)]=\"filterBySymbol\" (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\"\r\n                class=\"form-control\" />\r\n        </div>\r\n        <!-- Symbol Filter Ends -->\r\n\r\n        <!-- Zero Balance Filter -->\r\n        <div class=\"col-auto mt-6\">\r\n            <label><input type=\"checkbox\" id=\"zeroBalanceCheckBox\" [(ngModel)]=\"filterByZeroBalance\"\r\n                    (ngModelChange)=\"ngModelChangeZeroBalance($event)\">\r\n                Exclude zero balance</label>\r\n        </div>\r\n        <!-- Zero Balance Filter Ends -->\r\n\r\n        <!-- Date Range Label Div Starts -->\r\n        <div class=\"font-weight-bold mt-6\">\r\n            <label class=\"text-right\"> {{ DateRangeLabel }} </label>\r\n        </div>\r\n        <!-- Date Range Label Div Ends -->\r\n\r\n        <!-- Date Picker Div Starts -->\r\n        <div class=\"col-auto\">\r\n            <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n                [(ngModel)]=\"selected\" name=\"selectedDaterange\" [ranges]=\"ranges\" [showClearButton]=\"true\"\r\n                [alwaysShowCalendars]=\"true\" (ngModelChange)=\"ngModelChange($event)\"\r\n                [keepCalendarOpeningWithRange]=\"true\" />\r\n        </div>\r\n        <!-- Date Picker Div Ends -->\r\n\r\n        <!-- Clear Button  Div Starts -->\r\n        <div class=\"mr-auto\">\r\n            <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n                <i class=\"fa fa-remove\"></i>\r\n            </button>\r\n        </div>\r\n        <!-- Clear Button  Div Ends -->\r\n\r\n        <!-- Buttons Div Starts -->\r\n        <div class=\"ml-auto mr-3\">\r\n\r\n            <!-- Loading Spinner -->\r\n            <div *ngIf=\"isDataStreaming\" class=\"d-flex\">\r\n                <div class=\"pt-1 pr-2 font-weight-500\">Streaming Data</div>\r\n                <div class=\"spinner-border text-info\" role=\"status\">\r\n                    <span class=\"sr-only\">Loading...</span>\r\n                </div>\r\n            </div>\r\n            <!-- Loading Spinner Ends -->\r\n\r\n            <ng-container *ngIf=\"!isDataStreaming\">\r\n\r\n                <!-- Grid Util Actions -->\r\n                <app-grid-utils class=\"mr-4\" [utilsConfig]=\"utilsConfig\" [gridOptions]=\"gridOptions\"\r\n                    (refresh)=\"refreshGrid()\" [excelParams]=\"excelParams\">\r\n                </app-grid-utils>\r\n                <!-- Grid Util Actions Ends -->\r\n\r\n                <!-- Create Journal Button -->\r\n                <div class=\"d-inline-block mr-4 add-journal-btn\">\r\n                    <button class=\"btn btn-pa\" type=\"button\" (click)=\"openJournalModal()\" tooltip=\"Create Journal\"\r\n                        placement=\"top\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                    </button>\r\n                </div>\r\n                <!-- Create Journal Button Ends -->\r\n\r\n            </ng-container>\r\n\r\n        </div>\r\n        <!-- Buttons Div Ends -->\r\n\r\n    </div>\r\n    <!-- Filters Row Ends -->\r\n\r\n    <div class=\"clearfix\"></div>\r\n\r\n    <!-- Journals Div Starts -->\r\n    <div #divToMeasureJournal>\r\n        <div [ngStyle]=\"styleForHeight\">\r\n            <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n            </ag-grid-angular>\r\n        </div>\r\n    </div>\r\n    <!-- Journals Div Endss -->\r\n\r\n</div>\r\n<!-- Main Div Ends -->\r\n\r\n<app-journal-modal *ngIf=\"isJournalModalActive\" #journalModal (modalClose)=\"closeJournalModal()\">\r\n</app-journal-modal>\r\n\r\n<app-data-modal #dataModal [title]=\"'Order Detail'\" (closed)=\"closeDataModal()\">\r\n</app-data-modal>\r\n\r\n<app-report-modal #reportModal [title]=\"'Report'\" [tableHeader]=\"tableHeader\">\r\n</app-report-modal>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/shared/Component/report-modal/report-modal.component.html":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/shared/Component/report-modal/report-modal.component.html ***!
  \*************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!------ Modal Div Starts------>\r\n<div class=\"modal fade\" bsModal #modal=\"bs-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal\" aria-hidden=\"true\"\r\n  [config]=\"{backdrop: modal-backdrop}\">\r\n  <!------ Modal Dialog Div Starts------>\r\n  <div class=\"modal-dialog mw-100 w-75 modal-dialog-centered\" id=\"modal-lg\">\r\n    <!------ Modal Content Div Starts------>\r\n    <div class=\"modal-content\">\r\n      <!-- Modal Header Starts-->\r\n      <div class=\"modal-header color-primary\">\r\n        <h3>{{ title }}</h3>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" (click)=\"closeModal()\">&times;</button>\r\n      </div>\r\n      <div class=\"report-container\">\r\n        <app-report-grid [trialBalanceReport]=\"trialBalanceReport\" [trialBalanceReportStats]=\"trialBalanceReportStats\"\r\n          [tableHeader]=\"tableHeader\" [hideGrid]=\"hideGrid\">\r\n        </app-report-grid>\r\n      </div>\r\n    </div>\r\n  </div>");

/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.scss":
/*!*******************************************************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.scss ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".modal {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n\n.modal-backdrop {\n  position: relative;\n}\n\n.close {\n  font-size: 1.5em;\n  color: #ffff;\n  display: none;\n}\n\n.modal-body {\n  overflow-y: auto;\n  max-height: 60vh;\n}\n\n::ng-deep .loader-wrapper .spinner-grow {\n  width: 2rem !important;\n  height: 2rem !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9qb3VybmFscy1sZWRnZXJzL2pvdXJuYWxzLWNsaWVudC1zaWRlL2pvdXJuYWwtbW9kYWwvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXHVpL3NyY1xcYXBwXFxtYWluXFxqb3VybmFscy1sZWRnZXJzXFxqb3VybmFscy1jbGllbnQtc2lkZVxcam91cm5hbC1tb2RhbFxcam91cm5hbC1tb2RhbC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9qb3VybmFscy1sZWRnZXJzL2pvdXJuYWxzLWNsaWVudC1zaWRlL2pvdXJuYWwtbW9kYWwvam91cm5hbC1tb2RhbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG9DQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7RUFDQSxnQkFBQTtBQ0NGOztBREVBO0VBQ0Usc0JBQUE7RUFDQSx1QkFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9qb3VybmFscy1sZWRnZXJzL2pvdXJuYWxzLWNsaWVudC1zaWRlL2pvdXJuYWwtbW9kYWwvam91cm5hbC1tb2RhbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tb2RhbCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xyXG59XHJcblxyXG4ubW9kYWwtYmFja2Ryb3Age1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuLmNsb3NlIHtcclxuICBmb250LXNpemU6IDEuNWVtO1xyXG4gIGNvbG9yOiAjZmZmZjtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubW9kYWwtYm9keSB7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBtYXgtaGVpZ2h0OiA2MHZoO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xyXG4gIHdpZHRoOiAycmVtICFpbXBvcnRhbnQ7XHJcbiAgaGVpZ2h0OiAycmVtICFpbXBvcnRhbnQ7XHJcbn1cclxuIiwiLm1vZGFsIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xufVxuXG4ubW9kYWwtYmFja2Ryb3Age1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5jbG9zZSB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIGNvbG9yOiAjZmZmZjtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLm1vZGFsLWJvZHkge1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBtYXgtaGVpZ2h0OiA2MHZoO1xufVxuXG46Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xuICB3aWR0aDogMnJlbSAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDJyZW0gIWltcG9ydGFudDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: JournalModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalModalComponent", function() { return JournalModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/journal-api.service */ "./src/services/journal-api.service.ts");
/* harmony import */ var src_services_account_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/account-api.service */ "./src/services/account-api.service.ts");
/* harmony import */ var src_services_setting_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/setting-api.service */ "./src/services/setting-api.service.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");

/* Core/Libraries */







/* Services/Components */





var JournalModalComponent = /** @class */ (function () {
    function JournalModalComponent(financePocServiceProxy, accountApiService, journalApiService, settingApiService, cacheService, toastrService) {
        this.financePocServiceProxy = financePocServiceProxy;
        this.accountApiService = accountApiService;
        this.journalApiService = journalApiService;
        this.settingApiService = settingApiService;
        this.cacheService = cacheService;
        this.toastrService = toastrService;
        this.modalClose = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.entryTypes = [
            { name: 'Debit', value: 'debit' },
            { name: 'Credit', value: 'credit' }
        ];
        this.toAccountCategories = [];
        this.toAccountTypes = [];
        this.fromAccountCategories = [];
        this.fromAccountTypes = [];
        this.symbols = [];
        this.currencies = [];
        this.selectedRow = {
            balance: 0
        };
        this.isAsOfDateValid = false;
        this.noResult = false;
        this.contraEntryMode = false;
        this.isLoading = false;
        this.isFetchingToAccountTypes = false;
        this.isFetchingFromAccountTypes = false;
        this.isSaving = false;
        this.isDeleting = false;
    }
    JournalModalComponent.prototype.ngOnInit = function () {
        this.initJournalData();
        this.editJournal = false;
        this.maxDate = moment__WEBPACK_IMPORTED_MODULE_7__();
    };
    JournalModalComponent.prototype.initJournalData = function () {
        var _this = this;
        this.isLoading = true;
        this.requestJournalData().subscribe(function (_a) {
            var fundsResponse = _a[0], accountCategoriesResponse = _a[1], symbolsResponse = _a[2], currenciesResponse = _a[3], accountsResponse = _a[4];
            _this.getFunds(fundsResponse);
            _this.getAccountCategories(accountCategoriesResponse);
            _this.getSymbols(symbolsResponse);
            _this.getCurrencies(currenciesResponse);
            _this.getAccounts(accountsResponse);
            _this.isLoading = false;
        }, function (error) {
            _this.isLoading = false;
        });
    };
    JournalModalComponent.prototype.requestJournalData = function () {
        var fundsResponse = this.financePocServiceProxy.getFunds();
        var accountCategoriesResponse = this.accountApiService.accountCategories().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) {
            response.payload = response.payload.map(function (element) { return ({
                id: element.Id,
                name: element.Name
            }); });
            return response;
        }));
        var symbolsResponse = this.financePocServiceProxy.getSymbol();
        var currenciesResponse = this.settingApiService.getReportingCurrencies();
        var accountsResponse = this.cacheService.getDummyAccount();
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])([
            fundsResponse,
            accountCategoriesResponse,
            symbolsResponse,
            currenciesResponse,
            accountsResponse
        ]);
    };
    JournalModalComponent.prototype.getFunds = function (response) {
        if (response.payload) {
            this.funds = response.payload;
        }
        else {
            this.toastrService.error('Failed to fetch funds!');
        }
    };
    JournalModalComponent.prototype.getAccountCategories = function (response) {
        if (response.isSuccessful) {
            this.toAccountCategories = response.payload.filter(function (element) { return element.id !== 0; });
            this.fromAccountCategories = response.payload.filter(function (element) { return element.id !== 0; });
        }
        else {
            this.toastrService.error('Failed to fetch account categories!');
        }
    };
    JournalModalComponent.prototype.getAccountTypes = function (accountCategoryId) {
        return this.accountApiService.accountTypes(accountCategoryId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) {
            response.payload = response.payload.map(function (element) { return ({
                id: element.Id,
                name: element.Name
            }); });
            return response;
        }));
    };
    JournalModalComponent.prototype.getSymbols = function (response) {
        if (response.isSuccessful) {
            this.symbols = response.payload.map(function (item) { return item.symbol; });
        }
        else {
            this.toastrService.error('Failed to fetch symbols!');
        }
    };
    JournalModalComponent.prototype.getCurrencies = function (response) {
        if (response.isSuccessful) {
            this.currencies = response.payload;
        }
        else {
            this.toastrService.error('Failed to fetch currencies!');
        }
    };
    JournalModalComponent.prototype.getAccounts = function (response) {
        if (response.isSuccessful) {
            this.dummyAccount = {
                accountId: response.payload.AccountId,
                name: response.payload.AccountName,
                description: response.payload.Description,
                typeId: response.payload.TypeId,
                type: response.payload.Type,
                categoryId: response.payload.CategoryId,
                category: response.payload.Category,
                hasJournal: response.payload.HasJournal,
                canDeleted: response.payload.CanDeleted,
                canEdited: response.payload.CanEdited
            };
            this.dummyAccountCategory = {
                id: this.dummyAccount.categoryId,
                name: this.dummyAccount.category
            };
            this.dummyAccountType = {
                id: this.dummyAccount.typeId,
                name: this.dummyAccount.type
            };
        }
        else {
            this.toastrService.error('Failed to fetch Accounts!');
        }
    };
    JournalModalComponent.prototype.saveJournal = function () {
        var _this = this;
        this.isSaving = true;
        var journalPayload = this.getPayload();
        console.log('JOURNAL PAYLOAD', journalPayload);
        if (this.editJournal) {
            var source = this.selectedRow.source;
            this.journalApiService.updateJournal(source, journalPayload).subscribe(function (response) {
                if (response.isSuccessful) {
                    _this.toastrService.success('Journal is updated successfully!');
                    _this.modal.hide();
                    _this.modalClose.emit(true);
                    setTimeout(function () { return _this.clearForm(); }, 500);
                }
                else {
                    _this.toastrService.error('Failed to update Journal!');
                }
                _this.isSaving = false;
            }, function (error) {
                _this.toastrService.error('Something went wrong. Try again later!');
                _this.isSaving = false;
            });
        }
        else {
            this.journalApiService.createJounal(journalPayload).subscribe(function (response) {
                if (response.isSuccessful) {
                    _this.toastrService.success('Journal is created successfully!');
                    _this.modal.hide();
                    _this.modalClose.emit(true);
                    setTimeout(function () { return _this.clearForm(); }, 500);
                }
                else {
                    _this.toastrService.error('Failed to create Journal!');
                }
                _this.isSaving = false;
            }, function (error) {
                _this.toastrService.error('Something went wrong. Try again later!');
                _this.isSaving = false;
            });
        }
    };
    JournalModalComponent.prototype.deleteJournal = function () {
        var _this = this;
        this.isDeleting = true;
        var source = this.selectedRow.source;
        this.journalApiService.deleteJournal(source).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Journal is deleted successfully!');
                _this.modal.hide();
                _this.modalClose.emit(true);
                setTimeout(function () { return _this.clearForm(); }, 500);
            }
            else {
                _this.toastrService.error('Failed to delete Journal!');
            }
            _this.isDeleting = false;
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
            _this.isDeleting = false;
        });
    };
    JournalModalComponent.prototype.getPayload = function () {
        var _a = this.journalForm.value, fund = _a.fund, toAccountEntryType = _a.toAccountEntryType, toAccountCategory = _a.toAccountCategory, toAccountType = _a.toAccountType, toAccountSymbol = _a.toAccountSymbol, toAccountCurrency = _a.toAccountCurrency, fromAccountCategory = _a.fromAccountCategory, fromAccountType = _a.fromAccountType, fromAccountSymbol = _a.fromAccountSymbol, fromAccountCurrency = _a.fromAccountCurrency, selectedAsOfDate = _a.selectedAsOfDate, value = _a.value, comments = _a.comments;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ fund: fund, accountTo: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, (this.editJournal && {
                journalId: this.selectedJournal.AccountTo.JournalId
            }), { entryType: toAccountEntryType, accountCategoryId: this.selectedToAccountCategory.id, accountTypeId: this.selectedToAccountType.id, accountCategory: toAccountCategory, accountType: toAccountType, accountSymbol: toAccountSymbol, accountCurrency: toAccountCurrency }), accountFrom: fromAccountCategory && this.selectedFromAccountCategory.id !== 0
                ? tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, (this.editJournal &&
                    !this.contraEntryMode && {
                    journalId: this.selectedJournal.AccountFrom.JournalId
                }), { entryType: this.getEntryType(), accountCategoryId: this.selectedFromAccountCategory.id, accountTypeId: this.selectedFromAccountType.id, accountCategory: fromAccountCategory, accountType: fromAccountType, accountSymbol: fromAccountSymbol, accountCurrency: fromAccountCurrency }) : {
                // ...(this.editJournal &&
                //   !this.contraEntryMode && {
                //     journalId: this.selectedJournal.AccountFrom.JournalId
                //   }),
                accountId: this.dummyAccount.accountId,
                entryType: this.getEntryType(),
                accountCategoryId: this.dummyAccountCategory.id,
                accountTypeId: this.dummyAccountType.id,
                accountCategory: this.dummyAccountCategory.name,
                accountType: this.dummyAccountType.name,
                accountSymbol: '',
                accountCurrency: ''
            }, asOf: moment__WEBPACK_IMPORTED_MODULE_7__(selectedAsOfDate.startDate).format('YYYY-MM-DD'), value: this.contraEntryMode ? this.selectedRow.balance * -1 : value }, (this.editJournal && { commentId: this.selectedJournal.CommentId }), { comments: comments, contraEntryMode: this.contraEntryMode });
    };
    JournalModalComponent.prototype.typeaheadNoResults = function (event) {
        this.noResult = event;
    };
    JournalModalComponent.prototype.onToEntrySelect = function (event) {
        this.journalForm.form.patchValue({
            fromAccountEntryType: this.getEntryType()
        });
    };
    JournalModalComponent.prototype.getEntryType = function () {
        return this.journalForm.value.toAccountEntryType === 'debit' ? 'credit' : 'debit';
    };
    JournalModalComponent.prototype.onToAccountCategorySelected = function (event) {
        var _this = this;
        this.selectedToAccountCategory = event.item;
        this.journalForm.form.patchValue({
            toAccountType: ''
        });
        this.isFetchingToAccountTypes = true;
        this.getAccountTypes(event.item.id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isFetchingToAccountTypes = false;
        }))
            .subscribe(function (response) { return (_this.toAccountTypes = response.payload); });
    };
    JournalModalComponent.prototype.onToAccountCategoryChange = function (value) {
        if (value === '') {
            this.journalForm.form.patchValue({
                toAccountType: ''
            });
            this.toAccountTypes = [];
        }
    };
    JournalModalComponent.prototype.onToAccountTypeSelected = function (event) {
        this.selectedToAccountType = event.item;
    };
    JournalModalComponent.prototype.onFromAccountCategorySelected = function (event) {
        var _this = this;
        this.selectedFromAccountCategory = event.item;
        this.journalForm.form.patchValue({
            fromAccountType: ''
        });
        this.isFetchingFromAccountTypes = true;
        this.getAccountTypes(event.item.id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isFetchingFromAccountTypes = false;
        }))
            .subscribe(function (response) { return (_this.fromAccountTypes = response.payload); });
    };
    JournalModalComponent.prototype.onFromAccountCategoryChange = function (value) {
        if (value === '') {
            this.journalForm.form.patchValue({
                fromAccountType: ''
            });
            this.fromAccountTypes = [];
        }
    };
    JournalModalComponent.prototype.onFromAccountTypeSelected = function (event) {
        this.selectedFromAccountType = event.item;
    };
    JournalModalComponent.prototype.onDatesChanged = function (selectedDate) {
        if (selectedDate) {
            this.isAsOfDateValid = selectedDate.startDate != null;
        }
    };
    JournalModalComponent.prototype.openModal = function (rowData, contraEntryMode) {
        var _this = this;
        if (rowData === void 0) { rowData = {}; }
        if (contraEntryMode === void 0) { contraEntryMode = false; }
        if (this.isEditMode(rowData, contraEntryMode)) {
            this.editJournal = true;
            this.selectedRow = rowData;
            var _a = this.selectedRow, source = _a.source, event_1 = _a.event;
            if (event_1 !== 'manual') {
                this.closeModal();
                this.toastrService.error('Only User Generated Journals are Editable !');
                return;
            }
            this.isLoading = true;
            this.journalApiService.getJournal(source).subscribe(function (response) {
                if (response.isSuccessful) {
                    var _a = response.payload, Fund = _a.Fund, AccountTo = _a.AccountTo, AccountFrom = _a.AccountFrom, When = _a.When, Comment_1 = _a.Comment;
                    _this.selectedJournal = response.payload;
                    _this.selectedRow.balance = AccountTo.Value;
                    // this.setContraEntryMode(AccountFrom);
                    _this.setJournalAccountsValue(AccountTo, AccountFrom);
                    _this.setFormValues(Fund, AccountTo.CreditDebit, AccountTo.AccountCategory, AccountTo.AccountType, AccountTo.Symbol, AccountTo.FxCurrency, AccountFrom ? AccountFrom.CreditDebit : null, AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.AccountCategory, AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.AccountType, AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.Symbol, AccountFrom && AccountFrom.AccountCategoryId !== 0 && AccountFrom.FxCurrency, When, AccountTo.Value, Comment_1);
                }
                else {
                    _this.toastrService.error('Failed to fetch Journal details. Try again later!');
                }
                _this.isLoading = false;
            }, function (error) {
                _this.isLoading = false;
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
        else if (contraEntryMode) {
            this.contraEntryMode = true;
            this.selectedRow = rowData;
            var _b = this.selectedRow, when = _b.when, balance = _b.balance, AccountType = _b.AccountType;
            // TODO :: Set Journal Accounts Value For Contra Entry Here
            this.setFormValues(this.funds[0].FundCode, null, null, null, null, null, null, null, null, null, null, when, balance, 'A Contra Journal Entry!');
        }
        this.modal.show();
    };
    JournalModalComponent.prototype.setJournalAccountsValue = function (toAccount, fromAccount) {
        var _this = this;
        this.selectedToAccountCategory = this.getMappedJournalAccount(toAccount, 'Category');
        this.selectedToAccountType = this.getMappedJournalAccount(toAccount, 'Type');
        if (fromAccount) {
            this.selectedFromAccountCategory = this.getMappedJournalAccount(fromAccount, 'Category');
            this.selectedFromAccountType = this.getMappedJournalAccount(fromAccount, 'Type');
        }
        this.isFetchingToAccountTypes = true;
        this.getAccountTypes(toAccount.AccountCategoryId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
            _this.isFetchingToAccountTypes = false;
        }))
            .subscribe(function (response) { return (_this.toAccountTypes = response.payload); });
        if (fromAccount) {
            this.isFetchingFromAccountTypes = true;
            this.getAccountTypes(fromAccount.AccountCategoryId)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {
                _this.isFetchingFromAccountTypes = false;
            }))
                .subscribe(function (response) { return (_this.fromAccountTypes = response.payload); });
        }
    };
    JournalModalComponent.prototype.getMappedJournalAccount = function (journalAccount, accountProperty) {
        return {
            id: journalAccount["Account" + accountProperty + "Id"],
            name: journalAccount["Account" + accountProperty]
        };
    };
    JournalModalComponent.prototype.setContraEntryMode = function (fromAccount) {
        this.contraEntryMode = fromAccount == null;
    };
    JournalModalComponent.prototype.isEditMode = function (data, contraEntryMode) {
        return Object.entries(data).length > 0 && !contraEntryMode;
    };
    JournalModalComponent.prototype.setFormValues = function (fund, toAccountEntryType, toAccountCategory, toAccountType, toAccountSymbol, toAccountCurrency, fromAccountEntryType, fromAccountCategory, fromAccountType, fromAccountSymbol, fromAccountCurrency, when, value, comments) {
        this.journalForm.form.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, (fund && { fund: fund }), (toAccountEntryType && { toAccountEntryType: toAccountEntryType }), (toAccountCategory && { toAccountCategory: toAccountCategory }), (toAccountType && { toAccountType: toAccountType }), (toAccountSymbol && { toAccountSymbol: toAccountSymbol }), (toAccountCurrency && { toAccountCurrency: toAccountCurrency }), (fromAccountEntryType && { fromAccountEntryType: fromAccountEntryType }), (fromAccountCategory && { fromAccountCategory: fromAccountCategory }), (fromAccountType && { fromAccountType: fromAccountType }), (fromAccountSymbol && { fromAccountSymbol: fromAccountSymbol }), (fromAccountCurrency && { fromAccountCurrency: fromAccountCurrency }), (when && {
            selectedAsOfDate: {
                startDate: moment__WEBPACK_IMPORTED_MODULE_7__(when, 'MM/DD/YYYY'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_7__(when, 'MM/DD/YYYY')
            }
        }), (value && { value: Math.abs(value) }), (comments && { comments: comments })));
    };
    JournalModalComponent.prototype.closeModal = function () {
        var _this = this;
        this.modal.hide();
        setTimeout(function () { return _this.clearForm(); }, 1000);
    };
    JournalModalComponent.prototype.clearForm = function () {
        this.editJournal = false;
        this.contraEntryMode = false;
        this.toAccountTypes = [];
        this.fromAccountTypes = [];
        this.selectedToAccountCategory = null;
        this.selectedToAccountType = null;
        this.selectedFromAccountCategory = null;
        this.selectedFromAccountType = null;
        this.journalForm.resetForm({
            fund: '',
            toAccountEntryType: '',
            toAccountCategory: '',
            toAccountType: '',
            toAccountSymbol: '',
            toAccountCurrency: '',
            fromAccountEntryType: '',
            fromAccountCategory: '',
            fromAccountType: '',
            fromAccountSymbol: '',
            fromAccountCurrency: ''
        });
    };
    JournalModalComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"] },
        { type: src_services_account_api_service__WEBPACK_IMPORTED_MODULE_10__["AccountApiService"] },
        { type: src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_9__["JournalApiService"] },
        { type: src_services_setting_api_service__WEBPACK_IMPORTED_MODULE_11__["SettingApiService"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_12__["CacheService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('modal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], JournalModalComponent.prototype, "modal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('journalForm', { static: true }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgForm"])
    ], JournalModalComponent.prototype, "journalForm", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], JournalModalComponent.prototype, "modalClose", void 0);
    JournalModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-journal-modal',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./journal-modal.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./journal-modal.component.scss */ "./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_8__["FinanceServiceProxy"],
            src_services_account_api_service__WEBPACK_IMPORTED_MODULE_10__["AccountApiService"],
            src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_9__["JournalApiService"],
            src_services_setting_api_service__WEBPACK_IMPORTED_MODULE_11__["SettingApiService"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_12__["CacheService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"]])
    ], JournalModalComponent);
    return JournalModalComponent;
}());



/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-layout.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-layout.component.scss ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vam91cm5hbHMtbGVkZ2Vycy9qb3VybmFscy1sYXlvdXQuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-layout.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-layout.component.ts ***!
  \********************************************************************/
/*! exports provided: JournalsLayoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalsLayoutComponent", function() { return JournalsLayoutComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");




var JournalsLayoutComponent = /** @class */ (function () {
    function JournalsLayoutComponent(dataService) {
        this.dataService = dataService;
        this.hideGrid = false;
        this.isServerSideJournalActive = true;
        this.isNavActive = false;
        this.isBalanceSheetActive = false;
        this.isIncomeStatementActive = false;
        this.isTrialBalanceActive = false;
        this.isClientSideJournalActive = false;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
        this.containerDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
    }
    JournalsLayoutComponent.prototype.ngOnInit = function () { };
    JournalsLayoutComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
        });
    };
    JournalsLayoutComponent.prototype.activateTab = function (tab) {
        switch (tab) {
            case 'ServerSideJournal':
                this.isServerSideJournalActive = true;
                break;
            case 'Nav':
                this.isNavActive = true;
                break;
            case 'BalanceSheet':
                this.isBalanceSheetActive = true;
                break;
            case 'IncomeStatement':
                this.isIncomeStatementActive = true;
                break;
            case 'TrialBalance':
                this.isTrialBalanceActive = true;
                break;
            case 'ClientSideJournal':
                this.isClientSideJournalActive = true;
                break;
            default:
                break;
        }
    };
    JournalsLayoutComponent.ctorParameters = function () { return [
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }
    ]; };
    JournalsLayoutComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-journals-layout',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./journals-layout.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-layout.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./journals-layout.component.scss */ "./src/app/main/journals-ledgers/journals-layout.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]])
    ], JournalsLayoutComponent);
    return JournalsLayoutComponent;
}());



/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-ledger.module.ts":
/*!*****************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-ledger.module.ts ***!
  \*****************************************************************/
/*! exports provided: JournalsLedgerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalsLedgerModule", function() { return JournalsLedgerModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/fesm5/ngx-bootstrap-dropdown.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var _journals_layout_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./journals-layout.component */ "./src/app/main/journals-ledgers/journals-layout.component.ts");
/* harmony import */ var _journals_server_side_journals_server_side_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./journals-server-side/journals-server-side.component */ "./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.ts");
/* harmony import */ var _main_journals_ledgers_journals_client_side_journal_modal_journal_modal_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component */ "./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.ts");
/* harmony import */ var _shared_Component_report_modal_report_modal_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../shared/Component/report-modal/report-modal.component */ "./src/shared/Component/report-modal/report-modal.component.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _journals_ledger_routes__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./journals-ledger.routes */ "./src/app/main/journals-ledgers/journals-ledger.routes.ts");












// import { GridUtilsComponent } from '../../../shared/Component/grid-utils/grid-utils.component';





var journalLedgerComponents = [
    _journals_layout_component__WEBPACK_IMPORTED_MODULE_10__["JournalsLayoutComponent"],
    _journals_server_side_journals_server_side_component__WEBPACK_IMPORTED_MODULE_11__["JournalsServerSideComponent"],
    // GridUtilsComponent,
    _main_journals_ledgers_journals_client_side_journal_modal_journal_modal_component__WEBPACK_IMPORTED_MODULE_12__["JournalModalComponent"],
    _shared_Component_report_modal_report_modal_component__WEBPACK_IMPORTED_MODULE_13__["ReportModalComponent"]
];
var JournalsLedgerModule = /** @class */ (function () {
    function JournalsLedgerModule() {
    }
    JournalsLedgerModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: journalLedgerComponents.slice(),
            exports: [_journals_layout_component__WEBPACK_IMPORTED_MODULE_10__["JournalsLayoutComponent"], _journals_server_side_journals_server_side_component__WEBPACK_IMPORTED_MODULE_11__["JournalsServerSideComponent"], _shared_module__WEBPACK_IMPORTED_MODULE_14__["SharedModule"]],
            imports: [
                _shared_module__WEBPACK_IMPORTED_MODULE_14__["SharedModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_15__["RouterModule"].forChild(_journals_ledger_routes__WEBPACK_IMPORTED_MODULE_16__["JournalsLedgerRoutes"]),
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["AlertModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TooltipModule"],
                lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["LpToolkitModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_6__["BsDropdownModule"].forRoot(),
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_7__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_8__["TypeaheadModule"].forRoot()
            ],
            providers: [_shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_9__["AgGridUtils"]]
        })
    ], JournalsLedgerModule);
    return JournalsLedgerModule;
}());



/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-ledger.routes.ts":
/*!*****************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-ledger.routes.ts ***!
  \*****************************************************************/
/*! exports provided: JournalsLedgerRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalsLedgerRoutes", function() { return JournalsLedgerRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _journals_layout_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./journals-layout.component */ "./src/app/main/journals-ledgers/journals-layout.component.ts");


var JournalsLedgerRoutes = [
    {
        path: '',
        component: _journals_layout_component__WEBPACK_IMPORTED_MODULE_1__["JournalsLayoutComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.scss ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.font-weight-500 {\n  font-weight: 500;\n}\n\n.mt-6 {\n  margin-top: 6px;\n}\n\n.add-journal-btn {\n  margin-left: -0.9rem;\n}\n\ninput[type=checkbox] {\n  transform: scale(1.5);\n}\n\n::ng-deep .greenBackground {\n  background-color: #b5e6b5;\n}\n\n/****************************** \n********    AG Grid    ******** \n******************************/\n\n.ag-body-viewport-wrapper.ag-layout-normal {\n  overflow-x: scroll;\n  overflow-y: scroll;\n}\n\n::-webkit-scrollbar {\n  -webkit-appearance: none;\n  width: 8px;\n  height: 8px;\n}\n\n::-webkit-scrollbar-thumb {\n  border-radius: 4px;\n  background-color: rgba(0, 0, 0, 0.5);\n  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);\n}\n\n/****************************** \n********  Date Picker  ******** \n******************************/\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9qb3VybmFscy1sZWRnZXJzL2pvdXJuYWxzLXNlcnZlci1zaWRlL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxcam91cm5hbHMtbGVkZ2Vyc1xcam91cm5hbHMtc2VydmVyLXNpZGVcXGpvdXJuYWxzLXNlcnZlci1zaWRlLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL2pvdXJuYWxzLWxlZGdlcnMvam91cm5hbHMtc2VydmVyLXNpZGUvam91cm5hbHMtc2VydmVyLXNpZGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsU0FBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBREVBO0VBQ0Usb0JBQUE7QUNDRjs7QURFQTtFQUNFLHFCQUFBO0FDQ0Y7O0FERUE7RUFDRSx5QkFBQTtBQ0NGOztBREVBOzs4QkFBQTs7QUFJQTtFQUNFLGtCQUFBO0VBQ0Esa0JBQUE7QUNBRjs7QURHQTtFQUNFLHdCQUFBO0VBQ0EsVUFBQTtFQUNBLFdBQUE7QUNBRjs7QURHQTtFQUNFLGtCQUFBO0VBQ0Esb0NBQUE7RUFDQSw0Q0FBQTtBQ0FGOztBREdBOzs4QkFBQTs7QUFJQTtFQUNFLFlBQUE7QUNERjs7QURJQTtFQUNFLFNBQUE7QUNERjs7QURJQTtFQUNFO0lBQ0UsWUFBQTtFQ0RGO0FBQ0Y7O0FESUE7RUFDRTtJQUNFLFdBQUE7RUNGRjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9qb3VybmFscy1sZWRnZXJzL2pvdXJuYWxzLXNlcnZlci1zaWRlL2pvdXJuYWxzLXNlcnZlci1zaWRlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYm9keSxcclxuaHRtbCB7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4uZm9udC13ZWlnaHQtNTAwIHtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG4ubXQtNiB7XHJcbiAgbWFyZ2luLXRvcDogNnB4O1xyXG59XHJcblxyXG4uYWRkLWpvdXJuYWwtYnRuIHtcclxuICBtYXJnaW4tbGVmdDogLTAuOXJlbTtcclxufVxyXG5cclxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXSB7XHJcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xyXG59XHJcblxyXG46Om5nLWRlZXAgLmdyZWVuQmFja2dyb3VuZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2I1ZTZiNTtcclxufVxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBcclxuKioqKioqKiogICAgQUcgR3JpZCAgICAqKioqKioqKiBcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLmFnLWJvZHktdmlld3BvcnQtd3JhcHBlci5hZy1sYXlvdXQtbm9ybWFsIHtcclxuICBvdmVyZmxvdy14OiBzY3JvbGw7XHJcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgd2lkdGg6IDhweDtcclxuICBoZWlnaHQ6IDhweDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41KTtcclxuICBib3gtc2hhZG93OiAwIDAgMXB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcclxufVxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBcclxuKioqKioqKiogIERhdGUgUGlja2VyICAqKioqKioqKiBcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLm1kLWRhdGVwaWNrZXItaW5wdXQtY29udGFpbmVyIHtcclxuICB3aWR0aDogMTUwcHg7XHJcbn1cclxuXHJcbi5tYXQtZGF0ZXBpY2tlci1jb250ZW50IC5tYXQtY2FsZW5kYXIge1xyXG4gIHpvb206IDAuNTtcclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcclxuICAgIHdpZHRoOiAzMjBweDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICB9XHJcbn1cclxuIiwiYm9keSxcbmh0bWwge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLmZvbnQtd2VpZ2h0LTUwMCB7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbi5tdC02IHtcbiAgbWFyZ2luLXRvcDogNnB4O1xufVxuXG4uYWRkLWpvdXJuYWwtYnRuIHtcbiAgbWFyZ2luLWxlZnQ6IC0wLjlyZW07XG59XG5cbmlucHV0W3R5cGU9Y2hlY2tib3hdIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xufVxuXG46Om5nLWRlZXAgLmdyZWVuQmFja2dyb3VuZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNiNWU2YjU7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogXG4qKioqKioqKiAgICBBRyBHcmlkICAgICoqKioqKioqIFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLmFnLWJvZHktdmlld3BvcnQtd3JhcHBlci5hZy1sYXlvdXQtbm9ybWFsIHtcbiAgb3ZlcmZsb3cteDogc2Nyb2xsO1xuICBvdmVyZmxvdy15OiBzY3JvbGw7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIHdpZHRoOiA4cHg7XG4gIGhlaWdodDogOHB4O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGJveC1zaGFkb3c6IDAgMCAxcHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFxuKioqKioqKiogIERhdGUgUGlja2VyICAqKioqKioqKiBcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi5tZC1kYXRlcGlja2VyLWlucHV0LWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxNTBweDtcbn1cblxuLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQgLm1hdC1jYWxlbmRhciB7XG4gIHpvb206IDAuNTtcbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XG4gICAgd2lkdGg6IDMyMHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: JournalsServerSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalsServerSideComponent", function() { return JournalsServerSideComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ag-grid-enterprise */ "./node_modules/ag-grid-enterprise/dist/ag-grid-enterprise.cjs.js");
/* harmony import */ var ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ag_grid_enterprise__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/common/posting-engine.service */ "./src/services/common/posting-engine.service.ts");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _journals_client_side_journal_modal_journal_modal_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../journals-client-side/journal-modal/journal-modal.component */ "./src/app/main/journals-ledgers/journals-client-side/journal-modal/journal-modal.component.ts");
/* harmony import */ var src_shared_Component_report_modal_report_modal_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/Component/report-modal/report-modal.component */ "./src/shared/Component/report-modal/report-modal.component.ts");
/* harmony import */ var _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../shared/Component/data-modal/data-modal.component */ "./src/shared/Component/data-modal/data-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var _shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! src/services/journal-api.service */ "./src/services/journal-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");

/* Core/Library Imports */






/* Services/Components Imports */
















var JournalsServerSideComponent = /** @class */ (function () {
    function JournalsServerSideComponent(financeService, dataService, postingEngineService, agGridUtls, dataDictionary, journalApiService, securityApiService, cacheService, cdRef, toastrService) {
        var _this = this;
        this.financeService = financeService;
        this.dataService = dataService;
        this.postingEngineService = postingEngineService;
        this.agGridUtls = agGridUtls;
        this.dataDictionary = dataDictionary;
        this.journalApiService = journalApiService;
        this.securityApiService = securityApiService;
        this.cacheService = cacheService;
        this.cdRef = cdRef;
        this.toastrService = toastrService;
        this.defaultView = '';
        this.filterSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.rowData = [];
        this.isEngineRunning = false;
        this.isLoading = false;
        this.hideGrid = false;
        this.totalRecords = 0;
        this.fund = 'All Funds';
        this.filterBySymbol = '';
        this.symbol = '';
        this.accountSearch = { id: undefined };
        this.valueFilter = 0;
        this.sortColum = '';
        this.sortDirection = '';
        this.pageNumber = 0;
        this.pageSize = 100;
        this.dataRequestCount = 0;
        this.isDataStreaming = false;
        this.infiniteCount = null;
        this.filterByZeroBalance = 0;
        this.havingColumns = ['balance'];
        this.absoluteSorting = [];
        this.absoluteSortingAsc = false;
        this.absoluteSortingDesc = false;
        this.isJournalModalActive = false;
        this.ignoreFields = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["IgnoreFields"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["HeightStyle"])(220);
        this.excelParams = {
            fileName: 'Journals',
            sheetName: 'First Sheet'
        };
        this.containerDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.utilsConfig = {
            expandGrid: false,
            collapseGrid: false,
            refreshGrid: true,
            resetGrid: false,
            exportExcel: true
        };
        this.datasource = {
            getRows: function (params) {
                _this.pageNumber = params.request.endRow / _this.pageSize;
                var havingColumns = _this.havingColumns;
                var _a = _this.getServerSideExternalFilter(), fund = _a.fund, symbol = _a.symbol, when = _a.when, balance = _a.balance;
                var payload = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, params.request, { havingColumns: havingColumns, absoluteSorting: _this.absoluteSorting, externalFilterModel: { fund: fund, symbol: symbol, when: when, balance: balance }, pageNumber: _this.pageNumber, pageSize: _this.pageSize });
                // console.log('PARAMS :: ', JSON.stringify(params.request, null, 1));
                // console.log('PAYLOAD :: ', JSON.stringify(payload, null, 1));
                // console.log('GET ROWS CALLED ::');
                _this.journalApiService.getServerSideJournals(payload).subscribe(function (result) {
                    if (result.isSuccessful) {
                        _this.dataRequestCount++;
                        result.payload.forEach(function (item) {
                            item.when = moment__WEBPACK_IMPORTED_MODULE_6__(item.when).format('MM-DD-YYYY');
                        });
                        if (_this.gridOptions.columnApi.getAllColumns() !== null) {
                            _this.rowData = result.payload;
                            _this.rowData = _this.checkIfASingleFilterIsAppliedOnAccountCategory(params, _this.rowData);
                            _this.rowData = _this.getGroupedAccountCategoryData(params, _this.rowData);
                            params.successCallback(_this.rowData, result.meta.LastRow);
                        }
                        if (result.meta.LastRow === 0) {
                            _this.gridOptions.api.showNoRowsOverlay();
                        }
                        if (result.meta.FooterSum) {
                            if (result.meta.LastRow < 0) {
                                _this.infiniteCount = 'Showing ' + payload.endRow + ' of more';
                            }
                            else {
                                _this.infiniteCount =
                                    'Showing ' + result.meta.LastRow + ' of ' + result.meta.LastRow;
                            }
                            if (_this.pinnedBottomRowData != null) {
                                _this.pinnedBottomRowData[0].source = _this.infiniteCount;
                                _this.gridOptions.api.setPinnedBottomRowData(_this.pinnedBottomRowData);
                            }
                        }
                        // if (result.meta.FooterSum && this.pageNumber === 1) {
                        //   console.log('FIELDS SUM :: ', this.fieldsSum);
                        //   this.resetFieldsSum();
                        //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
                        // } else if (result.meta.FooterSum) {
                        //   console.log('FIELDS SUM :: ', this.fieldsSum);
                        //   this.fieldsSum = CalTotal(this.rowData, this.fieldsSum);
                        // }
                        // this.pinnedBottomRowData = [
                        //   {
                        //     source: 'Total Records: ' + this.totalRecords,
                        //     AccountType: '',
                        //     accountName: '',
                        //     when: '',
                        //     security_id: 0,
                        //     debit: Math.abs(this.fieldsSum[0].total),
                        //     credit: Math.abs(this.fieldsSum[1].total),
                        //     balance: Math.abs(this.fieldsSum[0].total) - Math.abs(this.fieldsSum[1].total),
                        //     Commission: Math.abs(this.fieldsSum[2].total),
                        //     Fees: Math.abs(this.fieldsSum[3].total),
                        //     TradePrice: this.fieldsSum[4].total,
                        //     NetPrice: Math.abs(this.fieldsSum[5].total),
                        //     SettleNetPrice: Math.abs(this.fieldsSum[6].total),
                        //     NetMoney: Math.abs(this.fieldsSum[7].total),
                        //     LocalNetNotional: Math.abs(this.fieldsSum[8].total),
                        //     value: Math.abs(this.fieldsSum[9].total),
                        //     start_price: 0,
                        //     end_price: 0
                        //   }
                        // ];
                        // this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
                        if (_this.dataRequestCount <= 2) {
                            Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["AutoSizeAllColumns"])(_this.gridOptions);
                        }
                        _this.gridOptions.api.refreshCells();
                    }
                    else {
                        params.failCallback();
                    }
                }, function (error) {
                    params.failCallback();
                });
            }
        };
        this.hideGrid = false;
        this.DateRangeLabel = '';
    }
    JournalsServerSideComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isEngineRunning = this.postingEngineService.getStatus();
        this.filterSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounce"])(function () { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["timer"])(500); })).subscribe(function () {
            _this.gridOptions.api.onFilterChanged();
        });
        this.resetFieldsSum();
        this.initGird();
        if (!this.defaultView) {
            this.getJournalsTotal({ filterModel: {}, externalFilterModel: {} });
        }
    };
    JournalsServerSideComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
                _this.initColDefs();
            }
        });
    };
    JournalsServerSideComponent.prototype.setWidthAndHeight = function (width, height) {
        this.style = {
            marginTop: '20px',
            width: width,
            height: height,
            boxSizing: 'border-box'
        };
    };
    JournalsServerSideComponent.prototype.getGroupedAccountCategoryData = function (params, rowData) {
        var accountCategoryIndex = params.request.rowGroupCols.findIndex(function (item) { return item.id === 'AccountCategory'; });
        var groupKey = params.request.groupKeys[accountCategoryIndex];
        return rowData.map(function (item) {
            if (!item.hasOwnProperty('AccountCategory')) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item, { AccountCategory: groupKey });
            }
            return item;
        });
    };
    JournalsServerSideComponent.prototype.checkIfASingleFilterIsAppliedOnAccountCategory = function (params, rowData) {
        var filteredCategory;
        if (params.request.filterModel.hasOwnProperty('AccountCategory')) {
            var obj = params.request.filterModel['AccountCategory'];
            var filterList = obj['values'];
            if (filterList.length === 1) {
                filteredCategory = filterList[0];
            }
        }
        if (filteredCategory) {
            return rowData.map(function (item) {
                if (!item.hasOwnProperty('AccountCategory')) {
                    return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item, { AccountCategory: filteredCategory });
                }
                return item;
            });
        }
        else {
            return rowData;
        }
    };
    JournalsServerSideComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            var localfunds = result.payload.map(function (item) { return ({
                FundCode: item.FundCode
            }); });
            _this.funds = localfunds;
        });
    };
    JournalsServerSideComponent.prototype.getJournalsTotal = function (payload) {
        var _this = this;
        this.journalApiService.getServerSideJournalsTotal(payload).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.pinnedBottomRowData = [
                    {
                        source: _this.infiniteCount,
                        AccountType: '',
                        accountName: '',
                        when: '',
                        security_id: 0,
                        debit: Math.abs(response.payload[0].debit),
                        credit: Math.abs(response.payload[0].credit),
                        balance: Math.abs(response.payload[0].balance),
                        Commission: Math.abs(_this.fieldsSum[2].total),
                        Fees: Math.abs(_this.fieldsSum[3].total),
                        TradePrice: _this.fieldsSum[4].total,
                        NetPrice: Math.abs(_this.fieldsSum[5].total),
                        SettleNetPrice: Math.abs(_this.fieldsSum[6].total),
                        NetMoney: Math.abs(_this.fieldsSum[7].total),
                        LocalNetNotional: Math.abs(_this.fieldsSum[8].total),
                        value: Math.abs(_this.fieldsSum[9].total),
                        start_price: 0,
                        end_price: 0
                    }
                ];
                _this.gridOptions.api.setPinnedBottomRowData(_this.pinnedBottomRowData);
            }
        }, function (error) { });
    };
    JournalsServerSideComponent.prototype.getMainMenuItems = function (params) {
        var _this = this;
        switch (params.column.getId()) {
            case 'balance':
                var menuItems = params.defaultItems.slice(0);
                menuItems.push({
                    name: 'Sort by absolute value',
                    action: function () {
                        _this.sortByAbsoluteValue('asc', params.column.getId());
                    },
                    checked: this.absoluteSortingAsc
                });
                // menuItems.push({
                //   name: "Sort by absolute value DESC",
                //   action: () => {
                //     this.sortByAbsoluteValue('desc', params.column.getId());
                //   },
                //   checked: this.absoluteSortingDesc
                // });
                return menuItems;
            default:
                return params.defaultItems;
        }
    };
    JournalsServerSideComponent.prototype.sortByAbsoluteValue = function (sortDirection, colId) {
        this.absoluteSortingAsc = !this.absoluteSortingAsc;
        if (this.absoluteSortingAsc) {
            this.absoluteSorting = [];
            this.absoluteSorting.push(colId);
        }
        else {
            this.absoluteSorting = [];
        }
        var sort = [
            {
                colId: colId,
                sort: sortDirection
            }
        ];
        // this.gridOptions.api.setSortModel(sort);
    };
    JournalsServerSideComponent.prototype.initColDefs = function () {
        var _this = this;
        var payload = {
            GridName: _shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_18__["GridName"].journalsLedgers
        };
        this.cacheService.getServerSideJournalsMeta(payload).subscribe(function (result) {
            _this.fundsRange = result.payload.FundsRange;
            _this.ranges = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["getRange"])(_this.getCustomFundRange());
            _this.cdRef.detectChanges();
            var metaColumns = result.payload.Columns;
            var commonColDefs = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["CommonCols"])(true, result.payload.Filters);
            var disabledFilters = [
                'id',
                'source',
                // 'accountDescription',
                // 'debit',
                // 'credit',
                'balance'
                // 'Quantity',
                // 'TradeCurrency',
                // 'SettleCurrency',
                // 'Side',
                // 'fxrate',
                // 'event',
                // 'security_id',
                // 'fx_currency',
                // 'value',
                // 'start_price',
                // 'end_price'
            ];
            var colDefs = commonColDefs.concat([
                _this.dataDictionary.column('fxrate', true),
                _this.dataDictionary.column('start_price', true),
                _this.dataDictionary.column('end_price', true)
            ]);
            var cdefs = _this.agGridUtls.customizeColumns(colDefs, metaColumns, _this.ignoreFields, true, result.payload.Filters);
            var afterDisableFilters = _this.agGridUtls.disableColumnFilters(cdefs, disabledFilters);
            _this.gridOptions.api.setColumnDefs(afterDisableFilters);
            // console.log('COL DEFS :: ', cdefs);
            // console.log('COL DEFS :: ', afterDisableFilters);
        });
    };
    /*
    Drives the Columns that will be Defined on the UI, and What can be Done with those Fields
    */
    JournalsServerSideComponent.prototype.customizeColumns = function (columns) {
        var colDefs = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["CommonCols"])(true).concat([
            this.dataDictionary.column('TradePrice', true),
            this.dataDictionary.column('NetPrice', true),
            this.dataDictionary.column('SettleNetPrice', true),
            this.dataDictionary.column('start_price', true),
            this.dataDictionary.column('end_price', true),
            this.dataDictionary.column('fxrate', true)
        ]);
        var cdefs = this.agGridUtls.customizeColumns(colDefs, columns, this.ignoreFields, true);
        this.gridOptions.api.setColumnDefs(cdefs);
    };
    JournalsServerSideComponent.prototype.initGird = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            /* Custom Method Binding for External Filters for Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearExternalFilter.bind(this),
            setExternalFilter: this.setExternalFilter.bind(this),
            /* Default Grid Options */
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            onSortChanged: this.onSortChanged.bind(this),
            onColumnRowGroupChanged: this.onColumnRowGroupChanged.bind(this),
            onCellDoubleClicked: this.openDataModal.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_14__["GridLayoutMenuComponent"] },
            rowModelType: 'serverSide',
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            animateRows: true,
            enableFilter: true,
            floatingFilter: true,
            suppressColumnVirtualisation: true,
            suppressHorizontalScroll: false,
            alignedGrids: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            },
            getMainMenuItems: this.getMainMenuItems.bind(this),
            onGridReady: function (params) {
                if (_this.defaultView) {
                    params.api.setServerSideDatasource(null);
                }
                else {
                    params.api.setServerSideDatasource(_this.datasource);
                }
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                // params.api.forEachNode(node => {
                //   node.expanded = true;
                // });
                // params.api.onGroupExpandedOrCollapsed();
            },
            getRowStyle: function (params) { return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["ApplyRowStyles"])(params); },
            getChildCount: function (data) {
                // Data Contains a Group that is returned from the API
                return data ? data.groupCount : 0;
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["SideBar"])(_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_18__["GridId"].journalsLedgersId, _shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_18__["GridName"].journalsLedgers, this.gridOptions, this.defaultView, this.datasource);
    };
    JournalsServerSideComponent.prototype.onFilterChanged = function (event) {
        try {
            if (event.api.serverSideRowModel.cacheParams) {
                this.payloadForJournalTotals(event.api.serverSideRowModel.cacheParams);
            }
        }
        catch (ex) {
        }
    };
    JournalsServerSideComponent.prototype.payloadForJournalTotals = function (cacheParams) {
        this.resetBottomRowData();
        var havingColumns = this.havingColumns;
        if (cacheParams) {
            var filterModel = cacheParams.filterModel, valueCols = cacheParams.valueCols;
            var _a = this.getServerSideExternalFilter(), fund = _a.fund, symbol = _a.symbol, when = _a.when, balance = _a.balance;
            var payload = {
                filterModel: filterModel,
                valueCols: valueCols,
                havingColumns: havingColumns,
                externalFilterModel: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, (fund && { fund: fund }), (symbol && { symbol: symbol }), (when && { when: when }), (balance && { balance: balance }))
            };
            this.getJournalsTotal(payload);
        }
    };
    JournalsServerSideComponent.prototype.onSortChanged = function () {
        // console.log('SORTING CHANGED ::');
        // this.resetBottomRowData();
    };
    JournalsServerSideComponent.prototype.onColumnRowGroupChanged = function () {
        // console.log('GROUPING CHANGED ::');
        // this.resetBottomRowData();
    };
    JournalsServerSideComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [];
        addDefaultItems.push({
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
        });
        if (params.node.data.event === 'manual') {
            addDefaultItems.push({
                name: 'Edit',
                action: function () {
                    _this.isJournalModalActive = true;
                    setTimeout(function () {
                        _this.openEditModal(params.node.data, false);
                    }, 250);
                }
            });
        }
        var addCustomItems = [
            {
                name: 'View Chart',
                action: function () {
                    var record = Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["ViewChart"])(params);
                    _this.tableHeader = record[0];
                    _this.openChartModal(record[1]);
                }
            }
        ];
        if (params.node.field === 'AccountType' && params.node.data.balance !== 0) {
            addCustomItems.push({
                name: 'Contra Entry',
                action: function () {
                    _this.openEditModal(params.node.data, true);
                }
            });
        }
        //  (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_15__["GetContextMenu"])(false, addDefaultItems, false, addCustomItems, params);
    };
    JournalsServerSideComponent.prototype.ngModelChangeFund = function (e) {
        this.fund = e;
        this.ranges = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["getRange"])(this.getCustomFundRange(e));
        this.cdRef.detectChanges();
        this.gridOptions.api.onFilterChanged();
    };
    JournalsServerSideComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
    };
    JournalsServerSideComponent.prototype.ngModelChangeZeroBalance = function (e) {
        this.filterByZeroBalance = e;
        this.gridOptions.api.onFilterChanged();
    };
    JournalsServerSideComponent.prototype.onSymbolKey = function (e) {
        this.filterSubject.next(e.srcElement.value);
        // For the Moment we React to Each Key Stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    JournalsServerSideComponent.prototype.ngModelChange = function (e) {
        this.startDate = e.startDate;
        this.endDate = e.endDate;
        this.getRangeLabel();
        this.gridOptions.api.onFilterChanged();
    };
    JournalsServerSideComponent.prototype.setExternalFilter = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        var zeroBalanceFilter = object.zeroBalanceFilter;
        var absoluteSortingModel = object.absoluteSortingModel;
        this.filterByZeroBalance = zeroBalanceFilter;
        this.absoluteSorting = absoluteSortingModel.sortingOn;
        this.absoluteSortingAsc = absoluteSortingModel.sortingApplied;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        //this.gridOptions.api.onFilterChanged();
    };
    JournalsServerSideComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    JournalsServerSideComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.fund !== 'All Funds' && this.filterBySymbol !== '' && this.startDate) {
            var cellFund = node.data.fund;
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            var cellDate = new Date(node.data.when);
            return (cellFund === this.fund &&
                cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
                this.startDate.toDate() <= cellDate &&
                this.endDate.toDate() >= cellDate);
        }
        if (this.fund !== 'All Funds' && this.filterBySymbol !== '') {
            var cellFund = node.data.fund;
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellFund === this.fund && cellSymbol.includes(this.filterBySymbol);
        }
        if (this.fund !== 'All Funds' && this.startDate) {
            var cellFund = node.data.fund;
            var cellDate = new Date(node.data.when);
            return (cellFund === this.fund &&
                this.startDate.toDate() <= cellDate &&
                this.endDate.toDate() >= cellDate);
        }
        if (this.filterBySymbol !== '' && this.startDate) {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            var cellDate = new Date(node.data.when);
            return (cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
                this.startDate.toDate() <= cellDate &&
                this.endDate.toDate() >= cellDate);
        }
        if (this.fund !== 'All Funds') {
            var cellFund = node.data.fund;
            return cellFund === this.fund;
        }
        if (this.startDate) {
            var cellDate = new Date(node.data.when);
            return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
        }
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
    };
    JournalsServerSideComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    JournalsServerSideComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_19__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    JournalsServerSideComponent.prototype.getCustomFundRange = function (fund) {
        if (fund === void 0) { fund = 'All Funds'; }
        var customRange = {};
        this.fundsRange.forEach(function (element) {
            if (fund === 'All Funds' && moment__WEBPACK_IMPORTED_MODULE_6__().year() !== element.Year) {
                customRange[element.Year] = [
                    [
                        moment__WEBPACK_IMPORTED_MODULE_6__(element.Year + "-01-01").startOf('year'),
                        moment__WEBPACK_IMPORTED_MODULE_6__(element.Year + "-01-01").endOf('year')
                    ]
                ][0];
            }
            else if (fund === element.fund && moment__WEBPACK_IMPORTED_MODULE_6__().year() !== element.Year) {
                customRange[element.Year] = [
                    [
                        moment__WEBPACK_IMPORTED_MODULE_6__(element.Year + "-01-01").startOf('year'),
                        moment__WEBPACK_IMPORTED_MODULE_6__(element.Year + "-01-01").endOf('year')
                    ]
                ][0];
            }
        });
        return customRange;
    };
    JournalsServerSideComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            zeroBalanceFilter: this.filterByZeroBalance,
            absoluteSortingModel: {
                sortingApplied: this.absoluteSortingAsc,
                sortingOn: this.absoluteSorting
            },
            dateFilter: this.DateRangeLabel !== ''
                ? this.DateRangeLabel
                : {
                    startDate: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
                    endDate: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : ''
                }
        };
    };
    JournalsServerSideComponent.prototype.getServerSideExternalFilter = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, (this.fund !== 'All Funds' && {
            fund: { values: this.fund, filterType: 'set' }
        }), (this.filterBySymbol !== '' && {
            symbol: { values: this.filterBySymbol, filterType: 'text' }
        }), (this.filterByZeroBalance === 1 && {
            balance: { values: 0, filterType: 'number', type: 'notEqual' }
        }), (this.startDate !== null && {
            when: {
                dateFrom: this.startDate !== null ? this.startDate.format('YYYY-MM-DD') : '',
                dateTo: this.endDate !== null ? this.endDate.format('YYYY-MM-DD') : '',
                filterType: 'date'
            }
        }));
    };
    JournalsServerSideComponent.prototype.clearExternalFilter = function () {
        this.gridOptions.api.redrawRows();
        this.fund = 'All Funds';
        this.filterBySymbol = '';
        this.filterByZeroBalance = 0;
        this.DateRangeLabel = '';
        this.selected = null;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_6__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_6__();
        this.absoluteSortingAsc = false;
        this.absoluteSorting = [];
        this.gridOptions.api.setFilterModel(null);
        this.gridOptions.api.onFilterChanged();
    };
    JournalsServerSideComponent.prototype.resetFieldsSum = function () {
        return (this.fieldsSum = [
            { name: 'debit', total: 0 },
            { name: 'credit', total: 0 },
            { name: 'local_debit', total: 0 },
            { name: 'local_credit', total: 0 },
            { name: 'Commission', total: 0 },
            { name: 'Fees', total: 0 },
            { name: 'TradePrice', total: 0 },
            { name: 'NetPrice', total: 0 },
            { name: 'SettleNetPrice', total: 0 },
            { name: 'NetMoney', total: 0 },
            { name: 'LocalNetNotional', total: 0 },
            { name: 'value', total: 0 }
        ]);
    };
    JournalsServerSideComponent.prototype.resetBottomRowData = function () {
        this.pinnedBottomRowData = null;
    };
    JournalsServerSideComponent.prototype.refreshGrid = function () {
        this.totalRecords = 0;
        this.rowData = [];
        this.cacheService.purgeServerSideJournalsMeta();
        this.gridOptions.api.showLoadingOverlay();
        this.initColDefs();
        this.gridOptions.api.setServerSideDatasource(this.datasource);
        var cacheParams = this.gridOptions.api.serverSideRowModel.cacheParams;
        this.payloadForJournalTotals(cacheParams);
    };
    JournalsServerSideComponent.prototype.openJournalModal = function () {
        var _this = this;
        this.isJournalModalActive = true;
        setTimeout(function () {
            _this.journalModal.openModal();
        }, 250);
    };
    JournalsServerSideComponent.prototype.openEditModal = function (data, contraEntryMode) {
        this.journalModal.openModal(data, contraEntryMode);
    };
    JournalsServerSideComponent.prototype.closeJournalModal = function () {
        this.refreshGrid();
    };
    JournalsServerSideComponent.prototype.openDataModal = function (row) {
        // We can Drive the Screen that we Wish to Display from here
        if (row.colDef.headerName === 'Group') {
            return;
        }
        var cols = this.gridOptions.columnApi.getColumnState();
        this.dataModal.openModal(row, cols);
    };
    JournalsServerSideComponent.prototype.closeDataModal = function () { };
    JournalsServerSideComponent.prototype.openChartModal = function (data) {
        this.reportModal.openModal(data);
    };
    JournalsServerSideComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_7__["FinanceServiceProxy"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_9__["DataService"] },
        { type: src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_8__["PostingEngineService"] },
        { type: _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_16__["AgGridUtils"] },
        { type: _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__["DataDictionary"] },
        { type: src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_20__["JournalApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_21__["SecurityApiService"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_22__["CacheService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], JournalsServerSideComponent.prototype, "defaultView", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('journalModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _journals_client_side_journal_modal_journal_modal_component__WEBPACK_IMPORTED_MODULE_10__["JournalModalComponent"])
    ], JournalsServerSideComponent.prototype, "journalModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_12__["DataModalComponent"])
    ], JournalsServerSideComponent.prototype, "dataModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('reportModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_report_modal_report_modal_component__WEBPACK_IMPORTED_MODULE_11__["ReportModalComponent"])
    ], JournalsServerSideComponent.prototype, "reportModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_13__["CreateSecurityComponent"])
    ], JournalsServerSideComponent.prototype, "securityModal", void 0);
    JournalsServerSideComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-journals-server-side',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./journals-server-side.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./journals-server-side.component.scss */ "./src/app/main/journals-ledgers/journals-server-side/journals-server-side.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_7__["FinanceServiceProxy"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_9__["DataService"],
            src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_8__["PostingEngineService"],
            _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_16__["AgGridUtils"],
            _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__["DataDictionary"],
            src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_20__["JournalApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_21__["SecurityApiService"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_22__["CacheService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"]])
    ], JournalsServerSideComponent);
    return JournalsServerSideComponent;
}());



/***/ }),

/***/ "./src/shared/Component/report-modal/report-modal.component.scss":
/*!***********************************************************************!*\
  !*** ./src/shared/Component/report-modal/report-modal.component.scss ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("button:focus {\n  outline: 0;\n}\n\n.modal {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n\n.modal-header {\n  padding: 5px;\n  background-color: #0275D8;\n  color: white;\n}\n\n.modal-body {\n  max-height: calc(100vh - 30vh);\n  overflow-y: auto;\n  padding: 5px;\n}\n\n.modal-backdrop {\n  position: relative;\n}\n\n.close {\n  font-size: 1.5rem;\n  color: #fff;\n  opacity: 1;\n}\n\n.report-container {\n  height: 38rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFyZWQvQ29tcG9uZW50L3JlcG9ydC1tb2RhbC9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxzaGFyZWRcXENvbXBvbmVudFxccmVwb3J0LW1vZGFsXFxyZXBvcnQtbW9kYWwuY29tcG9uZW50LnNjc3MiLCJzcmMvc2hhcmVkL0NvbXBvbmVudC9yZXBvcnQtbW9kYWwvcmVwb3J0LW1vZGFsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsVUFBQTtBQ0NGOztBREVBO0VBQ0Usb0NBQUE7QUNDRjs7QURFQTtFQUNFLFlBQUE7RUFDQSx5QkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLDhCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtBQ0NGOztBREVBO0VBQ0UsaUJBQUE7RUFDQSxXQUFBO0VBQ0EsVUFBQTtBQ0NGOztBREVBO0VBQ0UsYUFBQTtBQ0NGIiwiZmlsZSI6InNyYy9zaGFyZWQvQ29tcG9uZW50L3JlcG9ydC1tb2RhbC9yZXBvcnQtbW9kYWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJidXR0b246Zm9jdXMge1xyXG4gIG91dGxpbmU6IDA7XHJcbn1cclxuXHJcbi5tb2RhbCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xyXG59XHJcblxyXG4ubW9kYWwtaGVhZGVyIHtcclxuICBwYWRkaW5nOiA1cHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAyNzVEODtcclxuICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5tb2RhbC1ib2R5IHtcclxuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMzB2aCk7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBwYWRkaW5nOiA1cHg7XHJcbn1cclxuXHJcbi5tb2RhbC1iYWNrZHJvcCB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uY2xvc2Uge1xyXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xyXG4gIGNvbG9yOiAjZmZmO1xyXG4gIG9wYWNpdHk6IDE7XHJcbn1cclxuXHJcbi5yZXBvcnQtY29udGFpbmVyIHtcclxuICBoZWlnaHQ6IDM4cmVtO1xyXG59XHJcbiIsImJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmU6IDA7XG59XG5cbi5tb2RhbCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcbn1cblxuLm1vZGFsLWhlYWRlciB7XG4gIHBhZGRpbmc6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAyNzVEODtcbiAgY29sb3I6IHdoaXRlO1xufVxuXG4ubW9kYWwtYm9keSB7XG4gIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAzMHZoKTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgcGFkZGluZzogNXB4O1xufVxuXG4ubW9kYWwtYmFja2Ryb3Age1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5jbG9zZSB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBjb2xvcjogI2ZmZjtcbiAgb3BhY2l0eTogMTtcbn1cblxuLnJlcG9ydC1jb250YWluZXIge1xuICBoZWlnaHQ6IDM4cmVtO1xufSJdfQ== */");

/***/ }),

/***/ "./src/shared/Component/report-modal/report-modal.component.ts":
/*!*********************************************************************!*\
  !*** ./src/shared/Component/report-modal/report-modal.component.ts ***!
  \*********************************************************************/
/*! exports provided: ReportModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportModalComponent", function() { return ReportModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");




var ReportModalComponent = /** @class */ (function () {
    function ReportModalComponent() {
        this.isLoading = false;
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__["HeightStyle"])(220);
        this.containerDiv = {
            borderLeft: "1px solid #cecece",
            borderRight: "1px solid #cecece",
            width: "100%",
            boxSizing: "border-box",
            overflow: "overlay"
        };
    }
    ReportModalComponent.prototype.ngOnInit = function () { };
    ReportModalComponent.prototype.openModal = function (payload) {
        this.trialBalanceReport = payload.data;
        this.trialBalanceReportStats = payload.stats;
        this.modal.show();
    };
    ReportModalComponent.prototype.closeModal = function () {
        this.modal.hide();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])("modal", { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ModalDirective"])
    ], ReportModalComponent.prototype, "modal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ReportModalComponent.prototype, "title", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ReportModalComponent.prototype, "tableHeader", void 0);
    ReportModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-report-modal",
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./report-modal.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/shared/Component/report-modal/report-modal.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./report-modal.component.scss */ "./src/shared/Component/report-modal/report-modal.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ReportModalComponent);
    return ReportModalComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-journals-ledgers-journals-ledger-module.js.map