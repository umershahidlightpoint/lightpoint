import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from './../../../app.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SettingsModule } from './../settings.module';

// Settings Component
import { SettingsComponent } from '../settings/settings.component';

import { SettingApiService } from './../../../../services/setting-api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { TabsModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';

fdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let debugElement: DebugElement;

  let httpTestingController: HttpTestingController;
  let service: SettingApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach((() => {
    TestBed.configureTestingModule({
        imports: [
        AppModule,
        SettingsModule,
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        TabsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    }).compileComponents();
    // We inject our service (which imports the HttpClient) and the Test Controller
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SettingApiService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    httpTestingController.verify();
    fixture.detectChanges();
  });

  it('should create component', () => {
    component.isLoading = false;
    component.isSaving = false;
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  // it('form invalid when empty', () => {
  //   component.isLoading = false;
  //   fixture.detectChanges();
  //   expect(component.settingsForm.valid).toBeFalsy();
  // });

  // it('should disable save button', () => {
  //   component.isLoading = false;
  //   component.isSaving = false;
  //   fixture.detectChanges();
  //   const button = fixture.debugElement.query(By.css("button"));
  //   expect(button.nativeElement.disabled).toBeTruthy();
  // });

  // it('should enable save button', () => {
  //   component.isLoading = false;

  //   expect(component.settingsForm.valid).toBeFalsy();
  //   fixture.detectChanges();
  //   component.settingsForm.form.patchValue({
  //     theme: 'BLUE',
  //     currency: 'USD',
  //     methodology: 'FIFO',
  //     month: 'March',
  //     day: '15'
  //   });
  //   const elm = fixture.nativeElement;
  //   const button = elm.querySelectorAll('button');
  //   fixture.detectChanges();
  //   expect(component.settingsForm.valid).toBeTruthy();
  //   expect(button.nativeElement.disabled).toBeFalsy();
  // });

  describe('It should save the general settings', () => {
    it('save settings', () => {

        const postSettingObj = {
          id: 18,
          currencyCode: 'USD',
          taxMethodology: 'LIFO',
          fiscalMonth: 'March',
          fiscalDay: 15
        };

        service.saveSettings(postSettingObj).subscribe(settings => {
        settings.isSuccessful = true;
    });

        const request = httpTestingController.expectOne(baseUrl + '/setting');
        expect(request.request.method).toBe('PUT');
        request.flush(postSettingObj);
    });
});

  describe('Get User settings URL: api/setting', () => {
    it('returned user settings', () => {
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
        expect(settings.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/setting');
        expect(request.request.method).toBe('GET');
        request.flush(dummySettings);
    });

});

  describe('Get currencies and bind value to currencies dropdown', () => {
    it('returned currencies', () => {

      const dummyCurrencies = {
          when: '2020-02-10T11:58:38.1252146+05:00',
          by: '',
          isSuccessful: true,
          message: 'The Request was Successful',
          payload: [
          'USD',
          'PKR'
          ],
          meta: null,
          stats: null,
          statusCode: 200
          };

      service.getSettings().subscribe(settings => {
      component.currencies = settings.payload;
      expect(component.currencies.length).toBeGreaterThanOrEqual(1);
  });

      const request = httpTestingController.expectOne(baseUrl + '/setting');
      expect(request.request.method).toBe('GET');
      request.flush(dummyCurrencies);
  });
});

});
