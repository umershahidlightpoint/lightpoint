(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-accounts-accounts-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/account-mapping.component.html":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/account-mapping.component.html ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"d-flex flex-direction-row\">\r\n  <div class=\"w-100\">\r\n    <app-chart-of-account></app-chart-of-account>\r\n  </div>\r\n  <!-- <div class=\"w-50\">\r\n    <app-chart-of-account-detail></app-chart-of-account-detail>\r\n  </div> -->\r\n</div>\r\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.html":
/*!****************************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.html ***!
  \****************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Account Mapping Modal Div Starts -->\r\n<div bsModal #modal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal\" aria-hidden=\"true\"\r\n  [config]=\"{backdrop: modal-backdrop , keyboard: false, ignoreBackdropClick: true}\">\r\n\r\n  <!-- Modal Dialog Div Starts -->\r\n  <div class=\"modal-dialog modal-dialog-centered\" id=\"modal-lg\">\r\n\r\n    <!-- Modal Content Div Starts -->\r\n    <div class=\"modal-content\">\r\n\r\n      <!-- Modal Header -->\r\n      <div class=\"modal-header color-primary\">\r\n        <h3>Account Mapping</h3>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" (click)=\"onClose()\">&times;</button>\r\n      </div>\r\n      <!-- Modal Header Ends-->\r\n\r\n      <!-- Modal Body Starts -->\r\n      <div class=\"modal-body\">\r\n        <!-- Main Wrapper -->\r\n        <div class=\"main-wrapper\">\r\n\r\n          <p>Select a third party account for mapping.</p>\r\n\r\n          <!-- Third Party Organization Name Row -->\r\n          <div class=\"d-flex flex-direction-row mt-2\">\r\n            <p class=\"w-25\">Organization: </p>\r\n            <p class=\"w-75 text-muted\">{{ organization }}</p>\r\n          </div>\r\n          <!-- Third Party Row Organization Name Ends -->\r\n\r\n          <!-- Account Name Row-->\r\n          <div class=\"d-flex flex-direction-row mt-2\">\r\n            <div class=\"w-25\">\r\n              <label>Select Account</label>\r\n            </div>\r\n            <div class=\"w-75\">\r\n              <!--Searchable Dropdown-->\r\n              <div>\r\n                <input [(ngModel)]=\"selected\" typeaheadOptionField=\"AccountName\" [isAnimated]=\"true\"\r\n                  [typeahead]=\"states\" typeaheadWaitMs=\"400\" (typeaheadNoResults)=\"typeaheadNoResults($event)\"\r\n                  [typeaheadScrollable]=\"true\" [typeaheadOptionsInScrollableView]=\"15\" [typeaheadMinLength]=\"0\"\r\n                  [typeaheadIsFirstItemActive]=\"true\" placeholder=\"Select Account\"\r\n                  (typeaheadOnSelect)=\"onSelect($event)\" required class=\"form-control\" />\r\n              </div>\r\n              <div class=\"cust-alert text-danger\" *ngIf=\"noResult\">No Results Found</div>\r\n              <!--End Searchable Dropdown-->\r\n            </div>\r\n            <!--Plus Icon-->\r\n            <div *ngIf=\"selected\" class=\"d-flex align-items-center ml-2\">\r\n              <i class=\"fa fa-plus-circle icon-plus\" (click)=\"addAccount()\" aria-hidden=\"true\"></i>\r\n              <!--End Plus Icon-->\r\n            </div>\r\n\r\n          </div>\r\n          <!-- Account Name Row Ends-->\r\n\r\n          <div class=\"list-wrapper\" *ngIf=\"accountDetailList.length > 0\">\r\n            <div class=\"d-flex flex-direction-row\" *ngFor=\"let list of accountDetailList| slice:0:1\">\r\n              <div class=\"select-detail-wrap\">\r\n                <div class=\"d-flex justify-content-between title-bg-color\">\r\n                  <div class=\"align-items-center width-40\" style=\"padding: 7px 0px 0px 0;\">\r\n                    <h6>{{ list.ThirdPartyAccountName }}</h6>\r\n                  </div>\r\n\r\n                  <div class=\"fz-20 width-20\">|</div>\r\n\r\n                  <div class=\"align-items-center ac-name\">\r\n                    <h6 class=\"text-right\">\r\n                      {{ list.OrganizationName }}\r\n                    </h6>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"d-flex align-items-center ml-2\" style=\"padding: 18px 0px 0px 0;\">\r\n                <i class=\"fa fa-minus-circle icon-red\" (click)=\"deleteAccount(list)\" aria-hidden=\"true\"></i>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n        </div>\r\n        <!-- Main Wrapper Ends -->\r\n\r\n      </div>\r\n      <!-- Modal Body Ends -->\r\n\r\n      <!-- Modal Footer -->\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onClose()\">Cancel</button>\r\n        <button type=\"button\" class=\"btn btn-pa\" (click)=\"onSave()\">\r\n          <i class=\"fa fa-save\"></i> Save\r\n        </button>\r\n      </div>\r\n      <!-- Modal Footer Ends-->\r\n\r\n    </div>\r\n    <!-- Modal Content Div Ends -->\r\n\r\n  </div>\r\n  <!-- Modal Dialog Div Ends -->\r\n\r\n</div>\r\n<!-- Account Mapping Modal Div Ends -->");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.html":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.html ***!
  \**************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Actions Container -->\r\n<div class=\"d-flex\">\r\n\r\n  <!-- Organization Dropdown -->\r\n  <div class=\"width-20\">\r\n\r\n    <!-- Dropdown -->\r\n    <select [disabled]=\"isLoading\" class=\"form-control custom-select\" [(ngModel)]=\"organization\"\r\n      (change)=\"selectOrganization($event)\" required>\r\n      <option hidden [value]=\"0\">Choose Organization</option>\r\n      <option *ngFor=\"let list of organizationList; let i = index\">\r\n        {{ list.OrganizationName }}\r\n      </option>\r\n    </select>\r\n    <!-- Dropdown Ends -->\r\n\r\n  </div>\r\n  <!-- Organization Dropdown Ends -->\r\n\r\n  <!-- Loader -->\r\n  <div *ngIf=\"isLoading\" class=\"loader-wrapper\">\r\n    <lp-loading [loadingText]=\"false\"></lp-loading>\r\n  </div>\r\n  <!-- Loader Ends -->\r\n\r\n  <!-- Action Buttons Div Starts -->\r\n  <div class=\"ml-auto\">\r\n    <!-- Refresh Button -->\r\n    <button class=\"btn btn-pa\" tooltip=\"Reset\" placement=\"top\" [disabled]=\"!organization\" (click)=\"resetGrid()\">\r\n      <i class=\"fa fa-undo\"></i></button>\r\n\r\n    <!-- Commit Button -->\r\n    <button class=\"btn btn-pa ml-2\" type=\"button\" [disabled]=\"disableCommit || commitLoader\"\r\n      (click)=\"commitAccountMapping()\">\r\n      Commit\r\n      <span *ngIf=\"commitLoader\" class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\r\n    </button>\r\n  </div>\r\n  <!-- Action Buttons Div Ends -->\r\n\r\n</div>\r\n<!-- Actions Container Ends -->\r\n\r\n<!-- AG Grid Container -->\r\n<div [ngStyle]=\"styleForHeight\">\r\n  <ag-grid-angular class=\"ag-theme-balham w-100 h-100\" [gridOptions]=\"gridOptions\">\r\n  </ag-grid-angular>\r\n</div>\r\n<!-- AG Grid Container Ends -->\r\n\r\n<!-- Map Account Modal -->\r\n<app-chart-of-account-detail #mapAccountModal>\r\n</app-chart-of-account-detail>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account.component.html ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Hide Grid Div -->\r\n<div *ngIf=\"hideGrid\" [ngStyle]=\"containerDiv\">\r\n  <div class=\"d-flex align-items-center justify-content-center\">\r\n    <h1>Posting Engine is Running. Please Wait.</h1>\r\n  </div>\r\n</div>\r\n<!-- Hide Grid Div Ends -->\r\n\r\n<!-- Div Starts -->\r\n<div [ngStyle]=\"{ display: hideGrid ? 'none' : 'initial' }\">\r\n  <!-- Tab View Tag Starts -->\r\n  <tabset>\r\n    <!-- Account Tab Starts -->\r\n    <tab heading=\"Accounts\">\r\n      <!----- Action Buttons Div Starts ----->\r\n      <div [ngStyle]=\"style\">\r\n        <div class=\"row\">\r\n          <div class=\"ml-auto mt-1 mr-2\">\r\n            <!----- Refresh Button Div ----->\r\n            <div class=\"mr-2 d-inline-block\">\r\n              <button (click)=\"refreshGrid()\" class=\"btn btn-pa\" tooltip=\"Refresh\" placement=\"top\">\r\n                <i class=\"fa fa-refresh\"></i>\r\n              </button>\r\n            </div>\r\n            <!-- Export Excel Div -->\r\n            <div class=\"mr-2  d-inline-block\">\r\n              <button (click)=\"onBtExport()\" class=\"btn btn-pa\" tooltip=\"Export to Excel\" placement=\"top\">\r\n                <i class=\"fa fa-arrow-circle-o-down\"></i>\r\n              </button>\r\n            </div>\r\n            <!-- Create Account Button Div Starts -->\r\n            <div class=\"mr-2 btn-group d-inline-block\" dropdown>\r\n              <!-- Create Account Button -->\r\n              <button id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn btn-pa dropdown-toggle\"\r\n                aria-controls=\"dropdown-basic\">\r\n                Create Account <span class=\"caret\"></span>\r\n              </button>\r\n              <!----- Create Category Dropdown ----->\r\n              <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\r\n                <li role=\"menuitem\">\r\n                  <button class=\"dropdown-item disabled\">Select Account Category</button>\r\n                </li>\r\n                <div class=\"dropdown-divider\"></div>\r\n                <li *ngFor=\"let accountCategory of accountCategories\" role=\"menuitem\">\r\n                  <button class=\"dropdown-item\" (click)=\"accountCategorySelected(accountCategory)\">\r\n                    {{ accountCategory.Name }}\r\n                  </button>\r\n                </li>\r\n              </ul>\r\n            </div>\r\n            <!-- Create Account Button Div Ends -->\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <!----- Action Buttons Div Ends ----->\r\n\r\n      <!----- Div To Measure Identifier starts ----->\r\n      <div #divToMeasure>\r\n        <!----- Style For Height ----->\r\n        <div [ngStyle]=\"styleForHeight\">\r\n          <!----- Ag Grid Selector ----->\r\n          <ag-grid-angular class=\"ag-theme-balham w-100 h-100\" [gridOptions]=\"gridOptions\">\r\n          </ag-grid-angular>\r\n          <!----- Action buttons Template Starts ----->\r\n          <ng-template #actionButtons let-row>\r\n            <button class=\"btn grid-btn width-15 height-30px\" (click)=\"editRow(row)\" tooltip=\"Edit\" placement=\"auto\"\r\n              container=\"body\">\r\n              <i class=\"fa fa-lg fa-edit\" aria-hidden=\"true\"></i>\r\n            </button>\r\n            <button [disabled]=\"row.hasJournal == 'Yes'\" class=\"btn grid-btn width-15 height-30px\"\r\n              [ngClass]=\"{ 'cursor-not-allowed': row.hasJournal == 'Yes' }\" (click)=\"openConfirmationModal(row)\"\r\n              tooltip=\"Delete\" placement=\"auto\" container=\"body\">\r\n              <i class=\"fa fa-lg fa-trash-o\" aria-hidden=\"true\"></i>\r\n            </button>\r\n          </ng-template>\r\n          <!----- Action buttons Template Ends ----->\r\n        </div>\r\n      </div>\r\n      <!----- Div To Measure Identifier Ends ----->\r\n    </tab>\r\n    <!-- Account Tab Ends -->\r\n\r\n    <!-- Chart of account Tab -->\r\n    <tab heading=\"Chart of Account Mapping\" (selectTab)=\"activeAccountMapping()\">\r\n      <div [ngStyle]=\"style\">\r\n        <app-account-mapping *ngIf=\"activeAccountMap\"></app-account-mapping>\r\n      </div>\r\n    </tab>\r\n    <!-- Chart of account Tab End -->\r\n  </tabset>\r\n  <!-- Tag Ends -->\r\n</div>\r\n<!-- Div Ends -->\r\n\r\n\r\n\r\n<app-confirmation-modal #confirmationModal [title]=\"'Delete Account'\" (confirmed)=\"deleteAccount()\">\r\n</app-confirmation-modal>\r\n\r\n<!-- Create Account -->\r\n<app-create-account #createModal [selectedAccCategory]=\"selectedAccountCategory\" (modalClose)=\"getAccountsRecord()\">\r\n</app-create-account>\r\n\r\n<router-outlet></router-outlet>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/create-account/create-account.component.html":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/create-account/create-account.component.html ***!
  \******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!------ Modal Div Starts ------>\r\n<div bsModal #modal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal\" aria-hidden=\"true\"\r\n  [config]=\"{backdrop: modal-backdrop}\">\r\n  <div class=\"modal-dialog modal-dialog-centered\" id=\"modal-lg\">\r\n    <div class=\"modal-content\">\r\n      <!------ Form Starts------>\r\n      <form #roleForm=\"ngForm\" [formGroup]=\"accountForm\" (ngSubmit)=\"onSave()\">\r\n        <!-- Modal Header -->\r\n        <div class=\"modal-header color-primary\">\r\n          <h3 *ngIf=\"editCase\">Edit Account ({{ accountCategory }})</h3>\r\n          <h3 *ngIf=\"!editCase\">Create Account ({{ selectedAccountCategory?.name }})</h3>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" (click)=\"close()\">&times;</button>\r\n        </div>\r\n        <!-- Modal Header Ends-->\r\n\r\n        <!-- Modal Body Starts -->\r\n        <div class=\"modal-body\">\r\n          <!-- Account Type Div Starts -->\r\n          <div class=\"form-group\">\r\n            <div class=\"row\">\r\n              <!-- Account Type Label -->\r\n              <div class=\"col-sm-3\">\r\n                <label> Account Type </label>\r\n              </div>\r\n              <!-- Account Type Label for Accounts Having Journals -->\r\n              <div *ngIf=\"editCase && !canEditAccount\" class=\"col-sm-9\">\r\n                <label><strong>{{ accTypeLabel }}</strong></label>\r\n              </div>\r\n              <!-- Account Type Drop Down -->\r\n              <div *ngIf=\"editCase && canEditAccount || !editCase\" class=\"col-sm-9\">\r\n                <select [(ngModel)]=\"accTypeId\" class=\"form-control custom-select\" (change)=\"getAccountTags(accTypeId)\"\r\n                  formControlName=\"type\" [attr.disabled]=\"canEditAccount === false ? true : null\">\r\n                  <option *ngIf=\"!editCase\" hidden [value]=\"0\">Choose your account type</option>\r\n                  <option *ngFor=\"let accType of accountTypes\" [ngValue]=\"accType.Id\">\r\n                    {{ accType.Name }}\r\n                  </option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Account Type Div Ends -->\r\n\r\n          <!-- Description Div Starts -->\r\n          <div class=\"form-group\">\r\n            <div class=\"row\">\r\n              <!-- Description Label -->\r\n              <div class=\"col-sm-3\">\r\n                <label> Description </label>\r\n              </div>\r\n              <!-- Description Input -->\r\n              <div class=\"col-sm-9\">\r\n                <input type=\"text\" class=\"form-control\" formControlName=\"description\" />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Description Div Ends -->\r\n\r\n          <!-- Error message for account having no definition -->\r\n          <div *ngIf=\"noAccountDef\" class=\"row mt-4\">\r\n            <div class=\"col-sm-3\">\r\n            </div>\r\n            <div class=\"col-sm-9 ml-4\">\r\n              <label style=\"color: red\">Account definition is missing.<strong> Please contact support.</strong></label>\r\n            </div>\r\n          </div>\r\n\r\n          <!-- Account Tag Div Starts -->\r\n          <div *ngIf=\"accountTags && canEditAccount\">\r\n            <div class=\"form-group\">\r\n              <!-- Account Tag Label-->\r\n              <div class=\"row\">\r\n                <div class=\"col-sm-5\">\r\n                  <hr />\r\n                </div>\r\n                <div class=\"col-sm-02 mb-2\">\r\n                  <label><strong> Account Tag </strong></label>\r\n                </div>\r\n                <div class=\"col-sm-5\">\r\n                  <hr />\r\n                </div>\r\n              </div>\r\n\r\n              <!-- Account Tag Div Starts-->\r\n              <div class=\"form-group\">\r\n                <div class=\"row\">\r\n                  <!-- Account Tags Label -->\r\n                  <div class=\"col-sm-4\">\r\n                    <label> Account Tags </label>\r\n                  </div>\r\n                  <!-- Account Tags Drop Down -->\r\n                  <div class=\"col-sm-7 btn-group\" dropdown>\r\n                    <button id=\"button-basic\" dropdownToggle type=\"button\"\r\n                      class=\"btn btn-sm btn-pa dropdown-toggle max-height-100\" aria-controls=\"dropdown-basic\">\r\n                      Add Tag <span class=\"caret\"></span>\r\n                    </button>\r\n                    <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu ml-3\" role=\"menu\"\r\n                      aria-labelledby=\"button-basic\">\r\n                      <li *ngFor=\"let tag of accountTags\" role=\"menuitem\">\r\n                        <button *ngIf=\"!tag.isChecked\" type=\"button\" class=\"dropdown-item\"\r\n                          (click)=\"accountTagSelected(tag)\">\r\n                          {{ tag.Name }}\r\n                        </button>\r\n                      </li>\r\n                    </ul>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- Account Tag Div Ends -->\r\n\r\n              <!-- Account Tag Div -->\r\n              <div *ngIf=\"!editCase || editCase && canEditAccount\">\r\n                <div class=\"overflow-y-auto overflow-x-hidden max-height-180\" formArrayName=\"tagsList\">\r\n                  <div *ngFor=\"let instance of tags.controls; let i = index;\" [formGroupName]=\"i\">\r\n                    <div class=\"row mb-3\">\r\n                      <div class=\"col-sm-4\">\r\n                        <!-- Delete Tag Button -->\r\n                        <button type=\"button\" class=\"tag-label\" aria-label=\"Close\" (click)=\"unCheck(instance.value)\"\r\n                          type=\"button\">\r\n                          <span class=\"cross-button\" aria-hidden=\"true\">\r\n                            <strong>x</strong>\r\n                          </span>\r\n                        </button>\r\n                        <!-- Account Tag Name -->\r\n                        <label>\r\n                          {{instance.value.tagName}}\r\n                        </label>\r\n                      </div>\r\n                      <!-- Account Tag Description -->\r\n                      <div *ngIf=\"!editCase\" class=\"col-sm-8\">\r\n                        <input class=\"form-control\" [attr.disabled]=\"!instance.value.isChecked ? true : null\"\r\n                          formControlName=\"description\" placeholder=\"Enter {{instance.value.tagName}}\">\r\n                      </div>\r\n                      <div *ngIf=\"editCase\" class=\"col-sm-8\">\r\n                        <input class=\"form-control\" [attr.disabled]=\"!instance.value.isChecked ? true : null\"\r\n                          formControlName=\"description\" [value]=\"instance.value.description\">\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Account Tag Div Ends -->\r\n        </div>\r\n        <!-- Modal Body Ends -->\r\n\r\n        <!-- Modal Footer -->\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"close()\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-pa\" [disabled]=\"!roleForm.valid\">\r\n            <i class=\"fa fa-save\"></i> Save\r\n          </button>\r\n        </div>\r\n        <!-- Modal Footer Ends-->\r\n\r\n      </form>\r\n      <!-- Form Ends -->\r\n    </div>\r\n  </div>\r\n</div>\r\n<!------ Modal Div Ends ------>");

/***/ }),

/***/ "./src/app/main/accounts/account-mapping/account-mapping.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/account-mapping.component.scss ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vYWNjb3VudHMvYWNjb3VudC1tYXBwaW5nL2FjY291bnQtbWFwcGluZy5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/main/accounts/account-mapping/account-mapping.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/account-mapping.component.ts ***!
  \****************************************************************************/
/*! exports provided: AccountMappingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountMappingComponent", function() { return AccountMappingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AccountMappingComponent = /** @class */ (function () {
    function AccountMappingComponent() {
    }
    AccountMappingComponent.prototype.ngOnInit = function () {
    };
    AccountMappingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-account-mapping',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./account-mapping.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/account-mapping.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./account-mapping.component.scss */ "./src/app/main/accounts/account-mapping/account-mapping.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], AccountMappingComponent);
    return AccountMappingComponent;
}());



/***/ }),

/***/ "./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.scss":
/*!**************************************************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.scss ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".account-detail-wrap {\n  box-sizing: border-box;\n  margin: 20px 1px auto;\n  width: 100%;\n  padding-bottom: 2px;\n  border-radius: 2px;\n  border: 2px solid #dee2e6;\n  height: 97%;\n}\n\n.account-detail-wrap h3 {\n  padding: 5px;\n  background: #eee;\n}\n\n.select-detail-wrap {\n  box-sizing: border-box;\n  margin: 20px 1px auto;\n  padding: 0 5px 0 5px;\n  width: 74.2%;\n  border-radius: 2px;\n  border: 2px solid #dee2e6;\n  background: #eee;\n}\n\n.main-wrapper {\n  padding-bottom: 6%;\n}\n\n.title-bg-color {\n  background: #eee;\n}\n\n.icon-plus {\n  font-size: 25px;\n  color: #0275d8;\n}\n\n.icon-red {\n  font-size: 25px;\n  color: #dc3545;\n}\n\n.div-pad {\n  padding: 0px 10px 20px 0px;\n}\n\n.cust-alert {\n  padding: 0px 4px;\n  font-size: 12px;\n}\n\n.guide-placeholder {\n  background-color: #eee;\n  color: black;\n  text-align: center;\n}\n\n.ac-name {\n  width: 40%;\n  padding: 7px 0px 0px 0;\n}\n\n.list-wrapper {\n  overflow-y: auto;\n  max-height: 365px;\n}\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  max-width: 600px;\n  margin: 10px;\n}\n\n.modal {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n\n.modal-backdrop {\n  position: relative;\n}\n\n.modal-sm {\n  max-width: 300px;\n}\n\n.modal-lg {\n  max-width: 900px;\n}\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    margin: 30px auto;\n  }\n}\n\n@media (min-width: 320px) {\n  .modal-sm {\n    margin-right: auto;\n    margin-left: auto;\n  }\n}\n\n@media (min-width: 620px) {\n  .modal-dialog {\n    margin-right: auto;\n    margin-left: auto;\n  }\n\n  .modal-lg {\n    margin-right: 10px;\n    margin-left: 10px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9hY2NvdW50cy9hY2NvdW50LW1hcHBpbmcvY2hhcnQtb2YtYWNjb3VudC1kZXRhaWwvQzpcXFVzZXJzXFxsYXR0aVxcZGV2ZWxvcG1lbnRcXGxpZ2h0cG9pbnRcXGZpbmFuY2VcXHVpL3NyY1xcYXBwXFxtYWluXFxhY2NvdW50c1xcYWNjb3VudC1tYXBwaW5nXFxjaGFydC1vZi1hY2NvdW50LWRldGFpbFxcY2hhcnQtb2YtYWNjb3VudC1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vYWNjb3VudHMvYWNjb3VudC1tYXBwaW5nL2NoYXJ0LW9mLWFjY291bnQtZGV0YWlsL2NoYXJ0LW9mLWFjY291bnQtZGV0YWlsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usc0JBQUE7RUFDQSxxQkFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxXQUFBO0FDQ0Y7O0FERUE7RUFDRSxZQUFBO0VBQ0EsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLHNCQUFBO0VBQ0EscUJBQUE7RUFDQSxvQkFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLGtCQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtFQUNBLGNBQUE7QUNDRjs7QURFQTtFQUNFLGVBQUE7RUFDQSxjQUFBO0FDQ0Y7O0FERUE7RUFDRSwwQkFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ0NGOztBREVBO0VBQ0UsVUFBQTtFQUNBLHNCQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtFQUNBLGlCQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLG9DQUFBO0FDQ0Y7O0FERUE7RUFDRSxrQkFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLGdCQUFBO0FDQ0Y7O0FERUE7RUFDRTtJQUNFLGlCQUFBO0VDQ0Y7QUFDRjs7QURFQTtFQUNFO0lBQ0Usa0JBQUE7SUFDQSxpQkFBQTtFQ0FGO0FBQ0Y7O0FER0E7RUFDRTtJQUNFLGtCQUFBO0lBQ0EsaUJBQUE7RUNERjs7RURHQTtJQUNFLGtCQUFBO0lBQ0EsaUJBQUE7RUNBRjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9hY2NvdW50cy9hY2NvdW50LW1hcHBpbmcvY2hhcnQtb2YtYWNjb3VudC1kZXRhaWwvY2hhcnQtb2YtYWNjb3VudC1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYWNjb3VudC1kZXRhaWwtd3JhcCB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBtYXJnaW46IDIwcHggMXB4IGF1dG87XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZy1ib3R0b206IDJweDtcclxuICBib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyOiAycHggc29saWQgI2RlZTJlNjtcclxuICBoZWlnaHQ6IDk3JTtcclxufVxyXG5cclxuLmFjY291bnQtZGV0YWlsLXdyYXAgaDMge1xyXG4gIHBhZGRpbmc6IDVweDtcclxuICBiYWNrZ3JvdW5kOiAjZWVlO1xyXG59XHJcblxyXG4uc2VsZWN0LWRldGFpbC13cmFwIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIG1hcmdpbjogMjBweCAxcHggYXV0bztcclxuICBwYWRkaW5nOiAwIDVweCAwIDVweDtcclxuICB3aWR0aDogNzQuMiU7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIGJvcmRlcjogMnB4IHNvbGlkICNkZWUyZTY7XHJcbiAgYmFja2dyb3VuZDogI2VlZTtcclxufVxyXG5cclxuLm1haW4td3JhcHBlciB7XHJcbiAgcGFkZGluZy1ib3R0b206IDYlO1xyXG59XHJcblxyXG4udGl0bGUtYmctY29sb3Ige1xyXG4gIGJhY2tncm91bmQ6ICNlZWU7XHJcbn1cclxuXHJcbi5pY29uLXBsdXMge1xyXG4gIGZvbnQtc2l6ZTogMjVweDtcclxuICBjb2xvcjogIzAyNzVkODtcclxufVxyXG5cclxuLmljb24tcmVkIHtcclxuICBmb250LXNpemU6IDI1cHg7XHJcbiAgY29sb3I6ICNkYzM1NDU7XHJcbn1cclxuXHJcbi5kaXYtcGFkIHtcclxuICBwYWRkaW5nOiAwcHggMTBweCAyMHB4IDBweDtcclxufVxyXG5cclxuLmN1c3QtYWxlcnQge1xyXG4gIHBhZGRpbmc6IDBweCA0cHg7XHJcbiAgZm9udC1zaXplOiAxMnB4O1xyXG59XHJcblxyXG4uZ3VpZGUtcGxhY2Vob2xkZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbiAgY29sb3I6IGJsYWNrO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLmFjLW5hbWUge1xyXG4gIHdpZHRoOiA0MCU7XHJcbiAgcGFkZGluZzogN3B4IDBweCAwcHggMDtcclxufVxyXG5cclxuLmxpc3Qtd3JhcHBlciB7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBtYXgtaGVpZ2h0OiAzNjVweDtcclxufVxyXG5cclxuLm1vZGFsLWRpYWxvZyB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHdpZHRoOiBhdXRvO1xyXG4gIG1heC13aWR0aDogNjAwcHg7XHJcbiAgbWFyZ2luOiAxMHB4O1xyXG59XHJcblxyXG4ubW9kYWwge1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcclxufVxyXG5cclxuLm1vZGFsLWJhY2tkcm9wIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbi5tb2RhbC1zbSB7XHJcbiAgbWF4LXdpZHRoOiAzMDBweDtcclxufVxyXG5cclxuLm1vZGFsLWxnIHtcclxuICBtYXgtd2lkdGg6IDkwMHB4O1xyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcclxuICAubW9kYWwtZGlhbG9nIHtcclxuICAgIG1hcmdpbjogMzBweCBhdXRvO1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XHJcbiAgLm1vZGFsLXNtIHtcclxuICAgIG1hcmdpbi1yaWdodDogYXV0bztcclxuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtaW4td2lkdGg6IDYyMHB4KSB7XHJcbiAgLm1vZGFsLWRpYWxvZyB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XHJcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcclxuICB9XHJcbiAgLm1vZGFsLWxnIHtcclxuICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG4gIH1cclxufVxyXG4iLCIuYWNjb3VudC1kZXRhaWwtd3JhcCB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbjogMjBweCAxcHggYXV0bztcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmctYm90dG9tOiAycHg7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgYm9yZGVyOiAycHggc29saWQgI2RlZTJlNjtcbiAgaGVpZ2h0OiA5NyU7XG59XG5cbi5hY2NvdW50LWRldGFpbC13cmFwIGgzIHtcbiAgcGFkZGluZzogNXB4O1xuICBiYWNrZ3JvdW5kOiAjZWVlO1xufVxuXG4uc2VsZWN0LWRldGFpbC13cmFwIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgbWFyZ2luOiAyMHB4IDFweCBhdXRvO1xuICBwYWRkaW5nOiAwIDVweCAwIDVweDtcbiAgd2lkdGg6IDc0LjIlO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNkZWUyZTY7XG4gIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi5tYWluLXdyYXBwZXIge1xuICBwYWRkaW5nLWJvdHRvbTogNiU7XG59XG5cbi50aXRsZS1iZy1jb2xvciB7XG4gIGJhY2tncm91bmQ6ICNlZWU7XG59XG5cbi5pY29uLXBsdXMge1xuICBmb250LXNpemU6IDI1cHg7XG4gIGNvbG9yOiAjMDI3NWQ4O1xufVxuXG4uaWNvbi1yZWQge1xuICBmb250LXNpemU6IDI1cHg7XG4gIGNvbG9yOiAjZGMzNTQ1O1xufVxuXG4uZGl2LXBhZCB7XG4gIHBhZGRpbmc6IDBweCAxMHB4IDIwcHggMHB4O1xufVxuXG4uY3VzdC1hbGVydCB7XG4gIHBhZGRpbmc6IDBweCA0cHg7XG4gIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuLmd1aWRlLXBsYWNlaG9sZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcbiAgY29sb3I6IGJsYWNrO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5hYy1uYW1lIHtcbiAgd2lkdGg6IDQwJTtcbiAgcGFkZGluZzogN3B4IDBweCAwcHggMDtcbn1cblxuLmxpc3Qtd3JhcHBlciB7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG1heC1oZWlnaHQ6IDM2NXB4O1xufVxuXG4ubW9kYWwtZGlhbG9nIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogYXV0bztcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgbWFyZ2luOiAxMHB4O1xufVxuXG4ubW9kYWwge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XG59XG5cbi5tb2RhbC1iYWNrZHJvcCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLm1vZGFsLXNtIHtcbiAgbWF4LXdpZHRoOiAzMDBweDtcbn1cblxuLm1vZGFsLWxnIHtcbiAgbWF4LXdpZHRoOiA5MDBweDtcbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIC5tb2RhbC1kaWFsb2cge1xuICAgIG1hcmdpbjogMzBweCBhdXRvO1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgLm1vZGFsLXNtIHtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA2MjBweCkge1xuICAubW9kYWwtZGlhbG9nIHtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cblxuICAubW9kYWwtbGcge1xuICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgfVxufSJdfQ== */");

/***/ }),

/***/ "./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.ts":
/*!************************************************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.ts ***!
  \************************************************************************************************************/
/*! exports provided: ChartOfAccountDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartOfAccountDetailComponent", function() { return ChartOfAccountDetailComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../services/accountmapping-api.service */ "./src/services/accountmapping-api.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");





var ChartOfAccountDetailComponent = /** @class */ (function () {
    function ChartOfAccountDetailComponent(accountmappingApiService, toastrService, elementRef) {
        this.accountmappingApiService = accountmappingApiService;
        this.toastrService = toastrService;
        this.elementRef = elementRef;
        this.modalClosed = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.storeThirdPartyAccounts = [];
        this.selectedAccountList = [];
        this.selectedMappedAccount = [];
        this.accountDetailList = [];
        this.organizationList = [];
        this.rowNodes = [];
        this.payload = [];
        this.thirdPartyAccountList = [];
        this.selectedAccount = false;
        this.isSaving = false;
        this.organization = '';
        this.noResult = false;
        this.states = [];
    }
    ChartOfAccountDetailComponent.prototype.typeaheadNoResults = function (event) {
        this.noResult = event;
    };
    ChartOfAccountDetailComponent.prototype.onSelect = function (event) {
        var _this = this;
        this.selectedOption = event.item;
        if (this.accountDetailList.length === 1) {
            return;
        }
        this.rowNodes.forEach(function (element) {
            var account = _this.payload.find(function (x) { return x.AccountId == element.accountId; });
            if (account) {
                account.ThirdPartyAccountMapping.push({
                    ThirdPartyAccountId: _this.selectedOption.AccountId,
                    OrganizationName: _this.organization
                });
            }
            else {
                var thirdPartyAccountMapping = [];
                thirdPartyAccountMapping.push({
                    ThirdPartyAccountId: _this.selectedOption.AccountId,
                    OrganizationName: _this.organization
                });
                var payLoadItem = {
                    AccountId: element.accountId,
                    ThirdPartyAccountMapping: thirdPartyAccountMapping
                };
                _this.payload.push(payLoadItem);
            }
            _this.thirdPartyAccountList.push({
                LPAccountId: element.accountId,
                ThirdPartyAccountId: _this.selectedOption.AccountId
            });
            // Removing duplicate object with same organization name
            element.thirdPartyMappedAccounts.forEach(function (mappedAccount, index, object) {
                if (mappedAccount.OrganizationName === _this.organization &&
                    !mappedAccount.hasOwnProperty('ThirdPartyAccountId') &&
                    !mappedAccount.hasOwnProperty('ThirdPartyAccountName')) {
                    object.splice(index, 1);
                }
            });
            // TODO modify third party mapping in row node
            element.thirdPartyMappedAccounts.push({
                ThirdPartyAccountId: _this.selectedOption.AccountId,
                ThirdPartyAccountName: _this.selectedOption.AccountName,
                OrganizationName: _this.organization,
                isCommitted: false,
                isModified: true
            });
        });
        // TODO iterate over row nodes and modify hasmapping and account name property
        this.accountDetailList.push({
            ThirdPartyAccountName: this.selectedOption.AccountName,
            OrganizationName: this.organization
        });
        // console.log('ACCOUNT WITH SAME ORG', accountWithSameOrg);
        console.log(this.payload, 'modified payload after insertion');
        console.log(this.rowNodes, 'modified row nodes after insertion');
    };
    ChartOfAccountDetailComponent.prototype.onSaveSettings = function () {
        var _this = this;
        this.isSaving = true;
        var payload = [];
        this.selectedAccountList.params.forEach(function (element, index) {
            payload.push({
                AccountId: element.accountId,
                ThirdPartyAccountMapping: _this.storeThirdPartyAccounts
            });
        });
        this.accountmappingApiService.postAccountMapping(payload).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.isSaving = false;
                _this.clearForm();
                _this.toastrService.success('Saved Successfully');
                _this.payload = [];
            }
        }, function (error) {
            _this.isSaving = false;
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    ChartOfAccountDetailComponent.prototype.clearForm = function () {
        this.storeThirdPartyAccounts = [];
        this.selectedAccountList = [];
        this.accountDetailList = [];
        this.organizationList = [];
        this.organization = '';
        this.states = [];
        this.selected = '';
        this.rowNodes = [];
        this.payload = [];
        this.thirdPartyAccountList = [];
    };
    ChartOfAccountDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getOrganizations();
        this.modificationSubscription = this.accountmappingApiService.selectedAccounList$.subscribe(function (list) {
            if (list) {
                _this.rowNodes = JSON.parse(JSON.stringify(list.rowNodes));
                _this.payload = JSON.parse(JSON.stringify(list.payload));
                _this.organization = list.organization;
                _this.states = list.accounts;
                _this.rowNodes.forEach(function (element) {
                    element.thirdPartyMappedAccounts.forEach(function (object) {
                        if (object.OrganizationName == _this.organization) {
                            _this.thirdPartyAccountList.push(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ LPAccountId: element.accountId }, object));
                        }
                    });
                });
                if (_this.thirdPartyAccountList.length > 0 &&
                    _this.thirdPartyAccountList[0].ThirdPartyAccountName !== undefined) {
                    _this.accountDetailList.push({
                        ThirdPartyAccountName: _this.thirdPartyAccountList[0].ThirdPartyAccountName,
                        OrganizationName: _this.thirdPartyAccountList[0].OrganizationName,
                        MapId: _this.thirdPartyAccountList[0].MapId
                    });
                }
                console.log(list, 'in oberver');
            }
        });
    };
    ChartOfAccountDetailComponent.prototype.ngOnDestroy = function () {
        this.modificationSubscription.unsubscribe();
        this.elementRef.nativeElement.remove();
    };
    ChartOfAccountDetailComponent.prototype.getOrganizations = function () {
        var _this = this;
        this.accountmappingApiService.getOrganisation().subscribe(function (data) {
            _this.organizationList = data.payload;
        });
    };
    ChartOfAccountDetailComponent.prototype.addAccount = function () {
        this.selectedAccount = true;
    };
    ChartOfAccountDetailComponent.prototype.deleteAccount = function (obj) {
        var _this = this;
        this.rowNodes.forEach(function (element) {
            var referenceThirdParty = _this.thirdPartyAccountList.find(function (x) { return x.LPAccountId === element.accountId; });
            var account = _this.payload.find(function (x) { return x.AccountId == element.accountId; });
            // Modifying the payload
            element.thirdPartyMappedAccounts.forEach(function (mappedAccount, index) {
                if (mappedAccount.ThirdPartyAccountId === referenceThirdParty.ThirdPartyAccountId &&
                    mappedAccount.OrganizationName === _this.organization) {
                    // Deleting all properties except organization name and flags(is committed and is modified)
                    delete mappedAccount.MapId;
                    delete mappedAccount.ThirdPartyAccountId;
                    delete mappedAccount.ThirdPartyAccountName;
                    mappedAccount.isCommitted = false;
                    mappedAccount.isModified = true;
                }
            });
            if (account) {
                if (obj.MapId) {
                    account.ThirdPartyAccountMapping.push({
                        MapId: referenceThirdParty.MapId,
                        ThirdPartyAccountId: referenceThirdParty.ThirdPartyAccountId
                    });
                }
                else {
                    // If map id is not present, we need to remove it from the payload instead of adding it.
                    var filteredThirdPartAccounts = account.ThirdPartyAccountMapping.filter(function (item) {
                        return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId;
                    });
                    account.ThirdPartyAccountMapping = filteredThirdPartAccounts;
                }
            }
            // adding element for the first time
            else {
                if (obj.MapId) {
                    var thirdPartyMapping = [];
                    thirdPartyMapping.push({
                        MapId: referenceThirdParty.MapId,
                        ThirdPartyAccountId: referenceThirdParty.ThirdPartyAccountId
                    });
                    _this.payload.push({
                        AccountId: element.accountId,
                        ThirdPartyAccountMapping: thirdPartyMapping
                    });
                }
                else {
                    // if map id is not present, we need to remove it from the payload instead of adding it.
                }
            }
            // Modifying row nodes
            var thirdPartyMappedAccounts = element.thirdPartyMappedAccounts.filter(function (item) {
                return item.ThirdPartyAccountId !== referenceThirdParty.ThirdPartyAccountId;
            });
            element.thirdPartyMappedAccounts = thirdPartyMappedAccounts;
            // Modifying third party account list.
            var thirdPartyAccountList = _this.thirdPartyAccountList.filter(function (item) {
                return item.LPAccountId !== referenceThirdParty.LPAccountId;
            });
            _this.thirdPartyAccountList = thirdPartyAccountList;
        });
        this.accountDetailList = [];
        // TODO iterate over row nodes and modify third party accounts
        console.log(this.payload, 'modified payload after deletion');
        console.log(this.rowNodes, 'modified row nodes after deletion');
    };
    ChartOfAccountDetailComponent.prototype.onSave = function () {
        var changes = {
            payload: this.payload,
            rowNodes: this.rowNodes
        };
        this.accountmappingApiService.dispatchChanges(changes);
        this.onClose();
    };
    ChartOfAccountDetailComponent.prototype.show = function () {
        this.modal.show();
    };
    ChartOfAccountDetailComponent.prototype.onClose = function () {
        this.clearForm();
        this.modal.hide();
    };
    ChartOfAccountDetailComponent.ctorParameters = function () { return [
        { type: _services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_3__["AccountmappingApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('modal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_4__["ModalDirective"])
    ], ChartOfAccountDetailComponent.prototype, "modal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ChartOfAccountDetailComponent.prototype, "modalClosed", void 0);
    ChartOfAccountDetailComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chart-of-account-detail',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./chart-of-account-detail.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./chart-of-account-detail.component.scss */ "./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_3__["AccountmappingApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ChartOfAccountDetailComponent);
    return ChartOfAccountDetailComponent;
}());



/***/ }),

/***/ "./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.scss ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("::ng-deep .loader-wrapper .spinner-grow {\n  width: 2rem !important;\n  height: 2rem !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9hY2NvdW50cy9hY2NvdW50LW1hcHBpbmcvY2hhcnQtb2YtYWNjb3VudC9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXGFjY291bnRzXFxhY2NvdW50LW1hcHBpbmdcXGNoYXJ0LW9mLWFjY291bnRcXGNoYXJ0LW9mLWFjY291bnQuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vYWNjb3VudHMvYWNjb3VudC1tYXBwaW5nL2NoYXJ0LW9mLWFjY291bnQvY2hhcnQtb2YtYWNjb3VudC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsdUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL21haW4vYWNjb3VudHMvYWNjb3VudC1tYXBwaW5nL2NoYXJ0LW9mLWFjY291bnQvY2hhcnQtb2YtYWNjb3VudC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIjo6bmctZGVlcCAubG9hZGVyLXdyYXBwZXIgLnNwaW5uZXItZ3JvdyB7XHJcbiAgd2lkdGg6IDJyZW0gIWltcG9ydGFudDtcclxuICBoZWlnaHQ6IDJyZW0gIWltcG9ydGFudDtcclxufVxyXG4iLCI6Om5nLWRlZXAgLmxvYWRlci13cmFwcGVyIC5zcGlubmVyLWdyb3cge1xuICB3aWR0aDogMnJlbSAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDJyZW0gIWltcG9ydGFudDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: ChartOfAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartOfAccountComponent", function() { return ChartOfAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _chart_of_account_detail_chart_of_account_detail_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../chart-of-account-detail/chart-of-account-detail.component */ "./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.ts");
/* harmony import */ var src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/shared/utils/ContextMenu */ "./src/shared/utils/ContextMenu.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../services/accountmapping-api.service */ "./src/services/accountmapping-api.service.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");








var ChartOfAccountComponent = /** @class */ (function () {
    function ChartOfAccountComponent(toastrService, dataService, accountmappingApiService, elementRef) {
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.accountmappingApiService = accountmappingApiService;
        this.elementRef = elementRef;
        this.accountRecords = [];
        this.organizationList = [];
        this.organization = '';
        this.accountsList = [];
        this.payload = [];
        this.selectedAccounts = [];
        this.isLoading = true;
        this.commitLoader = false;
        this.disableCommit = true;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["HeightStyle"])(220);
        this.hideGrid = false;
    }
    ChartOfAccountComponent.prototype.ngOnInit = function () {
        this.initColDefs();
        this.initGrid();
        this.getOrganizations();
    };
    ChartOfAccountComponent.prototype.ngOnDestroy = function () {
        this.modificationsSubscription.unsubscribe();
        this.elementRef.nativeElement.remove();
    };
    ChartOfAccountComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getAccountsRecord();
            }
        });
        this.modificationsSubscription = this.accountmappingApiService.dispatchModifications$.subscribe(function (obj) {
            if (obj) {
                _this.disableCommit = false;
                _this.gridOptions.api.deselectAll();
                var rowNodes = _this.setOrganizationAccounts(obj.rowNodes);
                _this.payload = obj.payload;
                rowNodes.forEach(function (element) {
                    _this.accountRecords[_this.accountRecords.findIndex(function (item) { return item.accountId === element.accountId; })] = element;
                    var row = _this.gridOptions.api.getRowNode(element.accountId).setData(element);
                });
                var columnGroupState = _this.gridOptions.columnApi.getColumnState();
                _this.gridOptions.columnApi.resetColumnState();
                _this.gridOptions.columnApi.setColumnState(columnGroupState);
            }
        });
    };
    ChartOfAccountComponent.prototype.initColDefs = function () {
        this.colDefs = [
            {
                headerName: 'Account Id',
                field: 'accountId',
                hide: true
            },
            {
                headerName: 'Name',
                field: 'accountName',
                filter: true,
                checkboxSelection: true
            },
            {
                headerName: 'Description',
                field: 'description',
                filter: true
            },
            { headerName: 'Category Id', field: 'categoryId', hide: true },
            {
                headerName: 'Category',
                field: 'category',
                filter: true
            },
            {
                headerName: 'Account Type',
                field: 'type',
                filter: true
            },
            {
                headerName: 'Has Mapping',
                field: 'hasMapping',
                hide: true
            },
            {
                headerName: 'Third Party Account Name',
                field: 'thirdPartyAccountName',
                filter: true,
                enableRowGroup: true
            }
        ];
        this.autoGroupColumnDef = {
            headerName: 'Third Party Account',
            field: 'thirdPartyAccount',
            width: 200,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: { checkbox: true }
        };
    };
    ChartOfAccountComponent.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            rowData: [],
            columnDefs: this.colDefs,
            pinnedBottomRowData: null,
            rowSelection: 'multiple',
            groupSelectsChildren: true,
            onRowSelected: this.onRowSelected.bind(this),
            autoGroupColumnDef: this.autoGroupColumnDef,
            getContextMenuItems: this.getContextMenuItems.bind(this),
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotColumnGroupTotals: 'after',
            pivotRowTotals: 'after',
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            },
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_7__["AutoSizeAllColumns"])(params);
                params.api.sizeColumnsToFit();
            },
            getRowNodeId: function (data) {
                return data.accountId;
            },
            getRowStyle: function (params) {
                if (!params.node.group && params.data.thirdPartyOrganizationName === _this.organization) {
                    var accountWithOrgName = params.data.thirdPartyMappedAccounts.find(function (account) { return account.OrganizationName === params.data.thirdPartyOrganizationName; });
                    if (accountWithOrgName.isCommitted && !accountWithOrgName.isModifed) {
                        return { background: '#eeeeee' };
                    }
                    else {
                        return { background: '#f9a89f' };
                    }
                }
                // For deleted third party mapped account ( Only modified and committed properties present )
                var specialCase = params.data.thirdPartyMappedAccounts.find(function (account) {
                    return  true &&
                        'isCommitted' in account &&
                        account.OrganizationName === _this.organization &&
                        !account.hasOwnProperty('thirdPartyOrganizationName');
                });
                if (specialCase !== undefined && specialCase.isModified) {
                    return { background: '#f9a89f' };
                }
                return { background: '#ffffff' };
            },
            getExternalFilterState: function () {
                return {};
            },
            clearExternalFilter: function () { }
        };
    };
    ChartOfAccountComponent.prototype.selectOrganization = function (event) {
        this.selectedAccounts = [];
        this.organization = event.target.value;
        this.setGridData();
    };
    ChartOfAccountComponent.prototype.setGridData = function () {
        var _this = this;
        this.accountsList = this.organizationList.find(function (element) { return element.OrganizationName === _this.organization; }).Accounts;
        var cloneList = JSON.parse(JSON.stringify(this.accountRecords));
        this.gridOptions.api.setRowData(this.setOrganizationAccounts(cloneList));
    };
    ChartOfAccountComponent.prototype.setOrganizationAccounts = function (list) {
        var _this = this;
        list = list.map(function (item) {
            var accountName = '';
            var organizationName = '';
            if (item.thirdPartyMappedAccounts.length !== 0) {
                var _a = item.thirdPartyMappedAccounts.find(function (element) { return element.OrganizationName === _this.organization; }) || {}, _b = _a.ThirdPartyAccountName, ThirdPartyAccountName = _b === void 0 ? '' : _b, _c = _a.OrganizationName, OrganizationName = _c === void 0 ? '' : _c;
                accountName = ThirdPartyAccountName;
                organizationName = OrganizationName;
            }
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item, { thirdPartyAccountName: accountName, thirdPartyOrganizationName: organizationName });
        });
        return list;
    };
    ChartOfAccountComponent.prototype.getContextMenuItems = function (params) {
        var _this = this;
        var addDefaultItems = [
            {
                name: 'Map',
                action: function () {
                    _this.mappedAccountId(params.node.data);
                }
            }
        ];
        return Object(src_shared_utils_ContextMenu__WEBPACK_IMPORTED_MODULE_4__["GetContextMenu"])(false, addDefaultItems, false, [], params);
    };
    ChartOfAccountComponent.prototype.mappedAccountId = function (params) {
        var getSelectedAccounts = this.gridOptions.api.getSelectedRows();
        var dispatchObject = {
            payload: this.payload,
            rowNodes: getSelectedAccounts,
            organization: this.organization,
            accounts: this.accountsList
        };
        this.accountmappingApiService.storeAccountList(dispatchObject);
        this.mapAccountModal.show();
    };
    ChartOfAccountComponent.prototype.onRowSelected = function (params) {
        var status = false;
        if (params.data === undefined) {
            return;
        }
        if (params.node.selected) {
            status = this.addSelectedAccount(params.data);
        }
        else {
            status = this.removeUnselectedAccount(params.data);
        }
        params.node.setSelected(status);
    };
    ChartOfAccountComponent.prototype.addSelectedAccount = function (rowData) {
        var selectionStatus = false;
        var accountIndex = this.selectedAccounts.length - 1;
        var account = {
            accountId: rowData.accountId,
            thirdPartyAccountName: rowData.thirdPartyAccountName
        };
        if (this.selectedAccounts.length === 0) {
            this.selectedAccounts.push(account);
            selectionStatus = true;
        }
        else if (this.selectedAccounts[accountIndex].thirdPartyAccountName === account.thirdPartyAccountName) {
            this.selectedAccounts.push(account);
            selectionStatus = true;
        }
        else {
            this.toastrService.clear();
            this.toastrService.error('Please Select a Homogeneous Collection, Either rows which are not Mapped or rows with the same Mapping');
        }
        return selectionStatus;
    };
    ChartOfAccountComponent.prototype.removeUnselectedAccount = function (rowData) {
        this.selectedAccounts = this.selectedAccounts.filter(function (element) { return element.accountId !== rowData.accountId; });
        return false;
    };
    ChartOfAccountComponent.prototype.getOrganizations = function () {
        var _this = this;
        this.accountmappingApiService.getOrganisation().subscribe(function (response) {
            if (response.isSuccessful) {
                _this.organizationList = response.payload;
                _this.organization = response.payload[0].OrganizationName;
                _this.getAccountsRecord();
            }
            else {
                _this.toastrService.error('Failed to fetch account Organizations!');
            }
            _this.isLoading = false;
        }, function (error) {
            _this.isLoading = false;
            _this.toastrService.error('Failed to fetch account Organizations!');
        });
    };
    ChartOfAccountComponent.prototype.getAccountsRecord = function () {
        var _this = this;
        this.accountmappingApiService.getMappedAccounts().subscribe(function (response) {
            _this.accountRecords = response.payload;
            if (response.payload) {
                _this.accountRecords = response.payload.map(function (result) { return ({
                    accountId: result.AccountId,
                    accountName: result.AccountName,
                    description: result.Description,
                    categoryId: result.CategoryId,
                    category: result.Category,
                    typeId: result.TypeId,
                    type: result.Type,
                    hasMapping: result.HasMapping,
                    hasJournal: result.HasJournal,
                    canDeleted: result.CanDeleted,
                    canEdited: result.CanEdited,
                    thirdPartyMappedAccounts: result.ThirdPartyMappedAccounts.length > 0
                        ? result.ThirdPartyMappedAccounts.map(function (account) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, account, { isCommitted: true, isModified: false })); })
                        : result.ThirdPartyMappedAccounts.map(function (account) { return (tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, account, { isCommitted: false, isModified: false })); })
                }); });
            }
            _this.setGridData();
            _this.cloneList = JSON.parse(JSON.stringify(_this.accountRecords));
        });
    };
    ChartOfAccountComponent.prototype.resetGrid = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.selectedAccounts = [];
        this.gridOptions.api.setRowData(this.setOrganizationAccounts(this.cloneList));
    };
    ChartOfAccountComponent.prototype.commitAccountMapping = function () {
        var _this = this;
        this.commitLoader = true;
        this.accountmappingApiService.postAccountMapping(this.payload).subscribe(function (response) {
            _this.commitLoader = false;
            if (response.isSuccessful) {
                _this.payload = [];
                _this.toastrService.success('Sucessfully Commited.');
                _this.getAccountsRecord();
            }
            else {
                _this.toastrService.error('Something went wrong! Try Again.');
            }
        });
        this.disableCommit = true;
    };
    ChartOfAccountComponent.ctorParameters = function () { return [
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"] },
        { type: _services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_6__["AccountmappingApiService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mapAccountModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _chart_of_account_detail_chart_of_account_detail_component__WEBPACK_IMPORTED_MODULE_3__["ChartOfAccountDetailComponent"])
    ], ChartOfAccountComponent.prototype, "mapAccountModal", void 0);
    ChartOfAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chart-of-account',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./chart-of-account.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.html")).default,
            providers: [_services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_6__["AccountmappingApiService"]],
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./chart-of-account.component.scss */ "./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            _services_accountmapping_api_service__WEBPACK_IMPORTED_MODULE_6__["AccountmappingApiService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ChartOfAccountComponent);
    return ChartOfAccountComponent;
}());



/***/ }),

/***/ "./src/app/main/accounts/account.component.scss":
/*!******************************************************!*\
  !*** ./src/app/main/accounts/account.component.scss ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".dropdown-menu {\n  margin-left: -4rem !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9hY2NvdW50cy9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXGFjY291bnRzXFxhY2NvdW50LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9tYWluL2FjY291bnRzL2FjY291bnQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSw2QkFBQTtBQ0NGIiwiZmlsZSI6InNyYy9hcHAvbWFpbi9hY2NvdW50cy9hY2NvdW50LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmRyb3Bkb3duLW1lbnUge1xyXG4gIG1hcmdpbi1sZWZ0OiAtNHJlbSAhaW1wb3J0YW50O1xyXG59IiwiLmRyb3Bkb3duLW1lbnUge1xuICBtYXJnaW4tbGVmdDogLTRyZW0gIWltcG9ydGFudDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/main/accounts/account.component.ts":
/*!****************************************************!*\
  !*** ./src/app/main/accounts/account.component.ts ***!
  \****************************************************/
/*! exports provided: AccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountComponent", function() { return AccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/shared/utils/AppEnums */ "./src/shared/utils/AppEnums.ts");
/* harmony import */ var _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../template-renderer/template-renderer.component */ "./src/app/template-renderer/template-renderer.component.ts");
/* harmony import */ var _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./create-account/create-account.component */ "./src/app/main/accounts/create-account/create-account.component.ts");
/* harmony import */ var src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/shared/Component/confirmation-modal/confirmation-modal.component */ "./src/shared/Component/confirmation-modal/confirmation-modal.component.ts");
/* harmony import */ var src_services_common_data_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/services/common/data.service */ "./src/services/common/data.service.ts");
/* harmony import */ var _services_account_api_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../services/account-api.service */ "./src/services/account-api.service.ts");
/* harmony import */ var src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/shared/utils/DownloadExcelUtils */ "./src/shared/utils/DownloadExcelUtils.ts");
/* harmony import */ var src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/shared/utils/Shared */ "./src/shared/utils/Shared.ts");













var AccountComponent = /** @class */ (function () {
    function AccountComponent(router, accountApiService, toastrService, dataService, downloadExcelUtils) {
        this.router = router;
        this.accountApiService = accountApiService;
        this.toastrService = toastrService;
        this.dataService = dataService;
        this.downloadExcelUtils = downloadExcelUtils;
        this.style = src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["Style"];
        this.styleForHeight = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["HeightStyle"])(224);
        this.containerDiv = {
            border: '1px solid #eee',
            padding: '4px',
            marginTop: '20px',
            width: '100%',
            height: 'calc(100vh - 125px)',
            boxSizing: 'border-box'
        };
        this.activeAccountMap = false;
        this.hideGrid = false;
    }
    AccountComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dataService.flag$.subscribe(function (obj) {
            _this.hideGrid = obj;
            if (!_this.hideGrid) {
                _this.getAccountsRecord();
            }
        });
        this.gridOptions.api.setColumnDefs([
            {
                headerName: 'Account Id',
                field: 'accountId',
                hide: true
            },
            {
                headerName: 'Name',
                field: 'accountName',
                filter: true
            },
            {
                headerName: 'Description',
                field: 'description',
                filter: true
            },
            { headerName: 'Category Id', field: 'categoryId', hide: true },
            {
                headerName: 'Category',
                field: 'category',
                filter: true
            },
            {
                headerName: 'Has Journal',
                field: 'hasJournal',
                filter: true
            },
            {
                headerName: 'Account Type',
                field: 'type',
                filter: true
            },
            { headerName: 'CanDeleted', field: 'canDeleted', hide: true },
            { headerName: 'CanEdited', field: 'canEdited', hide: true },
            {
                headerName: 'Actions',
                cellRendererFramework: _template_renderer_template_renderer_component__WEBPACK_IMPORTED_MODULE_6__["TemplateRendererComponent"],
                cellRendererParams: {
                    ngTemplate: this.actionButtons
                },
                filter: false
            }
        ]);
    };
    AccountComponent.prototype.ngOnInit = function () {
        this.initGrid();
        this.getAccountsRecord();
        this.getAccountCategories();
    };
    AccountComponent.prototype.initGrid = function () {
        this.gridOptions = {
            rowData: null,
            pinnedBottomRowData: null,
            frameworkComponents: { customToolPanel: lp_toolkit__WEBPACK_IMPORTED_MODULE_4__["GridLayoutMenuComponent"] },
            rowSelection: 'single',
            rowGroupPanelShow: 'after',
            pivotPanelShow: 'after',
            pivotRowTotals: 'after',
            pivotColumnGroupTotals: 'after',
            onFirstDataRendered: function (params) {
                Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["AutoSizeAllColumns"])(params);
                params.api.sizeColumnsToFit();
            },
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true
            }
        };
        this.gridOptions.sideBar = Object(src_shared_utils_Shared__WEBPACK_IMPORTED_MODULE_12__["SideBar"])(src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridId"].accountId, src_shared_utils_AppEnums__WEBPACK_IMPORTED_MODULE_5__["GridName"].account, this.gridOptions);
    };
    AccountComponent.prototype.activeAccountMapping = function () {
        this.activeAccountMap = true;
    };
    AccountComponent.prototype.getAccountCategories = function () {
        var _this = this;
        this.accountApiService.accountCategories().subscribe(function (response) {
            if (response.isSuccessful) {
                _this.accountCategories = response.payload;
            }
            else {
                _this.toastrService.error('Failed to fetch account categories!');
            }
        });
    };
    AccountComponent.prototype.getAccountsRecord = function () {
        var _this = this;
        setTimeout(function () {
            _this.accountApiService.getAllAccounts().subscribe(function (result) {
                if (result.payload) {
                    _this.rowData = result.payload.map(function (result) { return ({
                        accountId: result.AccountId,
                        accountName: result.AccountName,
                        description: result.Description,
                        categoryId: result.CategoryId,
                        category: result.Category,
                        typeId: result.TypeId,
                        type: result.Type,
                        hasJournal: result.HasJournal,
                        canDeleted: result.CanDeleted,
                        canEdited: result.CanEdited
                    }); });
                    _this.gridOptions.api.setRowData(_this.rowData);
                }
            });
        }, 100);
    };
    AccountComponent.prototype.editRow = function (row) {
        this.router.navigateByUrl('/accounts/create-account');
        this.createAccount.show(row);
    };
    AccountComponent.prototype.openConfirmationModal = function (row) {
        this.account = row;
        this.confirmationModal.showModal();
    };
    AccountComponent.prototype.deleteAccount = function () {
        var _this = this;
        var selectedAccount = this.account;
        this.accountApiService.deleteAccount(selectedAccount.accountId).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.toastrService.success('Account deleted successfully!');
                _this.getAccountsRecord();
            }
            else {
                _this.toastrService.error('Account deleted failed!');
            }
        }, function (error) {
            _this.toastrService.error('Something went wrong. Try again later!');
        });
    };
    AccountComponent.prototype.addAccount = function () {
        this.router.navigateByUrl('/accounts/create-account');
        this.createAccount.show({});
    };
    AccountComponent.prototype.onBtExport = function () {
        var params = {
            fileName: 'Accounts',
            sheetName: 'First Sheet',
            columnKeys: ['accountName', 'description', 'category', 'hasJournal', 'type']
        };
        this.gridOptions.api.exportDataAsExcel(params);
        this.downloadExcelUtils.ToastrMessage();
    };
    AccountComponent.prototype.refreshGrid = function () {
        this.gridOptions.api.showLoadingOverlay();
        this.getAccountsRecord();
    };
    AccountComponent.prototype.accountCategorySelected = function (category) {
        this.selectedAccountCategory = {
            id: category.Id,
            name: category.Name
        };
        this.router.navigateByUrl('/accounts/create-account');
        this.createAccount.show({});
    };
    AccountComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _services_account_api_service__WEBPACK_IMPORTED_MODULE_10__["AccountApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"] },
        { type: src_services_common_data_service__WEBPACK_IMPORTED_MODULE_9__["DataService"] },
        { type: src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_11__["DownloadExcelUtils"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('createModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_7__["CreateAccountComponent"])
    ], AccountComponent.prototype, "createAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('actionButtons', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], AccountComponent.prototype, "actionButtons", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('divToMeasure', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AccountComponent.prototype, "divToMeasureElement", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('confirmationModal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_shared_Component_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_8__["ConfirmationModalComponent"])
    ], AccountComponent.prototype, "confirmationModal", void 0);
    AccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-ledger-form',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./account.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/account.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./account.component.scss */ "./src/app/main/accounts/account.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_account_api_service__WEBPACK_IMPORTED_MODULE_10__["AccountApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            src_services_common_data_service__WEBPACK_IMPORTED_MODULE_9__["DataService"],
            src_shared_utils_DownloadExcelUtils__WEBPACK_IMPORTED_MODULE_11__["DownloadExcelUtils"]])
    ], AccountComponent);
    return AccountComponent;
}());



/***/ }),

/***/ "./src/app/main/accounts/accounts.module.ts":
/*!**************************************************!*\
  !*** ./src/app/main/accounts/accounts.module.ts ***!
  \**************************************************/
/*! exports provided: AccountsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountsModule", function() { return AccountsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/fesm5/ngx-bootstrap-dropdown.js");
/* harmony import */ var lp_toolkit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lp-toolkit */ "./node_modules/lp-toolkit/fesm5/lp-toolkit.js");
/* harmony import */ var _accounts_route__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./accounts.route */ "./src/app/main/accounts/accounts.route.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");
/* harmony import */ var _account_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./account.component */ "./src/app/main/accounts/account.component.ts");
/* harmony import */ var _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./create-account/create-account.component */ "./src/app/main/accounts/create-account/create-account.component.ts");
/* harmony import */ var _account_mapping_account_mapping_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./account-mapping/account-mapping.component */ "./src/app/main/accounts/account-mapping/account-mapping.component.ts");
/* harmony import */ var _account_mapping_chart_of_account_chart_of_account_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./account-mapping/chart-of-account/chart-of-account.component */ "./src/app/main/accounts/account-mapping/chart-of-account/chart-of-account.component.ts");
/* harmony import */ var _account_mapping_chart_of_account_detail_chart_of_account_detail_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./account-mapping/chart-of-account-detail/chart-of-account-detail.component */ "./src/app/main/accounts/account-mapping/chart-of-account-detail/chart-of-account-detail.component.ts");











// Account Component





var AccountsComponents = [
    _account_component__WEBPACK_IMPORTED_MODULE_11__["AccountComponent"],
    _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_12__["CreateAccountComponent"],
    _account_mapping_account_mapping_component__WEBPACK_IMPORTED_MODULE_13__["AccountMappingComponent"],
    _account_mapping_chart_of_account_chart_of_account_component__WEBPACK_IMPORTED_MODULE_14__["ChartOfAccountComponent"],
    _account_mapping_chart_of_account_detail_chart_of_account_detail_component__WEBPACK_IMPORTED_MODULE_15__["ChartOfAccountDetailComponent"]
];
var AccountsModule = /** @class */ (function () {
    function AccountsModule() {
    }
    AccountsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: AccountsComponents.slice(),
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TooltipModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__["TypeaheadModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"].forRoot(),
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_accounts_route__WEBPACK_IMPORTED_MODULE_9__["AccountRoutes"]),
                lp_toolkit__WEBPACK_IMPORTED_MODULE_8__["LpToolkitModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_10__["SharedModule"]
            ]
        })
    ], AccountsModule);
    return AccountsModule;
}());



/***/ }),

/***/ "./src/app/main/accounts/accounts.route.ts":
/*!*************************************************!*\
  !*** ./src/app/main/accounts/accounts.route.ts ***!
  \*************************************************/
/*! exports provided: AccountRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountRoutes", function() { return AccountRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _account_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./account.component */ "./src/app/main/accounts/account.component.ts");
/* harmony import */ var _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./create-account/create-account.component */ "./src/app/main/accounts/create-account/create-account.component.ts");



var AccountRoutes = [
    {
        path: '',
        component: _account_component__WEBPACK_IMPORTED_MODULE_1__["AccountComponent"],
        children: [
            {
                path: 'create-account',
                component: _create_account_create_account_component__WEBPACK_IMPORTED_MODULE_2__["CreateAccountComponent"]
            }
        ]
    },
];


/***/ }),

/***/ "./src/app/main/accounts/create-account/create-account.component.scss":
/*!****************************************************************************!*\
  !*** ./src/app/main/accounts/create-account/create-account.component.scss ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".modal-dialog {\n  position: relative;\n  width: auto;\n  max-width: 600px;\n  margin: 10px;\n}\n\n.close {\n  font-size: 1.5em;\n  color: #ffff;\n  display: none;\n}\n\n.modal-sm {\n  max-width: 300px;\n}\n\n.modal-lg {\n  max-width: 900px;\n}\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    margin: 30px auto;\n  }\n}\n\n@media (min-width: 320px) {\n  .modal-sm {\n    margin-right: auto;\n    margin-left: auto;\n  }\n}\n\n@media (min-width: 620px) {\n  .modal-dialog {\n    margin-right: auto;\n    margin-left: auto;\n  }\n\n  .modal-lg {\n    margin-right: 10px;\n    margin-left: 10px;\n  }\n}\n\n@media (min-width: 920px) {\n  .modal-lg {\n    margin-right: auto;\n    margin-left: auto;\n  }\n}\n\n.cross-button {\n  background-color: transparent;\n  cursor: pointer;\n  color: #fa0a0a;\n  font-size: 18px;\n  font-weight: bold;\n  padding: 0 8px;\n}\n\n.tag-label {\n  background: none;\n  border-style: none;\n  margin-right: 2px;\n}\n\n.modal {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n\n.modal-backdrop {\n  position: relative;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi9hY2NvdW50cy9jcmVhdGUtYWNjb3VudC9DOlxcVXNlcnNcXGxhdHRpXFxkZXZlbG9wbWVudFxcbGlnaHRwb2ludFxcZmluYW5jZVxcdWkvc3JjXFxhcHBcXG1haW5cXGFjY291bnRzXFxjcmVhdGUtYWNjb3VudFxcY3JlYXRlLWFjY291bnQuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21haW4vYWNjb3VudHMvY3JlYXRlLWFjY291bnQvY3JlYXRlLWFjY291bnQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7QUNDRjs7QURFQTtFQUNFLGdCQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtBQ0NGOztBREVBO0VBQ0U7SUFDRSxpQkFBQTtFQ0NGO0FBQ0Y7O0FERUE7RUFDRTtJQUNFLGtCQUFBO0lBQ0EsaUJBQUE7RUNBRjtBQUNGOztBREdBO0VBQ0U7SUFDRSxrQkFBQTtJQUNBLGlCQUFBO0VDREY7O0VER0E7SUFDRSxrQkFBQTtJQUNBLGlCQUFBO0VDQUY7QUFDRjs7QURHQTtFQUNFO0lBQ0Usa0JBQUE7SUFDQSxpQkFBQTtFQ0RGO0FBQ0Y7O0FESUE7RUFDRSw2QkFBQTtFQUNBLGVBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtBQ0ZGOztBREtBO0VBQ0UsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0FDRkY7O0FES0E7RUFDRSxvQ0FBQTtBQ0ZGOztBREtBO0VBQ0Usa0JBQUE7QUNGRiIsImZpbGUiOiJzcmMvYXBwL21haW4vYWNjb3VudHMvY3JlYXRlLWFjY291bnQvY3JlYXRlLWFjY291bnQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubW9kYWwtZGlhbG9nIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IGF1dG87XHJcbiAgbWF4LXdpZHRoOiA2MDBweDtcclxuICBtYXJnaW46IDEwcHg7XHJcbn1cclxuXHJcbi5jbG9zZSB7XHJcbiAgZm9udC1zaXplOiAxLjVlbTtcclxuICBjb2xvcjogI2ZmZmY7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLm1vZGFsLXNtIHtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG59XHJcblxyXG4ubW9kYWwtbGcge1xyXG4gIG1heC13aWR0aDogOTAwcHg7XHJcbn1cclxuXHJcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gIC5tb2RhbC1kaWFsb2cge1xyXG4gICAgbWFyZ2luOiAzMHB4IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcclxuICAubW9kYWwtc20ge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xyXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogNjIwcHgpIHtcclxuICAubW9kYWwtZGlhbG9nIHtcclxuICAgIG1hcmdpbi1yaWdodDogYXV0bztcclxuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xyXG4gIH1cclxuICAubW9kYWwtbGcge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1pbi13aWR0aDogOTIwcHgpIHtcclxuICAubW9kYWwtbGcge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xyXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgfVxyXG59XHJcblxyXG4uY3Jvc3MtYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgY29sb3I6ICNmYTBhMGE7XHJcbiAgZm9udC1zaXplOiAxOHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIHBhZGRpbmc6IDAgOHB4O1xyXG59XHJcblxyXG4udGFnLWxhYmVsIHtcclxuICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcclxuICBtYXJnaW4tcmlnaHQ6IDJweDtcclxufVxyXG5cclxuLm1vZGFsIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XHJcbn1cclxuXHJcbi5tb2RhbC1iYWNrZHJvcCB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcbiIsIi5tb2RhbC1kaWFsb2cge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiBhdXRvO1xuICBtYXgtd2lkdGg6IDYwMHB4O1xuICBtYXJnaW46IDEwcHg7XG59XG5cbi5jbG9zZSB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIGNvbG9yOiAjZmZmZjtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLm1vZGFsLXNtIHtcbiAgbWF4LXdpZHRoOiAzMDBweDtcbn1cblxuLm1vZGFsLWxnIHtcbiAgbWF4LXdpZHRoOiA5MDBweDtcbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIC5tb2RhbC1kaWFsb2cge1xuICAgIG1hcmdpbjogMzBweCBhdXRvO1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgLm1vZGFsLXNtIHtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA2MjBweCkge1xuICAubW9kYWwtZGlhbG9nIHtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cblxuICAubW9kYWwtbGcge1xuICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDkyMHB4KSB7XG4gIC5tb2RhbC1sZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICB9XG59XG4uY3Jvc3MtYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgY29sb3I6ICNmYTBhMGE7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHBhZGRpbmc6IDAgOHB4O1xufVxuXG4udGFnLWxhYmVsIHtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDJweDtcbn1cblxuLm1vZGFsIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xufVxuXG4ubW9kYWwtYmFja2Ryb3Age1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59Il19 */");

/***/ }),

/***/ "./src/app/main/accounts/create-account/create-account.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/main/accounts/create-account/create-account.component.ts ***!
  \**************************************************************************/
/*! exports provided: CreateAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountComponent", function() { return CreateAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var src_services_account_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/services/account-api.service */ "./src/services/account-api.service.ts");







var CreateAccountComponent = /** @class */ (function () {
    function CreateAccountComponent(router, formBuilder, accountApiService, toastrService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.accountApiService = accountApiService;
        this.toastrService = toastrService;
        this.editCase = false;
        this.accTypeId = 0;
        this.noAccountDef = false;
        this.canEditAccount = true;
        this.modalClose = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    CreateAccountComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    CreateAccountComponent.prototype.buildForm = function () {
        this.accountForm = this.formBuilder.group({
            description: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required),
            type: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required),
            tagsList: this.formBuilder.array([])
        });
        this.tags = this.accountForm.get('tagsList');
    };
    CreateAccountComponent.prototype.getAccountTypes = function (selectedAccountCategoryId) {
        var _this = this;
        this.accountApiService.accountTypes(selectedAccountCategoryId).subscribe(function (response) {
            if (response.isSuccessful) {
                _this.accountTypes = response.payload;
            }
            else {
                _this.toastrService.error('Failed to fetch account categories!');
            }
        });
    };
    CreateAccountComponent.prototype.createTag = function (tag) {
        return this.formBuilder.group({
            description: this.formBuilder.control(tag.description),
            isChecked: this.formBuilder.control(tag.isChecked),
            tagId: this.formBuilder.control(tag.Id),
            tagName: this.formBuilder.control(tag.Name)
        });
    };
    CreateAccountComponent.prototype.addTag = function (selectedAccTags) {
        selectedAccTags['description'] = '';
        selectedAccTags['isChecked'] = true;
        this.tags.push(this.createTag(selectedAccTags));
    };
    CreateAccountComponent.prototype.deleteTag = function (tagToDelete) {
        var control = this.accountForm.controls['tagsList'];
        for (var i = control.length - 1; i >= 0; i--) {
            if (control.at(i).value.tagId === tagToDelete.tagId) {
                control.removeAt(i);
            }
        }
        this.accountTags.forEach(function (tag) {
            if (tag.Id == tagToDelete.tagId) {
                tag['isChecked'] = false;
                tag['description'] = '';
            }
        });
    };
    CreateAccountComponent.prototype.getAccountTags = function (typeId) {
        var _this = this;
        var accTypeId = typeId;
        if (this.editCase) {
            this.accountApiService.accountTags().subscribe(function (response) {
                if (response.payload.length < 1) {
                    _this.noAccountDef = true;
                    return;
                }
                _this.accountTags = response.payload;
                if (accTypeId !== _this.rowDataSelected.typeId) {
                    _this.clearTagsListArray();
                }
                else {
                    _this.hasExistingAccount(_this.rowDataSelected);
                }
            }, function (error) {
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
        else {
            this.accountApiService.accountTags().subscribe(function (response) {
                if (response.payload.length < 1) {
                    _this.noAccountDef = true;
                    return;
                }
                _this.accountTags = response.payload;
            }, function (error) {
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
    };
    CreateAccountComponent.prototype.hasExistingAccount = function (accountData) {
        var _this = this;
        this.accountApiService.getAccountTags(accountData.accountId).subscribe(function (response) {
            var payload = response.payload;
            var Tags = payload[0].Tags;
            if (Tags.length > 0) {
                var temp = _this.accountTags;
                temp.map(function (accountTags) {
                    Tags.forEach(function (tag) {
                        if (tag.Id === accountTags.Id) {
                            accountTags['isChecked'] = true;
                            accountTags['description'] = tag['Value'];
                            return accountTags;
                        }
                    });
                });
                temp = temp.filter(function (tag) {
                    if (tag.hasOwnProperty('isChecked')) {
                        return tag;
                    }
                });
                temp.forEach(function (tag) {
                    _this.tags.push(_this.createTag(tag));
                });
            }
        });
    };
    CreateAccountComponent.prototype.show = function (rowSelected) {
        this.rowDataSelected = rowSelected;
        if (Object.keys(rowSelected).length !== 0) {
            this.accountCategory = rowSelected.category;
            this.canEditAccount = rowSelected.canDeleted;
            this.accTypeLabel = !this.canEditAccount ? null : rowSelected.type;
            this.editCase = true;
            this.getAccountTypes(rowSelected.categoryId);
            this.getAccountTags(rowSelected.typeId);
            this.accountForm.patchValue({
                description: rowSelected.description,
                type: {
                    id: rowSelected.typeId,
                    name: rowSelected.type
                }
            });
            this.accTypeId = rowSelected.typeId;
            this.accTypeLabel = rowSelected.type;
        }
        this.modal.show();
    };
    CreateAccountComponent.prototype.onShown = function () {
        this.accountForm.value.description.focusInput();
    };
    CreateAccountComponent.prototype.close = function () {
        var _this = this;
        this.modal.hide();
        setTimeout(function () { return _this.clearForm(); }, 250);
        this.router.navigateByUrl('/accounts');
    };
    CreateAccountComponent.prototype.onSave = function () {
        var _this = this;
        var formValues = this.accountForm.value.tagsList;
        var tagsObject = formValues.filter(function (tag) {
            if (tag.isChecked === true) {
                return { id: tag.tag_id, value: tag.description };
            }
        });
        var tagObjectToSend = tagsObject.map(function (tag) {
            return { id: tag.tagId, value: tag.description };
        });
        if (this.editCase) {
            if (!this.canEditAccount) {
                var patchAccountObj = {
                    description: this.accountForm.value.description
                };
                this.accountApiService
                    .patchAccount(this.rowDataSelected.accountId, patchAccountObj)
                    .subscribe(function (response) {
                    if (response.isSuccessful) {
                        _this.toastrService.success('Account edited successfully!');
                    }
                    else {
                        _this.toastrService.error('Account edited failed!');
                    }
                }, function (error) {
                    _this.toastrService.error('Something went wrong. Try again later!');
                });
            }
            else {
                this.editAccountInstance = {
                    id: this.rowDataSelected.accountId,
                    description: this.accountForm.value.description,
                    type: this.accountForm.value.type || this.rowDataSelected.typeId,
                    tags: tagObjectToSend
                };
                this.accountApiService.editAccount(this.editAccountInstance).subscribe(function (response) {
                    if (response.isSuccessful) {
                        _this.toastrService.success('Account edited successfully!');
                    }
                    else {
                        _this.toastrService.error('Account edition failed!');
                    }
                }, function (error) {
                    _this.toastrService.error('Something went wrong. Try again later!');
                });
            }
        }
        else {
            this.accountInstance = {
                description: this.accountForm.value.description,
                type: this.accountForm.value.type,
                tags: tagObjectToSend
            };
            this.accountApiService.createAccount(this.accountInstance).subscribe(function (response) {
                if (response.isSuccessful) {
                    _this.toastrService.success('Account created successfully!');
                }
                else {
                    _this.toastrService.error('Account creation failed!');
                }
            }, function (error) {
                _this.toastrService.error('Something went wrong. Try again later!');
            });
        }
        this.modalClose.emit(true);
        this.modal.hide();
        setTimeout(function () { return _this.clearForm(); }, 1000);
        this.router.navigateByUrl('/accounts');
    };
    CreateAccountComponent.prototype.clearForm = function () {
        this.accountForm.controls['description'].reset();
        this.accountForm.controls['type'].reset();
        this.clearTagsListArray();
        this.accountTags = null;
        this.canEditAccount = true;
        this.editCase = false;
        this.accTypeLabel = null;
        this.accountTags = null;
        this.noAccountDef = false;
        this.accTypeId = null;
    };
    CreateAccountComponent.prototype.clearTagsListArray = function () {
        var control = this.accountForm.controls['tagsList'];
        for (var i = control.length - 1; i >= 0; i--) {
            control.removeAt(i);
        }
    };
    CreateAccountComponent.prototype.accountTagSelected = function (tag) {
        this.addTag(tag);
    };
    CreateAccountComponent.prototype.unCheck = function (instance) {
        this.deleteTag(instance);
    };
    CreateAccountComponent.prototype.ngOnChanges = function (changes) {
        var selectedAccountCategory = changes.selectedAccountCategory;
        var currentValue = selectedAccountCategory.currentValue;
        if (currentValue) {
            this.getAccountTypes(currentValue.id);
        }
    };
    CreateAccountComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] },
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] },
        { type: src_services_account_api_service__WEBPACK_IMPORTED_MODULE_6__["AccountApiService"] },
        { type: ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])('selectedAccCategory'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], CreateAccountComponent.prototype, "selectedAccountCategory", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('modal', { static: false }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], CreateAccountComponent.prototype, "modal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], CreateAccountComponent.prototype, "modalClose", void 0);
    CreateAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-create-account',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./create-account.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/main/accounts/create-account/create-account.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./create-account.component.scss */ "./src/app/main/accounts/create-account/create-account.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            src_services_account_api_service__WEBPACK_IMPORTED_MODULE_6__["AccountApiService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"]])
    ], CreateAccountComponent);
    return CreateAccountComponent;
}());



/***/ }),

/***/ "./src/services/accountmapping-api.service.ts":
/*!****************************************************!*\
  !*** ./src/services/accountmapping-api.service.ts ***!
  \****************************************************/
/*! exports provided: AccountmappingApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountmappingApiService", function() { return AccountmappingApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment.prod */ "./src/environments/environment.prod.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");






var AccountmappingApiService = /** @class */ (function () {
    function AccountmappingApiService(http) {
        this.http = http;
        this.selectedAccounList = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
        this.selectedAccounList$ = this.selectedAccounList.asObservable();
        this.dispatchModifications = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
        this.dispatchModifications$ = this.dispatchModifications.asObservable();
        this.baseUrl = window['config'] ? window['config'].remoteServerUrl : _environments_environment_prod__WEBPACK_IMPORTED_MODULE_3__["environment"].testCaseRemoteServerUrl;
    }
    AccountmappingApiService.prototype.storeAccountList = function (obj) {
        this.selectedAccounList.next(obj);
    };
    AccountmappingApiService.prototype.dispatchChanges = function (obj) {
        this.dispatchModifications.next(obj);
    };
    AccountmappingApiService.prototype.getMappedAccounts = function () {
        var url = this.baseUrl + '/account/mappedAccount';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    AccountmappingApiService.prototype.postAccountMapping = function (obj) {
        var url = this.baseUrl + '/account/chartOfAccountMapping';
        return this.http.post(url, obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    AccountmappingApiService.prototype.getOrganisation = function () {
        var url = this.baseUrl + '/account/thirdParty';
        return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (response) { return response; }));
    };
    AccountmappingApiService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    AccountmappingApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AccountmappingApiService);
    return AccountmappingApiService;
}());



/***/ })

}]);
//# sourceMappingURL=main-accounts-accounts-module.js.map