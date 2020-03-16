import { TestBed } from '@angular/core/testing';
import { AccountmappingApiService } from './accountmapping-api.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('AccountMapping Service', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: AccountmappingApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountmappingApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AccountmappingApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Get MappedAccounts URL: /account/mappedAccount', () => {
    it('return mappedAccounts', () => {

        service.getMappedAccounts().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });
        const request = httpTestingController.expectOne(baseUrl + '/account/mappedAccount');
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get Organization URL: /account/thirdParty', () => {
    it('return organization', () => {

        service.getOrganisation().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });
        const request = httpTestingController.expectOne(baseUrl + '/account/thirdParty');
        expect(request.request.method).toBe('GET');
    });
  });

});
