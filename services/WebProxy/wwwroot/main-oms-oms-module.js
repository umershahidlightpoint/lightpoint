(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-oms-oms-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/accruals/accruals.component.html":
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/accruals/accruals.component.html ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<tabset>\r\n  <tab heading=\"OMS Accruals\">\r\n    <div [ngStyle]=\"style\">\r\n      <div class=\"clearfix\"></div>\r\n      <div [ngStyle]=\"styleForHeight\">\r\n        <ag-grid-angular class=\"w-100 height-45 ag-theme-balham\" [gridOptions]=\"gridOptions\"\r\n          (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n        </ag-grid-angular>\r\n\r\n        <h4>Allocations</h4>\r\n        <ag-grid-angular class=\"w-100 height-45 ag-theme-balham\" [gridOptions]=\"allocationsGridOptions\"\r\n          [rowData]=\"allocationsData\">\r\n        </ag-grid-angular>\r\n\r\n      </div>\r\n    </div>\r\n  </tab>\r\n</tabset>\r\n\r\n<app-data-modal #dataModal [title]=\"title\">\r\n</app-data-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/journal-allocation/journal-allocation.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/journal-allocation/journal-allocation.component.html ***!
  \*********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<tabset>\r\n  <tab heading=\"Ops Blotter Journal / Allocation\">\r\n    <div [ngStyle]=\"style\">\r\n      <div class=\"clearfix\"></div>\r\n      <div #divToMeasure>\r\n        <div [ngStyle]=\"styleForHeight\">\r\n          <app-trades [tradeType]=\"'opsblotter'\"></app-trades>\r\n          <div class=\"w-100 height-45 d-flex\">\r\n            <div class=\"col-6 p-0\">\r\n              <app-allocations></app-allocations>\r\n            </div>\r\n            <div class=\"col-6 p-0\">\r\n              <app-journals></app-journals>\r\n            </div>\r\n          </div>\r\n\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </tab>\r\n</tabset>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/securities.component.html":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/securities.component.html ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\r\n  <tabset>\r\n    <tab heading=\"Security Details\">\r\n      <div [ngStyle]=\"style\">\r\n        <div [ngStyle]=\"styleForHeight\">\r\n            <app-security-details></app-security-details>\r\n        </div>\r\n      </div>\r\n    </tab>\r\n  </tabset>\r\n\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/security-details/security-details.component.html":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/security-details/security-details.component.html ***!
  \****************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\r\n  <!-- Loader -->\r\n<div *ngIf=\"isLoading\" class=\"loader-wrapper mtop-15\">\r\n  <lp-loading></lp-loading>\r\n  <!-- Loader -->\r\n</div>\r\n\r\n<!-- <div [hidden]=\"isLoading\"> -->\r\n\r\n  <div [hidden]=\"isLoading\" class=\"row\">\r\n\r\n    <!-- Symbol Filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n    <!-- Symbol Filter Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <!-- <form>\r\n        <input ngxDaterangepickerMd\r\n            class=\"form-control\"\r\n            type=\"text\"\r\n            placeholder=\"Choose date\"\r\n            [(ngModel)]=\"selected\"\r\n            (ngModelChange)=\"ngModelChangeDates($event)\"\r\n            name=\" selected\"\r\n            [autoApply]=\"true\"\r\n            [alwaysShowCalendars]=\"true\"\r\n            [keepCalendarOpeningWithRange]=\"true\"\r\n           />\r\n      </form> -->\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" value=\"clear\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Util Buttons Div Starts -->\r\n    <div class=\"col-auto ml-auto\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" value=\"refresh\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i></button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button class=\"btn btn-pa\" type=\"button\" value=\"showModal\" (click)=\"openSecurityModal()\" tooltip=\"Create Security\"\r\n          placement=\"top\">\r\n          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n        </button>\r\n      </div>\r\n\r\n    <!-- Expand/Collapse Button -->\r\n      <!-- <div class=\"mr-3 d-inline-block\">\r\n        <ng-template #tooltipTemplate>{{dividendScreenRatio.detailsView ? 'Expand' : 'Collapse'}}</ng-template>\r\n        <button (click)=\"dividendScreenRatio.detailsView = !dividendScreenRatio.detailsView\" class=\"btn btn-pa\"\r\n          [tooltip]=\"tooltipTemplate\" placement=\"top\">\r\n          <i class=\"fa\"\r\n            [ngClass]=\"{'fa-arrow-right': dividendScreenRatio.detailsView, 'fa-arrow-left': !dividendScreenRatio.detailsView}\"></i>\r\n        </button>\r\n      </div> -->\r\n\r\n    </div>\r\n    <!-- Util Buttons Div Ends -->\r\n\r\n  </div>\r\n\r\n  <!-- Main Split Row Starts -->\r\n<div [hidden]=\"isLoading\" class=\"row h-100\" style=\"margin-top: 20px;\">\r\n\r\n  <ag-grid-angular\r\n    class=\"w-100 h-100 ag-theme-balham\"\r\n    [gridOptions]=\"gridOptions\"\r\n    (rowSelected)=\"onRowSelected($event)\"\r\n    [rowData]=\"rowData\"\r\n   >\r\n  </ag-grid-angular>\r\n\r\n  </div>\r\n  <!-- </div> -->\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n<!-- Confirmation Modal Selector -->\r\n<app-confirmation-modal #confirmationModal (confirmDeletion)=\"deleteSecurityExtend()\" [modalTitle]=\"'Delete Security Extended'\">\r\n</app-confirmation-modal>\r\n<!-- Confirmation Modal Selector Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/allocations/allocations.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/allocations/allocations.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<h4>Allocations</h4>\r\n<ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"allocationsGridOptions\" [rowData]=\"allocationsData\">\r\n</ag-grid-angular>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/trades/trades.component.html":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/trades/trades.component.html ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row mb-3\">\r\n    <div class=\"col-auto\">\r\n        <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n            (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n</div>\r\n<ag-grid-angular class=\"w-100 height-40 ag-theme-balham\" [gridOptions]=\"gridOptions\"\r\n    (rowSelected)=\"onRowSelected($event)\" [rowData]=\"rowData\">\r\n</ag-grid-angular>\r\n\r\n<app-data-modal #dataModal [title]=\"title\">\r\n</app-data-modal>\r\n\r\n<app-create-dividend #dividendModal (modalClose)=\"closeDividendModal()\">\r\n</app-create-dividend>\r\n\r\n<app-create-stock-splits #stockSplitsModal (modalClose)=\"closeStockSplitModal()\">\r\n</app-create-stock-splits>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>\r\n\r\n<app-exclude-trade #tradeExclusionModal (refreshData)=\"refreshGrid()\"></app-exclude-trade>\r\n\r\n<app-confirmation-modal #confirmationModal (confirmDeletion)=\"reverseTradeExclusion()\" (cancelEvent)=\"cancelTradeExclusionReversal()\" [modalTitle]=\"'Reverse Trade Exclusion'\">\r\n</app-confirmation-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/trade-allocation/trade-allocation.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/trade-allocation/trade-allocation.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<tabset>\r\n  <tab heading=\"OMS Trade History\">\r\n    <div [ngStyle]=\"style\">\r\n      <div class=\"clearfix\"></div>\r\n      <div [ngStyle]=\"styleForHeight\">\r\n        <app-trades [tradeType]=\"'trade'\"></app-trades>\r\n        <div class=\"d-flex w-100 height-45\">\r\n          <div class=\"col-6 p-0\">\r\n            <app-allocations></app-allocations>\r\n          </div>\r\n          <div class=\"col-6 p-0\">\r\n            <app-journals></app-journals>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </tab>\r\n</tabset>");

/***/ }),

/***/ "./src/app/main/oms/accruals/accruals.component.scss":
/*!***********************************************************!*\
  !*** ./src/app/main/oms/accruals/accruals.component.scss ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body, html {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vbXMvYWNjcnVhbHMvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXGZyb250ZW5kYXBwL3NyY1xcYXBwXFxtYWluXFxvbXNcXGFjY3J1YWxzXFxhY2NydWFscy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9vbXMvYWNjcnVhbHMvYWNjcnVhbHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxTQUFBO0VBQVcsVUFBQTtFQUFZLFlBQUE7QUNHM0IiLCJmaWxlIjoic3JjL2FwcC9tYWluL29tcy9hY2NydWFscy9hY2NydWFscy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksIGh0bWx7XHJcbiAgICBtYXJnaW46IDA7IHBhZGRpbmc6IDA7IGhlaWdodDogMTAwJTtcclxufVxyXG4gXHJcbiIsImJvZHksIGh0bWwge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/oms/accruals/accruals.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/main/oms/accruals/accruals.component.ts ***!
  \*********************************************************/
/*! exports provided: AccrualsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccrualsComponent", function() { return AccrualsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/Component/data-modal/data-modal.component */ "./src/shared/Component/data-modal/data-modal.component.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");









var AccrualsComponent = /** @class */ (function () {
    function AccrualsComponent(financeService, dataService, agGridUtils) {
        this.financeService = financeService;
        this.dataService = dataService;
        this.agGridUtils = agGridUtils;
        this.bottomOptions = { alignedGrids: [] };
        this.accountSearch = { id: undefined };
        this.columnDefs = [];
        this.title = '';
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(156);
        this.initGrid();
        this.hideGrid = false;
    }
    AccrualsComponent.prototype.setWidthAndHeight = function (width, height) {
        this.style = {
            marginTop: '20px',
            width: width,
            height: height,
            boxSizing: 'border-box'
        };
    };
    AccrualsComponent.prototype.splitColId = function (colId) {
        var modifiedColId = colId.split('_');
        return modifiedColId[0];
    };
    AccrualsComponent.prototype.openModal = function (row) {
        var _this = this;
        // We can drive the screen that we wish to display from here
        if (row.colDef.headerName === 'Group') {
            return;
        }
        var cols = this.gridOptions.columnApi.getColumnState();
        var modifiedCols = cols.map(function (i) { return ({
            colId: _this.splitColId(i.colId),
            hide: i.hide
        }); });
        if (row.colDef.headerName === 'LPOrderId') {
            this.title = 'Allocation Details';
            this.dataModal.openModal(row, modifiedCols);
            return;
        }
        if (row.colDef.headerName === 'AccrualId') {
            this.title = 'Accrual Details';
            this.dataModal.openModal(row, modifiedCols);
            return;
        }
    };
    AccrualsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getAccruals();
            }
        });
    };
    AccrualsComponent.prototype.ngOnInit = function () {
        this.getAccruals();
    };
    AccrualsComponent.prototype.getAccruals = function () {
        var _this = this;
        this.defaultColDef = {
            sortable: true,
            resizable: true
        };
        // Align Scroll of Grid and Footer Grid
        this.gridOptions.alignedGrids.push(this.bottomOptions);
        this.bottomOptions.alignedGrids.push(this.gridOptions);
        this.page = 0;
        this.pageSize = 0;
        this.accountSearch.id = 0;
        this.valueFilter = 0;
        this.sortColum = '';
        this.sortDirection = '';
        this.financeService.getAccruals().subscribe(function (result) {
            _this.accrualsData = result;
            _this.rowData = [];
            var someArray = _this.agGridUtils.columizeData(result.data, _this.accrualsData.meta.Columns);
            var cdefs = _this.agGridUtils.customizeColumns([], _this.accrualsData.meta.Columns, [], false);
            _this.gridOptions.api.setColumnDefs(cdefs);
            _this.rowData = someArray;
            Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["AutoSizeAllColumns"])(_this.gridOptions);
        });
    };
    AccrualsComponent.prototype.initGrid = function () {
        this.gridOptions = {
            rowData: null,
            columnDefs: this.columnDefs,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            onCellDoubleClicked: this.openModal.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'always',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            defaultColDef: this.defaultColDef,
            onGridReady: function (params) { },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["AutoSizeAllColumns"])(params);
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].accrualsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].accruals, this.gridOptions);
        this.allocationsGridOptions = {
            rowData: [],
            columnDefs: this.columnDefs,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            onCellDoubleClicked: this.openModal.bind(this),
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'always',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            defaultColDef: this.defaultColDef,
            onGridReady: function (params) { },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["AutoSizeAllColumns"])(params);
            },
            getExternalFilterState: function () {
                return {};
            }
        };
        this.allocationsGridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].selectedAccrualsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].selectedAccruals, this.gridOptions);
    };
    AccrualsComponent.prototype.onRowSelected = function (event) {
        var _this = this;
        if (event.node.selected) {
            this.financeService.getAccrualAllocations(event.node.data.AccrualId).subscribe(function (result) {
                _this.allocationAccrualsData = result;
                var someArray = _this.agGridUtils.columizeData(result.data, _this.allocationAccrualsData.meta.Columns);
                var cdefs = _this.agGridUtils.customizeColumns([], _this.allocationAccrualsData.meta.Columns, ['Id', 'AllocationId', 'EMSOrderId'], false);
                _this.allocationsGridOptions.api.setColumnDefs(cdefs);
                _this.allocationsData = someArray;
            });
        }
    };
    AccrualsComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_7__["AgGridUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_4__["DataModalComponent"])
    ], AccrualsComponent.prototype, "dataModal", void 0);
    AccrualsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-accruals',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./accruals.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/accruals/accruals.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./accruals.component.scss */ "./src/app/main/oms/accruals/accruals.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_7__["AgGridUtils"]])
    ], AccrualsComponent);
    return AccrualsComponent;
}());



/***/ }),

/***/ "./src/app/main/oms/journal-allocation/journal-allocation.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/app/main/oms/journal-allocation/journal-allocation.component.scss ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body, html {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vbXMvam91cm5hbC1hbGxvY2F0aW9uL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFxmcm9udGVuZGFwcC9zcmNcXGFwcFxcbWFpblxcb21zXFxqb3VybmFsLWFsbG9jYXRpb25cXGpvdXJuYWwtYWxsb2NhdGlvbi5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9vbXMvam91cm5hbC1hbGxvY2F0aW9uL2pvdXJuYWwtYWxsb2NhdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFNBQUE7RUFBVyxVQUFBO0VBQVksWUFBQTtBQ0czQiIsImZpbGUiOiJzcmMvYXBwL21haW4vb21zL2pvdXJuYWwtYWxsb2NhdGlvbi9qb3VybmFsLWFsbG9jYXRpb24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5LCBodG1se1xyXG4gICAgbWFyZ2luOiAwOyBwYWRkaW5nOiAwOyBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuIFxyXG4iLCJib2R5LCBodG1sIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/oms/journal-allocation/journal-allocation.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/main/oms/journal-allocation/journal-allocation.component.ts ***!
  \*****************************************************************************/
/*! exports provided: JournalAllocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JournalAllocationComponent", function() { return JournalAllocationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");



var JournalAllocationComponent = /** @class */ (function () {
    function JournalAllocationComponent() {
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["HeightStyle"])(156);
    }
    JournalAllocationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-journal-allocation',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./journal-allocation.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/journal-allocation/journal-allocation.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./journal-allocation.component.scss */ "./src/app/main/oms/journal-allocation/journal-allocation.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], JournalAllocationComponent);
    return JournalAllocationComponent;
}());



/***/ }),

/***/ "./src/app/main/oms/oms.module.ts":
/*!****************************************!*\
  !*** ./src/app/main/oms/oms.module.ts ***!
  \****************************************/
/*! exports provided: OmsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OmsModule", function() { return OmsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _journal_allocation_journal_allocation_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./journal-allocation/journal-allocation.component */ "./src/app/main/oms/journal-allocation/journal-allocation.component.ts");
/* harmony import */ var _sharedOms_trades_trades_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sharedOms/trades/trades.component */ "./src/app/main/oms/sharedOms/trades/trades.component.ts");
/* harmony import */ var _sharedOms_allocations_allocations_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sharedOms/allocations/allocations.component */ "./src/app/main/oms/sharedOms/allocations/allocations.component.ts");
/* harmony import */ var _trade_allocation_trade_allocation_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./trade-allocation/trade-allocation.component */ "./src/app/main/oms/trade-allocation/trade-allocation.component.ts");
/* harmony import */ var _accruals_accruals_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./accruals/accruals.component */ "./src/app/main/oms/accruals/accruals.component.ts");
/* harmony import */ var _securities_securities_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./securities/securities.component */ "./src/app/main/oms/securities/securities.component.ts");
/* harmony import */ var _securities_security_details_security_details_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./securities/security-details/security-details.component */ "./src/app/main/oms/securities/security-details/security-details.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");
/* harmony import */ var _oms_route__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./oms.route */ "./src/app/main/oms/oms.route.ts");








// Journal Allocation



// Trade Allocations

// Accruals

// Securities





var omsComponents = [
    _journal_allocation_journal_allocation_component__WEBPACK_IMPORTED_MODULE_8__["JournalAllocationComponent"],
    _sharedOms_trades_trades_component__WEBPACK_IMPORTED_MODULE_9__["TradesComponent"],
    _sharedOms_allocations_allocations_component__WEBPACK_IMPORTED_MODULE_10__["AllocationsComponent"],
    _trade_allocation_trade_allocation_component__WEBPACK_IMPORTED_MODULE_11__["TradeAllocationComponent"],
    _accruals_accruals_component__WEBPACK_IMPORTED_MODULE_12__["AccrualsComponent"],
    _securities_securities_component__WEBPACK_IMPORTED_MODULE_13__["SecuritiesComponent"],
    _securities_security_details_security_details_component__WEBPACK_IMPORTED_MODULE_14__["SecurityDetailsComponent"]
];
var OmsModule = /** @class */ (function () {
    function OmsModule() {
    }
    OmsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: omsComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["TooltipModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_5__["TypeaheadModule"].forRoot(),
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_7__["LpToolkitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_16__["SharedModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_15__["RouterModule"].forChild(_oms_route__WEBPACK_IMPORTED_MODULE_17__["OmsRoutes"]),
            ]
        })
    ], OmsModule);
    return OmsModule;
}());



/***/ }),

/***/ "./src/app/main/oms/oms.route.ts":
/*!***************************************!*\
  !*** ./src/app/main/oms/oms.route.ts ***!
  \***************************************/
/*! exports provided: OmsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OmsRoutes", function() { return OmsRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _accruals_accruals_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./accruals/accruals.component */ "./src/app/main/oms/accruals/accruals.component.ts");
/* harmony import */ var _journal_allocation_journal_allocation_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./journal-allocation/journal-allocation.component */ "./src/app/main/oms/journal-allocation/journal-allocation.component.ts");
/* harmony import */ var _trade_allocation_trade_allocation_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./trade-allocation/trade-allocation.component */ "./src/app/main/oms/trade-allocation/trade-allocation.component.ts");
/* harmony import */ var _securities_securities_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./securities/securities.component */ "./src/app/main/oms/securities/securities.component.ts");





var OmsRoutes = [
    {
        path: '',
        component: _accruals_accruals_component__WEBPACK_IMPORTED_MODULE_1__["AccrualsComponent"]
    },
    {
        path: 'accruals',
        component: _accruals_accruals_component__WEBPACK_IMPORTED_MODULE_1__["AccrualsComponent"]
    },
    {
        path: 'trade-allocation',
        component: _trade_allocation_trade_allocation_component__WEBPACK_IMPORTED_MODULE_3__["TradeAllocationComponent"]
    },
    {
        path: 'journal-allocation',
        component: _journal_allocation_journal_allocation_component__WEBPACK_IMPORTED_MODULE_2__["JournalAllocationComponent"]
    },
    {
        path: 'security',
        component: _securities_securities_component__WEBPACK_IMPORTED_MODULE_4__["SecuritiesComponent"]
    },
];


/***/ }),

/***/ "./src/app/main/oms/securities/securities.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/main/oms/securities/securities.component.scss ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb21zL3NlY3VyaXRpZXMvc2VjdXJpdGllcy5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/oms/securities/securities.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/main/oms/securities/securities.component.ts ***!
  \*************************************************************/
/*! exports provided: SecuritiesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecuritiesComponent", function() { return SecuritiesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");



var SecuritiesComponent = /** @class */ (function () {
    function SecuritiesComponent() {
        this.corporateActions = true;
        this.stockSplits = false;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["HeightStyle"])(206);
    }
    SecuritiesComponent.prototype.ngOnInit = function () { };
    SecuritiesComponent.prototype.activeCorporateActions = function () {
        this.corporateActions = true;
    };
    SecuritiesComponent.prototype.activeStockSplits = function () {
        this.stockSplits = true;
    };
    SecuritiesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-securities',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./securities.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/securities.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./securities.component.scss */ "./src/app/main/oms/securities/securities.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SecuritiesComponent);
    return SecuritiesComponent;
}());



/***/ }),

/***/ "./src/app/main/oms/securities/security-details/security-details.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/main/oms/securities/security-details/security-details.component.scss ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("::ng-deep .rightAlign {\n  text-align: right;\n}\n\n::ng-deep .tabset-wrapper .tab-content {\n  height: 100% !important;\n}\n\n::ng-deep .as-split-area {\n  overflow-y: hidden !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vbXMvc2VjdXJpdGllcy9zZWN1cml0eS1kZXRhaWxzL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFxmcm9udGVuZGFwcC9zcmNcXGFwcFxcbWFpblxcb21zXFxzZWN1cml0aWVzXFxzZWN1cml0eS1kZXRhaWxzXFxzZWN1cml0eS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL29tcy9zZWN1cml0aWVzL3NlY3VyaXR5LWRldGFpbHMvc2VjdXJpdHktZGV0YWlscy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGlCQUFBO0FDQ0o7O0FERUE7RUFDRSx1QkFBQTtBQ0NGOztBREVBO0VBQ0csNkJBQUE7QUNDSCIsImZpbGUiOiJzcmMvYXBwL21haW4vb21zL3NlY3VyaXRpZXMvc2VjdXJpdHktZGV0YWlscy9zZWN1cml0eS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcclxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIH1cclxuXHJcbjo6bmctZGVlcCAudGFic2V0LXdyYXBwZXIgLnRhYi1jb250ZW50IHtcclxuICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5hcy1zcGxpdC1hcmVhIHtcclxuICAgb3ZlcmZsb3cteTogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbn1cclxuIiwiOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbjo6bmctZGVlcCAudGFic2V0LXdyYXBwZXIgLnRhYi1jb250ZW50IHtcbiAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAuYXMtc3BsaXQtYXJlYSB7XG4gIG92ZXJmbG93LXk6IGhpZGRlbiAhaW1wb3J0YW50O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/oms/securities/security-details/security-details.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/main/oms/securities/security-details/security-details.component.ts ***!
  \************************************************************************************/
/*! exports provided: SecurityDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecurityDetailsComponent", function() { return SecurityDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Component_grid_layout_menu_grid_layout_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/Component/grid-layout-menu/grid-layout-menu.component */ "./src/shared/Component/grid-layout-menu/grid-layout-menu.component.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");











var SecurityDetailsComponent = /** @class */ (function () {
    function SecurityDetailsComponent(securityApiService, toastrService) {
        this.securityApiService = securityApiService;
        this.toastrService = toastrService;
        this.isLoading = false;
        this.toBeDeletedSecurityExtended = null;
        this.filterBySymbol = '';
    }
    SecurityDetailsComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getSecurities();
    };
    SecurityDetailsComponent.prototype.getSecurities = function () {
        var _this = this;
        this.securityApiService.getSecurityDetails().subscribe(function (response) {
            _this.data = response.payload;
            _this.gridOptions.api.sizeColumnsToFit();
            _this.gridOptions.api.setRowData(_this.data);
            _this.gridOptions.api.expandAll();
        });
    };
    SecurityDetailsComponent.prototype.initGrid = function () {
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
            // onCellClicked: this.rowSelected.bind(this),
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
                    headerName: 'Id',
                    hide: true
                },
                {
                    field: 'security_id',
                    headerName: 'SecurityId',
                    hide: true
                },
                {
                    field: 'symbol',
                    width: 120,
                    headerName: 'Symbol',
                    rowGroup: true,
                    enableRowGroup: true,
                    sortable: true,
                    filter: true,
                    hide: true
                },
                {
                    field: 'maturity_date',
                    headerName: 'Maturity Date',
                    sortable: true,
                    filter: true,
                    width: 120,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'valuation_date',
                    headerName: 'Valuation Date',
                    sortable: true,
                    filter: true,
                    width: 100,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'spread',
                    headerName: 'Spread',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'security_return_description',
                    headerName: 'Security Return Description',
                    width: 100,
                    filter: true,
                    sortable: true
                },
                {
                    field: 'financing_leg',
                    headerName: 'Financing Leg',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'financing_end_date',
                    headerName: 'Financing End Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'financing_payment_date',
                    headerName: 'Financing Payment Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'financing_reset_date_type',
                    headerName: 'Financing Reset Date Type',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'financing_reset_date',
                    headerName: 'Financing Reset Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'next_financing_end_date_type',
                    headerName: 'Next Financing End Date Type',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'next_financing_end_date',
                    headerName: 'Next Financing End Date',
                    width: 100,
                    filter: true,
                    sortable: true,
                    valueFormatter: dateFormatter
                },
                {
                    field: 'fixed_rate',
                    headerName: 'Fixed Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'dcc_fixed_rate',
                    headerName: 'DCC Fixed Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'floating_rate',
                    headerName: 'Floating Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'dcc_floating_rate',
                    headerName: 'DCC Floating Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'primary_market',
                    headerName: 'Primary Market',
                    width: 100,
                    filter: true,
                    sortable: true,
                },
                {
                    field: 'reference_equity',
                    headerName: 'Reference Equity',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'reference_obligation',
                    headerName: 'Reference Obligation',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'upfront',
                    headerName: 'Upfront',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'premium_rate',
                    headerName: 'Preminum Rate',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                },
                {
                    field: 'premium_frequency',
                    headerName: 'Preminum Frequency',
                    width: 100,
                    filter: true,
                    sortable: true,
                    cellClass: 'rightAlign',
                    valueFormatter: moneyFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
    };
    /////////// External Filters Code //////////////
    SecurityDetailsComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Edit',
                action: function () {
                    _this.isLoading = true;
                    _this.securityApiService
                        .getSecurityConfig(params.node.data.symbol)
                        .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["finalize"])(function () { return (_this.isLoading = false); }))
                        .subscribe(function (response) {
                        _this.securityModal.openEditModal(params.node.data, response.payload[0].SecurityType, response.payload[0].Fields, params.node.data, 'edit');
                    }, function (error) { });
                }
            },
            {
                name: 'Delete',
                action: function () {
                    _this.openDeleteSecurityModal(params.node.data.id);
                }
            }
        ];
        var addCustomItems = [];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__["GetContextMenu"])(false, addDefaultItems, false, addCustomItems, params);
    };
    SecurityDetailsComponent.prototype.openDeleteSecurityModal = function (id) {
        this.toBeDeletedSecurityExtended = id;
        this.confirmationModal.showModal();
    };
    SecurityDetailsComponent.prototype.deleteSecurityExtend = function () {
        var _this = this;
        this.securityApiService.deleteSecurity(this.toBeDeletedSecurityExtended).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Extended security deleted successfully!');
                _this.refreshGrid();
            }
            else {
                _this.toastrService.error('Failed to delete extended security!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    SecurityDetailsComponent.prototype.refreshGrid = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.getSecurities();
    };
    SecurityDetailsComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    SecurityDetailsComponent.prototype.onFilterChanged = function () {
        // this.pinnedBottomRowData = CalTotalRecords(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    SecurityDetailsComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    SecurityDetailsComponent.prototype.ngModelChangeDates = function (e) {
        if (!this.selected.startDate) {
            return;
        }
        this.startDate = e.startDate;
        this.endDate = e.endDate;
        this.gridOptions.api.onFilterChanged();
    };
    SecurityDetailsComponent.prototype.isExternalFilterPassed = function (object) {
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        // this.setDateRange(dateFilter);
        this.gridOptions.api.onFilterChanged();
    };
    SecurityDetailsComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    SecurityDetailsComponent.prototype.isExternalFilterPresent = function () {
        if (this.filterBySymbol !== '' || this.startDate) {
            return true;
        }
    };
    SecurityDetailsComponent.prototype.doesExternalFilterPass = function (node) {
        // if (this.filterBySymbol !== '' && this.startDate) {
        //   const cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
        //   const cellDate = new Date(node.data.execution_date);
        //   return (
        //     cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase()) &&
        //     this.startDate.toDate() <= cellDate &&
        //     this.endDate.toDate() >= cellDate
        //   );
        // }
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        // if (this.startDate !== '') {
        //   const cellDate = new Date(node.data.execution_date);
        //   return this.startDate.toDate() <= cellDate && this.endDate.toDate() >= cellDate;
        // }
        return true;
    };
    SecurityDetailsComponent.prototype.getExternalFilterState = function () {
        return {
            symbolFilter: this.filterBySymbol,
            dateFilter: {
                startDate: this.startDate !== undefined ? this.startDate : '',
                endDate: this.endDate !== undefined ? this.endDate : ''
            }
        };
    };
    SecurityDetailsComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        // this.dividendScreenRatio.detailsView = false;
        // this.dividendDetailsGrid.api.showLoadingOverlay();
        this.getSecurities();
        // this.getDividendDetails();
    };
    SecurityDetailsComponent.prototype.clearFilters = function () {
        this.selected = null;
        this.filterBySymbol = '';
        // this.dividendScreenRatio.detailsView = false;
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_6__('01-01-1901', 'MM-DD-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_6__();
        this.gridOptions.api.setRowData([]);
        // this.dividendDetailsGrid.api.setRowData([]);
    };
    /////////// End External Filters Code //////////////
    SecurityDetailsComponent.prototype.openSecurityModal = function () {
        this.securityModal.openModal(null);
    };
    SecurityDetailsComponent.prototype.openEditModal = function (data) {
        this.securityModal.openModal(data);
    };
    SecurityDetailsComponent.prototype.openSecurityModalFromOutside = function (data) {
        this.securityModal.openModal(data);
    };
    SecurityDetailsComponent.prototype.closeSecurityModal = function () {
        this.getSecurities();
    };
    SecurityDetailsComponent.ctorParameters = function () { return [
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_9__["CreateSecurityComponent"])
    ], SecurityDetailsComponent.prototype, "securityModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_10__["ConfirmationModalComponent"])
    ], SecurityDetailsComponent.prototype, "confirmationModal", void 0);
    SecurityDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-security-details',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./security-details.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/securities/security-details/security-details.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./security-details.component.scss */ "./src/app/main/oms/securities/security-details/security-details.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_security_api_service__WEBPACK_IMPORTED_MODULE_8__["SecurityApiService"], ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"]])
    ], SecurityDetailsComponent);
    return SecurityDetailsComponent;
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
    if (params.value === undefined || params.value === '' || params.value === null || !isNaN(params.value)) {
        return;
    }
    if (isNaN(params.value)) {
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

/***/ "./src/app/main/oms/sharedOms/allocations/allocations.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/main/oms/sharedOms/allocations/allocations.component.scss ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb21zL3NoYXJlZE9tcy9hbGxvY2F0aW9ucy9hbGxvY2F0aW9ucy5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/oms/sharedOms/allocations/allocations.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/main/oms/sharedOms/allocations/allocations.component.ts ***!
  \*************************************************************************/
/*! exports provided: AllocationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AllocationsComponent", function() { return AllocationsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");












var AllocationsComponent = /** @class */ (function () {
    function AllocationsComponent(financeService, securityApiService, dataService, agGridUtils, toasterService) {
        this.financeService = financeService;
        this.securityApiService = securityApiService;
        this.dataService = dataService;
        this.agGridUtils = agGridUtils;
        this.toasterService = toasterService;
        this.columnDefs = [];
        this.isLoading = false;
        this.initGrid();
    }
    AllocationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.allocationId.subscribe(function (data) {
            if (data != null) {
                _this.getTradeAllocations(data);
            }
        });
    };
    AllocationsComponent.prototype.ngAfterViewInit = function () { };
    // openModal = row => {
    //   // We can drive the screen that we wish to display from here
    //   if (row.colDef.headerName === 'Group') {
    //     return;
    //   }
    //   const cols = this.gridOptions.columnApi.getColumnState();
    //   const modifiedCols = cols.map(i => ({ colId: this.splitColId(i.colId), hide: i.hide }));
    //   if (row.colDef.headerName === 'LPOrderId') {
    //     this.title = 'Allocation Details';
    //     this.dataModal.openModal(row, modifiedCols);
    //     return;
    //   }
    //   if (row.colDef.headerName === 'AccrualId') {
    //     this.title = 'Accrual Details';
    //     this.dataModal.openModal(row, modifiedCols);
    //     return;
    //   }
    // };
    AllocationsComponent.prototype.initGrid = function () {
        this.allocationsGridOptions = {
            rowData: [],
            columnDefs: this.columnDefs,
            // onCellDoubleClicked: this.openModal.bind(this),
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            enableFilter: true,
            animateRows: true,
            suppressColumnVirtualisation: true,
            suppressHorizontalScroll: false,
            getContextMenuItems: this.getContextMenuItems.bind(this),
            alignedGrids: [],
            onGridReady: function () {
                // this.gridOptions.api.sizeColumnsToFit();
            },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["AutoSizeAllColumns"])(params);
            },
            getExternalFilterState: function () {
                return {};
            }
        };
        this.allocationsGridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].allocationsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].allocations, this.allocationsGridOptions);
    };
    AllocationsComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
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
                                    _this.toasterService.error('No security type found against the selected symbol!');
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
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_11__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    AllocationsComponent.prototype.getTradeAllocations = function (lpOrderId) {
        var _this = this;
        this.financeService.getTradeAllocations(lpOrderId).subscribe(function (result) {
            _this.allocationTradesData = result;
            var someArray = _this.agGridUtils.columizeData(result.data, _this.allocationTradesData.meta.Columns);
            var cdefs = _this.agGridUtils.customizeColumns([], _this.allocationTradesData.meta.Columns, ['Id', 'AllocationId', 'EMSOrderId'], false);
            _this.allocationsGridOptions.api.setColumnDefs(cdefs);
            _this.allocationsData = someArray;
        });
    };
    AllocationsComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__["SecurityApiService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"] },
        { type: _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_9__["AgGridUtils"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_8__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_5__["CreateSecurityComponent"])
    ], AllocationsComponent.prototype, "securityModal", void 0);
    AllocationsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-allocations',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./allocations.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/allocations/allocations.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./allocations.component.scss */ "./src/app/main/oms/sharedOms/allocations/allocations.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_6__["FinanceServiceProxy"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_7__["SecurityApiService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"],
            _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_9__["AgGridUtils"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_8__["ToastrService"]])
    ], AllocationsComponent);
    return AllocationsComponent;
}());



/***/ }),

/***/ "./src/app/main/oms/sharedOms/trades/trades.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/main/oms/sharedOms/trades/trades.component.scss ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb21zL3NoYXJlZE9tcy90cmFkZXMvdHJhZGVzLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/oms/sharedOms/trades/trades.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/main/oms/sharedOms/trades/trades.component.ts ***!
  \***************************************************************/
/*! exports provided: TradesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradesComponent", function() { return TradesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/Component/data-modal/data-modal.component */ "./src/shared/Component/data-modal/data-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/Modal/create-dividend/create-dividend.component */ "./src/shared/Modal/create-dividend/create-dividend.component.ts");
/* harmony import */ var src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Modal/create-stock-splits/create-stock-splits.component */ "./src/shared/Modal/create-stock-splits/create-stock-splits.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/posting-engine-api.service */ "./src/services/posting-engine-api.service.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/common/posting-engine.service */ "./src/services/common/posting-engine.service.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/utils/AgGridUtils */ "./src/shared/utils/AgGridUtils.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_Modal_exclude_trade_exclude_trade_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/Modal/exclude-trade/exclude-trade.component */ "./src/shared/Modal/exclude-trade/exclude-trade.component.ts");



















var TradesComponent = /** @class */ (function () {
    function TradesComponent(financeService, postingEngineService, postingEngineApiService, securityApiService, dataService, agGridUtils, toastrService) {
        var _this = this;
        this.financeService = financeService;
        this.postingEngineService = postingEngineService;
        this.postingEngineApiService = postingEngineApiService;
        this.securityApiService = securityApiService;
        this.dataService = dataService;
        this.agGridUtils = agGridUtils;
        this.toastrService = toastrService;
        this.titleEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.tradeType = '';
        this.bottomOptions = { alignedGrids: [] };
        this.accountSearch = { id: undefined };
        this.title = '';
        this.filterBySymbol = '';
        this.isLoading = false;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__["HeightStyle"])(550);
        this.openModal = function (row) {
            // We can drive the screen that we wish to display from here
            if (row.colDef.headerName === 'Group') {
                return;
            }
            var cols = _this.gridOptions.columnApi.getColumnState();
            var modifiedCols = cols.map(function (i) { return ({
                colId: _this.splitColId(i.colId),
                hide: i.hide
            }); });
            if (row.colDef.headerName === 'LPOrderId') {
                _this.title = 'Allocation Details';
                _this.dataModal.openModal(row, modifiedCols);
                return;
            }
            if (row.colDef.headerName === 'AccrualId') {
                _this.title = 'Accrual Details';
                _this.dataModal.openModal(row, modifiedCols);
                return;
            }
        };
        this.initGrid();
        this.hideGrid = false;
    }
    TradesComponent.prototype.setWidthAndHeight = function (width, height) {
        this.style = {
            marginTop: '20px',
            width: width,
            height: height,
            boxSizing: 'border-box'
        };
    };
    TradesComponent.prototype.ngOnInit = function () {
        // this.getTrades();
    };
    TradesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getTrades();
            }
        });
    };
    TradesComponent.prototype.splitColId = function (colId) {
        var modifiedColId = colId.split('_');
        return modifiedColId[0];
    };
    TradesComponent.prototype.getTrades = function () {
        var _this = this;
        // align scroll of grid and footer grid
        this.gridOptions.alignedGrids.push(this.bottomOptions);
        this.bottomOptions.alignedGrids.push(this.gridOptions);
        this.page = 0;
        this.pageSize = 0;
        this.accountSearch.id = 0;
        this.valueFilter = 0;
        this.sortColum = '';
        this.sortDirection = '';
        if (this.tradeType === 'trade') {
            this.gridOptions.api.showLoadingOverlay();
            this.financeService.getTrades().subscribe(function (result) {
                _this.gridOptions.api.hideOverlay();
                _this.tradesData = result;
                _this.rowData = [];
                var someArray = _this.agGridUtils.columizeData(result.data, _this.tradesData.meta.Columns);
                var cdefs = _this.agGridUtils.customizeColumns([], _this.tradesData.meta.Columns, [], false);
                _this.gridOptions.api.setColumnDefs(cdefs);
                _this.rowData = someArray;
            }, function (err) {
                _this.gridOptions.api.hideOverlay();
            });
        }
        else if (this.tradeType === 'opsblotter') {
            this.financeService.getOpsBlotterJournals().subscribe(function (result) {
                _this.tradesData = result;
                _this.rowData = [];
                var someArray = _this.agGridUtils.columizeData(result.data, _this.tradesData.meta.Columns);
                var cdefs = _this.agGridUtils.customizeColumns([], _this.tradesData.meta.Columns, [], false);
                _this.gridOptions.api.setColumnDefs(cdefs);
                _this.rowData = someArray;
            });
        }
    };
    TradesComponent.prototype.processOrder = function (orderId, row) {
        var _this = this;
        this.postingEngineApiService.startPostingEngineSingleOrder(orderId).subscribe(function (response) {
            if (response.IsRunning) {
                // this.isLoading = true;
                _this.key = response.key;
                _this.postingEngineService.changeStatus(true);
                _this.postingEngineService.checkProgress();
            }
            // this.key = response.key;
            // this.getLogs();
        });
    };
    TradesComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Process',
                action: function () {
                    _this.processOrder(params.node.data.LPOrderId, params.node);
                }
            },
            {
                name: 'Corporate Actions',
                subMenu: [
                    {
                        name: 'Create Dividend',
                        action: function () {
                            _this.dividendModal.openDividendModalFromOutside(params.node.data.Symbol);
                        }
                    },
                    {
                        name: 'Create Stock Split',
                        action: function () {
                            _this.stockSplitsModal.openStockSplitModalFromOutside(params.node.data.Symbol);
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
                        }
                    }
                ]
            }
        ];
        if (params.node.data.exclude !== 'Y') {
            addDefaultItems.push({
                name: 'Exclude Trade',
                action: function () {
                    _this.openTradeExclusionModal(params.node.data.LPOrderId);
                }
            });
        }
        else {
            addDefaultItems.push({
                name: 'Reverse Trade Exclusion',
                action: function () {
                    _this.openReverseTradeExclusionModal(params.node.data.LPOrderId);
                }
            });
        }
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_13__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    TradesComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            columnDefs: this.columnDefs,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearExternalFilter.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            getContextMenuItems: this.getContextMenuItems.bind(this),
            onCellDoubleClicked: this.openModal.bind(this),
            onGridReady: function (params) {
                _this.gridOptions.api = params.api;
                _this.gridOptions.columnApi = params.columnApi;
            },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__["AutoSizeAllColumns"])(params);
                // params.api.sizeColumnsToFit();
            },
            getRowStyle: function (params) {
                var style = {};
                if (params.data.exclude === 'Y') {
                    style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__["LegendColors"].nonZeroStyle;
                }
                return style;
            },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'always',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            enableFilter: true,
            animateRows: true,
            suppressHorizontalScroll: false,
            alignedGrids: []
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_16__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].tradeId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].trade, this.gridOptions);
    };
    TradesComponent.prototype.onRowSelected = function (event) {
        if (event.node.selected) {
            this.dataService.onRowSelectionTrade(event.node.data.LPOrderId);
        }
    };
    TradesComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    TradesComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    TradesComponent.prototype.isExternalFilterPassed = function (object) {
        var symbolFilter = object.symbolFilter;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.gridOptions.api.onFilterChanged();
    };
    TradesComponent.prototype.isExternalFilterPresent = function () {
        if (this.filterBySymbol !== '') {
            return true;
        }
    };
    TradesComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.Symbol === null ? '' : node.data.Symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    TradesComponent.prototype.getExternalFilterState = function () {
        return {
            symbolFilter: this.filterBySymbol
        };
    };
    TradesComponent.prototype.clearExternalFilter = function () {
        this.filterBySymbol = '';
        this.gridOptions.api.onFilterChanged();
    };
    TradesComponent.prototype.openTradeExclusionModal = function (lpOrderId) {
        this.tradeExclusionModal.showModal(lpOrderId);
    };
    TradesComponent.prototype.openReverseTradeExclusionModal = function (lpOrderId) {
        this.toBeReversedLpOrderId = lpOrderId;
        this.confirmationModal.showModal();
    };
    TradesComponent.prototype.refreshGrid = function () {
        this.getTrades();
    };
    TradesComponent.prototype.reverseTradeExclusion = function () {
        var _this = this;
        var payload = {
            LpOrderId: this.toBeReversedLpOrderId
        };
        this.financeService.reverseTradeExclusion(payload).subscribe(function (resp) {
            if (resp.statusCode === 200) {
                _this.toastrService.success('Trade exclusion reversed successfully');
                _this.refreshGrid();
            }
            else {
                _this.toastrService.error(resp.message);
            }
        }, function (err) {
            _this.toastrService.success('An error occured');
        });
        this.toBeReversedLpOrderId = null;
    };
    TradesComponent.prototype.cancelTradeExclusionReversal = function () {
        this.toBeReversedLpOrderId = null;
    };
    TradesComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_12__["FinanceServiceProxy"] },
        { type: src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__["PostingEngineService"] },
        { type: src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_8__["PostingEngineApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__["SecurityApiService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__["DataService"] },
        { type: _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_15__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_4__["DataModalComponent"])
    ], TradesComponent.prototype, "dataModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dividendModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_dividend_create_dividend_component__WEBPACK_IMPORTED_MODULE_5__["CreateDividendComponent"])
    ], TradesComponent.prototype, "dividendModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('stockSplitsModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_stock_splits_create_stock_splits_component__WEBPACK_IMPORTED_MODULE_6__["CreateStockSplitsComponent"])
    ], TradesComponent.prototype, "stockSplitsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_7__["CreateSecurityComponent"])
    ], TradesComponent.prototype, "securityModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('tradeExclusionModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_exclude_trade_exclude_trade_component__WEBPACK_IMPORTED_MODULE_17__["ExcludeTradeComponent"])
    ], TradesComponent.prototype, "tradeExclusionModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["ConfirmationModalComponent"])
    ], TradesComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], TradesComponent.prototype, "titleEmitter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], TradesComponent.prototype, "tradeType", void 0);
    TradesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-trades',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./trades.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/sharedOms/trades/trades.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./trades.component.scss */ "./src/app/main/oms/sharedOms/trades/trades.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_12__["FinanceServiceProxy"],
            src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__["PostingEngineService"],
            src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_8__["PostingEngineApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_9__["SecurityApiService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_11__["DataService"],
            _shared_utils_AgGridUtils__WEBPACK_IMPORTED_MODULE_14__["AgGridUtils"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_15__["ToastrService"]])
    ], TradesComponent);
    return TradesComponent;
}());



/***/ }),

/***/ "./src/app/main/oms/trade-allocation/trade-allocation.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/main/oms/trade-allocation/trade-allocation.component.scss ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body, html {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vbXMvdHJhZGUtYWxsb2NhdGlvbi9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcZnJvbnRlbmRhcHAvc3JjXFxhcHBcXG1haW5cXG9tc1xcdHJhZGUtYWxsb2NhdGlvblxcdHJhZGUtYWxsb2NhdGlvbi5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9vbXMvdHJhZGUtYWxsb2NhdGlvbi90cmFkZS1hbGxvY2F0aW9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksU0FBQTtFQUFXLFVBQUE7RUFBWSxZQUFBO0FDRzNCIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9vbXMvdHJhZGUtYWxsb2NhdGlvbi90cmFkZS1hbGxvY2F0aW9uLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYm9keSwgaHRtbHtcclxuICAgIG1hcmdpbjogMDsgcGFkZGluZzogMDsgaGVpZ2h0OiAxMDAlO1xyXG59XHJcbiBcclxuIiwiYm9keSwgaHRtbCB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/oms/trade-allocation/trade-allocation.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/main/oms/trade-allocation/trade-allocation.component.ts ***!
  \*************************************************************************/
/*! exports provided: TradeAllocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TradeAllocationComponent", function() { return TradeAllocationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");



var TradeAllocationComponent = /** @class */ (function () {
    function TradeAllocationComponent() {
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["HeightStyle"])(156);
    }
    TradeAllocationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-trade-allocation',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./trade-allocation.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/oms/trade-allocation/trade-allocation.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./trade-allocation.component.scss */ "./src/app/main/oms/trade-allocation/trade-allocation.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], TradeAllocationComponent);
    return TradeAllocationComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-oms-oms-module.js.map