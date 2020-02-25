# LP Toolkit

> Common Components and Tooling for LightPoint Angular Applications.

[![package version](https://img.shields.io/badge/package-0.0.7-blue)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)
[![last commit](https://img.shields.io/badge/last%20commit-february-brightgreen)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)

This library works fine with the latest version of angular.

**Demo:** https://github.com/LightPointFinancialTechnology/lpToolkit-src

## Prerequisite

1. Bootstrap: 4
2. Angular/Material: 8
3. Angular/CDK: 8
4. Font-Awesome: 4.7.0

## Installation

To install the library include the following in your **_package.json_ ** dependencies:

```bash
 "lp-toolkit": "git+https://github.com/LightPointFinancialTechnology/lpToolkit.git"
```

Then do

`npm install`

> **Note:** If `lp-toolkit` is previously installed and is already present in your `node_modules` directory, then please delete it from your `node_modules` before `npm install`

import **LpToolkitModule** in your root module:

```typescript
...
import { LpToolkitModule } from 'lp-toolkit';

@NgModule({
    imports: [
        ... ,
        LpToolkitModule.forRoot()
    ]
})
export class AppModule {}
```

> **Note:** In feature modules import LpToolkitModule without forRoot()

## Theming

### Using Pre-Built Themes

Available pre-built themes:

- _blue-theme.css_
- _purple-theme.css_
- _green-theme.css_
- _brown-theme.css_
- _magenta-theme.css_
- _teal-theme.css_

This is as simple as including one line in your `styles.css/styles.scss` file:

```css
@import '../node_modules/lp-toolkit/styles/blue-theme.css';
```

The actual path will depend on your server setup.

### Custom Themes

You can create your own theme files to define custom themes.

In order to add a custom theme:

**1)** Create a _theme.css_ file

A typical theme file will look something like this:

_`green-theme.css`_

```css
:root {
  --primary: #28a745;
  --on-primary: #ffffff;
  --primary-light: #67e083;
  --on-primary-light: #ffffff;
  --secondary: #f4f5f7;
  --on-secondary: #000000;
  --tertiary: #6c757d;
  --on-tertiary: #000000;
}
```

**2)** In your `styles.css/styles.scss` file, Import the newly created theme file:

```css
@import './path/to/theme/green-theme.css';
```

**3)** Now in order to register your newly created theme with LP Toolkit, Create a _toolkit-config.ts_ file

A typical toolkit-config file will look something like this:

_`toolkit-config.ts`_

```typescript
import { LPToolkitConfig } from 'lp-toolkit';

export const toolkitConfig: LPToolkitConfig = {
  themes: [
    {
      name: 'green',
      properties: {
        '--primary': '#28a745',
        '--on-primary': '#ffffff',
        '--primary-light': '#67e083',
        '--on-primary-light': '#ffffff',
        '--secondary': '#f4f5f7',
        '--on-secondary': '#000000',
        '--tertiary': '#6c757d',
        '--on-tertiary': '#ffffff'
      }
    }
  ]
};
```

**4)** Pass the `toolkitConfig` in your root module import of **LpToolkitModule**:

```typescript
import { LpToolkitModule } from 'lp-toolkit';
import { toolkitConfig } from './toolkit-config';

@NgModule({
    imports: [
        ... ,
        LpToolkitModule.forRoot(toolkitConfig)
    ]
})
export class AppModule {}
```

## Theme Service

LP Toolkit also provides a `Theme Service` which exposes a bunch of methods to programmatically change themes.

### Usage example

```typescript
import { ThemeService } from 'lp-toolkit';

export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.setActiveTheme('purple');
  }
}
```

### Attributes:

| Method               | Params            | Return Type | Description                              |
| -------------------- | ----------------- | ----------- | ---------------------------------------- |
| getAvailableThemes() | none              | Theme[]     | Returns an array of all available themes |
| getActiveTheme()     | none              | Theme       | Returns the currently active theme       |
| setActiveTheme()     | themeName: string | void        | Sets a theme as active theme             |

## Components

## 1. Header

### Usage example

Html:

```html
<lp-header [title]="appTitle">
  <app-header-content></app-header-content>
</lp-header>
```

Typescript:

```typescript
appTitle: string = 'Portfolio Accounting';
```

### Attributes:

| Attribute | Type   | Default |
| --------- | ------ | ------- |
| appTitle  | string | My App  |

## 2. Side Menu

### Usage example

Html:

```html
<lp-menu [userPages]="userPages" [adminPages]="adminPages">
  <router-outlet></router-outlet>
</lp-menu>
```

Typescript:

```typescript
import { Page } from 'lp-toolkit';

public userPages: Page[] = [
    {
      name: 'Reports',
      routerLink: '/reports',
      icon: 'fa-bar-chart'
    }
];

public adminPages: Page[] = [
    {
      name: 'Operations',
      routerLink: '/operations',
      icon: 'fa-tasks'
    },
    {
      name: 'Settings',
      routerLink: '/settings',
      icon: 'fa-cog'
    }
];
```

### Attributes:

| Attribute  | Type    | Default |
| ---------- | ------- | ------- |
| userPages  | Page[ ] | empty   |
| adminPages | Page[ ] | empty   |

## 3. Not Found

### Usage example

Html:

```html
<lp-not-found [imgPath]="imgPath" [route]="route"></lp-not-found>
```

Typescript:

```typescript
imgPath = './assets/images/logo.png';
route = '/reports';
```

### Options:

Html:

```html
<lp-not-found [btnText]="btnText"></lp-not-found>
```

Typescript:

```typescript
btnText = 'GO TO REPORTS';
```

### Attributes:

| Attribute | Type   | Default        |
| --------- | ------ | -------------- |
| imgPath   | string | none           |
| route     | string | none           |
| btnText   | string | GO TO HOMEPAGE |

## 4. Loading

### Usage example

Html:

```html
<lp-loading></lp-loading>
```

### Options:

Html:

```html
<lp-loading [loadingText]="false"> </lp-loading>
```

### Attributes:

| Attribute   | Type    | Default |
| ----------- | ------- | ------- |
| loadingText | boolean | true    |

## 5. Progress

### Usage example

Html:

```html
<lp-progress></lp-progress>
```

## 6. Services Log

### Usage example

Html:

```html
<lp-services-log [getLogsUrl]="getLogsUrl" [downloadFileUrl]="downloadFileUrl">
</lp-services-log>
```

Typescript:

```typescript
getLogsUrl: string = 'http://localhost:yourlocalhost/api/log/files';
downloadFileUrl: string =
  'http://localhost:yourlocalhost/api/log/download?fileName=';
```

### Attributes:

| Attribute       | Type   | Default |
| --------------- | ------ | ------- |
| getLogsUrl      | string | none    |
| downloadFileUrl | string | none    |

**Response (getLogsUrl):**

```typescript
{
"message": "The Request was Successful",
"payload": [
		{
			"FileName": "Finance-Log-2020-01-29.log"
		},
		{
			"FileName": "Finance-Log-2020-01-30.log"
		}
],
"statusCode": 200
}
```

## 7. Select Theme

### Usage example

Html:

```html
<lp-select-theme></lp-select-theme>
```

### Options:

Html:

```html
<form #settingsForm="ngForm" (ngSubmit)="onSaveSettings()">
  <div class="row justify-content-end">
    <div class="col-auto">
      <button
        class="btn btn-primary"
        [disabled]="settingsForm.invalid"
        type="submit"
      ></button>
    </div>
  </div>

  <h4>Application Theme</h4>
  <lp-select-theme #themeSelect="ngModel" ngModel="blue" name="theme" required>
  </lp-select-theme>

  <p class="text-danger" *ngIf="themeSelect.invalid && themeSelect.touched">
    *Please select a theme
  </p>

  <h4 class="mt-4">Theme Value</h4>
  <p>
    Value:
    <span class="font-weight-bold font-italic">
      {{settingsForm.form.value.theme}}
    </span>
  </p>
</form>
```

Typescript:

```typescript
@ViewChild('settingsForm', { static: true }) settingsForm: NgForm;

onSaveSettings() {
    console.log('SETTINGS FORM ::', this.settingsForm);
}
```

## 8. Grid Layout Menu

### Usage example

Html:

```html
<ag-grid-angular
  class="w-100 h-100 ag-theme-balham"
  [gridOptions]="gridOptions"
></ag-grid-angular>
```

Typescript:

```typescript
import { GridOptions } from 'ag-grid-community';
import { GridLayoutMenuComponent, GridUtils, CustomGridOptions, LayoutServices } from 'lp-toolkit';

public gridOptions: GridOptions;

initGird() {
	this.gridOptions = {
		rowData: [],
		onGridReady: params => {
		},
		frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
		... ,
		/* Add these Grid Option Properties only in Case of External Filters */
		isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
		doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
		... ,
		/* Add these Custom Grid Option Properties only in Case of External Filters */
		getExternalFilterState: this.getExternalFilterState.bind(this),
		clearExternalFilter: this.clearExternalFilter.bind(this),
		setExternalFilter: this.setExternalFilter.bind(this)
	};

	const url = 'http://localhost:9091/api';
	const layoutServices: LayoutServices = {
		getGridLayouts: url,
		getLayoutDetail: url,
		saveGridLayout: url,
		deleteGridLayout: url,
		dataProperty: 'payload'				// Key/Name of Data Property in Response Body
	  };
	// After the gridOptions is ready
	this.gridOptions.sideBar = GridUtils.SideBar(
		userId,
		gridId,
		gridName,
		gridOptions,				// Current Grid's GridOptions, e.g.  this.gridOptions
		layoutServices,
		defaultView,				// Optional: Name of DefaultView for the Grid
		dataSource				// Optional: Pass DataSource In Case of ServerSideRowModel
	);
}

// This method should return the External Filters Object
getExternalFilterState() {
    return {
      fundFilter: this.fund
    };
}

// This method is called when a Grid Layout is Reset clear External Filters here
clearExternalFilter() {
    this.fund = '';
    this.gridOptions.api.onFilterChanged();
}

// This method is called when a Grid Layout is Applied set your External Filters here
setExternalFilter(externalFilter) {
    const { fundFilter } = externalFilter;
    this.fund = fundFilter;
    this.gridOptions.api.onFilterChanged();
  }
```

**Read more** about [External Filters in AG Grid](https://www.ag-grid.com/javascript-grid-filter-external/ 'External Filters in AG Grid')

> **Note:** If you are using **External Filters** then the type of **GridOptions** should be **CustomGridOptions**
> i.e. `public gridOptions: CustomGridOptions;`
> else it should be GridOptions
> i.e. `public gridOptions: GridOptions;`

### API EndPoints

### API Interface

```typescript
interface GridLayout {
  UserId: number | string;
  Id: number | string;
  GridId: number | string;
  GridName: string;
  GridLayoutName: string;
  ColumnState: ColDef[] | ColGroupDef[] | string;
  GroupState: any[] | string;
  PivotMode: boolean | string;
  SortState: any[] | string;
  FilterState: any | string;
  ExternalFilterState: any | string;
  IsPublic: boolean;
  IsDefault?: boolean;
}
```

**1) GET :: getGridLayouts (Get All Layouts of a Grid by `userId` and `gridId` passed as query params):**

**Response**

```typescript
{
"message": "The Request was Successful",
"payload": [
	{
	"Id": 1,
	"GridId": 1,
	"GridName": "Journals Ledgers",
	"GridLayoutName": "Events",
	"ColumnState": "[{\"colId\":\"ag-Grid-AutoColumn\",\"hide\":false,\"aggFunc\":null,\"width\":402,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"source\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"fund\",\"hide\":true,\"aggFunc\":null,\"width\":120,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null}]",
	},
"IsPublic": false,
"IsDefault": false
],
"statusCode": 200
}
```

**2) GET :: getLayoutDetail (Get a Grid Layout Details by `id` passed as query param):**

**Response**

```typescript
{
"message": "The Request was Successful",
"payload": [
	{
	"Id": 1,
	"GridId": 1,
	"GridName": "Journals Ledgers",
	"GridLayoutName": "Events",
	"ColumnState": "[{\"colId\":\"ag-Grid-AutoColumn\",\"hide\":false,\"aggFunc\":null,\"width\":402,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"source\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"fund\",\"hide\":true,\"aggFunc\":null,\"width\":120,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null}]",
	},
"GroupState": "[]",
"PivotMode": "false",
"SortState": "[]",
"FilterState": "{\"side\":{\"values\":[\"LONG\"],\"filterType\":\"set\"}}",
"ExternalFilterState": "{\"fundFilter\":\"All Funds\"}",
"IsPublic": false,
"IsDefault": false
],
"statusCode": 200
}
```

**3) POST :: saveGridLayout (Save (Id will be 0 in Payload) or Update a Grid Layout):**

**Payload**

```typescript
{
  UserId: number | string;
  Id: number | string;
  GridId: number | string;
  GridName: string;
  GridLayoutName: string;
  ColumnState: ColDef[] | ColGroupDef[] | string;
  GroupState: any[] | string;
  PivotMode: boolean | string;
  SortState: any[] | string;
  FilterState: any | string;
  ExternalFilterState: any | string;
  IsPublic: boolean;
}
```

**Response**

```typescript
{
"message": "The Request was Successful",
"payload": [],
"statusCode": 200
}
```

**4) DELETE :: deleteGridLayout (Delete a Grid Layout by `id` passed as route param):**

**Response**

```typescript
{
"message": "The Request was Successful",
"payload": [],
"statusCode": 200
}
```

## 9. LP Modal

### Usage example

Html:

```html
<lp-modal #lpModal><div>I am inside Modal Body</div></lp-modal>
```

Typescript:

```typescript
import { ViewChild } from '@angular/core';
import { ModalComponent } from 'lp-toolkit';

@ViewChild('lpModal', { static: false }) lpModal: ModalComponent;

showModal() {
    this.lpModal.showModal();
}

hideModal() {
    this.lpModal.hideModal();
}
```

### Options:

Html:

```html
<lp-modal
  #lpModal
  size="large"
  [showCloseButton]="true"
  [showFooter]="true"
  [title]="isSaveState ? 'Save' : 'Edit'"
  [footerConfig]="footerConfig"
  (closed)="onClose()"
  (confirmed)="onConfirm()"
  (canceled)="onCancel()"
  (deleted)="onDelete()"
>
  <div>I am inside Modal Body</div>
</lp-modal>
```

Typescript:

```typescript
import { ViewChild } from '@angular/core';
import { ModalComponent, ModalFooterConfig } from 'lp-toolkit';

@ViewChild('lpModal', { static: false }) lpModal: ModalComponent;

public isSaveState = true;
public footerConfig: ModalFooterConfig = {
    showConfirmButton: true,
    confirmButtonText: 'Save',
    confirmButtonIcon: 'fa-save',
    confirmButtonDisabledState: false,
    confirmButtonLoadingState: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonIcon: 'fa-times',
    cancelButtonDisabledState: false,
    cancelButtonLoadingState: false,
    showDeleteButton: true,
    deleteButtonText: 'Delete',
    deleteButtonIcon: 'fa-trash',
    deleteButtonDisabledState: false,
    deleteButtonLoadingState: false
};

onClose() {
}

onConfirm() {
    this.hideModal();
}

onCancel() {
}

onDelete() {
    this.hideModal();
}

showModal() {
    this.lpModal.showModal();
}

hideModal() {
    this.lpModal.hideModal();
}
```

### Attributes:

| Attribute       | Type              | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| size            | string            | default (max-width: 500px)<br>Possible Values: **small, large, extra-large**                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| showCloseButton | boolean           | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| showFooter      | boolean           | true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| title           | string            | LP Modal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| footerConfig    | ModalFooterConfig | { <br>showConfirmButton: false,<br>confirmButtonText: 'Confirm',<br>confirmButtonIcon: 'fa-check-square',<br>confirmButtonDisabledState: false,<br>confirmButtonLoadingState: false,<br>showCancelButton: true,<br>cancelButtonText: 'Cancel',<br>cancelButtonIcon: 'fa-times',<br>cancelButtonDisabledState: false,<br>cancelButtonLoadingState: false,<br>showDeleteButton: false,<br>deleteButtonText: 'Delete',<br>deleteButtonIcon: 'fa-trash',<br>deleteButtonDisabledState: false,<br>deleteButtonLoadingState: false<br>} |

### Events:

#### (closed)

> (event) An event that is emitted when the top right cross icon is clicked.

#### (confirmed)

> (event) An event that is emitted when the confirm is clicked.

#### (canceled)

> (event) An event that is emitted when the cancel is clicked.

#### (deleted)

> (event) An event that is emitted when the delete is clicked.

## Interfaces

## 1. Page

```typescript
interface Page {
  routerLink: string;
  name: string;
  icon: string;
}
```

### Usage example

```typescript
const userPage: Page = {
  name: 'Reports',
  routerLink: '/reports',
  icon: 'fa-bar-chart'
};
```

## 2. LPToolkitConfig

```typescript
interface LPToolkitConfig {
  themes: Theme[];
}
```

### Usage example

```typescript
const toolkitConfig: LPToolkitConfig = {
  themes: [
    {
      name: 'green',
      properties: {
        '--primary': '#28a745',
        '--on-primary': '#ffffff',
        '--primary-light': '#67e083',
        '--on-primary-light': '#ffffff',
        '--secondary': '#f4f5f7',
        '--on-secondary': '#000000',
        '--tertiary': '#6c757d',
        '--on-tertiary': '#ffffff'
      }
    }
  ]
};
```

## 3. Theme

```typescript
interface Theme {
  name: string;
  properties: any;
}
```

### Usage example

```typescript
const blue: Theme = {
  name: 'blue',
  properties: {
    '--primary': '#0275d8',
    '--on-primary': '#ffffff',
    '--primary-light': '#519ddf',
    '--on-primary-light': '#ffffff',
    '--secondary': '#f4f5f7',
    '--on-secondary': '#000000',
    '--tertiary': '#6c757d',
    '--on-tertiary': '#ffffff'
  }
};
```

## 4. CustomGridOptions

```typescript
interface CustomGridOptions extends GridOptions {
  getExternalFilterState(): any;
  clearExternalFilter(): void;
  setExternalFilter(externalFilterState: any): void;
}
```

### Usage example

```typescript
private gridOptions: CustomGridOptions;

this.gridOptions = {
    rowData: [],
    onGridReady: params => {
    },
    ... ,
    /* Grid Options Properties for External Filters */
    isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    /* Custom Grid Options Properties for External Filters */
    getExternalFilterState: this.getExternalFilterState.bind(this),
    clearExternalFilter: this.clearExternalFilter.bind(this),
    setExternalFilter: this.setExternalFilter.bind(this)
};
```

## 5. LayoutServices

```typescript
interface LayoutServices {
  getGridLayouts: string;
  getLayoutDetail: string;
  saveGridLayout: string;
  deleteGridLayout: string;
  dataProperty: string;
}
```

### Usage example

```typescript
const url = 'http://localhost:9091/api';
const layoutServices: LayoutServices = {
  getGridLayouts: url,
  getLayoutDetail: url,
  saveGridLayout: url,
  deleteGridLayout: url,
  dataProperty: 'payload'
};
```

## 6. ModalFooterConfig

```typescript
interface ModalFooterConfig {
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  confirmButtonIcon?: string;
  confirmButtonDisabledState?: boolean;
  confirmButtonLoadingState?: boolean;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonIcon?: string;
  cancelButtonDisabledState?: boolean;
  cancelButtonLoadingState?: boolean;
  showDeleteButton?: boolean;
  deleteButtonText?: string;
  deleteButtonIcon?: string;
  deleteButtonDisabledState?: boolean;
  deleteButtonLoadingState?: boolean;
}
```

### Usage example

```typescript
public modalFooterConfig: ModalFooterConfig = {
    showConfirmButton: false,
    confirmButtonText: 'Confirm',
    confirmButtonIcon: 'fa-check-square',
    confirmButtonDisabledState: false,
    confirmButtonLoadingState: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonIcon: 'fa-times',
    cancelButtonDisabledState: false,
    cancelButtonLoadingState: false,
    showDeleteButton: false,
    deleteButtonText: 'Delete',
    deleteButtonIcon: 'fa-trash',
    deleteButtonDisabledState: false,
    deleteButtonLoadingState: false
};
```

# LP ToolkitSrc

In order to run LP ToolkitSrc application follow these steps.

## Installation

```bash
npm install
npm run lib:build
npm start
```

## Publish

To publish the library, run the following command:

`npm run lib:publish`
