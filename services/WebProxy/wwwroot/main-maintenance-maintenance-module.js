(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-maintenance-maintenance-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/maintenance.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/maintenance.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n    <div class=\"d-flex align-items-center justify-content-center\">\r\n      <h1> Posting Engine is Running. Please Wait. </h1>\r\n    </div>\r\n    <!-- Hide Grid Div Ends -->\r\n  </div>\r\n\r\n  <!-- Reports Main Div Starts -->\r\n  <div [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n    <!-- Tab View Starts -->\r\n    <tabset class=\"tab-color\">\r\n      <tab heading=\"Tax Lot Maintenance\" (selectTab)=\"activeTaxLotReport()\">\r\n        <div [ngStyle]=\"style\">\r\n          <app-taxlots-maintenance *ngIf=\"taxLotReportActive\"></app-taxlots-maintenance>\r\n        </div>\r\n      </tab>\r\n      <!-- Tab View Ends -->\r\n    </tabset>\r\n    <!-- Reports Main Div Ends-->\r\n  </div>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.html":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.html ***!
  \*******************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" #logScroll [ngStyle]=\"processingMsgDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1> Posting Engine is Running. Please Wait. </h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Loader -->\r\n<div *ngIf=\"isLoading\" class=\"loader-wrapper mtop-15\">\r\n  <lp-loading></lp-loading>\r\n</div>\r\n<!-- Loader -->\r\n\r\n<!-- Reports Main Div Starts -->\r\n<div [hidden]=\"!show || isLoading\" [ngStyle]=\"{ 'display': hideGrid ? 'none' : 'initial' } \">\r\n  <!-- Filters Div Starts -->\r\n  <div class=\"row \">\r\n    <!-- Funds Dropdown Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <select class=\"form-control\" [(ngModel)]=\"fund\" (ngModelChange)=\"changeFund($event)\">\r\n        <option selected>All Funds</option>\r\n        <option *ngFor=\"let fund of funds\" [ngValue]=\"fund.fundCode\">\r\n          {{ fund.fundCode }}\r\n        </option>\r\n      </select>\r\n      <!-- Funds Dropdown Div Ends -->\r\n    </div>\r\n\r\n    <!-- Symbol filter -->\r\n    <div class=\"col-auto\">\r\n      <input type=\"text\" autocomplete=\"off\" placeholder=\"Filter by Symbol\" name=\"symbol\" [(ngModel)]=\"filterBySymbol\"\r\n        (ngModelChange)=\"ngModelChangeSymbol($event)\" (keyup)=\"onSymbolKey($event)\" class=\"form-control\" />\r\n    </div>\r\n\r\n    <!-- DateRange Label Div Starts -->\r\n    <div class=\"font-weight-bold\">\r\n      <label class=\"text-right\"> {{ DateRangeLabel }} </label>\r\n    </div>\r\n    <!-- DateRange Label Div Ends -->\r\n\r\n    <!-- Date Picker Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <form>\r\n        <input ngxDaterangepickerMd class=\"form-control\" type=\"text\" autocomplete=\"off\" placeholder=\"Choose date\"\r\n          [(ngModel)]=\"selected\" name=\"selectedDaterange\" [ranges]=\"ranges\" [showClearButton]=\"true\"\r\n          [alwaysShowCalendars]=\"true\" (ngModelChange)=\"changeDate($event)\" [keepCalendarOpeningWithRange]=\"true\" />\r\n      </form>\r\n    </div>\r\n    <!-- Date Picker Div Ends -->\r\n\r\n    <!-- Clear Button Div Starts -->\r\n    <div class=\"col-auto\">\r\n      <button (click)=\"clearFilters()\" class=\"btn btn-pa\" tooltip=\"Clear\" placement=\"top\">\r\n        <i class=\"fa fa-remove\"></i>\r\n      </button>\r\n    </div>\r\n    <!-- Clear Button Div Ends -->\r\n\r\n    <!-- Buttons Div Starts -->\r\n    <div class=\"ml-auto\">\r\n\r\n      <!-- Refresh Button Div Starts -->\r\n      <div class=\"mr-2 d-inline-block\">\r\n        <button (click)=\"refreshReport()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n          <i class=\"fa fa-refresh\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Refresh Button Div Ends -->\r\n\r\n      <!-- Export to Excel Button -->\r\n      <div class=\"mr-3 d-inline-block\">\r\n        <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n          <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n        </button>\r\n      </div>\r\n      <!-- Export to Excel Button Ends -->\r\n\r\n    </div>\r\n    <!-- Buttons Div Ends -->\r\n\r\n  </div>\r\n  <!-- Filters Div Ends -->\r\n\r\n  <!-- Report Grid Starts -->\r\n  <div #divToMeasureJournal>\r\n    <div [ngStyle]=\"styleForHeight\" class=\"d-flex\">\r\n\r\n      <ag-grid-angular class=\"w-50 h-100 ag-theme-balham\" (cellClicked)=\"onRowSelected($event)\"\r\n        [gridOptions]=\"gridOptions\">\r\n      </ag-grid-angular>\r\n\r\n      <div class=\"w-50 h-100\">\r\n\r\n        <ag-grid-angular class=\"w-100 h-50 ag-theme-balham\" (cellClicked)=\"onTradeRowSelected($event)\"\r\n          [gridOptions]=\"closingTaxLots\">\r\n        </ag-grid-angular>\r\n\r\n        <div class=\"w-100 h-50 p-0\">\r\n\r\n          <ag-grid-angular class=\"w-100 h-100 ag-theme-balham\" [gridOptions]=\"tradeGridOptions\">\r\n          </ag-grid-angular>\r\n\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n  <!-- Report Grid Ends -->\r\n\r\n</div>\r\n<!-- Reports Main Div Ends-->\r\n\r\n<!-- Data Modal -->\r\n<app-data-modal #dataModal title=\"Trade Detail\" [isCustomData]=\"true\">\r\n</app-data-modal>\r\n\r\n<app-create-security #securityModal (modalClose)=\"closeSecurityModal()\"></app-create-security>");

/***/ }),

/***/ "./src/app/main/maintenance/maintenance.component.scss":
/*!*************************************************************!*\
  !*** ./src/app/main/maintenance/maintenance.component.scss ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n}\n\n.refresh-spinner {\n  display: flex;\n  width: 8rem;\n  height: 3rem;\n  position: absolute;\n  top: 46%;\n  left: 48%;\n  border: 1px solid grey;\n  background-color: #fcfbfd;\n  color: #606264;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.md-datepicker-input-container {\n  width: 150px;\n}\n\n.mat-datepicker-content .mat-calendar {\n  zoom: 0.5;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  z-index: 1000;\n}\n\n::-webkit-scrollbar-thumb {\n  /* background-clip: padding-box; */\n  border-radius: 16px;\n  border: 4px solid transparent;\n  background-color: #a0a0a0;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n@media (min-width: 320px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: 320px;\n  }\n}\n\n@media (min-width: 768px) {\n  ::ng-deep.md-drppicker.shown.drops-down-right {\n    width: auto;\n  }\n}\n\n::ng-deep .debit {\n  background-image: linear-gradient(to right, #64dc64 0%, #6ee16e 17%, #73e673 33%, #78f078 67%, #7dfa7d 83%, #96ff96 100%);\n  background-position: 100% 100%;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .credit {\n  background-image: linear-gradient(to left, #dc6464 0%, #e16e6e 17%, #e67373 33%, #f07878 67%, #fa7d7d 83%, #ff9696 100%);\n  padding-right: 18px !important;\n  text-align: end;\n  font-weight: 500;\n}\n\n::ng-deep .rightAlign {\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9tYWludGVuYW5jZS9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcZnJvbnRlbmRhcHAvc3JjXFxhcHBcXG1haW5cXG1haW50ZW5hbmNlXFxtYWludGVuYW5jZS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWFpbi9tYWludGVuYW5jZS9tYWludGVuYW5jZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7RUFFRSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLGFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FERUE7RUFDRSxTQUFBO0FDQ0Y7O0FERUE7RUFDRSxXQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0Usa0NBQUE7RUFDQSxtQkFBQTtFQUNBLDZCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0VBRUEsc0NBQUE7QUNDRjs7QURFQTtFQUNFO0lBQ0UsWUFBQTtFQ0NGO0FBQ0Y7O0FERUE7RUFDRTtJQUNFLFdBQUE7RUNBRjtBQUNGOztBREdBO0VBQ0UseUhBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ1RGOztBRFlBO0VBQ0Usd0hBQUE7RUFTQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQ2pCRjs7QURvQkE7RUFDRSxpQkFBQTtBQ2pCRiIsImZpbGUiOiJzcmMvYXBwL21haW4vbWFpbnRlbmFuY2UvbWFpbnRlbmFuY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5LFxyXG5odG1sIHtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMDtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5yZWZyZXNoLXNwaW5uZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDhyZW07XHJcbiAgaGVpZ2h0OiAzcmVtO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDQ2JTtcclxuICBsZWZ0OiA0OCU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgZ3JleTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNmYmZkO1xyXG4gIGNvbG9yOiAjNjA2MjY0O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgei1pbmRleDogMTAwMDtcclxufVxyXG5cclxuLm1kLWRhdGVwaWNrZXItaW5wdXQtY29udGFpbmVyIHtcclxuICB3aWR0aDogMTUwcHg7XHJcbn1cclxuXHJcbi5tYXQtZGF0ZXBpY2tlci1jb250ZW50IC5tYXQtY2FsZW5kYXIge1xyXG4gIHpvb206IDAuNTtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgd2lkdGg6IDEwcHg7XHJcbiAgei1pbmRleDogMTAwMDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgLyogYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDsgKi9cclxuICBib3JkZXItcmFkaXVzOiAxNnB4O1xyXG4gIGJvcmRlcjogNHB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTYwLCAxNjAsIDE2MCk7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xyXG4gIDo6bmctZGVlcC5tZC1kcnBwaWNrZXIuc2hvd24uZHJvcHMtZG93bi1yaWdodCB7XHJcbiAgICB3aWR0aDogMzIwcHg7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcclxuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xyXG4gICAgd2lkdGg6IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG46Om5nLWRlZXAgLmRlYml0IHtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXHJcbiAgICB0byByaWdodCxcclxuICAgIHJnYigxMDAsIDIyMCwgMTAwLCAxKSAwJSxcclxuICAgIHJnYigxMTAsIDIyNSwgMTEwLCAxKSAxNyUsXHJcbiAgICByZ2IoMTE1LCAyMzAsIDExNSwgMSkgMzMlLFxyXG4gICAgcmdiYSgxMjAsIDI0MCwgMTIwLCAxKSA2NyUsXHJcbiAgICByZ2IoMTI1LCAyNTAsIDEyNSwgMSkgODMlLFxyXG4gICAgcmdiKDE1MCwgMjU1LCAxNTAsIDEpIDEwMCVcclxuICApO1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwMCUgMTAwJTtcclxuICB0ZXh0LWFsaWduOiBlbmQ7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuOjpuZy1kZWVwIC5jcmVkaXQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcclxuICAgIHRvIGxlZnQsXHJcbiAgICByZ2IoMjIwLCAxMDAsIDEwMCwgMSkgMCUsXHJcbiAgICByZ2IoMjI1LCAxMTAsIDExMCwgMSkgMTclLFxyXG4gICAgcmdiYSgyMzAsIDExNSwgMTE1LCAxKSAzMyUsXHJcbiAgICByZ2JhKDI0MCwgMTIwLCAxMjAsIDEpIDY3JSxcclxuICAgIHJnYmEoMjUwLCAxMjUsIDEyNSwgMSkgODMlLFxyXG4gICAgcmdiYSgyNTUsIDE1MCwgMTUwLCAxKSAxMDAlXHJcbiAgKTtcclxuICBwYWRkaW5nLXJpZ2h0OiAxOHB4ICFpbXBvcnRhbnQ7XHJcbiAgdGV4dC1hbGlnbjogZW5kO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbn1cclxuXHJcbjo6bmctZGVlcCAucmlnaHRBbGlnbiB7XHJcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbn1cclxuIiwiYm9keSxcbmh0bWwge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLnJlZnJlc2gtc3Bpbm5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiA4cmVtO1xuICBoZWlnaHQ6IDNyZW07XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA0NiU7XG4gIGxlZnQ6IDQ4JTtcbiAgYm9yZGVyOiAxcHggc29saWQgZ3JleTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZjZmJmZDtcbiAgY29sb3I6ICM2MDYyNjQ7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB6LWluZGV4OiAxMDAwO1xufVxuXG4ubWQtZGF0ZXBpY2tlci1pbnB1dC1jb250YWluZXIge1xuICB3aWR0aDogMTUwcHg7XG59XG5cbi5tYXQtZGF0ZXBpY2tlci1jb250ZW50IC5tYXQtY2FsZW5kYXIge1xuICB6b29tOiAwLjU7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICB3aWR0aDogMTBweDtcbiAgei1pbmRleDogMTAwMDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIC8qIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7ICovXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJvcmRlcjogNHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTBhMGEwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xcyBlYXNlO1xufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgOjpuZy1kZWVwLm1kLWRycHBpY2tlci5zaG93bi5kcm9wcy1kb3duLXJpZ2h0IHtcbiAgICB3aWR0aDogMzIwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xuICA6Om5nLWRlZXAubWQtZHJwcGlja2VyLnNob3duLmRyb3BzLWRvd24tcmlnaHQge1xuICAgIHdpZHRoOiBhdXRvO1xuICB9XG59XG46Om5nLWRlZXAgLmRlYml0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjNjRkYzY0IDAlLCAjNmVlMTZlIDE3JSwgIzczZTY3MyAzMyUsICM3OGYwNzggNjclLCAjN2RmYTdkIDgzJSwgIzk2ZmY5NiAxMDAlKTtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwJSAxMDAlO1xuICB0ZXh0LWFsaWduOiBlbmQ7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbjo6bmctZGVlcCAuY3JlZGl0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsICNkYzY0NjQgMCUsICNlMTZlNmUgMTclLCAjZTY3MzczIDMzJSwgI2YwNzg3OCA2NyUsICNmYTdkN2QgODMlLCAjZmY5Njk2IDEwMCUpO1xuICBwYWRkaW5nLXJpZ2h0OiAxOHB4ICFpbXBvcnRhbnQ7XG4gIHRleHQtYWxpZ246IGVuZDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cblxuOjpuZy1kZWVwIC5yaWdodEFsaWduIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/maintenance/maintenance.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/main/maintenance/maintenance.component.ts ***!
  \***********************************************************/
/*! exports provided: MaintenanceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaintenanceComponent", function() { return MaintenanceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");




var MaintenanceComponent = /** @class */ (function () {
    function MaintenanceComponent(dataService) {
        this.dataService = dataService;
        this.taxLotReportActive = true;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_2__["Style"];
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
    MaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
        });
    };
    MaintenanceComponent.prototype.activeTaxLotReport = function () {
        this.taxLotReportActive = true;
    };
    MaintenanceComponent.ctorParameters = function () { return [
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }
    ]; };
    MaintenanceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-maintenance',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./maintenance.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/maintenance.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./maintenance.component.scss */ "./src/app/main/maintenance/maintenance.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_services_common_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]])
    ], MaintenanceComponent);
    return MaintenanceComponent;
}());



/***/ }),

/***/ "./src/app/main/maintenance/maintenance.module.ts":
/*!********************************************************!*\
  !*** ./src/app/main/maintenance/maintenance.module.ts ***!
  \********************************************************/
/*! exports provided: MaintenanceModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaintenanceModule", function() { return MaintenanceModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/fesm5/ngx-bootstrap-dropdown.js");
/* harmony import */ var ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-daterangepicker-material */ "./node_modules/ngx-daterangepicker-material/fesm5/ngx-daterangepicker-material.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _maintenance_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./maintenance.component */ "./src/app/main/maintenance/maintenance.component.ts");
/* harmony import */ var _taxlots_maintenance_taxlots_maintenance_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./taxlots-maintenance/taxlots-maintenance.component */ "./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");
/* harmony import */ var _maintenance_route__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./maintenance.route */ "./src/app/main/maintenance/maintenance.route.ts");














var maintenanceComponents = [_maintenance_component__WEBPACK_IMPORTED_MODULE_10__["MaintenanceComponent"], _taxlots_maintenance_taxlots_maintenance_component__WEBPACK_IMPORTED_MODULE_11__["TaxlotsMaintenanceComponent"]];
var MaintenanceModule = /** @class */ (function () {
    function MaintenanceModule() {
    }
    MaintenanceModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: maintenanceComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TooltipModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__["TypeaheadModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"].forRoot(),
                ngx_daterangepicker_material__WEBPACK_IMPORTED_MODULE_8__["NgxDaterangepickerMd"].forRoot({
                    applyLabel: 'Okay',
                    firstDay: 1
                }),
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_maintenance_route__WEBPACK_IMPORTED_MODULE_13__["MaintenanceRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_9__["LpToolkitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_12__["SharedModule"]
            ]
        })
    ], MaintenanceModule);
    return MaintenanceModule;
}());



/***/ }),

/***/ "./src/app/main/maintenance/maintenance.route.ts":
/*!*******************************************************!*\
  !*** ./src/app/main/maintenance/maintenance.route.ts ***!
  \*******************************************************/
/*! exports provided: MaintenanceRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaintenanceRoutes", function() { return MaintenanceRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _maintenance_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maintenance.component */ "./src/app/main/maintenance/maintenance.component.ts");


var MaintenanceRoutes = [
    {
        path: '',
        component: _maintenance_component__WEBPACK_IMPORTED_MODULE_1__["MaintenanceComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.scss ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("::ng-deep .loader-wrapper .spinner-grow {\n  width: 2rem !important;\n  height: 2rem !important;\n}\n\n.mtop-15 {\n  margin-top: 15%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9tYWludGVuYW5jZS90YXhsb3RzLW1haW50ZW5hbmNlL0M6XFxVc2Vyc1xcbGF0dGlcXGRldmVsb3BtZW50XFxsaWdodHBvaW50XFxmaW5hbmNlXFxmcm9udGVuZGFwcC9zcmNcXGFwcFxcbWFpblxcbWFpbnRlbmFuY2VcXHRheGxvdHMtbWFpbnRlbmFuY2VcXHRheGxvdHMtbWFpbnRlbmFuY2UuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vbWFpbnRlbmFuY2UvdGF4bG90cy1tYWludGVuYW5jZS90YXhsb3RzLW1haW50ZW5hbmNlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0JBQUE7RUFDQSx1QkFBQTtBQ0NKOztBREVBO0VBQ0ksZUFBQTtBQ0NKIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9tYWludGVuYW5jZS90YXhsb3RzLW1haW50ZW5hbmNlL3RheGxvdHMtbWFpbnRlbmFuY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xyXG4gICAgd2lkdGg6IDJyZW0gIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogMnJlbSAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbi5tdG9wLTE1e1xyXG4gICAgbWFyZ2luLXRvcDogMTUlO1xyXG4gIH0iLCI6Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xuICB3aWR0aDogMnJlbSAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDJyZW0gIWltcG9ydGFudDtcbn1cblxuLm10b3AtMTUge1xuICBtYXJnaW4tdG9wOiAxNSU7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.ts ***!
  \***************************************************************************************/
/*! exports provided: TaxlotsMaintenanceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxlotsMaintenanceComponent", function() { return TaxlotsMaintenanceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/service-proxies */ "./src/services/service-proxies.ts");
/* harmony import */ var src_services_security_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/services/security-api.service */ "./src/services/security-api.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_services_maintenance_api_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/services/maintenance-api.service */ "./src/services/maintenance-api.service.ts");
/* harmony import */ var src_shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! src/shared/Component/data-modal/data-modal.component */ "./src/shared/Component/data-modal/data-modal.component.ts");
/* harmony import */ var src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/shared/Modal/create-security/create-security.component */ "./src/shared/Modal/create-security/create-security.component.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! src/shared/utils/DataDictionary */ "./src/shared/utils/DataDictionary.ts");


















var TaxlotsMaintenanceComponent = /** @class */ (function () {
    function TaxlotsMaintenanceComponent(financeService, maintenanceApiService, securityApiService, dataService, downloadExcelUtils, toasterService, dataDictionary) {
        this.financeService = financeService;
        this.maintenanceApiService = maintenanceApiService;
        this.securityApiService = securityApiService;
        this.dataService = dataService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.toasterService = toasterService;
        this.dataDictionary = dataDictionary;
        this.fund = 'All Funds';
        this.isLoading = false;
        this.show = true;
        this.ranges = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Ranges"];
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["HeightStyle"])(220);
        // private filterSubject: Subject<string> = new Subject();
        this.filterBySymbol = '';
        this.tradeSelectionSubject = new rxjs__WEBPACK_IMPORTED_MODULE_7__["BehaviorSubject"](null);
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
    TaxlotsMaintenanceComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getLatestJournalDate();
        this.getFunds();
        this.onTaxLotSelection();
        // In case we need to enable filter by symbol from server side
        // this.filterSubject.pipe(debounce(() => timer(1000))).subscribe(() => {
        //   this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        // });
    };
    TaxlotsMaintenanceComponent.prototype.getLatestJournalDate = function () {
        var _this = this;
        this.maintenanceApiService.getLatestJournalDate().subscribe(function (date) {
            if (date.isSuccessful && date.statusCode === 200) {
                _this.journalDate = date.payload[0].when;
                _this.startDate = _this.journalDate;
                _this.selected = {
                    startDate: moment__WEBPACK_IMPORTED_MODULE_6__(_this.startDate, 'YYYY-MM-DD'),
                    endDate: moment__WEBPACK_IMPORTED_MODULE_6__(_this.startDate, 'YYYY-MM-DD')
                };
            }
        }, function (error) { });
    };
    TaxlotsMaintenanceComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_9__["GridLayoutMenuComponent"] },
            /* Custom Method Binding for External Filters from Grid Layout Component */
            getExternalFilterState: this.getExternalFilterState.bind(this),
            clearExternalFilter: this.clearFilters.bind(this),
            setExternalFilter: this.isExternalFilterPassed.bind(this),
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
            onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
            onFilterChanged: this.onFilterChanged.bind(this),
            rowSelection: 'multiple',
            rowGroupPanelShow: 'after',
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItems(params); },
            onGridReady: function (params) {
                _this.gridOptions.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["ExcelStyle"];
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
                    field: 'open_id',
                    width: 120,
                    headerName: 'Order Id',
                    sortable: true,
                    filter: true,
                    hide: true
                },
                {
                    field: 'trade_price',
                    width: 120,
                    headerName: 'Trade Price',
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
                    aggFunc: 'sum'
                },
                {
                    field: 'quantity',
                    headerName: 'Rem Qty',
                    width: 100,
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
                    valueFormatter: moneyFormatter
                }
            ],
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridId"].taxlotsMaintenanceId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridName"].taxlotsMaintenance, this.gridOptions);
        this.closingTaxLots = {
            rowData: [],
            pinnedBottomRowData: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_9__["GridLayoutMenuComponent"] },
            onRowDoubleClicked: this.onClosingTaxLotsRowDoubleClicked.bind(this),
            rowSelection: 'multiple',
            rowGroupPanelShow: 'after',
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItemsForClosingLots(params); },
            onGridReady: function (params) {
                _this.closingTaxLots.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["ExcelStyle"];
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
        this.closingTaxLots.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridId"].closingTaxLotId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridName"].closingTaxLots, this.closingTaxLots);
        this.tradeGridOptions = {
            rowData: [],
            pinnedBottomRowData: [],
            alignedGrids: [],
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_9__["GridLayoutMenuComponent"] },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            enableFilter: true,
            animateRows: true,
            suppressHorizontalScroll: false,
            suppressColumnVirtualisation: true,
            getContextMenuItems: function (params) { return _this.getContextMenuItemsForProspectiveTrades(params); },
            onGridReady: function (params) {
                _this.closingTaxLots.excelStyles = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["ExcelStyle"];
            },
            onFirstDataRendered: function (params) {
                params.api.forEachNode(function (node) {
                    node.expanded = true;
                });
                params.api.onGroupExpandedOrCollapsed();
                params.api.sizeColumnsToFit();
            },
            columnDefs: [
                {
                    field: 'tradePrice',
                    width: 120,
                    headerName: 'Trade Price',
                    sortable: true,
                    hide: true,
                    filter: true
                },
                {
                    field: 'lpOrderId',
                    width: 120,
                    headerName: 'LPOrderId',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'quantity',
                    width: 120,
                    headerName: 'Quantity',
                    sortable: true,
                    filter: true,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'remainingQuantity',
                    width: 120,
                    headerName: 'Remaining Quantity',
                    sortable: true,
                    filter: true,
                    valueFormatter: currencyFormatter
                },
                {
                    field: 'symbol',
                    width: 120,
                    headerName: 'Symbol',
                    sortable: true,
                    filter: true
                },
                {
                    field: 'side',
                    width: 120,
                    headerName: 'Side',
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
        this.tradeGridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridId"].closingTaxLotId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_11__["GridName"].closingTaxLots, this.tradeGridOptions);
    };
    TaxlotsMaintenanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getFunds();
            }
        });
    };
    TaxlotsMaintenanceComponent.prototype.getFunds = function () {
        var _this = this;
        this.financeService.getFunds().subscribe(function (result) {
            _this.funds = result.payload.map(function (item) { return ({
                fundId: item.FundId,
                fundCode: item.FundCode
            }); });
        });
    };
    // Being called twice
    TaxlotsMaintenanceComponent.prototype.getReport = function (toDate, fromDate, symbol, fund) {
        var _this = this;
        this.maintenanceApiService
            .getTaxLotReport(moment__WEBPACK_IMPORTED_MODULE_6__(toDate).format('YYYY-MM-DD'), moment__WEBPACK_IMPORTED_MODULE_6__(fromDate).format('YYYY-MM-DD'), symbol, fund, true)
            .subscribe(function (response) {
            _this.stats = response.stats;
            _this.data = response.payload;
            _this.gridOptions.api.sizeColumnsToFit();
            _this.gridOptions.api.setRowData(_this.data);
            _this.gridOptions.api.forEachNodeAfterFilter(function (rowNode) {
                rowNode.expanded = true;
            });
            _this.gridOptions.api.onGroupExpandedOrCollapsed();
        });
    };
    TaxlotsMaintenanceComponent.prototype.onTaxLotSelection = function () {
        var _this = this;
        if (this.closingTaxLots.api) {
            this.closingTaxLots.api.showLoadingOverlay();
        }
        this.maintenanceApiService.getAllClosingTaxLots().subscribe(function (response) {
            _this.closingTaxLots.api.sizeColumnsToFit();
            _this.closingTaxLots.api.setRowData(response.payload);
            if (response.payload.length == 0) {
                _this.tradeSelectionSubject.next('');
            }
            else {
                _this.tradeSelectionSubject.next(response.payload[0].closing_lot_id);
            }
        });
    };
    TaxlotsMaintenanceComponent.prototype.onRowDoubleClicked = function (params) {
        var open_id = params.data.open_id;
        this.getTrade(open_id);
    };
    TaxlotsMaintenanceComponent.prototype.onClosingTaxLotsRowDoubleClicked = function (params) {
        var closing_lot_id = params.data.closing_lot_id;
        this.getTrade(closing_lot_id);
    };
    TaxlotsMaintenanceComponent.prototype.getTrade = function (tradeId) {
        var _this = this;
        this.isLoading = true;
        this.financeService
            .getTrade(tradeId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () { return (_this.isLoading = false); }))
            .subscribe(function (response) {
            _this.dataModal.openModal(response[0], null, true);
        }, function (error) { });
    };
    TaxlotsMaintenanceComponent.prototype.onRowSelected = function (event) {
        var _this = this;
        var open_id = event.data.open_id;
        if ((event.data.side === 'BUY' || event.data.side === 'SHORT') &&
            (event.data.status === 'Open' || event.data.status === 'Partially Closed')) {
            if (event.data.symbol !== this.activeTradeSymbol ||
                event.data.side !== this.activeTradeSide) {
                this.getProspectiveTrades(event.data.symbol, event.data.side);
            }
        }
        if (this.closingTaxLots.api) {
            this.closingTaxLots.api.forEachNodeAfterFilter(function (rowNode, index) {
                if (rowNode.data.open_lot_id === open_id) {
                    rowNode.setSelected(true);
                    _this.closingTaxLots.api.ensureIndexVisible(rowNode.rowIndex);
                }
                else {
                    rowNode.setSelected(false);
                }
            });
        }
    };
    TaxlotsMaintenanceComponent.prototype.getProspectiveTrades = function (symbol, side) {
        var _this = this;
        this.tradeGridOptions.api.showLoadingOverlay();
        this.maintenanceApiService.getProspectiveTradesToAlleviateTaxLot(symbol, side).subscribe(function (resp) {
            if (resp.isSuccessful) {
                var trades = resp.payload.map(function (x) { return ({
                    quantity: x.Quantity,
                    remainingQuantity: x.RemainingQuantity,
                    lpOrderId: x.LPOrderId,
                    symbol: x.Symbol,
                    side: x.Side,
                    tradePrice: x.TradePrice
                }); });
                _this.activeTradeSide = side;
                _this.activeTradeSymbol = symbol;
                _this.tradeGridOptions.api.setRowData(trades);
            }
        }, function (error) { });
    };
    TaxlotsMaintenanceComponent.prototype.onFilterChanged = function () {
        this.pinnedBottomRowData = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["CalTotalRecords"])(this.gridOptions);
        this.gridOptions.api.setPinnedBottomRowData(this.pinnedBottomRowData);
    };
    TaxlotsMaintenanceComponent.prototype.isExternalFilterPassed = function (object) {
        var fundFilter = object.fundFilter;
        var symbolFilter = object.symbolFilter;
        var dateFilter = object.dateFilter;
        this.fund = fundFilter !== undefined ? fundFilter : this.fund;
        this.filterBySymbol = symbolFilter !== undefined ? symbolFilter : this.filterBySymbol;
        this.setDateRange(dateFilter);
        this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund);
        this.gridOptions.api.onFilterChanged();
    };
    TaxlotsMaintenanceComponent.prototype.isExternalFilterPresent = function () {
        if (this.fund !== 'All Funds' || this.startDate || this.filterBySymbol !== '') {
            return true;
        }
    };
    TaxlotsMaintenanceComponent.prototype.doesExternalFilterPass = function (node) {
        if (this.filterBySymbol !== '') {
            var cellSymbol = node.data.symbol === null ? '' : node.data.symbol;
            return cellSymbol.toLowerCase().includes(this.filterBySymbol.toLowerCase());
        }
        return true;
    };
    TaxlotsMaintenanceComponent.prototype.getContextMenuItems = function (params) {
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
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    TaxlotsMaintenanceComponent.prototype.getContextMenuItemsForClosingLots = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Reverse Tax Lot Alleviation',
                action: function () {
                    _this.reverseTaxLotAlleviation();
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    TaxlotsMaintenanceComponent.prototype.getContextMenuItemsForProspectiveTrades = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Manually Alleviate Tax Lot',
                action: function () {
                    _this.alleviateTaxLot();
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_10__["GetContextMenu"])(false, addDefaultItems, true, null, params);
    };
    TaxlotsMaintenanceComponent.prototype.alleviateTaxLot = function () {
        var _this = this;
        this.isLoading = true;
        this.show = false;
        var taxLotStatus = this.gridOptions.api.getSelectedRows();
        var trades = this.tradeGridOptions.api.getSelectedRows();
        if (taxLotStatus.length == 0) {
            this.toasterService.info('Tax lot(s) not selected');
            this.isLoading = false;
            this.show = true;
            return;
        }
        if (trades.length == 0) {
            this.toasterService.info('Trade not selected');
            this.isLoading = false;
            this.show = true;
            return;
        }
        var taxLotStatusPayload = taxLotStatus.map(function (x) { return ({
            Id: x.id,
            OpenLotId: x.open_id,
            Symbol: x.symbol,
            Status: x.status,
            Side: x.side,
            OriginalQuantity: x.original_quantity,
            RemainingQuantity: x.quantity,
            TradePrice: x.trade_price
        }); });
        var tradesPayload = trades.map(function (x) { return ({
            LpOrderId: x.lpOrderId,
            Symbol: x.symbol,
            Side: x.side,
            Quantity: x.quantity,
            RemainingQuantity: x.remainingQuantity,
            TradePrice: x.tradePrice
        }); });
        var payload = {
            OpenTaxLots: taxLotStatusPayload,
            ProspectiveTrade: tradesPayload[0]
        };
        this.maintenanceApiService.alleviateTaxLot(payload).subscribe(function (resp) {
            if (resp.isSuccessful) {
                _this.toasterService.info('Tax lot(s) alleviated successfully');
                _this.isLoading = false;
                _this.show = true;
                _this.refreshTaxLots();
            }
            else {
                _this.toasterService.error('An error occured while alleviating tax lots');
                _this.isLoading = false;
                _this.show = true;
            }
        }, function (error) {
            _this.toasterService.error('An error occured while alleviating tax lots');
        });
    };
    TaxlotsMaintenanceComponent.prototype.reverseTaxLotAlleviation = function () {
        var _this = this;
        this.isLoading = true;
        this.show = false;
        var taxLotStatus = this.gridOptions.api.getSelectedRows();
        var closingTaxLots = this.closingTaxLots.api.getSelectedRows();
        if (closingTaxLots.length == 0) {
            this.toasterService.info('Closing lot not selected');
            this.isLoading = false;
            this.show = true;
            return;
        }
        var taxLotStatusPayload = taxLotStatus.map(function (x) { return ({
            Id: x.id,
            OpenLotId: x.open_id,
            Symbol: x.symbol,
            Status: x.status,
            Side: x.side,
            OriginalQuantity: x.original_quantity,
            RemainingQuantity: x.quantity
        }); });
        var closingTaxLotPayload = closingTaxLots.map(function (x) { return ({
            Id: x.id,
            OpenLotId: x.open_lot_id,
            ClosingLotId: x.closing_lot_id,
            Quantity: x.quantity
        }); });
        var payload = {
            ClosingLots: closingTaxLotPayload,
            OpenLots: taxLotStatusPayload
        };
        this.maintenanceApiService.taxLotReversal(payload).subscribe(function (resp) {
            if (resp.isSuccessful) {
                _this.toasterService.info('Tax lot(s) reversed successfully');
                _this.isLoading = false;
                _this.show = true;
                _this.refreshTaxLots();
            }
            else {
                _this.toasterService.error('An error occured while reversing tax lots');
                _this.isLoading = false;
                _this.show = true;
            }
        }, function (error) {
            _this.toasterService.error('An error occured while reversing tax lots');
        });
    };
    TaxlotsMaintenanceComponent.prototype.refreshTaxLots = function () {
        this.onTaxLotSelection();
        this.refreshReport();
        this.getProspectiveTrades(this.activeTradeSymbol, this.activeTradeSide);
    };
    TaxlotsMaintenanceComponent.prototype.setDateRange = function (dateFilter) {
        var dates = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["SetDateRange"])(dateFilter, this.startDate, this.endDate);
        this.startDate = dates[0];
        this.endDate = dates[1];
        this.selected =
            dateFilter.startDate !== '' ? { startDate: this.startDate, endDate: this.endDate } : null;
    };
    TaxlotsMaintenanceComponent.prototype.getRangeLabel = function () {
        this.DateRangeLabel = '';
        this.DateRangeLabel = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["GetDateRangeLabel"])(this.startDate, this.endDate);
    };
    TaxlotsMaintenanceComponent.prototype.refreshReport = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.onTaxLotSelection();
        if (this.selected.startDate == null) {
            this.selected = {
                startDate: moment__WEBPACK_IMPORTED_MODULE_6__(this.journalDate, 'YYYY-MM-DD'),
                endDate: moment__WEBPACK_IMPORTED_MODULE_6__(this.journalDate, 'YYYY-MM-DD')
            };
            this.getReport(this.journalDate, this.journalDate, this.filterBySymbol, 'ALL');
        }
        else {
            var startDate = this.selected.startDate.format('YYYY-MM-DD');
            var endDate = this.selected.endDate.format('YYYY-MM-DD');
            this.getReport(startDate, endDate, this.filterBySymbol, 'ALL');
        }
    };
    TaxlotsMaintenanceComponent.prototype.clearFilters = function () {
        this.fund = 'All Funds';
        this.DateRangeLabel = '';
        this.selected = null;
        this.filterBySymbol = '';
        this.gridOptions.api.setRowData([]);
        this.closingTaxLots.api.setRowData([]);
    };
    TaxlotsMaintenanceComponent.prototype.ngModelChangeSymbol = function (e) {
        this.filterBySymbol = e;
        this.gridOptions.api.onFilterChanged();
    };
    TaxlotsMaintenanceComponent.prototype.onSymbolKey = function (e) {
        this.filterBySymbol = e.srcElement.value;
        this.gridOptions.api.onFilterChanged();
        // For the moment we react to each key stroke
        if (e.code === 'Enter' || e.code === 'Tab') {
        }
    };
    TaxlotsMaintenanceComponent.prototype.getExternalFilterState = function () {
        return {
            fundFilter: this.fund,
            symbolFilter: this.filterBySymbol,
            dateFilter: { startDate: this.startDate, endDate: this.endDate }
        };
    };
    TaxlotsMaintenanceComponent.prototype.changeDate = function (selectedDate) {
        if (!selectedDate.startDate) {
            return;
        }
        this.startDate = selectedDate.startDate.format('YYYY-MM-DD');
        this.endDate = selectedDate.endDate.format('YYYY-MM-DD');
        this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
        this.getRangeLabel();
    };
    TaxlotsMaintenanceComponent.prototype.changeFund = function (selectedFund) {
        this.fund = selectedFund;
        this.getReport(this.startDate, this.endDate, this.filterBySymbol, this.fund === 'All Funds' ? 'ALL' : this.fund);
    };
    TaxlotsMaintenanceComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Tax Lot Reports',
            sheetName: 'First Sheet'
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    TaxlotsMaintenanceComponent.prototype.onTradeRowSelected = function (event) {
        var _this = this;
        var open_lot_id = event.data.open_lot_id;
        var closing_lot_id = event.data.closing_lot_id;
        if (this.gridOptions.api) {
            this.gridOptions.api.forEachLeafNode(function (rowNode) {
                if (rowNode.data.open_id === open_lot_id) {
                    rowNode.setSelected(true);
                    _this.gridOptions.api.ensureIndexVisible(rowNode.rowIndex);
                }
                else {
                    rowNode.setSelected(false);
                }
            });
        }
        this.closingTaxLots.api.forEachNodeAfterFilter(function (rowNode, index) {
            if (rowNode.data.closing_lot_id === closing_lot_id) {
                rowNode.setSelected(true);
                _this.gridOptions.api.forEachLeafNode(function (rowNodeInternal) {
                    if (rowNodeInternal.data.open_id === rowNode.data.open_lot_id) {
                        rowNodeInternal.setSelected(true);
                    }
                });
            }
            else {
                rowNode.setSelected(false);
            }
        });
    };
    TaxlotsMaintenanceComponent.ctorParameters = function () { return [
        { type: _services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"] },
        { type: src_services_maintenance_api_service__WEBPACK_IMPORTED_MODULE_13__["MaintenanceApiService"] },
        { type: src_services_security_api_service__WEBPACK_IMPORTED_MODULE_3__["SecurityApiService"] },
        { type: _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_12__["DownloadExcelUtils"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_16__["ToastrService"] },
        { type: src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__["DataDictionary"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dataModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_data_modal_data_modal_component__WEBPACK_IMPORTED_MODULE_14__["DataModalComponent"])
    ], TaxlotsMaintenanceComponent.prototype, "dataModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('securityModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Modal_create_security_create_security_component__WEBPACK_IMPORTED_MODULE_15__["CreateSecurityComponent"])
    ], TaxlotsMaintenanceComponent.prototype, "securityModal", void 0);
    TaxlotsMaintenanceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-taxlots-maintenance',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./taxlots-maintenance.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./taxlots-maintenance.component.scss */ "./src/app/main/maintenance/taxlots-maintenance/taxlots-maintenance.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_service_proxies__WEBPACK_IMPORTED_MODULE_2__["FinanceServiceProxy"],
            src_services_maintenance_api_service__WEBPACK_IMPORTED_MODULE_13__["MaintenanceApiService"],
            src_services_security_api_service__WEBPACK_IMPORTED_MODULE_3__["SecurityApiService"],
            _services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_12__["DownloadExcelUtils"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_16__["ToastrService"],
            src_shared_utils_DataDictionary__WEBPACK_IMPORTED_MODULE_17__["DataDictionary"]])
    ], TaxlotsMaintenanceComponent);
    return TaxlotsMaintenanceComponent;
}());

function moneyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["MoneyFormat"])(params.value);
}
function currencyFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["CommaSeparatedFormat"])(params.value);
}
function dateFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["DateFormatter"])(params.value);
}
function priceFormatter(params) {
    if (params.value === undefined) {
        return;
    }
    return Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_8__["FormatNumber4"])(params.value);
}


/***/ }),

/***/ "./src/services/maintenance-api.service.ts":
/*!*************************************************!*\
  !*** ./src/services/maintenance-api.service.ts ***!
  \*************************************************/
/*! exports provided: MaintenanceApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaintenanceApiService", function() { return MaintenanceApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





var MaintenanceApiService = /** @class */ (function () {
    function MaintenanceApiService(http) {
        this.http = http;
        this.baseUrl = window['config'] ? window['config'].remoteServerUrl : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseRemoteServerUrl;
        this.refDataUrl = window['config'] ? window['config'].referenceDataUrl : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseReferenceDataUrl;
    }
    // /*
    // TaxLots Maintenance Tab Services
    // */
    MaintenanceApiService.prototype.getTaxLotReport = function (fromDate, toDate, symbol, fund, side) {
        var url = this.baseUrl + '/journal/taxlotReport?from=' + fromDate + '&to=' + toDate + '&symbol=' + symbol + '&fund=' + fund + '&side=' + side;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    MaintenanceApiService.prototype.getLatestJournalDate = function () {
        var url = this.baseUrl + '/journal/lastPostedDate';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    MaintenanceApiService.prototype.getAllClosingTaxLots = function () {
        var url = this.baseUrl + '/journal/allClosingTaxLots';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    MaintenanceApiService.prototype.taxLotReversal = function (obj) {
        var url = this.baseUrl + '/taxLotMaintenance/reverseTaxLotAlleviation';
        return this.http.put(url, obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    // getProspectiveTradesToAlleviateTaxLot(symbol: string, side: string) {
    //   const url = this.refDataUrl + '/trades/prospectiveTradesToAlleviateTaxLot?symbol=' + symbol + '&side=' + side;
    //   return this.http.get(url).pipe(map((response: any) => response));
    // }
    MaintenanceApiService.prototype.getProspectiveTradesToAlleviateTaxLot = function (symbol, side) {
        var url = this.baseUrl + '/taxLotMaintenance/prospectiveTradesToAlleviateTaxLot?symbol=' + symbol + '&side=' + side;
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    MaintenanceApiService.prototype.alleviateTaxLot = function (obj) {
        var url = this.baseUrl + '/taxLotMaintenance/alleviateTaxLot';
        return this.http.put(url, obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (response) { return response; }));
    };
    MaintenanceApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    MaintenanceApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], MaintenanceApiService);
    return MaintenanceApiService;
}());



/***/ })

}]);
//# sourceMappingURL=main-maintenance-maintenance-module.js.map