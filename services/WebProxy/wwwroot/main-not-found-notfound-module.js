(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-not-found-notfound-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/not-found/notfound/notfound.component.html":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/not-found/notfound/notfound.component.html ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<lp-not-found [imgPath]=\"imgPath\" [route]=\"route\" [btnText]=\"btnText\">\r\n</lp-not-found>");

/***/ }),

/***/ "./src/app/main/not-found/notfound.module.ts":
/*!***************************************************!*\
  !*** ./src/app/main/not-found/notfound.module.ts ***!
  \***************************************************/
/*! exports provided: NotFoundModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundModule", function() { return NotFoundModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _notfound_notfound_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./notfound/notfound.component */ "./src/app/main/not-found/notfound/notfound.component.ts");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _notfound_route__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./notfound.route */ "./src/app/main/not-found/notfound.route.ts");








var notFoundComponents = [_notfound_notfound_component__WEBPACK_IMPORTED_MODULE_5__["NotfoundComponent"]];
var NotFoundModule = /** @class */ (function () {
    function NotFoundModule() {
    }
    NotFoundModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: notFoundComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_notfound_route__WEBPACK_IMPORTED_MODULE_7__["NotFoundRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_6__["LpToolkitModule"],
            ]
        })
    ], NotFoundModule);
    return NotFoundModule;
}());



/***/ }),

/***/ "./src/app/main/not-found/notfound.route.ts":
/*!**************************************************!*\
  !*** ./src/app/main/not-found/notfound.route.ts ***!
  \**************************************************/
/*! exports provided: NotFoundRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundRoutes", function() { return NotFoundRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _notfound_notfound_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notfound/notfound.component */ "./src/app/main/not-found/notfound/notfound.component.ts");


var NotFoundRoutes = [
    {
        path: '',
        component: _notfound_notfound_component__WEBPACK_IMPORTED_MODULE_1__["NotfoundComponent"]
    }
];


/***/ }),

/***/ "./src/app/main/not-found/notfound/notfound.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/main/not-found/notfound/notfound.component.scss ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vbm90LWZvdW5kL25vdGZvdW5kL25vdGZvdW5kLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/main/not-found/notfound/notfound.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/main/not-found/notfound/notfound.component.ts ***!
  \***************************************************************/
/*! exports provided: NotfoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotfoundComponent", function() { return NotfoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var NotfoundComponent = /** @class */ (function () {
    function NotfoundComponent() {
        this.imgPath = './assets/images/logo.png';
        this.route = '/reports';
        this.btnText = 'GO TO REPORTS';
    }
    NotfoundComponent.prototype.ngOnInit = function () { };
    NotfoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-notfound',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./notfound.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/not-found/notfound/notfound.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./notfound.component.scss */ "./src/app/main/not-found/notfound/notfound.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NotfoundComponent);
    return NotfoundComponent;
}());



/***/ })

}]);
//# sourceMappingURL=main-not-found-notfound-module.js.map