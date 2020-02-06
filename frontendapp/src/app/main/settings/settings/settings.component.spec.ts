

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { SettingsModule } from './../settings.module';

// Settings Component
import { SettingsComponent } from '../settings/settings.component';
// Layout Component
import { LayoutsComponent } from '../layouts/layouts.component';

import { SettingApiService } from './../../../../services/setting-api.service';
import { DataService } from './../../../../services/common/data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { TabsModule } from 'ngx-bootstrap';
import { LpToolkitModule } from 'lp-toolkit';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let debugElement: DebugElement;

  let service: SettingApiService;
  let httpMock: HttpTestingController;

  beforeEach((() => {
    fixture = TestBed.createComponent(SettingsComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();

    TestBed.configureTestingModule({
      declarations: [ SettingsComponent, LayoutsComponent ],
      imports: [
        SettingsModule,
        CommonModule,
        HttpClientModule,
        TabsModule,
        FormsModule,
        SharedModule,
        LpToolkitModule.forRoot()
      ],
      providers: [SettingApiService, DataService]

    }).compileComponents();
    service = TestBed.get(SettingApiService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  // afterEach(() => {
  //   httpMock.verify();
  // });

  // Angular default test added when you generate a service using the CLI
  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });

  // beforeEach(async () => {
  //   fixture = TestBed.createComponent(SettingsComponent);
  //   debugElement = fixture.debugElement;

  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create settings component', async () => {
  //   expect(component).toBeTruthy();
  // });

  describe('Settings API service', () => {

    it('be able to retrieve settings from the API via GET', () => {
      const dummySettings = {
          payload: [
            {
              id: 18,
              created_by: 'John Doe',
              created_date: '2019-12-17T00:00:00',
              last_updated_by: 'John Doe',
              last_updated_date: '2020-01-10T00:00:00',
              currency_code: 'USD',
              tax_methodology: 'MINTAX',
              fiscal_month: 'February',
              fiscal_day: 15
              }
          ],
          statusCode: 200
        };
      service.getSettings().subscribe(settings => {
          expect(settings.payload.length).toBe(1);
          expect(settings.payload[0].created_by).toEqual('John Doe');
          // expect(settings.isSuccessful).toEqual(true);
      });

      const request = httpMock.expectOne('http://localhost:9092/api/setting');
      expect(request.request.method).toBe('GET');
      request.flush(dummySettings);

      // afterEach(() => {
      //   httpMock.verify();
      // });

    });
  });

});
