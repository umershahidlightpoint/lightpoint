import { TestBed } from '@angular/core/testing';
import { AccountApiService } from './account-api.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('GridLayout Service', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: AccountApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AccountApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Get All Accounts URL: /account', () => {
    it('return accounts', () => {

        service.getAllAccounts().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });
        const request = httpTestingController.expectOne(baseUrl + '/account');
        expect(request.request.method).toBe('GET');
    });
  });

//   describe('Get Account Types URL: /account_types', () => {
//     it('return account types', () => {

//         service.getAccountTypes().subscribe(response => {
//         expect(response.statusCode).toEqual(200);
//     });
//         const request = httpTestingController.expectOne(baseUrl + '/account_types');
//         expect(request.request.method).toBe('GET');
//     });
//   });


//   describe('Get Account Tags URL: /account/id', () => {
//     it('return account types', () => {
//         const id 
//         service.getAccountTags(id).subscribe(response => {
//         expect(response.statusCode).toEqual(200);
//     });
//         const request = httpTestingController.expectOne(baseUrl + '/account/' + id);
//         expect(request.request.method).toBe('GET');
//     });
//   });

});
