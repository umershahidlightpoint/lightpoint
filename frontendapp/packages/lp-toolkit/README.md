# LP Toolkit

> Common components and functionality for LightPoint projects.

[![package version](https://img.shields.io/badge/package-0.0.2-blue)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)
[![last commit](https://img.shields.io/badge/last%20commit-january-brightgreen)](https://github.com/LightPointFinancialTechnology/lpToolkit.git)

This library works fine with the latest version of angular.

**Demo:** https://github.com/LightPointFinancialTechnology/lpToolkit.git

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

import **LpToolkitModule** in your module:

```typescript
...
import { LpToolkitModule } from 'lp-toolkit';

@NgModule({
    imports: [
        ... ,
        LpToolkitModule
    ]
})
export class AppModule {}
```

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

### Options:

Html:

```html
<lp-header
  [title]="appTitle"
  [colorMode]="colorMode"
  [backgroundColor]="backgroundColor"
  [textColor]="textColor"
>
  <app-header-content></app-header-content>
</lp-header>
```

Typescript:

```typescript
appTitle: string = 'Portfolio Accounting';
colorMode: string = 'light';
backgroundColor: string = '#0275d8';
textColor: string = '#fff';
```

### Attributes:

| Attribute       | Type   | Default |
| --------------- | ------ | ------- |
| appTitle        | string | My App  |
| colorMode       | string | dark    |
| backgroundColor | string | #0275d8 |
| textColor       | string | #fff    |

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

### Options:

Html:

```html
<lp-menu
  [userPages]="userPages"
  [adminPages]="adminPages"
  [colorMode]="colorMode"
  [backgroundColor]="backgroundColor"
>
  <router-outlet></router-outlet>
</lp-menu>
```

Typescript:

```typescript
import { Page } from 'lp-toolkit';

colorMode: string = 'dark';
backgroundColor: string = '#0275d8';

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

| Attribute       | Type    | Default |
| --------------- | ------- | ------- |
| userPages       | Page[ ] | empty   |
| adminPages      | Page[ ] | empty   |
| colorMode       | string  | light   |
| backgroundColor | string  | #f4f5f7 |

## 3. Not Found

### Usage example

Html:

```html
<lp-not-found [imgPath]="imgPath" [route]="route"> </lp-not-found>
```

Typescript:

```typescript
imgPath = './assets/images/logo.png';
route = '/reports';
```

### Options:

Html:

```html
<lp-not-found
  [backgroundColor]="backgroundColor"
  [btnTextColor]="btnTextColor"
  [btnBgColor]="btnBgColor"
  [btnText]="btnText"
>
</lp-not-found>
```

Typescript:

```typescript
backgroundColor = '#0275D8';
btnTextColor = '#DBD8D0';
btnBgColor = '#007BFF';
btnText = 'GO TO REPORTS';
```

### Attributes:

| Attribute       | Type   | Default        |
| --------------- | ------ | -------------- |
| backgroundColor | string | #0275D8        |
| imgPath         | string | none           |
| route           | string | none           |
| btnText         | string | GO TO HOMEPAGE |
| btnTextColor    | string | #DBD8D0        |
| btnBgColor      | string | #007BFF        |

## 4. Loading

### Usage example

Html:

```html
<lp-loading></lp-loading>
```

### Options:

Html:

```html
<lp-loading [loadingText]="false" [loaderColor]="loaderColor" [textColor]="textColor"> </lp-loading>
```

Typescript:

```typescript
loaderColor = '#0275D8';
textColor = '#0275D8';
```

### Attributes:

| Attribute   | Type    | Default |
| ----------- | ------- | ------- |
| loadingText | boolean | true    |
| loaderColor | boolean | #0275D8 |
| textColor   | boolean | #0275D8 |

## 5. Progress

### Usage example

Html:

```html
<lp-progress></lp-progress>
```

### Options:

Html:

```html
<lp-progress [color]="color" ;></lp-progress>
```

Typescript:

```typescript
color: string = '#f53d3d';
```

### Attributes:

| Attribute | Type   | Default |
| --------- | ------ | ------- |
| color     | string | #f53d3d |
