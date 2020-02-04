import { TestBed } from '@angular/core/testing';
import { MaintenanceApiService } from './maintenance-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('ReportsService', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: MaintenanceApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintenanceApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(MaintenanceApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Get Taxlot Report URL: /journal/taxlotReport?from=+fromDate+&to=+toDate+&symbol=+symbol+&fund=+fund+&side=+side', () => {
    it('returned taxlot report', () => {

        const obj = {
            fromDate: '2020-01-17',
            toDate: '2020-01-17',
            symbol: '',
            fund: 'ALL',
            side: false
        };

        service.getTaxLotReport(obj.fromDate, obj.toDate, obj.symbol, obj.fund, obj.side).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/taxlotReport?from=' + obj.fromDate + '&to=' + obj.toDate + '&symbol=' + obj.symbol + '&fund=' + obj.fund + '&side=' + obj.side);
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get closingTaxLots Report URL: /journal/allClosingTaxLots', () => {
    it('returned closingTaxLots report', () => {

        service.getAllClosingTaxLots().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/allClosingTaxLots');
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get ProspectiveTradesToAlleviateTaxLot Report URL: /taxLotMaintenance/prospectiveTradesToAlleviateTaxLot?symbol=+symbol+&side=+ side', () => {
    it('returned prospectiveTradesToAlleviateTaxLot', () => {
        const obj = {
            symbol: 'AROW',
            side: 'BUY'
        }
        service.getProspectiveTradesToAlleviateTaxLot(obj.symbol, obj.side).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/taxLotMaintenance/prospectiveTradesToAlleviateTaxLot?symbol=' + obj.symbol + '&side=' + obj.side);
        expect(request.request.method).toBe('GET');
    });
  });

});
