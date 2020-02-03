/*
Core/Libraries Imports
*/
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap';
import { LpToolkitModule } from 'lp-toolkit';
import { SharedModule } from './shared.module';

/*
Services
*/
import { SidenavService } from '../services/common/sidenav.service';
import { FinanceServiceProxy } from '../services/service-proxies';
import { PostingEngineService } from '../services/common/posting-engine.service';
import { DataService } from '../services/common/data.service';
import { AgGridUtils } from '../shared/utils/AgGridUtils';
import { DataDictionary } from '../shared/utils/DataDictionary';
import { PerformanceCanDeactivateGuard } from '../../src/services/guards/performance-can-deactivate-guard.service';
/*
Components
*/
import { AppComponent } from './app.component';
import { HeaderContentComponent } from './menu/header-content/header-content.component';

@NgModule({
  declarations: [AppComponent, HeaderContentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
    TooltipModule,
    LpToolkitModule.forRoot(),
    SharedModule
  ],
  exports: [],
  providers: [
    SidenavService,
    FinanceServiceProxy,
    DataService,
    PostingEngineService,
    AgGridUtils,
    DataDictionary,
    PerformanceCanDeactivateGuard,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
