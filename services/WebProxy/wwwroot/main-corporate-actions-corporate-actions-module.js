(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-corporate-actions-corporate-actions-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/corporate-actions.component.html":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/corporate-actions.component.html ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\r\n  <tabset>\r\n    <tab heading=\"Dividends\">\r\n      <div [ngStyle]=\"style\">\r\n        <div [ngStyle]=\"styleForHeight\">\r\n          <app-dividends *ngIf=\"corporateActions\"></app-dividends>\r\n        </div>\r\n      </div>\r\n    </tab>\r\n\r\n    <tab heading=\"Stock Splits\" (selectTab)=\"activeStockSplits()\">\r\n      <div [ngStyle]=\"style\">\r\n        <div [ngStyle]=\"styleForHeight\">\r\n          <app-stock-splits *ngIf=\"stockSplits\"></app-stock-splits>\r\n        </div>\r\n      </div>\r\n    </tab>\r\n  </tabset>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/dividends.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/dividends.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row\">\r\n\r\n  <!-- Symbol Filter -->\r\n  <div class=\"col-auto\">\r\n    <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n      (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n  </div>\r\n  <!-- Symbol Filter Ends -->\r\n\r\n  <!-- Date Picker Div Starts -->\r\n  <div class=\"col-auto\">\r\n    <form>\r\n      <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\" [(ngModel)]=\"selected\"\r\n        (ngModelChange)=\"ngModelChangeDates($event)\" name=\" selected\" [autoApply]=\"true\" [alwaysShowCalendars]=\"true\"\r\n        [keepCalendarOpeningWithRange]=\"true\" />\r\n    </form>\r\n  </div>\r\n  <!-- Date Picker Div Ends -->\r\n\r\n  <!-- Clear Button Div Starts -->\r\n  <div class=\"col-auto\">\r\n    <button (click)=\"clearFilters()\" class=\"btn btn-pa\" value=\"clear\" tooltip=\"Clear\" placement=\"top\">\r\n      <i class=\"fa fa-remove\"></i>\r\n    </button>\r\n  </div>\r\n  <!-- Clear Button Div Ends -->\r\n\r\n  <!-- Util Buttons Div Starts -->\r\n  <div class=\"col-auto ml-auto\">\r\n\r\n    <!-- Refresh Button Div Starts -->\r\n    <div class=\"mr-2 d-inline-block\">\r\n      <button (click)=\"refreshReport()\" class=\"btn btn-pa\" value=\"refresh\" tooltip=\"Refresh\" placement=\"top\">\r\n        <i class=\"fa fa-refresh\"></i></button>\r\n    </div>\r\n    <!-- Refresh Button Div Ends -->\r\n\r\n    <div class=\"mr-2 d-inline-block\">\r\n      <button class=\"btn btn-pa\" type=\"button\" value=\"showModal\" (click)=\"openDividendModal()\" tooltip=\"Create Dividend\"\r\n        placement=\"top\">\r\n        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Expand/Collapse Button -->\r\n    <div class=\"mr-3 d-inline-block\">\r\n      <ng-template #tooltipTemplate>{{dividendConfig.detailsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n      <button (click)=\"dividendConfig.detailsView = !dividendConfig.detailsView\" class=\"btn btn-pa\"\r\n        [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n        <i class=\"fa\"\r\n          [ngClass]=\"{'fa-arrow-down': dividendConfig.detailsView, 'fa-arrow-up': !dividendConfig.detailsView}\"></i>\r\n      </button>\r\n    </div>\r\n\r\n  </div>\r\n  <!-- Util Buttons Div Ends -->\r\n\r\n</div>\r\n\r\n<!-- Main Split Row Starts -->\r\n<div class=\"split-area row h-100\" style=\"margin-top: 20px;\">\r\n\r\n  <!-- AS Split Main Container -->\r\n  <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"vertical\" [useTransition]=\"dividendConfig.useTransition\"\r\n    (dragEnd)=\"applyPageLayout($event)\" (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n    <!-- Cost Basis Split Area -->\r\n    <as-split-area [visible]=\"dividendConfig.dividendView\" [size]=\"dividendConfig.dividendSize\" order=\"1\">\r\n\r\n\r\n      <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\"\r\n        (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n      </ag-grid-angular>\r\n\r\n    </as-split-area>\r\n\r\n    <!-- Charts Split Area -->\r\n    <as-split-area class=\"mt-3\" [visible]=\"dividendConfig.detailsView\" [size]=\"dividendConfig.detailsSize\" order=\"2\">\r\n      <div class=\"w-100 h-100 grid-height tabset-wrapper\">\r\n        <tabset class=\"w-100 h-100\">\r\n          <tab class=\"h-100\" heading=\"Details\" (selectTab)=\"activeStockSplits()\">\r\n            <ag-grid-angular class=\"w-100 h-100 mt-3 ag-theme-balham\" [gridOptions]=\"dividendDetailsGrid\"\r\n              (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n            </ag-grid-angular>\r\n          </tab>\r\n\r\n          <tab heading=\"Preview\">\r\n            <app-preview></app-preview>\r\n          </tab>\r\n        </tabset>\r\n      </div>\r\n    </as-split-area>\r\n\r\n  </as-split>\r\n\r\n</div>\r\n\r\n<app-create-dividend #dividendModal (modalClose)=\"closeDividendModal()\"></app-create-dividend>\r\n\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\"></app-data-grid-modal>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n\r\n<!-- Confirmation Modal Selector -->\r\n<app-confirmation-modal #confirmationModal (confirmDeletion)=\"deleteDividend()\" [modalTitle]=\"'Delete Dividend'\">\r\n</app-confirmation-modal>\r\n<!-- Confirmation Modal Selector Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/preview/preview.component.html":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/preview/preview.component.html ***!
  \***********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.html":
/*!****************************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.html ***!
  \****************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits.component.html":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits.component.html ***!
  \***********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row\">\r\n\r\n  <!-- Symbol Filter -->\r\n  <div class=\"col-auto\">\r\n    <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n      (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n  </div>\r\n  <!-- Symbol Filter Ends -->\r\n\r\n  <!-- Date Picker Div Starts -->\r\n  <div class=\"col-auto\">\r\n    <form>\r\n      <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" placeholder=\"Choose date\" [(ngModel)]=\"selected\"\r\n        (ngModelChange)=\"ngModelChangeDates($event)\" name=\" selected\" [autoApply]=\"true\" [alwaysShowCalendars]=\"true\"\r\n        [keepCalendarOpeningWithRange]=\"true\" />\r\n    </form>\r\n  </div>\r\n  <!-- Date Picker Div Ends -->\r\n\r\n  <!-- Clear Button Div Starts -->\r\n  <div class=\"col-auto\">\r\n    <button (click)=\"clearFilters()\" class=\"btn btn-pa\" value=\"clear\" tooltip=\"Clear\" placement=\"top\">\r\n      <i class=\"fa fa-remove\"></i>\r\n    </button>\r\n  </div>\r\n  <!-- Clear Button Div Ends -->\r\n\r\n  <!-- Util Buttons Div Starts -->\r\n  <div class=\"col-auto ml-auto\">\r\n\r\n    <!-- Refresh Button Div Starts -->\r\n    <div class=\"mr-2 d-inline-block\">\r\n      <button (click)=\"refreshReport()\" class=\"btn btn-pa\" value=\"refresh\" tooltip=\"Refresh\" placement=\"top\">\r\n        <i class=\"fa fa-refresh\"></i></button>\r\n    </div>\r\n    <!-- Refresh Button Div Ends -->\r\n\r\n    <div class=\"mr-2 d-inline-block\">\r\n      <button class=\"btn btn-pa\" type=\"button\" value=\"showModal\" (click)=\"openStockSplitModal()\"\r\n        tooltip=\"Create StockSplits\" placement=\"top\">\r\n        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Expand/Collapse Button -->\r\n    <div class=\"mr-3 d-inline-block\">\r\n      <ng-template #tooltipTemplate>{{stockSplitConfig.detailsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n      <button (click)=\"stockSplitConfig.detailsView = !stockSplitConfig.detailsView\" class=\"btn btn-pa\"\r\n        [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n        <i class=\"fa\"\r\n          [ngClass]=\"{'fa-arrow-down': stockSplitConfig.detailsView, 'fa-arrow-up': !stockSplitConfig.detailsView}\"></i>\r\n      </button>\r\n    </div>\r\n\r\n  </div>\r\n  <!-- Util Buttons Div Ends -->\r\n\r\n</div>\r\n\r\n<!-- Main Split Row Starts -->\r\n<div class=\"split-area row h-100\" style=\"margin-top: 20px;\">\r\n\r\n  <!-- AS Split Main Container -->\r\n  <as-split class=\"pl-15 pr-15\" disabled=\"false\" direction=\"vertical\" [useTransition]=\"stockSplitConfig.useTransition\"\r\n    (dragEnd)=\"applyPageLayout($event)\" (transitionEnd)=\"applyPageLayout($event)\">\r\n\r\n    <!-- Cost Basis Split Area -->\r\n    <as-split-area [visible]=\"stockSplitConfig.stockSplitView\" [size]=\"stockSplitConfig.stockSplitSize\" order=\"1\">\r\n\r\n\r\n      <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\"\r\n        (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n      </ag-grid-angular>\r\n\r\n    </as-split-area>\r\n\r\n    <!-- Charts Split Area -->\r\n    <as-split-area [visible]=\"stockSplitConfig.detailsView\" [size]=\"stockSplitConfig.detailsSize\" order=\"2\">\r\n      <div class=\"w-100 h-100 mt-3 tabset-wrapper grid-height\">\r\n        <tabset class=\"w-100 height-45 mt-3\">\r\n          <tab class=\"h-100\" heading=\"Details\" (selectTab)=\"activeStockSplits()\">\r\n            <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" style=\"margin-top: 20px;\"\r\n              [gridOptions]=\"stockSplitDetailsGrid\" (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n            </ag-grid-angular>\r\n          </tab>\r\n\r\n          <tab heading=\"Preview\">\r\n            <app-stock-splits-preview></app-stock-splits-preview>\r\n          </tab>\r\n        </tabset>\r\n      </div>\r\n    </as-split-area>\r\n\r\n  </as-split>\r\n\r\n</div>\r\n\r\n<!-- <ag-grid-angular\r\n class=\"w-100 height-45 ag-theme-balham\"\r\n style=\"margin-top: 20px;\"\r\n [gridOptions]=\"gridOptions\"\r\n (rowSelected)=\"onRowSelected($event)\"\r\n [rowData]=\"rowData\"\r\n>\r\n</ag-grid-angular>\r\n\r\n<h4>Details</h4>\r\n\r\n<ag-grid-angular\r\n class=\"w-100 height-45 ag-theme-balham\"\r\n style=\"margin-top: 20px;\"\r\n [gridOptions]=\"stockSplitDetailsGrid\"\r\n (rowSelected)=\"onRowSelected($event)\"\r\n [rowData]=\"rowData\"\r\n>\r\n</ag-grid-angular> -->\r\n\r\n<app-create-stock-splits #stockSplitsModal (modalClose)=\"closeStockSplitModal()\">\r\n</app-create-stock-splits>\r\n\r\n<!-- Data Grid Modal Component Selector Starts -->\r\n<app-data-grid-modal #dataGridModal [gridTitle]=\"title\">\r\n</app-data-grid-modal>\r\n<!-- Data Grid Modal Component Selector Ends -->\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n\r\n<!-- Confirmation Modal Selector -->\r\n<app-confirmation-modal #confirmationModal (confirmDeletion)=\"deleteStockSplit()\" [modalTitle]=\"'Delete Stock Split'\">\r\n</app-confirmation-modal>\r\n<!-- Confirmation Modal Selector Ends -->");

/***/ }),

/***/ "./src/app/main/corporate-actions/corporate-actions.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/main/corporate-actions/corporate-actions.component.scss ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvY29ycG9yYXRlLWFjdGlvbnMuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/corporate-actions/corporate-actions.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/main/corporate-actions/corporate-actions.component.ts ***!
  \***********************************************************************/
/*! exports provided: CorporateActionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CorporateActionsComponent", function() { return CorporateActionsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");



var CorporateActionsComponent = /** @class */ (function () {
    function CorporateActionsComponent() {
        this.corporateActions = true;
        this.stockSplits = false;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["HeightStyle"])(206);
    }
    CorporateActionsComponent.prototype.ngOnInit = function () { };
    CorporateActionsComponent.prototype.activeCorporateActions = function () {
        this.corporateActions = true;
    };
    CorporateActionsComponent.prototype.activeStockSplits = function () {
        this.stockSplits = true;
    };
    CorporateActionsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-corporate-actions',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./corporate-actions.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/corporate-actions.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./corporate-actions.component.scss */ "./src/app/main/corporate-actions/corporate-actions.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], CorporateActionsComponent);
    return CorporateActionsComponent;
}());



/***/ }),

/***/ "./src/app/main/corporate-actions/corporate-actions.module.ts":
/*!********************************************************************!*\
  !*** ./src/app/main/corporate-actions/corporate-actions.module.ts ***!
  \********************************************************************/
/*! exports provided: CorporateActionsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CorporateActionsModule", function() { return CorporateActionsModule; });
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
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _corporate_actions_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./corporate-actions.component */ "./src/app/main/corporate-actions/corporate-actions.component.ts");
/* harmony import */ var _dividends_dividends_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./dividends/dividends.component */ "./src/app/main/corporate-actions/dividends/dividends.component.ts");
/* harmony import */ var _stock_splits_stock_splits_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./stock-splits/stock-splits.component */ "./src/app/main/corporate-actions/stock-splits/stock-splits.component.ts");
/* harmony import */ var _dividends_preview_preview_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./dividends/preview/preview.component */ "./src/app/main/corporate-actions/dividends/preview/preview.component.ts");
/* harmony import */ var _corporate_actions_route__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./corporate-actions.route */ "./src/app/main/corporate-actions/corporate-actions.route.ts");
/* harmony import */ var src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/app/shared.module */ "./src/app/shared.module.ts");
/* harmony import */ var _stock_splits_stock_splits_preview_stock_splits_preview_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./stock-splits/stock-splits-preview/stock-splits-preview.component */ "./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.ts");


















var corporateActionsComponents = [
    _corporate_actions_component__WEBPACK_IMPORTED_MODULE_11__["CorporateActionsComponent"],
    _dividends_dividends_component__WEBPACK_IMPORTED_MODULE_12__["DividendsComponent"],
    _stock_splits_stock_splits_component__WEBPACK_IMPORTED_MODULE_13__["StockSplitsComponent"],
    _dividends_preview_preview_component__WEBPACK_IMPORTED_MODULE_14__["PreviewComponent"],
    _stock_splits_stock_splits_preview_stock_splits_preview_component__WEBPACK_IMPORTED_MODULE_17__["StockSplitsPreviewComponent"]
];
var CorporateActionsModule = /** @class */ (function () {
    function CorporateActionsModule() {
    }
    CorporateActionsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: corporateActionsComponents.slice(),
            exports: corporateActionsComponents.concat([src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__["SharedModule"]]),
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["AlertModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TooltipModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__["TypeaheadModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"].forRoot(),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_8__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                angular_split__WEBPACK_IMPORTED_MODULE_9__["AngularSplitModule"].forRoot(),
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_corporate_actions_route__WEBPACK_IMPORTED_MODULE_15__["CorporateActionsRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_10__["LpToolkitModule"],
                src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__["SharedModule"]
            ]
        })
    ], CorporateActionsModule);
    return CorporateActionsModule;
}());



/***/ }),

/***/ "./src/app/main/corporate-actions/corporate-actions.route.ts":
/*!*******************************************************************!*\
  !*** ./src/app/main/corporate-actions/corporate-actions.route.ts ***!
  \*******************************************************************/
/*! exports provided: CorporateActionsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CorporateActionsRoutes", function() { return CorporateActionsRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _corporate_actions_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./corporate-actions.component */ "./src/app/main/corporate-actions/corporate-actions.component.ts");


var CorporateActionsRoutes = [
    {
        path: '',
        component: _corporate_actions_component__WEBPACK_IMPORTED_MODULE_1__["CorporateActionsComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/corporate-actions/dividends/dividends.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/main/corporate-actions/dividends/dividends.component.scss ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("::ng-deep .rightAlign {\n  text-align: right;\n}\n\n::ng-deep .tabset-wrapper .tab-content {\n  height: 100% !important;\n}\n\n.grid-height {\n  height: calc(100% - 84px) !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9jb3Jwb3JhdGUtYWN0aW9ucy9kaXZpZGVuZHMvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXGZyb250ZW5kYXBwL3NyY1xcYXBwXFxtYWluXFxjb3Jwb3JhdGUtYWN0aW9uc1xcZGl2aWRlbmRzXFxkaXZpZGVuZHMuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvZGl2aWRlbmRzL2RpdmlkZW5kcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0FDQ0o7O0FERUE7RUFDRSx1QkFBQTtBQ0NGOztBREVBO0VBQ0Usb0NBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvZGl2aWRlbmRzL2RpdmlkZW5kcy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIjo6bmctZGVlcCAucmlnaHRBbGlnbiB7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuICB9XHJcblxyXG46Om5nLWRlZXAgLnRhYnNldC13cmFwcGVyIC50YWItY29udGVudCB7XHJcbiAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5ncmlkLWhlaWdodCB7XHJcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSA4NHB4KSAhaW1wb3J0YW50O1xyXG59XHJcbiIsIjo6bmctZGVlcCAucmlnaHRBbGlnbiB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG46Om5nLWRlZXAgLnRhYnNldC13cmFwcGVyIC50YWItY29udGVudCB7XG4gIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xufVxuXG4uZ3JpZC1oZWlnaHQge1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDg0cHgpICFpbXBvcnRhbnQ7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/corporate-actions/dividends/dividends.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/main/corporate-actions/dividends/dividends.component.ts ***!
  \*************************************************************************/
/*! exports provided: DividendsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DividendsComponent", function() { return DividendsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/Component/grid-layout-menu/grid-layout-menu.component */ "./src/shared/Component/grid-layout-menu/grid-layout-menu.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../../../../services/corporate-actions.api.service */ "./src/services/corporate-actions.api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/Modal/create-dividend/create-dividend.component */ "./src/shared/Modal/create-dividend/create-dividend.component.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");















var DividendsComponent = /** @class */ (function () {
    function DividendsComponent(cdRef, cacheService, corporateActionsApiService, toastrService, securityApiService) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.corporateActionsApiService = corporateActionsApiService;
        this.toastrService = toastrService;
        this.securityApiService = securityApiService;
        this.isLoading = false;
        this.filterBySymbol = '';
        this.createDividend = false;
        this.toBeDeletedDividend = null;
        this.dividendConfig = {
            dividendSize: 50,
            detailsSize: 50,
            dividendView: true,
            detailsView: false,
            useTransition: true
        };
        this.hideGrid = false;
    }
    DividendsComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getDividends();
    };
    DividendsComponent.prototype.ngAfterViewInit = function () {
        this.initPageLayout();
    };
    DividendsComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dividendConfigKey);
        if (config) {
            this.dividendConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    DividendsComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.dividendConfig.dividendSize = event.sizes[0];
            this.dividendConfig.detailsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dividendConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dividendConfigKey,
            value: JSON.stringify(this.dividendConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["LayoutConfig"].dividendConfigKey
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
    DividendsComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_3__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            /* Custom Method Binding for External Filters from Grid Layout Component */
            isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            getExternalFilterState: this.getExternalFilterState.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            onCellClicked: this.rowSelected.bind(this),
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            columnDefs: [
                {
                    field: 'id',
                    width: 120,
                    headerName: 'Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
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
                    field: 'notice_date',
                    headerName: 'Notice Date',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'execution_date',
                    headerName: 'Execution Date',
                    sortable: true,
                    filter: true,
                    width: 100,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'record_date',
                    headerName: 'Record Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'pay_date',
                    headerName: 'Pay Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'rate',
                    headerName: 'Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'currency',
                    headerName: 'Currency',
                    width: 100,
                    filter: true,
                    sortable: true
                },
                {
                    field: 'withholding_rate',
                    headerName: 'Holding Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'fx_rate',
                    headerName: 'Fx Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'active_flag',
                    headerName: 'Active Flag',
                    width: 100,
                    filter: true,
                    sortable: true,
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.dividendDetailsGrid = {
            rowData: [],
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_3__["GridLayoutMenuComponent"] },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'after',
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.dividendDetailsGrid.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            columnDefs: [
                {
                    field: 'id',
                    width: 120,
                    headerName: 'Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
                {
                    field: 'fund',
                    headerName: 'Fund',
                    width: 100,
                    enableRowGroup: true,
                    filter: true,
                    sortable: true
                },
                {
                    field: 'symbol',
                    width: 120,
                    headerName: 'Symbol',
                    enableRowGroup: true,
                    sortable: true,
                    filter: true,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'quantity',
                    width: 120,
                    headerName: 'Quantity',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'execution_date',
                    headerName: 'Execution Date',
                    sortable: true,
                    sort: 'asc',
                    filter: true,
                    width: 100,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'fx_rate',
                    headerName: 'Fx Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'currency',
                    headerName: 'Currency',
                    width: 100,
                    filter: true,
                    sortable: true
                },
                {
                    field: 'base_gross_dividend',
                    headerName: 'Base Gross Dividend',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'base_withholding_amount',
                    headerName: 'Base Withholding Amount',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'base_net_dividend',
                    headerName: 'Base Net Dividend',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'settlement_gross_dividend',
                    headerName: 'Settlement Gross Dividend',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'settlement_withholdings_amount',
                    headerName: 'Settlement Withholding Amount',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'settlement_local_net_dividend',
                    headerName: 'Settlement Local Net Dividend',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    cellClassRules: {
                        footerRow: function (params) {
                            if (params.node.rowPinned) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                {
                    field: 'active_flag',
                    headerName: 'Active Flag',
                    width: 100,
                    filter: true,
                    sortable: true,
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridId"].dividendsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridName"].dividends, this.gridOptions);
    };
    DividendsComponent.prototype.getDividends = function () {
        var _this = this;
        this.corporateActionsApiService.getDividends().subscribe(function (response) {
            if (response.statusCode === 200) {
                _this.data = response.payload;
                _this.gridOptions.api.sizeColumnsToFit();
                _this.gridOptions.api.setRowData(_this.data);
                _this.gridOptions.api.expandAll();
            }
            else {
                _this.toastrService.error(response.Message);
            }
        }, function (err) {
            _this.toastrService.error("The request failed");
            _this.gridOptions.api.hideOverlay();
        });
    };
    DividendsComponent.prototype.getDividendDetails = function (id, executionDate) {
        var _this = this;
        this.dividendConfig.detailsView = true;
        this.dividendDetailsGrid.api.showLoadingOverlay();
        this.corporateActionsApiService.getDividendDetails(executionDate, id).subscribe(function (response) {
            if (response.statusCode === 200) {
                var dividendDetail = response.payload;
                _this.dividendDetailsGrid.api.sizeColumnsToFit();
                _this.setPinnedBottomRowData(dividendDetail);
                _this.dividendDetailsGrid.api.setRowData(dividendDetail);
                _this.dividendDetailsGrid.api.expandAll();
            }
            else {
                _this.toastrService.error(response.Message);
            }
        }, function (err) {
            _this.dividendDetailsGrid.api.hideOverlay();
            _this.toastrService.error("The request failed");
        });
    };
    DividendsComponent.prototype.openEditModal = function (data) {
        this.dividendModal.openModal(data);
    };
    DividendsComponent.prototype.openDividendModal = function () {
        this.dividendModal.openModal(null);
    };
    DividendsComponent.prototype.closeDividendModal = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.dividendDetailsGrid.api.setRowData([]);
        this.getDividends();
    };
    DividendsComponent.prototype.rowSelected = function (row) {
        var id = row.data.id;
        var execution_date = row.data.execution_date;
        // let node;
        // this.dividendDetailsGrid.api.forEachLeafNode(rowNode => {
        //   if (rowNode.data.id === id) {
        //     rowNode.setSelected(true);
        //     node = rowNode;
        //   } else {
        //     rowNode.setSelected(false);
        //   }
        // });
        // if (node) {
        //   this.dividendConfig.detailsView = true;
        //   this.dividendDetailsGrid.api.ensureIndexVisible(node.rowIndex);
        // }
        this.getDividendDetails(id, execution_date);
    };
    /////////// External Filters Code //////////////
    DividendsComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    DividendsComponent.prototype.onFilterChanged = function () {
        // this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    DividendsComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    DividendsComponent.prototype.ngModelChangeDates = function (e) {
        if (!this.selected.startDate) {
            return;
        }
        this.startDate = e.startDate;
        this.endDate = e.endDate;
        this.gridOptions.api.onFilterChanged();
    };
    DividendsComponent.prototype.isExternalFilterPassed = function (object) {
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.gridOptions.api.onFilterChanged();
    };
    DividendsComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    DividendsComponent.prototype.isExternalFilterPresent = function () {
        if (this.filterBySymbol !== '' || this.startDate) {
            return true;
        }
    };
    DividendsComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '' && this.startDate) {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            var cellDate = new Date(node.data.execution_date);
            return (cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
                this.startDate.toDate() <= cellDate &&
                this.endDate.toDate() >= cellDate);
        }
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        if (this.startDate !== '') {
            var cellDate = new Date(node.data.execution_date);
            return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
        }
        return true;
    };
    DividendsComponent.prototype.getExternalFilterState = function () {
        return {
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    DividendsComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.dividendConfig.detailsView = false;
        this.dividendDetailsGrid.api.setRowData([]);
        this.dividendDetailsGrid.api.showLoadingOverlay();
        this.getDividends();
    };
    DividendsComponent.prototype.setPinnedBottomRowData = function (data) {
        this.pinnedBottomRowData = [
            {
                fund: '',
                symbol: 'Total: ',
                quantity: undefined,
                execution_date: undefined,
                fx_rate: undefined,
                currency: '',
                base_gross_dividend: this.sum(data, "base_gross_dividend"),
                base_withholding_amount: this.sum(data, "base_withholding_amount"),
                base_net_dividend: this.sum(data, "base_net_dividend"),
                settlement_gross_dividend: this.sum(data, "settlement_gross_dividend"),
                settlement_withholdings_amount: this.sum(data, "settlement_withholdings_amount"),
                settlement_local_net_dividend: this.sum(data, "settlement_local_net_dividend"),
            }
        ];
        this.dividendDetailsGrid.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    DividendsComponent.prototype.sum = function (items, prop) {
        return items.reduce(function (a, b) {
            return Math.abs(a + b[prop]);
        }, 0);
    };
    DividendsComponent.prototype.clearFilters = function () {
        this.selected = null;
        this.filterBySymbol = '';
        this.dividendConfig.detailsView = false;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_7__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_7__();
        this.gridOptions.api.setRowData([]);
        this.dividendDetailsGrid.api.setRowData([]);
    };
    /////////// End External Filters Code //////////////
    DividendsComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Edit',
                action: function () {
                    _this.openEditModal(params.node.data);
                }
            },
            {
                name: 'Delete',
                action: function () {
                    _this.openDeleteDividendModal(params.node.data.id);
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
                        },
                    }
                ]
            }
        ];
        var addCustomItems = [];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_5__["GetContextMenu"])(false, addDefaultItems, false, addCustomItems, params);
    };
    DividendsComponent.prototype.openDeleteDividendModal = function (id) {
        this.toBeDeletedDividend = id;
        this.confirmationModal.showModal();
    };
    DividendsComponent.prototype.deleteDividend = function () {
        var _this = this;
        this.corporateActionsApiService.deleteDividend(this.toBeDeletedDividend).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Dividend deleted successfully!');
                _this.closeDividendModal();
            }
            else {
                _this.toastrService.error('Failed to delete Dividend!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    DividendsComponent.prototype.openDataGridModal = function (rowNode) {
        var _this = this;
        var id = rowNode.node.data.id;
        this.corporateActionsApiService.getDividendDetail(id).subscribe(function (response) {
            if (response.statusCode === 200) {
                var payload = response.payload;
                var columns = _this.getAuditColDefs();
                var modifiedCols = columns.map(function (col) {
                    return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, col, { editable: false });
                });
                _this.title = 'Dividend Audit Trail';
                _this.dataGridModal.openModal(modifiedCols, payload);
            }
        }, function (err) {
        });
    };
    DividendsComponent.prototype.getAuditColDefs = function () {
        return [
            {
                field: 'id',
                width: 120,
                headerName: 'Id',
                sortable: true,
                filter: true,
                hide: true
            },
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
                field: 'notice_date',
                headerName: 'Notice Date',
                sortable: true,
                filter: true,
                width: 120
            },
            {
                field: 'execution_date',
                headerName: 'Execution Date',
                sortable: true,
                filter: true,
                width: 100
            },
            {
                field: 'record_date',
                headerName: 'Record Date',
                width: 100,
                filter: true,
                sortable: true
            },
            {
                field: 'pay_date',
                headerName: 'Pay Date',
                width: 100,
                filter: true,
                sortable: true
            },
            {
                field: 'rate',
                headerName: 'Rate',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: moneyFormatter
            },
            {
                field: 'currency',
                headerName: 'Currency',
                width: 100,
                filter: true,
                sortable: true
            },
            {
                field: 'withholding_rate',
                headerName: 'Holding Rate',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: moneyFormatter
            },
            {
                field: 'fx_rate',
                headerName: 'Fx Rate',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: moneyFormatter
            },
            {
                field: 'active_flag',
                headerName: 'Active Flag',
                width: 100,
                filter: true,
                sortable: true,
                hide: true
            }
        ];
    };
    DividendsComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__["CacheService"] },
        { type: _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__["CorporateActionsApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_9__["ToastrService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dividendModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_12__["CreateDividendComponent"])
    ], DividendsComponent.prototype, "dividendModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_13__["DataGridModalComponent"])
    ], DividendsComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_4__["CreateSecurityComponent"])
    ], DividendsComponent.prototype, "securityModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_14__["ConfirmationModalComponent"])
    ], DividendsComponent.prototype, "confirmationModal", void 0);
    DividendsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dividends',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./dividends.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/dividends.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./dividends.component.scss */ "./src/app/main/corporate-actions/dividends/dividends.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_8__["CacheService"],
            _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__["CorporateActionsApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_9__["ToastrService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_11__["SecurityApiService"]])
    ], DividendsComponent);
    return DividendsComponent;
}());

function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["MoneyFormat"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["CommaSeparatedFormat"])(params.value);
}
function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["DateFormatter"])(params.value);
}
function priceFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["FormatNumber4"])(params.value);
}


/***/ }),

/***/ "./src/app/main/corporate-actions/dividends/preview/preview.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/main/corporate-actions/dividends/preview/preview.component.scss ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvZGl2aWRlbmRzL3ByZXZpZXcvcHJldmlldy5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/corporate-actions/dividends/preview/preview.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/main/corporate-actions/dividends/preview/preview.component.ts ***!
  \*******************************************************************************/
/*! exports provided: PreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreviewComponent", function() { return PreviewComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var PreviewComponent = /** @class */ (function () {
    function PreviewComponent() {
    }
    PreviewComponent.prototype.ngOnInit = function () {
    };
    PreviewComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-preview',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./preview.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/dividends/preview/preview.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./preview.component.scss */ "./src/app/main/corporate-actions/dividends/preview/preview.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PreviewComponent);
    return PreviewComponent;
}());



/***/ }),

/***/ "./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.scss":
/*!**************************************************************************************************************!*\
  !*** ./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.scss ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvc3RvY2stc3BsaXRzL3N0b2NrLXNwbGl0cy1wcmV2aWV3L3N0b2NrLXNwbGl0cy1wcmV2aWV3LmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.ts":
/*!************************************************************************************************************!*\
  !*** ./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.ts ***!
  \************************************************************************************************************/
/*! exports provided: StockSplitsPreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockSplitsPreviewComponent", function() { return StockSplitsPreviewComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var StockSplitsPreviewComponent = /** @class */ (function () {
    function StockSplitsPreviewComponent() {
    }
    StockSplitsPreviewComponent.prototype.ngOnInit = function () {
    };
    StockSplitsPreviewComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-stock-splits-preview',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./stock-splits-preview.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./stock-splits-preview.component.scss */ "./src/app/main/corporate-actions/stock-splits/stock-splits-preview/stock-splits-preview.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], StockSplitsPreviewComponent);
    return StockSplitsPreviewComponent;
}());



/***/ }),

/***/ "./src/app/main/corporate-actions/stock-splits/stock-splits.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/main/corporate-actions/stock-splits/stock-splits.component.scss ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("::ng-deep .rightAlign {\n  text-align: right;\n}\n\n.grid-height {\n  height: calc(100% - 84px) !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9jb3Jwb3JhdGUtYWN0aW9ucy9zdG9jay1zcGxpdHMvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXGZyb250ZW5kYXBwL3NyY1xcYXBwXFxtYWluXFxjb3Jwb3JhdGUtYWN0aW9uc1xcc3RvY2stc3BsaXRzXFxzdG9jay1zcGxpdHMuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vY29ycG9yYXRlLWFjdGlvbnMvc3RvY2stc3BsaXRzL3N0b2NrLXNwbGl0cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0FDQ0o7O0FERUM7RUFDQyxvQ0FBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9jb3Jwb3JhdGUtYWN0aW9ucy9zdG9jay1zcGxpdHMvc3RvY2stc3BsaXRzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIH1cclxuXHJcbiAuZ3JpZC1oZWlnaHQge1xyXG4gIGhlaWdodDogY2FsYygxMDAlIC0gODRweCkgIWltcG9ydGFudDtcclxufVxyXG4iLCI6Om5nLWRlZXAgLnJpZ2h0QWxpZ24ge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLmdyaWQtaGVpZ2h0IHtcbiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSA4NHB4KSAhaW1wb3J0YW50O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/corporate-actions/stock-splits/stock-splits.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/main/corporate-actions/stock-splits/stock-splits.component.ts ***!
  \*******************************************************************************/
/*! exports provided: StockSplitsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockSplitsComponent", function() { return StockSplitsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/Component/grid-layout-menu/grid-layout-menu.component */ "./src/shared/Component/grid-layout-menu/grid-layout-menu.component.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/Modal/create-stock-splits/create-stock-splits.component */ "./src/shared/Modal/create-stock-splits/create-stock-splits.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Component/data-grid-modal/data-grid-modal.component */ "./src/shared/Component/data-grid-modal/data-grid-modal.component.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/common/cache.service */ "./src/services/common/cache.service.ts");
/* harmony import */ var _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../../../../services/corporate-actions.api.service */ "./src/services/corporate-actions.api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");















var StockSplitsComponent = /** @class */ (function () {
    function StockSplitsComponent(cdRef, cacheService, corporateActionsApiService, securityApiService, toastrService) {
        this.cdRef = cdRef;
        this.cacheService = cacheService;
        this.corporateActionsApiService = corporateActionsApiService;
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        this.isLoading = false;
        this.filterBySymbol = '';
        this.createDividend = false;
        this.toBeDeletedStockSplit = null;
        this.stockSplitConfig = {
            stockSplitSize: 50,
            detailsSize: 50,
            stockSplitView: true,
            detailsView: false,
            useTransition: true
        };
        this.hideGrid = false;
    }
    StockSplitsComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getStockSplits();
    };
    StockSplitsComponent.prototype.ngAfterViewInit = function () {
        this.initPageLayout();
    };
    StockSplitsComponent.prototype.initPageLayout = function () {
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].stockSplitsConfigKey);
        if (config) {
            this.stockSplitConfig = JSON.parse(config.value);
        }
        this.cdRef.detectChanges();
    };
    StockSplitsComponent.prototype.applyPageLayout = function (event) {
        if (event.sizes) {
            this.stockSplitConfig.stockSplitSize = event.sizes[0];
            this.stockSplitConfig.detailsSize = event.sizes[1];
        }
        var persistUIState = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].persistUIState);
        if (!persistUIState || !JSON.parse(persistUIState.value)) {
            return;
        }
        var config = this.cacheService.getConfigByKey(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].stockSplitsConfigKey);
        var payload = {
            id: !config ? 0 : config.id,
            project: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].projectName,
            uom: 'JSON',
            key: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].stockSplitsConfigKey,
            value: JSON.stringify(this.stockSplitConfig),
            description: src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["LayoutConfig"].stockSplitsConfigKey
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
    StockSplitsComponent.prototype.getStockSplits = function () {
        var _this = this;
        this.corporateActionsApiService.getStockSplits().subscribe(function (response) {
            _this.gridOptions.api.hideOverlay();
            if (response.statusCode === 200) {
                _this.data = response.payload.map(function (obj) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, obj, { ratio: obj.top_ratio + '' + '/' + obj.bottom_ratio })); });
                _this.gridOptions.api.sizeColumnsToFit();
                _this.gridOptions.api.setRowData(_this.data);
                _this.gridOptions.api.expandAll();
            }
            else {
                _this.toastrService.error(response.Message);
            }
        }, function (err) {
            _this.gridOptions.api.hideOverlay();
        });
    };
    StockSplitsComponent.prototype.getStockSplitDetails = function (id) {
        var _this = this;
        this.stockSplitConfig.detailsView = true;
        this.stockSplitDetailsGrid.api.showLoadingOverlay();
        this.corporateActionsApiService.getStockSplitDetails(id).subscribe(function (response) {
            if (response.statusCode === 200) {
                var stockSplitDetail = response.payload;
                _this.stockSplitDetailsGrid.api.setRowData(stockSplitDetail);
                _this.stockSplitDetailsGrid.api.sizeColumnsToFit();
                _this.stockSplitDetailsGrid.api.expandAll();
            }
            else {
                _this.toastrService.error(response.Message);
            }
        }, function (err) {
            _this.toastrService.error("The request failed");
            _this.stockSplitDetailsGrid.api.hideOverlay();
        });
    };
    StockSplitsComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            onFilterChanged: this.onFilterChanged.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            /* Custom Method Binding to Clear External Filters from Grid Layout Component */
            isExternalFilterPassed: this.isExternalFilterPassed.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            getExternalFilterState: this.getExternalFilterState.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            onCellClicked: this.rowSelected.bind(this),
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            columnDefs: [
                {
                    field: 'id',
                    width: 120,
                    headerName: 'Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
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
                    field: 'notice_date',
                    headerName: 'Notice Date',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'execution_date',
                    headerName: 'Execution Date',
                    sortable: true,
                    filter: true,
                    width: 100,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'top_ratio',
                    headerName: 'Top Ratio',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    hide: true
                },
                {
                    field: 'bottom_ratio',
                    headerName: 'Bottom Ratio',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    hide: true,
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'ratio',
                    headerName: 'Ratio',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign'
                },
                {
                    field: 'adjustment_factor',
                    headerName: 'Adjustment Factor',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'active_flag',
                    headerName: 'Active Flag',
                    width: 100,
                    filter: true,
                    sortable: true,
                    hide: true
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.stockSplitDetailsGrid = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'after',
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.stockSplitDetailsGrid.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                // AutoSizeAllColumns(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            columnDefs: [
                {
                    field: 'id',
                    width: 120,
                    headerName: 'Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
                {
                    field: 'fund',
                    headerName: 'Portfolio',
                    width: 100,
                    rowGroup: true,
                    enableRowGroup: true,
                    filter: true,
                    sortable: true
                },
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
                    field: 'pre_split_quantity',
                    width: 120,
                    headerName: 'Pre-Split-Quantity',
                    sortable: true,
                    filter: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'post_split_quantity',
                    headerName: 'Post-Split-Quantity',
                    sortable: true,
                    filter: true,
                    width: 100,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'cost_basis_pre_split',
                    headerName: 'Cost Basis(Pre-Split)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'cost_basis_post_split',
                    headerName: 'Cost Basis(Post-Split)',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'pre_split_investment_at_cost',
                    headerName: 'Pre-Split Investment at cost',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter,
                    aggFunc: 'sum'
                },
                {
                    field: 'post_split_investment_at_cost',
                    headerName: 'Post-Spli Investment at Cost',
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
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].stockSplitsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].stockSplits, this.gridOptions);
    };
    StockSplitsComponent.prototype.openEditModal = function (data) {
        this.stockSplitsModal.openModal(data);
    };
    StockSplitsComponent.prototype.openStockSplitModal = function () {
        this.stockSplitsModal.openModal(null);
    };
    StockSplitsComponent.prototype.closeStockSplitModal = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.getStockSplits();
        this.stockSplitDetailsGrid.api.setRowData([]);
    };
    StockSplitsComponent.prototype.deleteStockSplit = function () {
        var _this = this;
        this.corporateActionsApiService.deleteStockSplit(this.toBeDeletedStockSplit).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Stock Split deleted successfully!');
                _this.closeStockSplitModal();
            }
            else {
                _this.toastrService.error('Failed to delete Dividend!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    StockSplitsComponent.prototype.rowSelected = function (row) {
        var id = row.data.id;
        // let node;
        // this.stockSplitDetailsGrid.api.forEachLeafNode(rowNode => {
        //   if (rowNode.data.id === id) {
        //     rowNode.setSelected(true);
        //     node = rowNode;
        //   } else {
        //     rowNode.setSelected(false);
        //   }
        // });
        // if (node) {
        //   this.stockSplitConfig.detailsView = true;
        //   this.stockSplitDetailsGrid.api.ensureIndexVisible(node.rowIndex);
        // }
        this.getStockSplitDetails(id);
    };
    /////////// External Filters Code //////////////
    StockSplitsComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    StockSplitsComponent.prototype.onFilterChanged = function () {
        // this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    StockSplitsComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    StockSplitsComponent.prototype.ngModelChangeDates = function (e) {
        if (!this.selected.startDate) {
            return;
        }
        this.startDate = e.startDate;
        this.endDate = e.endDate;
        this.gridOptions.api.onFilterChanged();
    };
    StockSplitsComponent.prototype.isExternalFilterPassed = function (object) {
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.gridOptions.api.onFilterChanged();
    };
    StockSplitsComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    StockSplitsComponent.prototype.isExternalFilterPresent = function () {
        if (this.filterBySymbol !== '' || this.startDate) {
            return true;
        }
    };
    StockSplitsComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '' && this.startDate) {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            var cellDate = new Date(node.data.execution_date);
            return (cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
                this.startDate.toDate() <= cellDate &&
                this.endDate.toDate() >= cellDate);
        }
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        if (this.startDate !== '') {
            var cellDate = new Date(node.data.execution_date);
            return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
        }
        return true;
    };
    StockSplitsComponent.prototype.getExternalFilterState = function () {
        return {
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    StockSplitsComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.stockSplitDetailsGrid.api.showLoadingOverlay();
        this.getStockSplits();
        this.stockSplitDetailsGrid.api.setRowData([]);
        this.stockSplitConfig.detailsView = false;
    };
    StockSplitsComponent.prototype.clearFilters = function () {
        this.selected = null;
        this.filterBySymbol = '';
        this.stockSplitConfig.detailsView = false;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_8__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_8__();
        this.gridOptions.api.setRowData([]);
        this.stockSplitDetailsGrid.api.setRowData([]);
    };
    /////////// End External Filters Code //////////////
    StockSplitsComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [{
                name: 'Edit',
                action: function () {
                    _this.openEditModal(params.node.data);
                }
            },
            {
                name: 'Delete',
                action: function () {
                    _this.openDeleteDividendModal(params.node.data.id);
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
                        },
                    }
                ]
            },
        ];
        var addCustomItems = [];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__["GetContextMenu"])(false, addDefaultItems, false, addCustomItems, params);
    };
    StockSplitsComponent.prototype.openDeleteDividendModal = function (id) {
        this.toBeDeletedStockSplit = id;
        this.confirmationModal.showModal();
    };
    StockSplitsComponent.prototype.openDataGridModal = function (rowNode) {
        var _this = this;
        var id = rowNode.node.data.id;
        this.corporateActionsApiService.getStockSplitAudit(id).subscribe(function (response) {
            var payload = response.payload;
            var columns = _this.getAuditColDefs();
            var modifiedCols = columns.map(function (col) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, col, { editable: false });
            });
            _this.title = 'Stock Split Audit Trail';
            _this.dataGridModal.openModal(modifiedCols, payload);
        });
    };
    StockSplitsComponent.prototype.getAuditColDefs = function () {
        return [
            {
                field: 'id',
                width: 120,
                headerName: 'Id',
                sortable: true,
                filter: true,
                hide: true
            },
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
                field: 'notice_date',
                headerName: 'Notice Date',
                sortable: true,
                filter: true,
                width: 120
            },
            {
                field: 'execution_date',
                headerName: 'Execution Date',
                sortable: true,
                filter: true,
                width: 100
            },
            {
                field: 'top_ratio',
                headerName: 'Top Ratio',
                width: 100,
                filter: true,
                sortable: true
            },
            {
                field: 'bottom_ratio',
                headerName: 'Bottom Ratio',
                width: 100,
                filter: true,
                sortable: true
            },
            {
                field: 'adjustment_factor',
                headerName: 'Adjustment Factor',
                width: 100,
                filter: true,
                sortable: true,
                cellClass: 'rightAlign',
                valueFormatter: moneyFormatter
            },
            {
                field: 'active_flag',
                headerName: 'Active Flag',
                width: 100,
                filter: true,
                sortable: true,
                hide: true
            }
        ];
    };
    StockSplitsComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_9__["CacheService"] },
        { type: _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__["CorporateActionsApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_14__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_13__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('stockSplitsModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_5__["CreateStockSplitsComponent"])
    ], StockSplitsComponent.prototype, "stockSplitsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataGridModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_grid_modal_data_grid_modal_component__WEBPACK_IMPORTED_MODULE_7__["DataGridModalComponent"])
    ], StockSplitsComponent.prototype, "dataGridModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_6__["CreateSecurityComponent"])
    ], StockSplitsComponent.prototype, "securityModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_12__["ConfirmationModalComponent"])
    ], StockSplitsComponent.prototype, "confirmationModal", void 0);
    StockSplitsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-stock-splits',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./stock-splits.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/corporate-actions/stock-splits/stock-splits.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./stock-splits.component.scss */ "./src/app/main/corporate-actions/stock-splits/stock-splits.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            src_services_common_cache_service__WEBPACK_IMPORTED_MODULE_9__["CacheService"],
            _services_corporate_actions_api_service__WEBPACK_IMPORTED_MODULE_10__["CorporateActionsApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_14__["SecurityApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_13__["ToastrService"]])
    ], StockSplitsComponent);
    return StockSplitsComponent;
}());

function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["MoneyFormat"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["CommaSeparatedFormat"])(params.value);
}
function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["DateFormatter"])(params.value);
}
function priceFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_11__["FormatNumber4"])(params.value);
}


/***/ })

}]);
//# sourceMappingURL=main-corporate-actions-corporate-actions-module.js.map