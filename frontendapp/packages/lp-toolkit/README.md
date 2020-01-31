# LP Toolkit

> Common Components and Tooling for LightPoint Angular Applications.

[![package version](https://img.shields.io/badge/package-0.0.5-blue)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)
[![last commit](https://img.shields.io/badge/last%20commit-january-brightgreen)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)

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
