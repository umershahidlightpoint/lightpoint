(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-settings-settings-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/layouts/layouts.component.html":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/layouts/layouts.component.html ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Grid View Div Starts -->\r\n<div class=\"d-flex\" [ngStyle]=\"styleForHeight\">\r\n\r\n  <!-- AG Grid Starts -->\r\n  <ag-grid-angular class=\"width-55 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n  </ag-grid-angular>\r\n  <!-- AG Grid Ends -->\r\n\r\n  <!-- Action Buttons Template Starts -->\r\n  <ng-template #actionButtons let-row>\r\n    <button class=\"btn grid-btn width-15 height-30px\" (click)=\"viewLayout(row)\" tooltip=\"View\" placement=\"auto\"\r\n      container=\"body\">\r\n      <i class=\"fa fa-lg fa-eye\" aria-hidden=\"true\"></i>\r\n    </button>\r\n\r\n    <button [disabled]=\"row.isDefault\" class=\"btn grid-btn width-15 height-30px\"\r\n      [ngClass]=\"{'cursor-not-allowed': row.isDefault}\" (click)=\"showConfirmation(row)\" tooltip=\"Delete\"\r\n      placement=\"auto\" container=\"body\">\r\n      <i class=\"fa fa-lg fa-trash-o\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </ng-template>\r\n  <!-- Action Buttons Template Ends -->\r\n\r\n  <!-- Grid Layout Json Div Starts -->\r\n  <div *ngIf=\"gridLayoutJson\" class=\"width-45 h-100 json-container\">\r\n    <pre>{{gridLayoutJson | json}}</pre>\r\n  </div>\r\n  <!-- Grid Layout Json Div Ends -->\r\n\r\n</div>\r\n<!-- Grid View Div Ends -->\r\n\r\n<app-confirmation-modal #confirmationModal [title]=\"'Delete Layout'\" (confirmed)=\"deleteLayout()\">\r\n</app-confirmation-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/settings/settings.component.html":
/*!******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/settings/settings.component.html ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Settings Main Div Starts -->\r\n<div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n\r\n  <!-- General Settings Tab Set -->\r\n  <tabset>\r\n\r\n    <!-- General Settings Tab -->\r\n    <tab heading=\"General Settings\">\r\n      <div class=\"mt-0\" [ngStyle]=\"style\">\r\n\r\n        <!-- Loading Spinner -->\r\n        <div *ngIf=\"isLoading\" class=\"d-flex justify-content-center align-items-center height-50vh\">\r\n          <lp-loading></lp-loading>\r\n        </div>\r\n        <!-- Loading Spinner Ends -->\r\n\r\n        <!-- Content Div -->\r\n        <div [ngStyle]=\"styleForHeight\" [hidden]=\"isLoading\">\r\n\r\n          <!-- Settings Form -->\r\n          <form #settingsForm=\"ngForm\" (ngSubmit)=\"onSaveSettings()\">\r\n\r\n            <!-- Save Button -->\r\n            <div class=\"row justify-content-end\">\r\n              <div class=\"col-auto\">\r\n                <button [disabled]=\"settingsForm.invalid || isSaving\" type=\"submit\" class=\"btn btn-pa\">\r\n                  <i class=\"fa fa-save\"></i>\r\n                  Save\r\n                  <span *ngIf=\"isSaving\" class=\"spinner-border spinner-border-sm\" role=\"status\"\r\n                    aria-hidden=\"true\"></span>\r\n                </button>\r\n              </div>\r\n            </div>\r\n            <!-- Save Button Ends -->\r\n\r\n            <!-- App Theme Dropdown -->\r\n            <h4 class=\"mt-2\">Application Theme</h4>\r\n            <lp-select-theme #themeSelect=\"ngModel\" ngModel name=\"theme\" required></lp-select-theme>\r\n\r\n            <p class=\"form-text text-danger\" *ngIf=\"themeSelect.invalid && themeSelect.touched\">*Please select a\r\n              theme</p>\r\n            <!-- App Theme Dropdown Ends -->\r\n\r\n            <!-- Reporting Currency Dropdown -->\r\n            <h4 class=\"mt-2\">Reporting Currency</h4>\r\n            <select class=\"form-control\" #currencySelect=\"ngModel\" ngModel name=\"currency\" required>\r\n              <option selected disabled value=\"\">Select a Currency</option>\r\n              <option *ngFor=\"let currency of currencies\">\r\n                {{ currency }}\r\n              </option>\r\n            </select>\r\n\r\n            <p class=\"form-text text-danger\" *ngIf=\"currencySelect.invalid && currencySelect.touched\">*Please select a\r\n              currency</p>\r\n            <!-- Reporting Currency Dropdown Ends -->\r\n\r\n            <!-- Tax Methodology Dropdown -->\r\n            <h4 class=\"mt-3\">Tax Methodology</h4>\r\n            <select class=\"form-control\" #methodologySelect=\"ngModel\" ngModel name=\"methodology\" required>\r\n              <option selected disabled value=\"\">Select a Methodology</option>\r\n              <option *ngFor=\"let method of methods\" [value]=\"method.code\">\r\n                {{ method.code }}\r\n              </option>\r\n            </select>\r\n\r\n            <p class=\"form-text text-danger\" *ngIf=\"methodologySelect.invalid && methodologySelect.touched\">*Please\r\n              select\r\n              a methodology</p>\r\n            <!-- Tax Methodology Dropdown Ends -->\r\n\r\n            <!-- Fiscal Year End Label -->\r\n            <div class=\"row\">\r\n              <div class=\"col-12\">\r\n                <h4 class=\"mt-3\">Fiscal Year End</h4>\r\n              </div>\r\n            </div>\r\n            <!-- Fiscal Year End Label Ends -->\r\n\r\n            <!-- Fiscal Year End Fields -->\r\n            <div class=\"row\">\r\n\r\n              <!-- Fiscal Year End Month -->\r\n              <div class=\"col-6\">\r\n                <select class=\"form-control\" #monthSelect=\"ngModel\" ngModel name=\"month\" required\r\n                  (change)=\"onChangeReportingMonth($event.target.value)\">\r\n                  <option selected disabled value=\"\">Select a Month</option>\r\n                  <option *ngFor=\"let month of months\">\r\n                    {{ month }}\r\n                  </option>\r\n                </select>\r\n\r\n                <p class=\"form-text text-danger\" *ngIf=\"monthSelect.invalid && monthSelect.touched\">*Please select a\r\n                  month\r\n                </p>\r\n              </div>\r\n              <!-- Fiscal Year End Month Ends -->\r\n\r\n              <!-- Fiscal Year End Day -->\r\n              <div class=\"col-6\">\r\n                <select class=\"form-control\" #daySelect=\"ngModel\" [ngModel]=\"day\" name=\"day\" required>\r\n                  <option selected disabled value=\"\">Select a Day</option>\r\n                  <option *ngFor=\"let day of days\">\r\n                    {{ day }}\r\n                  </option>\r\n                </select>\r\n\r\n                <p class=\"form-text text-danger\" *ngIf=\"daySelect.invalid && daySelect.touched\">*Please select a day\r\n                </p>\r\n              </div>\r\n              <!-- Fiscal Year End Day Ends -->\r\n\r\n            </div>\r\n            <!-- Fiscal Year End Fields Ends -->\r\n\r\n          </form>\r\n          <!-- Settings Form Ends -->\r\n\r\n        </div>\r\n        <!-- Content Div Ends -->\r\n      </div>\r\n    </tab>\r\n    <!-- General Settings Tab Ends -->\r\n\r\n    <!-- General Settings Tab -->\r\n    <tab heading=\"Grid Views\" (selectTab)=\"activateTab('GridViews')\">\r\n      <app-layouts *ngIf=\"isGridViewsActive\"></app-layouts>\r\n    </tab>\r\n\r\n  </tabset>\r\n  <!-- General Settings Tab Set Ends -->\r\n\r\n</div>\r\n<!-- Settings Main Div Ends -->");

/***/ }),

/***/ "./src/app/main/settings/layouts/layouts.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/main/settings/layouts/layouts.component.scss ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".grid-btn:focus {\n  outline: none;\n}\n\nbutton:focus {\n  outline: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9zZXR0aW5ncy9sYXlvdXRzL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFx1aS9zcmNcXGFwcFxcbWFpblxcc2V0dGluZ3NcXGxheW91dHNcXGxheW91dHMuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vc2V0dGluZ3MvbGF5b3V0cy9sYXlvdXRzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBQTtBQ0NGOztBREVBO0VBQ0UsYUFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9zZXR0aW5ncy9sYXlvdXRzL2xheW91dHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZ3JpZC1idG46Zm9jdXMge1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbn1cclxuXHJcbmJ1dHRvbjpmb2N1cyB7XHJcbiAgb3V0bGluZTogbm9uZTtcclxufVxyXG4iLCIuZ3JpZC1idG46Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG5idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/settings/layouts/layouts.component.ts":
/*!************************************************************!*\
  !*** ./src/app/main/settings/layouts/layouts.component.ts ***!
  \************************************************************/
/*! exports provided: LayoutsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutsComponent", function() { return LayoutsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var src_services_grid_layout_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/grid-layout-api.service */ "./src/services/grid-layout-api.service.ts");










var LayoutsComponent = /** @class */ (function () {
    function LayoutsComponent(gridLayoutApiService, toastrService, dataService) {
        this.gridLayoutApiService = gridLayoutApiService;
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.isEngineRunning = false;
        this.hideGrid = false;
        this.selectedLayout = null;
        this.gridLayoutJson = null;
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["HeightStyle"])(180);
        this.initGrid();
    }
    LayoutsComponent.prototype.ngOnInit = function () { };
    LayoutsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getGridLayouts();
            }
        });
    };
    LayoutsComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            getExternalFilterState: function () {
                return {};
            },
            clearExternalFilter: function () { },
            onGridReady: function (params) {
                _this.customizeColumns();
            },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["AutoSizeAllColumns"])(params);
                params.api.sizeColumnsToFit();
            },
            alignedGrids: [],
            animateRows: true,
            enableFilter: true,
            suppressColumnVirtualisation: true,
            suppressHorizontalScroll: false,
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridId"].gridLayoutsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_6__["GridName"].gridLayouts, this.gridOptions);
    };
    LayoutsComponent.prototype.customizeColumns = function () {
        var colDefs = [
            {
                field: 'id',
                headerName: 'gridId',
                hide: true
            },
            {
                field: 'userId',
                headerName: 'User Id'
            },
            {
                field: 'gridName',
                headerName: 'Grid Name'
            },
            {
                field: 'gridLayoutName',
                headerName: 'Grid Layout Name'
            },
            {
                field: 'isPublic',
                headerName: 'Is Public'
            },
            {
                field: 'gridState',
                headerName: 'Grid State',
                hide: true
            },
            {
                headerName: 'Actions',
                cellRendererFramework: src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_2__["TemplateRendererComponent"],
                cellRendererParams: {
                    ngTemplate: this.actionButtons
                }
            }
        ];
        this.gridOptions.api.setColumnDefs(colDefs);
    };
    LayoutsComponent.prototype.getGridLayouts = function () {
        var _this = this;
        this.gridLayoutApiService.getAllGridLayouts().subscribe(function (response) {
            if (response.isSuccessful) {
                _this.gridLayouts = response.payload;
                _this.rowData = response.payload.map(function (layout) { return ({
                    gridId: layout.Id,
                    userId: layout.UserId,
                    gridName: layout.GridName,
                    gridLayoutName: layout.GridLayoutName,
                    isPublic: layout.IsPublic,
                    isDefault: layout.IsDefault,
                    gridState: "[{\n                \"ColumnState\":  " + layout.ColumnState + ",\n                \"GroupState\":  " + layout.GroupState + ",\n                \"SortState\":  " + layout.SortState + ",\n                \"FilterState\":  " + layout.FilterState + ",\n                \"ExternalFilterState\":  " + layout.ExternalFilterState + ",\n                \"PivotMode\":  " + layout.PivotMode + "\n              }]"
                }); });
            }
            _this.gridOptions.api.setRowData(_this.rowData);
            _this.gridOptions.api.sizeColumnsToFit();
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    LayoutsComponent.prototype.viewLayout = function (row) {
        this.gridLayoutJson = JSON.parse(row.gridState);
    };
    LayoutsComponent.prototype.showConfirmation = function (row) {
        this.selectedLayout = row;
        this.confirmModal.showModal();
    };
    LayoutsComponent.prototype.deleteLayout = function () {
        var _this = this;
        this.gridLayoutApiService.deleteGridLayout(this.selectedLayout.gridId).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Grid layout is successfully deleted!');
                _this.gridLayoutJson = null;
                _this.getGridLayouts();
            }
            else {
                _this.toastrService.error('Failed to delete grid layout!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    LayoutsComponent.ctorParameters = function () { return [
        { type: src_services_grid_layout_api_service__WEBPACK_IMPORTED_MODULE_9__["GridLayoutApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_3__["ConfirmationModalComponent"])
    ], LayoutsComponent.prototype, "confirmModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], LayoutsComponent.prototype, "actionButtons", void 0);
    LayoutsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-layouts',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./layouts.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/layouts/layouts.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./layouts.component.scss */ "./src/app/main/settings/layouts/layouts.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_grid_layout_api_service__WEBPACK_IMPORTED_MODULE_9__["GridLayoutApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"]])
    ], LayoutsComponent);
    return LayoutsComponent;
}());



/***/ }),

/***/ "./src/app/main/settings/settings.module.ts":
/*!**************************************************!*\
  !*** ./src/app/main/settings/settings.module.ts ***!
  \**************************************************/
/*! exports provided: SettingsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsModule", function() { return SettingsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/main/settings/settings/settings.component.ts");
/* harmony import */ var _layouts_layouts_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./layouts/layouts.component */ "./src/app/main/settings/layouts/layouts.component.ts");
/* harmony import */ var _settings_route__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./settings.route */ "./src/app/main/settings/settings.route.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");







// Settings Component

// Layout Component

// Settings Routes


var settingsComponents = [_settings_settings_component__WEBPACK_IMPORTED_MODULE_7__["SettingsComponent"], _layouts_layouts_component__WEBPACK_IMPORTED_MODULE_8__["LayoutsComponent"]];
var SettingsModule = /** @class */ (function () {
    function SettingsModule() {
    }
    SettingsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: settingsComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_10__["SharedModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild(_settings_route__WEBPACK_IMPORTED_MODULE_9__["SettingsRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_6__["LpToolkitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_10__["SharedModule"]
            ]
        })
    ], SettingsModule);
    return SettingsModule;
}());



/***/ }),

/***/ "./src/app/main/settings/settings.route.ts":
/*!*************************************************!*\
  !*** ./src/app/main/settings/settings.route.ts ***!
  \*************************************************/
/*! exports provided: SettingsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsRoutes", function() { return SettingsRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/main/settings/settings/settings.component.ts");


var SettingsRoutes = [
    {
        path: '',
        component: _settings_settings_component__WEBPACK_IMPORTED_MODULE_1__["SettingsComponent"]
    },
    {
        path: 'settings',
        component: _settings_settings_component__WEBPACK_IMPORTED_MODULE_1__["SettingsComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/settings/settings/settings.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/main/settings/settings/settings.component.scss ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("html,\nbody {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.m-top-10 {\n  margin-top: 10%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9zZXR0aW5ncy9zZXR0aW5ncy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXHNldHRpbmdzXFxzZXR0aW5nc1xcc2V0dGluZ3MuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vc2V0dGluZ3Mvc2V0dGluZ3Mvc2V0dGluZ3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsU0FBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxlQUFBO0FDQ0YiLCJmaWxlIjoic3JjL2FwcC9tYWluL3NldHRpbmdzL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiaHRtbCxcclxuYm9keSB7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ubS10b3AtMTAge1xyXG4gIG1hcmdpbi10b3A6IDEwJTtcclxufVxyXG4iLCJodG1sLFxuYm9keSB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ubS10b3AtMTAge1xuICBtYXJnaW4tdG9wOiAxMCU7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/settings/settings/settings.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/main/settings/settings/settings.component.ts ***!
  \**************************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_setting_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/setting-api.service */ "./src/services/setting-api.service.ts");
/* harmony import */ var _shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/utils/Shared */ "./src/shared/utils/Shared.ts");








var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(settingApiService, dataService, toastrService) {
        this.settingApiService = settingApiService;
        this.dataService = dataService;
        this.toastrService = toastrService;
        this.currencies = [];
        this.methods = [
            { code: 'FIFO', description: 'First In First Out' },
            { code: 'LIFO', description: 'Last In First Out' },
            { code: 'MINTAX', description: 'Minimum Tax' }
        ];
        this.months = moment__WEBPACK_IMPORTED_MODULE_4__["months"]();
        this.days = [];
        this.dates = [];
        this.settingId = 0;
        this.day = '';
        this.requestType = 'PUT';
        this.isLoading = true;
        this.isSaving = false;
        this.isGridViewsActive = false;
        this.style = _shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["Style"];
        this.styleForHeight = Object(_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["HeightStyle"])(180);
        this.processingMsgDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.hideGrid = false;
        this.createDates();
    }
    SettingsComponent.prototype.setWidthAndHeight = function (width, height) {
        this.style = {
            marginTop: '20px',
            width: width,
            height: height,
            boxSizing: 'border-box'
        };
    };
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getCurrencies();
            }
        });
    };
    SettingsComponent.prototype.activateTab = function (tab) {
        switch (tab) {
            case 'GridViews':
                this.isGridViewsActive = true;
                break;
            default:
                break;
        }
    };
    SettingsComponent.prototype.onChangeReportingMonth = function (selectedMonth) {
        this.days = this.dates.find(function (date) { return date.month === selectedMonth; }).days;
    };
    SettingsComponent.prototype.getCurrencies = function () {
        var _this = this;
        this.settingApiService.getReportingCurrencies().subscribe(function (response) {
            if (response.isSuccessful) {
                _this.currencies = response.payload;
            }
            _this.getSettings();
        }, function (error) {
            _this.isLoading = false;
        });
    };
    SettingsComponent.prototype.getSettings = function () {
        var _this = this;
        this.settingApiService.getSettings().subscribe(function (response) {
            if (response.isSuccessful && response.statusCode === 200) {
                _this.requestType = 'PUT';
                _this.onChangeReportingMonth(response.payload[0].fiscal_month);
                _this.settingId = response.payload[0].id;
                _this.settingsForm.form.patchValue({
                    theme: response.payload[0].theme,
                    currency: response.payload[0].currency_code,
                    methodology: response.payload[0].tax_methodology,
                    month: response.payload[0].fiscal_month
                });
                _this.day = response.payload[0].fiscal_day;
            }
            else if (response.isSuccessful && response.statusCode === 404) {
                _this.requestType = 'POST';
            }
            _this.isLoading = false;
        }, function (error) {
            _this.isLoading = false;
        });
    };
    SettingsComponent.prototype.onSaveSettings = function () {
        var _this = this;
        this.isSaving = true;
        var payload = {
            id: this.settingId,
            theme: this.settingsForm.value.theme,
            currencyCode: this.settingsForm.value.currency,
            taxMethodology: this.settingsForm.value.methodology,
            fiscalMonth: this.settingsForm.value.month,
            fiscalDay: this.settingsForm.value.day
        };
        var requestMethod = this.requestType === 'POST' ? 'createSettings' : 'saveSettings';
        this.settingApiService[requestMethod](payload).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Settings Saved Successfully');
            }
            _this.isSaving = false;
            _this.getSettings();
        }, function (error) {
            _this.isSaving = false;
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    SettingsComponent.prototype.createDates = function () {
        var _this = this;
        this.months.forEach(function (month) {
            _this.dates.push({
                month: month,
                days: _this.getListofDaysByMonth(month)
            });
        });
    };
    SettingsComponent.prototype.getListofDaysByMonth = function (month) {
        var days = [];
        for (var i = 1; i <= moment__WEBPACK_IMPORTED_MODULE_4__(moment__WEBPACK_IMPORTED_MODULE_4__().month(month)).daysInMonth(); i++) {
            days.push(i);
        }
        return days;
    };
    SettingsComponent.ctorParameters = function () { return [
        { type: _services_setting_api_service__WEBPACK_IMPORTED_MODULE_6__["SettingApiService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('settingsForm', { static: true }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgForm"])
    ], SettingsComponent.prototype, "settingsForm", void 0);
    SettingsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-settings',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./settings.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/settings/settings/settings.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./settings.component.scss */ "./src/app/main/settings/settings/settings.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_setting_api_service__WEBPACK_IMPORTED_MODULE_6__["SettingApiService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"]])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-settings-settings-module.js.map