
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { NgModuleFactoryLoader, Component, NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { PostingEngineService } from '../services/common/posting-engine.service';
import { DataService } from './../services/common/data.service';

import { AppComponent } from './app.component';

// import { JournalsLedgerModule } from './main/journals-ledgers/journals-ledger.module';
// import { OmsModule } from './main/oms/oms.module';
// import { SettingsModule } from './main/settings/settings.module';

import { HeaderContentComponent } from './menu/header-content/header-content.component';
import { LpToolkitModule } from 'lp-toolkit';

fdescribe('Routing Testing', () => {
let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
// let router: Router;
// let location: Location;

beforeEach(async(() => {
TestBed.configureTestingModule({
declarations: [
          AppComponent,
          HeaderContentComponent
        ],
imports: [
          RouterTestingModule.withRoutes(routes),
          BrowserAnimationsModule,
          HttpClientModule,
          LpToolkitModule.forRoot()
        ],
providers: [
          PostingEngineService,
          DataService
]
}).compileComponents();
}));
beforeEach(() => {
fixture = TestBed.createComponent(AppComponent);
component = fixture.componentInstance;
fixture.detectChanges();
let router = TestBed.get(Router);
});

@Component({ template: '' })
class LazyLoadedComponent { }

@NgModule({ declarations: [LazyLoadedComponent] })
class LazyModule { }

it('should navigate to reports', (() => {
  // tslint:disable-next-line: no-shadowed-variable
  const router = TestBed.get(Router);
  router.initialNavigation();
  // Used to load ng module factories.
  const loader = TestBed.get(NgModuleFactoryLoader);
  // tslint:disable-next-line: no-shadowed-variable
  const location = TestBed.get(Location);
  // sets up stubbedModules
  loader.stubbedModules = {
  './main/reports/reports.module#ReportsModule': LazyModule,
  };
  router.resetConfig([
  { path: 'reports', loadChildren: './main/reports/reports.module#ReportsModule' },
  ]);
  router.navigateByUrl('/');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to fund-theoretical', (() => {
  const router = TestBed.get(Router);
  router.initialNavigation();
  const loader = TestBed.get(NgModuleFactoryLoader);
  const location = TestBed.get(Location);
  loader.stubbedModules = {
  './main/fund-theoretical/fund-theoretical.module#FundTheoreticalModule': LazyModule,
  };
  router.resetConfig([
  { path: 'fund-theoretical', loadChildren: './main/fund-theoretical/fund-theoretical.module#FundTheoreticalModule' },
  ]);
  router.navigateByUrl('/');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to journals-ledgers', (() => {
const router = TestBed.get(Router);
router.initialNavigation();
const loader = TestBed.get(NgModuleFactoryLoader);
const location = TestBed.get(Location);
loader.stubbedModules = {
'./main/journals-ledgers/journals-ledger.module#JournalsLedgerModule': LazyModule,
};
router.resetConfig([
{ path: 'journals-ledgers', loadChildren: './main/journals-ledgers/journals-ledger.module#JournalsLedgerModule' },
]);
router.navigateByUrl('/');
fixture.detectChanges();
expect(location.path()).toBe('/');
}));

it('should navigate to maintenance', (() => {
  const router = TestBed.get(Router);
  router.initialNavigation();
  const loader = TestBed.get(NgModuleFactoryLoader);
  const location = TestBed.get(Location);
  loader.stubbedModules = {
  './main/maintenance/maintenance.module#MaintenanceModule': LazyModule,
  };
  router.resetConfig([
  { path: '', loadChildren: './main/maintenance/maintenance.module#MaintenanceModule' },
  ]);
  router.navigateByUrl('/');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to oms', (() => {
    const router = TestBed.get(Router);
    router.initialNavigation();
    const loader = TestBed.get(NgModuleFactoryLoader);
    const location = TestBed.get(Location);
    loader.stubbedModules = {
    './main/oms/oms.module#OmsModule': LazyModule,
    };
    router.resetConfig([
    { path: 'oms', loadChildren: './main/oms/oms.module#OmsModule' },
    ]);
    router.navigateByUrl('/');
    fixture.detectChanges();
    expect(location.path()).toBe('/');
    }));

// it('should navigate to Journal-allocation', (() => {
//   let router = TestBed.get(Router);
//   let location = TestBed.get(Location);
//   let fixture = TestBed.createComponent(AppComponent);
//   router.initialNavigation();

//   const loader = TestBed.get(NgModuleFactoryLoader);
//   loader.stubbedModules = {lazyModule: OmsModule};

//   router.resetConfig([
//     {path: 'oms', loadChildren: 'lazyModule'},
//   ]);

//   router.navigateByUrl('/oms/journal-allocation');

//   fixture.detectChanges();

//   expect(location.path()).toBe('/');
// }));

it('should navigate to Accounts', (() => {
  const router = TestBed.get(Router);
  router.initialNavigation();
  const loader = TestBed.get(NgModuleFactoryLoader);
  const location = TestBed.get(Location);
  loader.stubbedModules = {
  './main/accounts/accounts.module#AccountsModule': LazyModule,
  };
  router.resetConfig([
  { path: 'accounts', loadChildren: './main/accounts/accounts.module#AccountsModule' },
  ]);
  router.navigateByUrl('/');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to Operations', (() => {
  const router = TestBed.get(Router);
  router.initialNavigation();
  const loader = TestBed.get(NgModuleFactoryLoader);
  const location = TestBed.get(Location);
  loader.stubbedModules = {
  './main/operations/operations.module#OperationsModule': LazyModule,
  };
  router.resetConfig([
  { path: 'operations', loadChildren: './main/operations/operations.module#OperationsModule' },
  ]);
  router.navigateByUrl('/');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to 404', (() => {
  const router = TestBed.get(Router);
  router.initialNavigation();
  const loader = TestBed.get(NgModuleFactoryLoader);
  const location = TestBed.get(Location);
  loader.stubbedModules = {
  './main/not-found/notfound.module#NotFoundModule': LazyModule,
  };
  router.resetConfig([
  { path: '**', loadChildren: './main/not-found/notfound.module#NotFoundModule' },
  ]);
  router.navigateByUrl('/404');
  fixture.detectChanges();
  expect(location.path()).toBe('/');
  }));

it('should navigate to settings', (() => {
    const router = TestBed.get(Router);
    router.initialNavigation();
    const loader = TestBed.get(NgModuleFactoryLoader);
    const location = TestBed.get(Location);
    loader.stubbedModules = {
    './main/settings/settings.module#SettingsModule': LazyModule,
    };
    router.resetConfig([
    { path: 'settings', loadChildren: './main/settings/settings.module#SettingsModule' },
    ]);
    router.navigateByUrl('/settings');
    fixture.detectChanges();
    expect(location.path()).toBe('/');
    }));

});
