import { TestBed } from '@angular/core/testing';
import { SettingApiService } from './setting-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('SettingsService', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: SettingApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SettingApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Get User settings URL: api/setting', () => {
    it('returned user settings', () => {
        // const dummySettings = {
        //     payload: [
        //       {
        //         id: 18,
        //         created_by: 'John Doe',
        //         created_date: '2019-12-17T00:00:00',
        //         last_updated_by: 'John Doe',
        //         last_updated_date: '2020-01-10T00:00:00',
        //         currency_code: 'USD',
        //         tax_methodology: 'MINTAX',
        //         fiscal_month: 'February',
        //         fiscal_day: 15
        //         }
        //     ],
        //     statusCode: 200
        //   };

        service.getSettings().subscribe(settings => {
        expect(settings.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/setting');
        expect(request.request.method).toBe('GET');
        // request.flush(dummySettings);
    });
  });

  describe('Create Settings URL: api/setting', () => {
    it('should create user settings', () => {

     const obj = {
        id : 18,
        currencyCode: 'USD',
        taxMethodology: 'LIFO',
        fiscalMonth: 'March',
        fiscalDay: 15
     };

     service.createSettings(obj).subscribe(settings => {
    expect(settings.statusCode).toEqual(200);
    });

     const request = httpTestingController.expectOne(baseUrl + '/setting');
     expect(request.request.method).toBe('POST');
    });
    });

  describe('Update Settings URL: api/setting', () => {
    it('should update user settings', () => {

     const obj = {
        id : 18,
        currencyCode: 'USD',
        taxMethodology: 'LIFO',
        fiscalMonth: 'March',
        fiscalDay: 15
     };

     service.saveSettings(obj).subscribe(settings => {
    expect(settings.statusCode).toEqual(200);
    });

     const request = httpTestingController.expectOne(baseUrl + '/setting');
     expect(request.request.method).toBe('PUT');
    });
    });


  describe('Get Currencies URL: api/setting/currency', () => {
    it('returned currency list', () => {

    service.getReportingCurrencies().subscribe(currencies => {
    expect(currencies.statusCode).toEqual(200);
    });

    const request = httpTestingController.expectOne(baseUrl + '/setting/currency');
    expect(request.request.method).toBe('GET');
    });
    });

});
