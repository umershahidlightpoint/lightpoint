
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from './../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CorporateActionsModule } from './../corporate-actions.module';
import * as moment from 'moment';

import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';

// StockSplits Component
import { StockSplitsComponent } from './stock-splits.component';

import { CorporateActionsApiService } from './../../../../services/corporate-actions.api.service';
import { FinanceServiceProxy } from './../../../../services/service-proxies';
import { SettingApiService } from './../../../../services/setting-api.service';

import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../shared.module';
import { By } from '@angular/platform-browser';

fdescribe('StockSplitsComponent', () => {

  let component: StockSplitsComponent;
  let fixture: ComponentFixture<StockSplitsComponent>;
  let debugElement: DebugElement;

  let httpTestingController: HttpTestingController;
  let service: CorporateActionsApiService;
  let settingService: SettingApiService;
  let financeServiceProxy: FinanceServiceProxy;

  const baseUrl = 'http://localhost:9092/api';
  const refUrl = 'http://localhost:9091/api';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        CorporateActionsModule,
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        TabsModule,
        ModalModule,
        AlertModule,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSplitsComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CorporateActionsApiService);
    settingService = TestBed.get(SettingApiService);
    financeServiceProxy =  TestBed.get(FinanceServiceProxy);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.openStockSplitModal();
    fixture.detectChanges();
    expect(component.openStockSplitModal).toBeTruthy();
  });

  it('should have button with plus icon', () => {

    fixture.whenStable().then(() => {
      const debug = fixture.debugElement.query(By.css('input[value="showModal"]'));
      const native = debug.nativeElement;
      const buttonElem = native;
      expect(buttonElem.value).toContain('showModal');
        });
  });

  it('should have button with refresh icon', () => {

    fixture.whenStable().then(() => {
      const debug = fixture.debugElement.query(By.css('input[value="refresh"]'));
      const native = debug.nativeElement;
      const buttonElem = native;
      expect(buttonElem.value).toContain('refresh');
        });
  });

  it('should have button with clear icon', () => {

    fixture.whenStable().then(() => {
      const debug = fixture.debugElement.query(By.css('input[value="clear"]'));
      const native = debug.nativeElement;
      const buttonElem = native;
      expect(buttonElem.value).toContain('clear');
        });
  });

});
