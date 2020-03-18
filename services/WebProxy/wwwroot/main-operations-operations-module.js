(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-operations-operations-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-exception/file-exception.component.html":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-exception/file-exception.component.html ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!----- Grid View Div Starts ----->\r\n<div class=\"d-flex\" [ngStyle]=\"styleForHeight\">\r\n  <!----- AG Grid Starts ----->\r\n  <ag-grid-angular class=\"width-55 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\">\r\n  </ag-grid-angular>\r\n  <!----- AG Grid Ends ----->\r\n  <!----- Action buttons Template Starts ----->\r\n  <ng-template #actionButtons let-row>\r\n    <button class=\"btn grid-btn width-15 height-30px\" (click)=\"viewLayout(row)\" tooltip=\"View\" placement=\"auto\"\r\n      container=\"body\">\r\n      <i class=\"fa fa-lg fa-eye\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </ng-template>\r\n  <!----- Action buttons Template Ends ----->\r\n\r\n  <!----- Grid Layout Json Div Starts ----->\r\n  <div *ngIf=\"invalidRecordJson\" class=\"width-45 h-100 json-container\">\r\n    <pre>{{invalidRecordJson | json}}</pre>\r\n  </div>\r\n  <!----- Grid Layout Json Div Ends ----->\r\n\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-management/file-management.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-management/file-management.component.html ***!
  \**********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Action Buttons Div -->\r\n<div class=\"row\">\r\n  <div class=\"ml-3\">\r\n    <h4>LightPoint Files</h4>\r\n  </div>\r\n  <div class=\"ml-auto mr-3\">\r\n    <app-grid-utils [gridOptions]=\"filesGridOptions\" (refresh)=\"refreshFilesGrid()\" [excelParams]=\"excelParams\">\r\n    </app-grid-utils>\r\n  </div>\r\n</div>\r\n<!-- AG Grid for Files -->\r\n<div [ngStyle]=\"styleForLogsHeight\">\r\n  <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"filesGridOptions\"\r\n    [getContextMenuItems]=\"getContextMenuItems\">\r\n  </ag-grid-angular>\r\n  <!----- Action buttons Template Starts ----->\r\n  <ng-template #actionButtons let-row>\r\n    <button class=\"btn action-btn width-15 height-30px\" (click)=\"downloadFile(row)\" tooltip=\"View\" placement=\"auto\"\r\n      container=\"body\">\r\n      <i class=\"fa fa-download\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </ng-template>\r\n  <!----- Action buttons Template Ends ----->\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-upload/file-upload.component.html":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-upload/file-upload.component.html ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- File Upload Container -->\r\n<div class=\"row mt-2\">\r\n\r\n  <!-- File Type Dropdown Div -->\r\n  <div class=\"col-auto\">\r\n    <select class=\"form-control\" [(ngModel)]=\"fileType\" (ngModelChange)=\"changeFileType($event)\">\r\n      <option [disabled]=\"true\">Select a File Type</option>\r\n      <option *ngFor=\"let fileType of fileTypes\">\r\n        {{ fileType }}\r\n      </option>\r\n    </select>\r\n  </div>\r\n  <!-- File Type Dropdown Div Ends -->\r\n\r\n  <!-- File Upload Input Div -->\r\n  <div class=\"col-auto\">\r\n    <input #fileInput class=\"btn btn-pa mr-2 file-input\" type=\"file\" (change)=\"onFileInput($event.target.files)\">\r\n    <button class=\"btn btn-pa\" type=\"button\" [disabled]=\"disableFileUpload || uploadLoader\" (click)=\"uploadRows()\">\r\n      Upload\r\n      <span *ngIf=\"uploadLoader\" class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\r\n    </button>\r\n  </div>\r\n  <!-- File Upload Input Div Ends -->\r\n\r\n</div>\r\n<!-- File Upload Container Ends -->\r\n\r\n<!-- AG Grid for file Upload -->\r\n<div [ngStyle]=\"styleForLogsHeight\" [ngClass]=\"{'w-100' : displayGrid, 'd-none' : !displayGrid}\">\r\n  <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"uploadGrid\">\r\n  </ag-grid-angular>\r\n</div>\r\n\r\n<!-- Confirmation Modal Component -->\r\n<app-confirmation-modal #confirmationModal (confirmDeletion)=\"confirmReset()\" [modalTitle]=\"'Reset Performance'\"\r\n  [modalDescription]=\"'All your changes will be lost.\\nAre you sure you want to reset performance?'\">\r\n</app-confirmation-modal>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/operations.component.html":
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/operations.component.html ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Main Tab View -->\r\n<tabset>\r\n  <!-- Logs Tab -->\r\n  <tab heading=\"Logs\" (selectTab)=\"activeLogs()\">\r\n    <!-- Action Buttons Div -->\r\n    <div class=\"row\" [ngStyle]=\"style\">\r\n      <div class=\"ml-auto mr-3\">\r\n        <app-grid-utils [gridOptions]=\"gridOptions\" (refresh)=\"refreshGrid()\" [excelParams]=\"excelParams\">\r\n        </app-grid-utils>\r\n      </div>\r\n    </div>\r\n    <!-- AG Grid for Logs -->\r\n    <div [ngStyle]=\"styleForLogsHeight\">\r\n      <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"gridOptions\"\r\n        [getContextMenuItems]=\"getContextMenuItems\">\r\n      </ag-grid-angular>\r\n    </div>\r\n  </tab>\r\n  <!-- Logs Tab Ends -->\r\n\r\n  <!-- Tasks Tab -->\r\n  <tab #task heading=\"Tasks\">\r\n    <div [ngStyle]=\"styleForTasksHeight\">\r\n      <!-- Tasks Div -->\r\n      <div class=\"row\">\r\n\r\n        <!-- Run Engine Div -->\r\n        <div class=\"col-2\">\r\n          <!-- <p-dropdown [options]=\"periods\" [(ngModel)]=\"selectedPeriod\" optionLabel=\"name\"></p-dropdown> -->\r\n          <select class=\"form-control\" [(ngModel)]=\"selectedPeriod\">\r\n            <option [disabled]=\"true\" [ngValue]=\"periodPlaceholder\">Select a Period</option>\r\n            <option *ngFor=\"let period of periods\" [ngValue]=\"period\">\r\n              {{ period.name }}\r\n            </option>\r\n          </select>\r\n        </div>\r\n        <div class=\"col-2 p-0\">\r\n          <button class=\"btn btn-pa ml-2\" type=\"button\" [disabled]=\"isLoading\" (click)=\"runEngine()\">\r\n            Run Engine\r\n          </button>\r\n        </div>\r\n        <!-- Run Engine Div Ends -->\r\n\r\n        <!-- Silver End of Day Div -->\r\n        <div class=\"col-2\">\r\n          <input type=\"text\" class=\"form-control\" ngxDaterangepickerMd placeholder=\"Business Date\"\r\n            [(ngModel)]=\"businessDate\" [singleDatePicker]=\"true\" [autoApply]=\"true\" />\r\n        </div>\r\n        <div class=\"col-2 p-0\">\r\n          <button class=\"btn btn-pa\" type=\"button\" [disabled]=\"isLoading || generateFilesLoader\"\r\n            (click)=\"generateFiles()\">\r\n            <span *ngIf=\"generateFilesLoader\" class=\"spinner-border spinner-border-sm\" role=\"status\"\r\n              aria-hidden=\"true\"></span>\r\n            Silver End of Day\r\n          </button>\r\n        </div>\r\n        <!-- Silver End of Day Div Ends -->\r\n\r\n        <!-- Clear Journal Div -->\r\n        <div class=\"col-4\">\r\n          <form class=\"float-right\" [formGroup]=\"clearJournalForm\" (ngSubmit)=\"openModal()\">\r\n            <div class=\"mr-3\">\r\n              <div class=\"form-check\">\r\n                <input type=\"checkbox\" class=\"form-check-input\" id=\"system\" formControlName=\"system\" />\r\n                <label class=\"form-check-label\" for=\"system\">System Generated</label>\r\n              </div>\r\n              <div class=\"form-check\">\r\n                <input type=\"checkbox\" class=\"form-check-input\" id=\"user\" formControlName=\"user\" />\r\n                <label class=\"form-check-label\" for=\"user\">User Generated</label>\r\n              </div>\r\n              <button class=\"btn btn-danger mt-2\" [disabled]=\"validateClearForm()\" type=\"submit\">\r\n                Clear Journal\r\n              </button>\r\n            </div>\r\n          </form>\r\n        </div>\r\n        <!-- Clear Journal Div Ends -->\r\n\r\n      </div>\r\n      <!-- Tasks Div Ends -->\r\n\r\n      <!-- Posting Engine Messages Div -->\r\n      <div *ngIf=\"isLoading\">\r\n        <h3 class=\"mt-4\">Progress</h3>\r\n        <div #logScroll [ngStyle]=\"containerDiv\">\r\n          <div *ngFor=\"let message of messages\">\r\n            {{ message }}\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!-- Posting Engine Messages Div Ends -->\r\n\r\n    </div>\r\n    <!-- Confirmation Modal Selector -->\r\n    <app-confirmation-modal #confirmModal (confirmDeletion)=\"clearJournal()\" [modalTitle]=\"'Clear Journal'\">\r\n    </app-confirmation-modal>\r\n    <!-- Confirmation Modal Selector Ends -->\r\n\r\n  </tab>\r\n  <!-- Tasks Tab Ends -->\r\n\r\n  <!-- File Uploads Tab -->\r\n  <tab heading=\"Uploads\">\r\n    <div [ngStyle]=\"style\">\r\n      <app-file-upload></app-file-upload>\r\n    </div>\r\n  </tab>\r\n  <!-- File Uploads Tab Ends -->\r\n\r\n  <!-- Files Tab -->\r\n  <tab heading=\"Import / Export\" (selectTab)=\"activeFileManagement()\">\r\n    <div [ngStyle]=\"style\">\r\n      <div class=\"row\">\r\n        <!-- File Management Div -->\r\n        <div class=\"col-6\">\r\n          <app-file-management *ngIf=\"fileManagementActive\"></app-file-management>\r\n        </div>\r\n        <!-- File Management Div Ends -->\r\n\r\n        <!-- Silver File Management -->\r\n        <div class=\"col-6\">\r\n          <app-silver-file-management *ngIf=\"fileManagementActive\"></app-silver-file-management>\r\n        </div>\r\n        <!-- Silver File Management Ends -->\r\n      </div>\r\n    </div>\r\n  </tab>\r\n  <!-- Files Tab Ends -->\r\n\r\n  <!-- File Exception Tab -->\r\n  <tab heading=\"Export Exceptions\" (selectTab)=\"activeExportException()\">\r\n    <div class=\"col-12\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-file-exception *ngIf=\"exportExceptionActive\"></app-file-exception>\r\n      </div>\r\n    </div>\r\n    <!-- File Exception Tab Ends -->\r\n  </tab>\r\n\r\n  <!-- Services Status Tab -->\r\n  <tab heading=\"Services Status\" (selectTab)=\"activeServicesStatus()\">\r\n    <div class=\"col-12\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-services-status *ngIf=\"servicesStatus\"></app-services-status>\r\n      </div>\r\n    </div>\r\n    <!-- Services Status Tab Ends -->\r\n  </tab>\r\n\r\n  <!-- Services Log Tab -->\r\n  <tab heading=\"Services Log\" (selectTab)=\"activeServicesLog()\">\r\n    <div class=\"col-12\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-services-log *ngIf=\"servicesLog\"></app-services-log>\r\n      </div>\r\n    </div>\r\n    <!-- Services Log Tab Ends -->\r\n  </tab>\r\n</tabset>\r\n<!-- Main Tab View Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-log/services-log.component.html":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-log/services-log.component.html ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div [ngStyle]=\"styleForHeight\">\r\n    <lp-services-log [getLogsUrl]=\"getLogsUrl\" [viewFileUrl]=\"viewFileUrl\" [downloadFileUrl]=\"downloadFileUrl\">\r\n    </lp-services-log>\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-status/services-status.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-status/services-status.component.html ***!
  \**********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div *ngIf=\"!show\" class=\"d-flex justify-content-center align-items-center height-50vh\">\r\n  <lp-loading></lp-loading>\r\n</div>\r\n\r\n<div class=\"form_wrapper\" *ngIf=\"show\">\r\n  <div class=\"d-flex justify-content-between title-bg-color\">\r\n    <div>\r\n      <h3>List of Services</h3>\r\n    </div>\r\n\r\n    <div class=\"icon-wrap\">\r\n      <h2><i class=\"fa fa-refresh\" aria-hidden=\"true\" (click)=\"loadService()\"></i></h2>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"card-wrapper\" *ngFor=\"let service of listOfServices\">\r\n    <div>\r\n      <div class=\"w-100 d-flex flex-row justify-content-between\">\r\n        <div class=\"fz-20 label-p\">\r\n          <p>{{ service.serviceName }}</p>\r\n        </div>\r\n\r\n        <div class=\"status\" [ngClass]=\"{\r\n            'color-primary': service.status == 'Running',\r\n            'bc-red': service.status == 'Stopped'\r\n          }\">\r\n          <span>{{ service.status }}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/silver-file-management/silver-file-management.component.html":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/silver-file-management/silver-file-management.component.html ***!
  \************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Action Buttons Div -->\r\n<div class=\"row\">\r\n  <div class=\"ml-3\">\r\n    <h4>Silver Files (S3)</h4>\r\n  </div>\r\n  <div class=\"ml-auto mr-3\">\r\n    <app-grid-utils [gridOptions]=\"filesGridOptions\" (refresh)=\"refreshFilesGrid()\" [excelParams]=\"excelParams\">\r\n    </app-grid-utils>\r\n  </div>\r\n</div>\r\n<!-- AG Grid for Silver Files -->\r\n<div [ngStyle]=\"styleForLogsHight\">\r\n  <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"filesGridOptions\"\r\n    [getContextMenuItems]=\"getContextMenuItems\">\r\n  </ag-grid-angular>\r\n  <!----- Action buttons Template Starts ----->\r\n  <ng-template #actionButtons let-row>\r\n    <button class=\"btn ml-5 grid-btn width-15 height-30px\" (click)=\"downloadFile(row)\" tooltip=\"View\" placement=\"auto\"\r\n      container=\"body\">\r\n      <i class=\"fa fa-download\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </ng-template>\r\n  <!----- Action buttons Template Ends ----->\r\n</div>");

/***/ }),

/***/ "./src/app/main/operations/file-exception/file-exception.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/main/operations/file-exception/file-exception.component.scss ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9maWxlLWV4Y2VwdGlvbi9maWxlLWV4Y2VwdGlvbi5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/operations/file-exception/file-exception.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/main/operations/file-exception/file-exception.component.ts ***!
  \****************************************************************************/
/*! exports provided: FileExceptionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileExceptionComponent", function() { return FileExceptionComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/file-management-api.service */ "./src/services/file-management-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");











var FileExceptionComponent = /** @class */ (function () {
    function FileExceptionComponent(fileManagementApiService, toastrService, dataService) {
        this.fileManagementApiService = fileManagementApiService;
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.isEngineRunning = false;
        this.hideGrid = false;
        this.invalidRecordJson = null;
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["HeightStyle"])(180);
    }
    FileExceptionComponent.prototype.ngOnInit = function () {
        // this.isEngineRunning = this.postingEngineService.getStatus();
        this.initGrid();
    };
    FileExceptionComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFileExceptionData();
            }
        });
    };
    FileExceptionComponent.prototype.initGrid = function () {
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotRowTotals: 'after',
            pivotColumnGroupTotals: 'after',
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            masterDetail: true,
            detailCellRendererParams: {
                detailGridOptions: {
                    columnDefs: [
                        { field: 'referenceNumber' },
                        { field: 'rowNumber', type: 'numericColumn' },
                        {
                            headerName: 'Actions',
                            cellRendererFramework: src_app_template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_7__["TemplateRendererComponent"],
                            cellRendererParams: {
                                ngTemplate: this.actionButtons
                            }
                        }
                    ],
                    onFirstDataRendered: function (params) {
                        params.api.sizeColumnsToFit();
                    }
                },
                getDetailRowData: function (params) {
                    params.successCallback(params.data.exceptionList);
                },
                onGridReady: function (params) { },
                onFirstDataRendered: function (params) {
                    Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["AutoSizeAllColumns"])(params);
                    params.api.sizeColumnsToFit();
                },
                defaultColDef: {
                    sortable: true,
                    resizable: true,
                    filter: true
                }
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].fileExceptionId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].fileException, this.gridOptions);
    };
    FileExceptionComponent.prototype.customizeColumns = function () {
        var colDefs = [
            {
                field: 'id',
                headerName: 'File Exception Id',
                hide: true
            },
            {
                field: 'fileName',
                headerName: 'File Name',
                cellRenderer: 'agGroupCellRenderer'
            },
            {
                field: 'businessDate',
                headerName: 'Business Date'
            },
            {
                field: 'source',
                headerName: 'Source'
            },
            {
                field: 'exceptionCount',
                headerName: 'Count',
                type: 'numericColumn'
            }
        ];
        this.gridOptions.api.setColumnDefs(colDefs);
    };
    FileExceptionComponent.prototype.getFileExceptionData = function () {
        var _this = this;
        this.fileManagementApiService
            .getInvalidExportRecords()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1))
            .subscribe(function (resp) {
            if (resp.isSuccessful) {
                _this.gridLayouts = resp.payload;
                _this.rowData = resp.payload.map(function (data) { return ({
                    fileId: data.FileId,
                    fileExceptionId: data.FileExceptionId,
                    fileName: data.FileName,
                    source: data.Source,
                    businessDate: moment__WEBPACK_IMPORTED_MODULE_6__(data.BusinessDate).format('YYYY-MM-DD'),
                    exceptionCount: data.Exceptions,
                    exceptionList: data.ExceptionList.map(function (d) { return ({
                        referenceNumber: d.Reference,
                        rowNumber: JSON.parse(d.Record).RowNumber,
                        record: d.Record
                    }); })
                }); });
            }
            _this.gridOptions.api.setRowData(_this.rowData);
            Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_10__["AutoSizeAllColumns"])(_this.gridOptions);
            _this.gridOptions.api.sizeColumnsToFit();
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
        this.customizeColumns();
    };
    FileExceptionComponent.prototype.viewLayout = function (row) {
        this.invalidRecordJson = JSON.parse(row.record);
    };
    FileExceptionComponent.ctorParameters = function () { return [
        { type: src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_9__["FileManagementApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], FileExceptionComponent.prototype, "actionButtons", void 0);
    FileExceptionComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-file-exception',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./file-exception.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-exception/file-exception.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./file-exception.component.scss */ "./src/app/main/operations/file-exception/file-exception.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_9__["FileManagementApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"]])
    ], FileExceptionComponent);
    return FileExceptionComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/file-management/file-management.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/main/operations/file-management/file-management.component.scss ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9maWxlLW1hbmFnZW1lbnQvZmlsZS1tYW5hZ2VtZW50LmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/operations/file-management/file-management.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/operations/file-management/file-management.component.ts ***!
  \******************************************************************************/
/*! exports provided: FileManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileManagementComponent", function() { return FileManagementComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/services/file-management-api.service */ "./src/services/file-management-api.service.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");










var FileManagementComponent = /** @class */ (function () {
    function FileManagementComponent(fileManagementApiService, toastrService) {
        var _this = this;
        this.fileManagementApiService = fileManagementApiService;
        this.toastrService = toastrService;
        this.excelParams = {
            fileName: 'File Management',
            sheetName: 'First Sheet',
            columnKeys: [
                'name',
                'action',
                'source',
                'statistics',
                'businessDate',
                'actionStartDate',
                'actionEndDate'
            ]
        };
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["Style"];
        this.styleForLogsHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["HeightStyle"])(220);
        this.getContextMenuItems = function (params) {
            var process = [
                {
                    name: 'Process',
                    action: function () {
                        _this.processFile(params);
                    }
                }
            ];
            return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_8__["GetContextMenu"])(false, process, true, null, params);
        };
        this.initGrid();
    }
    FileManagementComponent.prototype.ngOnInit = function () { };
    FileManagementComponent.prototype.ngAfterViewInit = function () {
        this.getFiles();
    };
    FileManagementComponent.prototype.initGrid = function () {
        this.filesGridOptions = {
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_3__["GridLayoutMenuComponent"] },
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            onGridReady: function (params) { },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["AutoSizeAllColumns"])(params);
            }
        };
        this.filesGridOptions.getRowStyle = function (params) {
            if (params.data.exceptions) {
                return { backgroundColor: '#ffcfcf' };
            }
        };
        this.filesGridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_9__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__["GridId"].filesId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_4__["GridName"].files, this.filesGridOptions);
    };
    FileManagementComponent.prototype.setColDefs = function () {
        var colDefs = [
            {
                field: 'id',
                headerName: 'Id',
                hide: true
            },
            {
                field: 'name',
                headerName: 'File Name',
                sortable: true,
                filter: true,
                enableRowGroup: true,
                resizable: true
            },
            {
                field: 'path',
                headerName: 'Path',
                hide: true
            },
            {
                field: 'fileActionId',
                headerName: 'File Action Id',
                hide: true
            },
            {
                field: 'action',
                headerName: 'Action',
                sortable: true,
                filter: true,
                resizable: true
            },
            {
                field: 'source',
                headerName: 'Source',
                sortable: true,
                filter: true,
                resizable: true
            },
            {
                field: 'statistics',
                headerName: 'Statistics',
                sortable: true,
                filter: true,
                resizable: true,
                type: 'numericColumn'
            },
            {
                field: 'businessDate',
                headerName: 'Business Date',
                sortable: true,
                filter: true,
                enableRowGroup: true,
                resizable: true
            },
            {
                field: 'actionStartDate',
                headerName: 'Start Date',
                sortable: true,
                filter: true
            },
            {
                field: 'actionEndDate',
                headerName: 'End Date',
                sortable: true,
                filter: true
            },
            {
                headerName: 'View',
                cellRendererFramework: _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_6__["TemplateRendererComponent"],
                cellRendererParams: {
                    ngTemplate: this.actionButtons
                }
            }
        ];
        this.filesGridOptions.api.setColumnDefs(colDefs);
    };
    FileManagementComponent.prototype.getFiles = function () {
        var _this = this;
        this.fileManagementApiService.getFiles().subscribe(function (result) {
            _this.files = result.payload.map(function (item) { return ({
                id: item.id,
                name: item.name,
                path: item.path,
                source: item.source,
                statistics: item.statistics,
                fileActionId: item.file_action_id,
                action: item.action,
                actionStartDate: moment__WEBPACK_IMPORTED_MODULE_5__(item.action_start_date).format('MMM-DD-YYYY hh:mm:ss'),
                actionEndDate: moment__WEBPACK_IMPORTED_MODULE_5__(item.action_end_date).format('MMM-DD-YYYY hh:mm:ss'),
                businessDate: moment__WEBPACK_IMPORTED_MODULE_5__(item.business_date).format('MMM-DD-YYYY hh:mm:ss'),
                exceptions: item.exceptions
            }); });
            _this.filesGridOptions.api.setRowData(_this.files);
        });
        this.setColDefs();
    };
    FileManagementComponent.prototype.refreshFilesGrid = function () {
        this.filesGridOptions.api.showLoadingOverlay();
        this.getFiles();
    };
    FileManagementComponent.prototype.setGroupingStateForFiles = function (value) {
        this.filesGridOptions.api.forEachNode(function (node, index) {
            if (node.group) {
                node.setExpanded(value);
            }
        });
    };
    FileManagementComponent.prototype.processFile = function (params) {
        var local = this;
        this.toastrService.success('File Processing is Started');
        var obj = {
            fileId: params.node.data.id,
            action: 'Processing'
        };
        this.fileManagementApiService.updateAction(obj).subscribe(function (resp) {
            if (resp.isSuccessful) {
                local.getFiles();
            }
        });
    };
    FileManagementComponent.prototype.downloadFile = function (file) { };
    FileManagementComponent.ctorParameters = function () { return [
        { type: src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_7__["FileManagementApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], FileManagementComponent.prototype, "actionButtons", void 0);
    FileManagementComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-file-management',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./file-management.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-management/file-management.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./file-management.component.scss */ "./src/app/main/operations/file-management/file-management.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_7__["FileManagementApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]])
    ], FileManagementComponent);
    return FileManagementComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/file-upload/file-upload.component.scss":
/*!************************************************************************!*\
  !*** ./src/app/main/operations/file-upload/file-upload.component.scss ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/******************************\n****  Component UI Styles  ****\n******************************/\n.file-input {\n  padding: 0.2rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vcGVyYXRpb25zL2ZpbGUtdXBsb2FkL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFxmcm9udGVuZGFwcC9zcmNcXGFwcFxcbWFpblxcb3BlcmF0aW9uc1xcZmlsZS11cGxvYWRcXGZpbGUtdXBsb2FkLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL29wZXJhdGlvbnMvZmlsZS11cGxvYWQvZmlsZS11cGxvYWQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OzhCQUFBO0FBR0E7RUFDRSxlQUFBO0FDQ0YiLCJmaWxlIjoic3JjL2FwcC9tYWluL29wZXJhdGlvbnMvZmlsZS11cGxvYWQvZmlsZS11cGxvYWQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbioqKiogIENvbXBvbmVudCBVSSBTdHlsZXMgICoqKipcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4uZmlsZS1pbnB1dCB7XHJcbiAgcGFkZGluZzogMC4ycmVtO1xyXG59XHJcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKiogIENvbXBvbmVudCBVSSBTdHlsZXMgICoqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi5maWxlLWlucHV0IHtcbiAgcGFkZGluZzogMC4ycmVtO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/operations/file-upload/file-upload.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/main/operations/file-upload/file-upload.component.ts ***!
  \**********************************************************************/
/*! exports provided: FileUploadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileUploadComponent", function() { return FileUploadComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var src_services_service_proxies__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/services/fund-theoretical-api.service */ "./src/services/fund-theoretical-api.service.ts");
/* harmony import */ var _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");




/* Services/Components Imports */





var FileUploadComponent = /** @class */ (function () {
    function FileUploadComponent(financeService, fundTheoreticalApiService, toastrService, dataDictionary) {
        this.financeService = financeService;
        this.fundTheoreticalApiService = fundTheoreticalApiService;
        this.toastrService = toastrService;
        this.dataDictionary = dataDictionary;
        this.styleForLogsHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(220);
        this.displayGrid = false;
        this.ignoreFields = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["IgnoreFields"];
        this.rowData = [];
        this.fileToUpload = null;
        this.disableFileUpload = true;
        this.uploadLoader = false;
        this.confirmStatus = false;
        this.fileType = 'Select a File Type';
        this.fileTypes = ['Monthly Performance', 'Daily PnL', 'Market Prices', 'FxRates'];
    }
    FileUploadComponent.prototype.ngOnInit = function () {
        this.initGrid();
    };
    FileUploadComponent.prototype.initGrid = function () {
        this.uploadGrid = {
            rowData: null,
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_3__["GridLayoutMenuComponent"] },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotRowTotals: 'after',
            pivotColumnGroupTotals: 'after',
            animateRows: true,
            singleClickEdit: true,
            getExternalFilterState: function () {
                return {};
            },
            onRowSelected: function (params) { },
            clearExternalFilter: function () { },
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            },
            onFirstDataRendered: function (params) {
                params.api.sizeColumnsToFit();
            },
            defaultColDef: {
                resizable: true
            }
        };
    };
    FileUploadComponent.prototype.changeFileType = function (selectedFileType) {
        this.disableFileUpload =
            this.fileToUpload === null || this.fileType === 'Select a File Type' ? true : false;
        this.fileType = selectedFileType;
    };
    FileUploadComponent.prototype.onFileInput = function (files) {
        this.disableFileUpload = this.fileType === 'Select a File Type' ? true : false;
        this.fileToUpload = files.item(0);
    };
    FileUploadComponent.prototype.uploadRows = function () {
        var _this = this;
        if (this.fileType === 'Monthly Performance') {
            this.uploadLoader = true;
            this.fundTheoreticalApiService.getMonthlyPerformanceStatus().subscribe(function (response) {
                _this.uploadLoader = false;
                if (response.isSuccessful) {
                    if (response.payload) {
                        _this.confirmStatus = true;
                        _this.confirmationModal.showModal();
                    }
                    else {
                        _this.uploadMonthlyPerformance();
                    }
                }
                else {
                    _this.toastrService.error('Something went wrong! Try Again.');
                }
            });
        }
        else if (this.fileType === 'Daily PnL') {
            this.uploadDailyUnofficialPnl();
        }
        else if (this.fileType === 'Market Prices') {
            this.uploadMarketData();
        }
        else if (this.fileType === 'FxRates') {
            this.uploadFxRatesData();
        }
    };
    FileUploadComponent.prototype.confirmReset = function () {
        if (this.confirmStatus) {
            this.uploadMonthlyPerformance();
        }
    };
    FileUploadComponent.prototype.uploadMonthlyPerformance = function () {
        var _this = this;
        this.uploadLoader = true;
        this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            _this.confirmStatus = false;
            if (response.isSuccessful) {
                _this.displayGrid = false;
                _this.clearForm();
                _this.toastrService.success('File uploaded successfully!');
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FileUploadComponent.prototype.uploadDailyUnofficialPnl = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService
            .uploadDailyUnofficialPnl(this.fileToUpload)
            .subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful) {
                _this.displayGrid = false;
                _this.clearForm();
                _this.toastrService.success('File uploaded successfully!');
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FileUploadComponent.prototype.uploadMarketData = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService.uploadMarketPriceData(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            if (response.isSuccessful && response.statusCode == 200) {
                _this.displayGrid = false;
                _this.clearForm();
                _this.toastrService.success('File uploaded successfully!');
            }
            else if (response.isSuccessful && response.statusCode == 403) {
                _this.displayGrid = true;
                _this.columns = response.meta;
                _this.rowData = response.payload;
                _this.customizeColumns(_this.columns);
                _this.uploadGrid.api.setRowData(_this.rowData);
                _this.clearForm();
                _this.toastrService.error('Error: Duplication Detected!');
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    FileUploadComponent.prototype.uploadFxRatesData = function () {
        var _this = this;
        this.uploadLoader = true;
        this.fundTheoreticalApiService.uploadFxData(this.fileToUpload).subscribe(function (response) {
            _this.uploadLoader = false;
            _this.displayGrid = false;
            if (response.isSuccessful && response.statusCode == 200) {
                _this.clearForm();
                _this.toastrService.success('File uploaded successfully!');
            }
            else if (response.isSuccessful && response.statusCode == 403) {
                _this.displayGrid = true;
                _this.columns = response.meta;
                _this.rowData = response.payload;
                _this.customizeColumns(_this.columns);
                _this.uploadGrid.api.setRowData(_this.rowData);
                _this.clearForm();
                _this.toastrService.error('Error: Duplication Detected!');
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
    };
    /*
    Drives the columns that will be defined on the UI, and what can be done with those fields
    */
    FileUploadComponent.prototype.customizeColumns = function (columns) {
        var storeColumns = [];
        for (var i = 1; i < columns.length; i++) {
            storeColumns.push(this.dataDictionary.column(columns[i].field, true));
        }
        this.uploadGrid.api.setColumnDefs(storeColumns);
    };
    FileUploadComponent.prototype.clearForm = function () {
        this.disableFileUpload = true;
        this.fileType = 'Select a File Type';
        this.fileToUpload = null;
        this.fileInput.nativeElement.value = '';
    };
    FileUploadComponent.ctorParameters = function () { return [
        { type: src_services_service_proxies__WEBPACK_IMPORTED_MODULE_5__["FinanceServiceProxy"] },
        { type: src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_6__["FundTheoreticalApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_7__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_4__["ConfirmationModalComponent"])
    ], FileUploadComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('fileInput', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], FileUploadComponent.prototype, "fileInput", void 0);
    FileUploadComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-file-upload',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./file-upload.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/file-upload/file-upload.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./file-upload.component.scss */ "./src/app/main/operations/file-upload/file-upload.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_service_proxies__WEBPACK_IMPORTED_MODULE_5__["FinanceServiceProxy"],
            src_services_fund_theoretical_api_service__WEBPACK_IMPORTED_MODULE_6__["FundTheoreticalApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            _shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_7__["DataDictionary"]])
    ], FileUploadComponent);
    return FileUploadComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/operations.component.scss":
/*!***********************************************************!*\
  !*** ./src/app/main/operations/operations.component.scss ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.modal {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n\n.modal-backdrop {\n  position: relative;\n}\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  max-width: 600px;\n  margin: 10px;\n}\n\n.modal-sm {\n  max-width: 300px;\n}\n\n.modal-lg {\n  max-width: 900px;\n}\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    margin: 30px auto;\n  }\n}\n\n@media (min-width: 320px) {\n  .modal-sm {\n    margin-right: auto;\n    margin-left: auto;\n  }\n}\n\n@media (min-width: 620px) {\n  .modal-dialog {\n    margin-right: auto;\n    margin-left: auto;\n  }\n\n  .modal-lg {\n    margin-right: 10px;\n    margin-left: 10px;\n  }\n}\n\n@media (min-width: 920px) {\n  .modal-lg {\n    margin-right: auto;\n    margin-left: auto;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vcGVyYXRpb25zL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFxmcm9udGVuZGFwcC9zcmNcXGFwcFxcbWFpblxcb3BlcmF0aW9uc1xcb3BlcmF0aW9ucy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9vcGVyYXRpb25zL29wZXJhdGlvbnMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsU0FBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxvQ0FBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7QUNDRjs7QURFQTtFQUNFLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLGdCQUFBO0FDQ0Y7O0FERUE7RUFDRTtJQUNFLGlCQUFBO0VDQ0Y7QUFDRjs7QURFQTtFQUNFO0lBQ0Usa0JBQUE7SUFDQSxpQkFBQTtFQ0FGO0FBQ0Y7O0FER0E7RUFDRTtJQUNFLGtCQUFBO0lBQ0EsaUJBQUE7RUNERjs7RURHQTtJQUNFLGtCQUFBO0lBQ0EsaUJBQUE7RUNBRjtBQUNGOztBREdBO0VBQ0U7SUFDRSxrQkFBQTtJQUNBLGlCQUFBO0VDREY7QUFDRiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9vcGVyYXRpb25zLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYm9keSxcclxuaHRtbCB7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ubW9kYWwge1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcclxufVxyXG5cclxuLm1vZGFsLWJhY2tkcm9wIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5tb2RhbC1kaWFsb2cge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB3aWR0aDogYXV0bztcclxuICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gIG1hcmdpbjogMTBweDtcclxufVxyXG5cclxuLm1vZGFsLXNtIHtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG59XHJcblxyXG4ubW9kYWwtbGcge1xyXG4gIG1heC13aWR0aDogOTAwcHg7XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIC5tb2RhbC1kaWFsb2cge1xyXG4gICAgbWFyZ2luOiAzMHB4IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcclxuICAubW9kYWwtc20ge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xyXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogNjIwcHgpIHtcclxuICAubW9kYWwtZGlhbG9nIHtcclxuICAgIG1hcmdpbi1yaWdodDogYXV0bztcclxuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xyXG4gIH1cclxuICAubW9kYWwtbGcge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogOTIwcHgpIHtcclxuICAubW9kYWwtbGcge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xyXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgfVxyXG59XHJcbiIsImJvZHksXG5odG1sIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5tb2RhbCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcbn1cblxuLm1vZGFsLWJhY2tkcm9wIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4ubW9kYWwtZGlhbG9nIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogYXV0bztcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgbWFyZ2luOiAxMHB4O1xufVxuXG4ubW9kYWwtc20ge1xuICBtYXgtd2lkdGg6IDMwMHB4O1xufVxuXG4ubW9kYWwtbGcge1xuICBtYXgtd2lkdGg6IDkwMHB4O1xufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgLm1vZGFsLWRpYWxvZyB7XG4gICAgbWFyZ2luOiAzMHB4IGF1dG87XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICAubW9kYWwtc20ge1xuICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDYyMHB4KSB7XG4gIC5tb2RhbC1kaWFsb2cge1xuICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgfVxuXG4gIC5tb2RhbC1sZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogOTIwcHgpIHtcbiAgLm1vZGFsLWxnIHtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/operations/operations.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/main/operations/operations.component.ts ***!
  \*********************************************************/
/*! exports provided: OperationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OperationsComponent", function() { return OperationsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/services/common/posting-engine.service */ "./src/services/common/posting-engine.service.ts");
/* harmony import */ var src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/services/posting-engine-api.service */ "./src/services/posting-engine-api.service.ts");
/* harmony import */ var src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/services/journal-api.service */ "./src/services/journal-api.service.ts");
/* harmony import */ var src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/services/file-management-api.service */ "./src/services/file-management-api.service.ts");














var OperationsComponent = /** @class */ (function () {
    function OperationsComponent(fileManagementApiService, postingEngineApiService, journalApiService, toastrService, postingEngineService) {
        this.fileManagementApiService = fileManagementApiService;
        this.postingEngineApiService = postingEngineApiService;
        this.journalApiService = journalApiService;
        this.toastrService = toastrService;
        this.postingEngineService = postingEngineService;
        this.bottomOptions = { alignedGrids: [] };
        this.isLoading = false;
        this.postingEngineStatus = false;
        this.fileManagementActive = false;
        this.exportExceptionActive = false;
        this.servicesStatus = false;
        this.servicesLog = false;
        this.accountSearch = { id: undefined };
        this.generateFilesLoader = false;
        this.excelParams = {
            fileName: 'Journal Logs',
            sheetName: 'First Sheet',
            columnKeys: ['rundate', 'action_on', 'action']
        };
        this.periods = [
            { name: 'Latest' },
            { name: 'Today' },
            { name: 'MTD' },
            { name: 'YTD' },
            { name: 'ITD' }
        ];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Style"];
        this.styleForLogsHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(220);
        this.styleForTasksHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(180);
        this.containerDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 326px)',
            boxSizing: 'border-box',
            overflow: 'scroll'
        };
        /*
        We can define how we need to show the data here, as this is a log file we should group by the rundate
        */
        this.columnDefs = [
            {
                field: 'rundate',
                headerName: 'Run Date',
                sortable: true,
                filter: true,
                enableRowGroup: true,
                resizable: true
            },
            {
                field: 'action_on',
                headerName: 'Action On',
                sortable: true,
                filter: true,
                resizable: true
            },
            { field: 'action', headerName: 'Action', sortable: true, filter: true }
        ];
        this.initGrid();
    }
    OperationsComponent.prototype.ngOnInit = function () {
        /*
        Align Scroll of Grid and Footer Grid
        */
        // this.gridOptions.alignedGrids.push(this.bottomOptions);
        // this.bottomOptions.alignedGrids.push(this.gridOptions);
        /*
        Params for API Request
        */
        this.symbol = 'ALL';
        this.page = 0;
        this.pageSize = 0;
        this.accountSearch.id = 0;
        this.valueFilter = 0;
        this.sortColum = '';
        this.sortDirection = '';
        this.getJournalLogs();
        this.buildForm();
    };
    OperationsComponent.prototype.ngAfterViewChecked = function () {
        this.scrollToBottom();
    };
    OperationsComponent.prototype.scrollToBottom = function () {
        try {
            this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    };
    OperationsComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            columnDefs: this.columnDefs,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_5__["GridLayoutMenuComponent"] },
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            getExternalFilterState: function () {
                return {};
            },
            onGridReady: function (params) { },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["AutoSizeAllColumns"])(params);
                params.api.sizeColumnsToFit();
            },
            enableFilter: true,
            animateRows: true,
            alignedGrids: [],
            suppressHorizontalScroll: true,
            defaultColDef: {
                sortable: true,
                resizable: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_7__["GridId"].logsId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_7__["GridName"].logs, this.gridOptions);
    };
    OperationsComponent.prototype.getJournalLogs = function () {
        var _this = this;
        this.journalApiService
            .getJournalLogs(this.symbol, this.page, this.pageSize, this.accountSearch.id, this.valueFilter, this.sortColum, this.sortDirection)
            .subscribe(function (result) {
            _this.rowData = [];
            _this.rowData = result.payload.map(function (item) { return ({
                rundate: moment__WEBPACK_IMPORTED_MODULE_3__(item.rundate).format('MMM-DD-YYYY'),
                action_on: moment__WEBPACK_IMPORTED_MODULE_3__(item.action_on).format('MMM-DD-YYYY hh:mm:ss'),
                action: item.action
            }); });
            _this.gridOptions.api.setRowData(_this.rowData);
        });
    };
    OperationsComponent.prototype.refreshGrid = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.getJournalLogs();
    };
    OperationsComponent.prototype.buildForm = function () {
        this.clearJournalForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            user: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](false),
            system: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](false)
        });
    };
    OperationsComponent.prototype.validateClearForm = function () {
        return !this.clearJournalForm.value.system && !this.clearJournalForm.value.user ? true : false;
    };
    /* This needs to call out to the Posting Engine and invoke the process,
       this is a fire and forget as the process may take a little while to complete
    */
    OperationsComponent.prototype.runEngine = function () {
        var _this = this;
        this.postingEngineStatus = true;
        this.postingEngineApiService
            .startPostingEngine(this.selectedPeriod.name)
            .subscribe(function (response) {
            if (response.IsRunning) {
                _this.isLoading = true;
                _this.key = response.key;
                _this.postingEngineService.changeStatus(true);
                _this.postingEngineService.checkProgress();
            }
            _this.key = response.key;
            _this.getLogs();
        });
    };
    OperationsComponent.prototype.generateFiles = function () {
        var _this = this;
        var obj = {
            businessDate: this.businessDate != null ? this.businessDate.startDate : null
        };
        this.generateFilesLoader = true;
        this.fileManagementApiService.generateFiles(obj).subscribe(function (response) {
            _this.generateFilesLoader = false;
            if (response.isSuccessful) {
                _this.toastrService.success('Files are Generated for Processing');
            }
            else {
                _this.toastrService.error('Something went wrong, Please try again later.');
            }
        });
    };
    OperationsComponent.prototype.getLogs = function () {
        var _this = this;
        setTimeout(function () {
            _this.postingEngineApiService.runningEngineStatus(_this.key).subscribe(function (response) {
                _this.isLoading = response.Status;
                _this.progress = response.progress;
                _this.messages = response.message === '' ? _this.messages : response.message;
                if (response.Status) {
                    _this.getLogs();
                }
                else {
                    _this.messages = '';
                }
            });
        }, 3000);
    };
    OperationsComponent.prototype.activeLogs = function () {
        var _this = this;
        this.postingEngineApiService.isPostingEngineRunning().subscribe(function (response) {
            if (response.IsRunning) {
                _this.isLoading = true;
                _this.key = response.key;
                _this.getLogs();
            }
        });
    };
    OperationsComponent.prototype.activeFileManagement = function () {
        this.fileManagementActive = true;
    };
    OperationsComponent.prototype.activeExportException = function () {
        this.exportExceptionActive = true;
    };
    OperationsComponent.prototype.activeServicesStatus = function () {
        this.servicesStatus = true;
    };
    OperationsComponent.prototype.activeServicesLog = function () {
        this.servicesLog = true;
    };
    OperationsComponent.prototype.openModal = function () {
        this.confirmationModal.showModal();
    };
    OperationsComponent.prototype.clearJournal = function () {
        var _this = this;
        var type = this.clearJournalForm.value.system && this.clearJournalForm.value.user
            ? 'both'
            : this.clearJournalForm.value.system
                ? 'system'
                : 'user';
        this.postingEngineApiService.clearJournals(type).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Journals are cleared successfully!');
            }
            else {
                _this.toastrService.error('Failed to clear Journals!');
            }
        });
        this.clearForm();
    };
    OperationsComponent.prototype.clearForm = function () {
        this.clearJournalForm.reset();
    };
    OperationsComponent.prototype.getContextMenuItems = function (params) {
        // (isDefaultItems, addDefaultItem, isCustomItems, addCustomItems, params)
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_9__["GetContextMenu"])(true, null, true, null, params);
    };
    OperationsComponent.ctorParameters = function () { return [
        { type: src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_13__["FileManagementApiService"] },
        { type: src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_11__["PostingEngineApiService"] },
        { type: src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_12__["JournalApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"] },
        { type: src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__["PostingEngineService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_6__["ConfirmationModalComponent"])
    ], OperationsComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('logScroll', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], OperationsComponent.prototype, "logContainer", void 0);
    OperationsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-operations',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./operations.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/operations.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./operations.component.scss */ "./src/app/main/operations/operations.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_13__["FileManagementApiService"],
            src_services_posting_engine_api_service__WEBPACK_IMPORTED_MODULE_11__["PostingEngineApiService"],
            src_services_journal_api_service__WEBPACK_IMPORTED_MODULE_12__["JournalApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_4__["ToastrService"],
            src_services_common_posting_engine_service__WEBPACK_IMPORTED_MODULE_10__["PostingEngineService"]])
    ], OperationsComponent);
    return OperationsComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/operations.module.ts":
/*!******************************************************!*\
  !*** ./src/app/main/operations/operations.module.ts ***!
  \******************************************************/
/*! exports provided: OperationsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OperationsModule", function() { return OperationsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _operations_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./operations.component */ "./src/app/main/operations/operations.component.ts");
/* harmony import */ var _operations_file_exception_file_exception_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../operations/file-exception/file-exception.component */ "./src/app/main/operations/file-exception/file-exception.component.ts");
/* harmony import */ var _operations_file_management_file_management_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../operations/file-management/file-management.component */ "./src/app/main/operations/file-management/file-management.component.ts");
/* harmony import */ var _operations_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../operations/file-upload/file-upload.component */ "./src/app/main/operations/file-upload/file-upload.component.ts");
/* harmony import */ var src_app_main_operations_silver_file_management_silver_file_management_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/main/operations/silver-file-management/silver-file-management.component */ "./src/app/main/operations/silver-file-management/silver-file-management.component.ts");
/* harmony import */ var src_app_main_operations_services_status_services_status_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/main/operations/services-status/services-status.component */ "./src/app/main/operations/services-status/services-status.component.ts");
/* harmony import */ var _services_log_services_log_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./services-log/services-log.component */ "./src/app/main/operations/services-log/services-log.component.ts");
/* harmony import */ var _operations_route__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./operations.route */ "./src/app/main/operations/operations.route.ts");
/* harmony import */ var src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/app/shared.module */ "./src/app/shared.module.ts");

















var operationsComponents = [
    _operations_component__WEBPACK_IMPORTED_MODULE_8__["OperationsComponent"],
    _operations_file_exception_file_exception_component__WEBPACK_IMPORTED_MODULE_9__["FileExceptionComponent"],
    _operations_file_management_file_management_component__WEBPACK_IMPORTED_MODULE_10__["FileManagementComponent"],
    _operations_file_upload_file_upload_component__WEBPACK_IMPORTED_MODULE_11__["FileUploadComponent"],
    src_app_main_operations_silver_file_management_silver_file_management_component__WEBPACK_IMPORTED_MODULE_12__["SilverFileManagementComponent"],
    src_app_main_operations_services_status_services_status_component__WEBPACK_IMPORTED_MODULE_13__["ServicesStatusComponent"],
    _services_log_services_log_component__WEBPACK_IMPORTED_MODULE_14__["ServicesLogComponent"]
];
var OperationsModule = /** @class */ (function () {
    function OperationsModule() {
    }
    OperationsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: operationsComponents.slice(),
            exports: operationsComponents.concat([src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__["SharedModule"]]),
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_6__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_operations_route__WEBPACK_IMPORTED_MODULE_15__["OperationsRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_7__["LpToolkitModule"],
                src_app_shared_module__WEBPACK_IMPORTED_MODULE_16__["SharedModule"]
            ]
        })
    ], OperationsModule);
    return OperationsModule;
}());



/***/ }),

/***/ "./src/app/main/operations/operations.route.ts":
/*!*****************************************************!*\
  !*** ./src/app/main/operations/operations.route.ts ***!
  \*****************************************************/
/*! exports provided: OperationsRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OperationsRoutes", function() { return OperationsRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _operations_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./operations.component */ "./src/app/main/operations/operations.component.ts");


var OperationsRoutes = [
    {
        path: '',
        component: _operations_component__WEBPACK_IMPORTED_MODULE_1__["OperationsComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/operations/services-log/services-log.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/main/operations/services-log/services-log.component.scss ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9zZXJ2aWNlcy1sb2cvc2VydmljZXMtbG9nLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/operations/services-log/services-log.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/main/operations/services-log/services-log.component.ts ***!
  \************************************************************************/
/*! exports provided: ServicesLogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServicesLogComponent", function() { return ServicesLogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_environments_environment_prod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");




var ServicesLogComponent = /** @class */ (function () {
    function ServicesLogComponent() {
        // tslint:disable-next-line: no-string-literal
        this.baseUrl = window['config']
            ? // tslint:disable-next-line: no-string-literal
                window['config'].remoteServerUrl
            : src_environments_environment_prod__WEBPACK_IMPORTED_MODULE_2__["environment"].testCaseRemoteServerUrl;
        this.getLogsUrl = this.baseUrl + "/log/files";
        this.downloadFileUrl = this.baseUrl + "/log/download?fileName=";
        this.viewFileUrl = this.baseUrl + "/log/view?numberOfLines=100&fileName=";
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_3__["HeightStyle"])(200);
    }
    ServicesLogComponent.prototype.ngOnInit = function () { };
    ServicesLogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-services-log',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./services-log.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-log/services-log.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./services-log.component.scss */ "./src/app/main/operations/services-log/services-log.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ServicesLogComponent);
    return ServicesLogComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/services-status/services-status.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/main/operations/services-status/services-status.component.scss ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".card-wrapper {\n  max-width: 100%;\n  margin: 4px;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  display: block;\n  position: relative;\n  padding: 12px;\n  border-radius: 4px;\n  background: #fff;\n  color: rgba(0, 0, 0, 0.87);\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);\n}\n\n.form_wrapper {\n  box-sizing: border-box;\n  margin: 65px auto;\n  width: 100%;\n  padding-bottom: 2px;\n  box-shadow: 0 5px 15px 1px rgba(0, 0, 0, 0.6), 0 0 200px 1px rgba(255, 255, 255, 0.5);\n  border-radius: 2px;\n}\n\n.form_wrapper h3 {\n  padding: 20px;\n  background: #eee;\n}\n\n.icon-wrap {\n  margin: 17px 14px;\n}\n\n.m-top-10 {\n  margin-top: 10%;\n}\n\n.title-bg-color {\n  background: #eee;\n}\n\n.status {\n  border-radius: 25px;\n  color: #ffffff;\n  height: 29px;\n  width: 95px;\n  padding: 2px 19px;\n}\n\n.label-p {\n  color: rgba(0, 0, 0, 0.87);\n  font-weight: 500;\n  padding: 0 0 0 34px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9vcGVyYXRpb25zL3NlcnZpY2VzLXN0YXR1cy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcZnJvbnRlbmRhcHAvc3JjXFxhcHBcXG1haW5cXG9wZXJhdGlvbnNcXHNlcnZpY2VzLXN0YXR1c1xcc2VydmljZXMtc3RhdHVzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL29wZXJhdGlvbnMvc2VydmljZXMtc3RhdHVzL3NlcnZpY2VzLXN0YXR1cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EseURBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLDBCQUFBO0VBQ0EsaURBQUE7RUFDQSwrR0FBQTtBQ0NGOztBREdBO0VBQ0Usc0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtFQUNBLHFGQUFBO0VBQ0Esa0JBQUE7QUNBRjs7QURHQTtFQUNFLGFBQUE7RUFDQSxnQkFBQTtBQ0FGOztBREdBO0VBQ0UsaUJBQUE7QUNBRjs7QURHQTtFQUNFLGVBQUE7QUNBRjs7QURHQTtFQUNFLGdCQUFBO0FDQUY7O0FER0E7RUFDRSxtQkFBQTtFQUNBLGNBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0FDQUY7O0FER0E7RUFDRSwwQkFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7QUNBRiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9zZXJ2aWNlcy1zdGF0dXMvc2VydmljZXMtc3RhdHVzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNhcmQtd3JhcHBlciB7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIG1hcmdpbjogNHB4O1xyXG4gIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMjgwbXMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgcGFkZGluZzogMTJweDtcclxuICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgYmFja2dyb3VuZDogI2ZmZjtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg3KTtcclxuICBmb250LWZhbWlseTogUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xyXG4gIGJveC1zaGFkb3c6IDAgMnB4IDFweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4yKSwgMCAxcHggMXB4IDAgcmdiYSgwLCAwLCAwLCAwLjE0KSxcclxuICAgIDAgMXB4IDNweCAwIHJnYmEoMCwgMCwgMCwgMC4xMik7XHJcbn1cclxuXHJcbi5mb3JtX3dyYXBwZXIge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgbWFyZ2luOiA2NXB4IGF1dG87XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZy1ib3R0b206IDJweDtcclxuICBib3gtc2hhZG93OiAwIDVweCAxNXB4IDFweCByZ2JhKDAsIDAsIDAsIDAuNiksIDAgMCAyMDBweCAxcHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDJweDtcclxufVxyXG5cclxuLmZvcm1fd3JhcHBlciBoMyB7XHJcbiAgcGFkZGluZzogMjBweDtcclxuICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG59XHJcblxyXG4uaWNvbi13cmFwIHtcclxuICBtYXJnaW46IDE3cHggMTRweDtcclxufVxyXG5cclxuLm0tdG9wLTEwIHtcclxuICBtYXJnaW4tdG9wOiAxMCU7XHJcbn1cclxuXHJcbi50aXRsZS1iZy1jb2xvciB7XHJcbiAgYmFja2dyb3VuZDogI2VlZTtcclxufVxyXG5cclxuLnN0YXR1cyB7XHJcbiAgYm9yZGVyLXJhZGl1czogMjVweDtcclxuICBjb2xvcjogI2ZmZmZmZjtcclxuICBoZWlnaHQ6IDI5cHg7XHJcbiAgd2lkdGg6IDk1cHg7XHJcbiAgcGFkZGluZzogMnB4IDE5cHg7XHJcbn1cclxuXHJcbi5sYWJlbC1wIHtcclxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg3KTtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG4gIHBhZGRpbmc6IDAgMCAwIDM0cHg7XHJcbn1cclxuIiwiLmNhcmQtd3JhcHBlciB7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgbWFyZ2luOiA0cHg7XG4gIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMjgwbXMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg3KTtcbiAgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmO1xuICBib3gtc2hhZG93OiAwIDJweCAxcHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMiksIDAgMXB4IDFweCAwIHJnYmEoMCwgMCwgMCwgMC4xNCksIDAgMXB4IDNweCAwIHJnYmEoMCwgMCwgMCwgMC4xMik7XG59XG5cbi5mb3JtX3dyYXBwZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBtYXJnaW46IDY1cHggYXV0bztcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmctYm90dG9tOiAycHg7XG4gIGJveC1zaGFkb3c6IDAgNXB4IDE1cHggMXB4IHJnYmEoMCwgMCwgMCwgMC42KSwgMCAwIDIwMHB4IDFweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbn1cblxuLmZvcm1fd3JhcHBlciBoMyB7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi5pY29uLXdyYXAge1xuICBtYXJnaW46IDE3cHggMTRweDtcbn1cblxuLm0tdG9wLTEwIHtcbiAgbWFyZ2luLXRvcDogMTAlO1xufVxuXG4udGl0bGUtYmctY29sb3Ige1xuICBiYWNrZ3JvdW5kOiAjZWVlO1xufVxuXG4uc3RhdHVzIHtcbiAgYm9yZGVyLXJhZGl1czogMjVweDtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGhlaWdodDogMjlweDtcbiAgd2lkdGg6IDk1cHg7XG4gIHBhZGRpbmc6IDJweCAxOXB4O1xufVxuXG4ubGFiZWwtcCB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuODcpO1xuICBmb250LXdlaWdodDogNTAwO1xuICBwYWRkaW5nOiAwIDAgMCAzNHB4O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/operations/services-status/services-status.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/operations/services-status/services-status.component.ts ***!
  \******************************************************************************/
/*! exports provided: ServicesStatusComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServicesStatusComponent", function() { return ServicesStatusComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_services_status_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/services-status-api.service */ "./src/services/services-status-api.service.ts");



var ServicesStatusComponent = /** @class */ (function () {
    function ServicesStatusComponent(servicesStatusApiService) {
        this.servicesStatusApiService = servicesStatusApiService;
        this.show = false;
    }
    ServicesStatusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.servicesStatusApiService.loadServices();
        this.servicesStatusApiService.servicesStatusArr$.subscribe(function (data) {
            _this.listOfServices = data;
            _this.show = true;
        });
    };
    ServicesStatusComponent.prototype.loadService = function () {
        this.show = false;
        this.servicesStatusApiService.loadServices();
    };
    ServicesStatusComponent.ctorParameters = function () { return [
        { type: _services_services_status_api_service__WEBPACK_IMPORTED_MODULE_2__["ServicesStatusApiService"] }
    ]; };
    ServicesStatusComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-services-status',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./services-status.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/services-status/services-status.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./services-status.component.scss */ "./src/app/main/operations/services-status/services-status.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_services_status_api_service__WEBPACK_IMPORTED_MODULE_2__["ServicesStatusApiService"]])
    ], ServicesStatusComponent);
    return ServicesStatusComponent;
}());



/***/ }),

/***/ "./src/app/main/operations/silver-file-management/silver-file-management.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/operations/silver-file-management/silver-file-management.component.scss ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vb3BlcmF0aW9ucy9zaWx2ZXItZmlsZS1tYW5hZ2VtZW50L3NpbHZlci1maWxlLW1hbmFnZW1lbnQuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/main/operations/silver-file-management/silver-file-management.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/main/operations/silver-file-management/silver-file-management.component.ts ***!
  \********************************************************************************************/
/*! exports provided: SilverFileManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SilverFileManagementComponent", function() { return SilverFileManagementComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/services/file-management-api.service */ "./src/services/file-management-api.service.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");









var SilverFileManagementComponent = /** @class */ (function () {
    function SilverFileManagementComponent(fileManagementApiService) {
        this.fileManagementApiService = fileManagementApiService;
        this.excelParams = {
            fileName: 'Silver File',
            sheetName: 'First Sheet',
            columnKeys: ['name', 'uploadDate', 'size']
        };
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Style"];
        this.styleForLogsHight = {
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 220px)',
            boxSizing: 'border-box'
        };
        this.getContextMenuItems = function (params) {
            return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_7__["GetContextMenu"])(true, null, true, null, params);
        };
        this.initGrid();
    }
    SilverFileManagementComponent.prototype.ngOnInit = function () { };
    SilverFileManagementComponent.prototype.ngAfterViewInit = function () {
        this.getSilverFiles();
    };
    SilverFileManagementComponent.prototype.initGrid = function () {
        this.filesGridOptions = {
            rowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_2__["GridLayoutMenuComponent"] },
            animateRows: true,
            enableFilter: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            alignedGrids: [],
            onGridReady: function (params) { },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["AutoSizeAllColumns"])(params);
            }
        };
        this.filesGridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridId"].silverFilesId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_3__["GridName"].silverFiles, this.filesGridOptions);
    };
    SilverFileManagementComponent.prototype.setColDefs = function () {
        var colDefs = [
            {
                field: 'name',
                headerName: 'Name',
                sortable: true,
                filter: true,
                resizable: true
            },
            {
                field: 'uploadDate',
                headerName: 'Upload Date',
                sortable: true,
                filter: true,
                enableRowGroup: true,
                resizable: true
            },
            {
                field: 'size',
                headerName: 'Size',
                resizable: true,
                type: 'numericColumn'
            },
            {
                headerName: 'View',
                cellRendererFramework: _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_5__["TemplateRendererComponent"],
                cellRendererParams: {
                    ngTemplate: this.actionButtons
                }
            }
        ];
        this.filesGridOptions.api.setColumnDefs(colDefs);
    };
    SilverFileManagementComponent.prototype.getSilverFiles = function () {
        var _this = this;
        this.fileManagementApiService.getSilverFiles().subscribe(function (result) {
            _this.files = result.payload.map(function (item) { return ({
                name: item.Name,
                uploadDate: moment__WEBPACK_IMPORTED_MODULE_4__(item.UploadDate).format('MMM-DD-YYYY hh:mm:ss'),
                size: item.Size
            }); });
            _this.filesGridOptions.api.setRowData(_this.files);
        });
        this.setColDefs();
    };
    SilverFileManagementComponent.prototype.refreshFilesGrid = function () {
        this.filesGridOptions.api.showLoadingOverlay();
        this.getSilverFiles();
    };
    SilverFileManagementComponent.prototype.downloadFile = function (file) { };
    SilverFileManagementComponent.ctorParameters = function () { return [
        { type: src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_6__["FileManagementApiService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], SilverFileManagementComponent.prototype, "actionButtons", void 0);
    SilverFileManagementComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-silver-file-management',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./silver-file-management.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/operations/silver-file-management/silver-file-management.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./silver-file-management.component.scss */ "./src/app/main/operations/silver-file-management/silver-file-management.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_file_management_api_service__WEBPACK_IMPORTED_MODULE_6__["FileManagementApiService"]])
    ], SilverFileManagementComponent);
    return SilverFileManagementComponent;
}());



/***/ }),

/***/ "./src/services/file-management-api.service.ts":
/*!*****************************************************!*\
  !*** ./src/services/file-management-api.service.ts ***!
  \*****************************************************/
/*! exports provided: FileManagementApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileManagementApiService", function() { return FileManagementApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");






var FileManagementApiService = /** @class */ (function () {
    function FileManagementApiService(http) {
        this.http = http;
        this.selectedAccounList = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
        this.selectedAccounList$ = this.selectedAccounList.asObservable();
        this.dispatchModifications = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
        this.dispatchModifications$ = this.dispatchModifications.asObservable();
        this.baseUrl = window['config'] ? window['config'].remoteServerUrl : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseRemoteServerUrl;
    }
    /*
    Get All Files
    */
    FileManagementApiService.prototype.getFiles = function () {
        var url = this.baseUrl + '/fileManagement/files';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    FileManagementApiService.prototype.updateAction = function (body) {
        var url = this.baseUrl + '/fileManagement/UpdateFileAction';
        return this.http.post(url, body).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    /*
    Get Silver Files
    */
    FileManagementApiService.prototype.getSilverFiles = function () {
        var url = this.baseUrl + '/fileManagement/s3Files';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    /*
    Generate Files
    */
    FileManagementApiService.prototype.generateFiles = function (body) {
        var url = this.baseUrl + '/fileManagement/silverEndOfDay';
        return this.http.post(url, body).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    FileManagementApiService.prototype.getInvalidExportRecords = function () {
        var url = this.baseUrl + '/fileManagement/FileExportException';
        return this.http.get(url);
    };
    FileManagementApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    FileManagementApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], FileManagementApiService);
    return FileManagementApiService;
}());



/***/ })

}]);
//# sourceMappingURL=main-operations-operations-module.js.map